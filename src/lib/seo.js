import { siteConfig } from "@/config/site-config";

const SITE_URL = siteConfig.url;

/**
 * Generate Next.js Metadata object for a page.
 *
 * @param {Object} opts
 * @param {string} opts.title       - Page title (without the " | JobReady" suffix)
 * @param {string} opts.description - Meta description
 * @param {string} [opts.path]      - URL path e.g. "/jobs/technology"
 * @param {string} [opts.ogImage]   - Custom OG image URL
 * @param {string} [opts.ogType]    - OG type (default "website")
 * @param {string} [opts.publishedTime] - article:published_time
 * @param {string} [opts.modifiedTime]  - article:modified_time
 * @returns {Object} Next.js Metadata
 */
export function generateMeta({
  title,
  description,
  path = "",
  ogImage,
  ogType = "website",
  publishedTime,
  modifiedTime,
} = {}) {
  const url = `${SITE_URL}${path}`;
  const fullTitle = title ? `${title} | JobReady Kenya` : siteConfig.name;
  const image = ogImage || siteConfig.seo.ogImage;

  const meta = {
    title: fullTitle,
    description: description || siteConfig.description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: ogType,
      locale: "en_KE",
      url,
      siteName: siteConfig.name,
      title: fullTitle,
      description: description || siteConfig.description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.seo.twitterHandle,
      title: fullTitle,
      description: description || siteConfig.description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
  };

  // Article-specific OG tags
  if (ogType === "article") {
    if (publishedTime) {
      meta.openGraph.publishedTime = publishedTime;
    }
    if (modifiedTime) {
      meta.openGraph.modifiedTime = modifiedTime;
    }
  }

  return meta;
}

/**
 * Generate Google Jobs JobPosting JSON-LD from a job record.
 * Always includes salary for Google ranking.
 *
 * @param {Object} job - Prisma Job record (with company included)
 * @returns {Object} JSON-LD structure
 */
export function generateJobJsonLd(job) {
  const company = job.company || {};
  const logo = company.logo || `${SITE_URL}/logo.svg`;

  // Extract social URLs from socialLinks JSON array
  const socialLinks = Array.isArray(company.socialLinks) ? company.socialLinks : [];
  const socialUrls = socialLinks.map((l) => l.url).filter(Boolean);
  if (company.website) socialUrls.push(company.website);

  // Build location from structured fields, fallback to display string
  const addressLocality = job.county || job.town || "Nairobi";
  const addressCountry = job.country || "Kenya";

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.createdAt
      ? new Date(job.createdAt).toISOString()
      : new Date().toISOString(),
    url: `${SITE_URL}/jobs/${job.slug}`,
    employmentType: mapEmploymentType(job.employmentType),
    hiringOrganization: {
      "@type": "Organization",
      name: company.name || "JobReady Kenya",
      sameAs: socialUrls,
      logo,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: addressLocality,
        addressCountry: addressCountry,
      },
    },
    applicantLocationRequirements: {
      "@type": "Country",
      name: addressCountry,
    },
  };

  // Positions / Openings
  if (job.positions && job.positions > 1) {
    jsonLd.totalJobOpenings = job.positions;
  }

  // Remote jobs
  if (job.isRemote) {
    jsonLd.jobLocationType = "TELECOMMUTE";
  }

  // Salary — always include for Google ranking (even when hidden from users)
  if (job.salaryMin || job.salaryMax) {
    // Map salary period to Google's expected format
    const periodMap = {
      HOURLY: "HOUR",
      WEEKLY: "WEEK",
      MONTHLY: "MONTH",
      ANNUALLY: "YEAR",
    };

    jsonLd.baseSalary = {
      "@type": "MonetaryAmount",
      currency: job.salaryCurrency || "KES",
      value: {
        "@type": "QuantitativeValue",
        minValue: job.salaryMin || 0,
        maxValue: job.salaryMax || job.salaryMin || 0,
        unitText: periodMap[job.salaryPeriod] || "MONTH",
      },
    };
  }

  // Deadline
  if (job.applicationDeadline) {
    jsonLd.validThrough = new Date(job.applicationDeadline).toISOString();
  }

  // Experience level
  if (job.experienceLevel) {
    const qualMapping = {
      // Canonical UPPER_SNAKE_CASE values
      ENTRY_LEVEL: "No experience required",
      JUNIOR: "1-2 years experience",
      MID_LEVEL: "1-3 years experience",
      SENIOR: "5+ years experience",
      LEAD: "5+ years experience",
      MANAGER: "7+ years experience",
      DIRECTOR: "10+ years experience",
      EXECUTIVE: "10+ years experience",
      // Legacy Title Case values (backward compat)
      "Entry Level": "No experience required",
      "Junior": "1-2 years experience",
      "Mid Level": "1-3 years experience",
      "Senior": "5+ years experience",
      "Lead": "5+ years experience",
      "Manager": "7+ years experience",
      "Director": "10+ years experience",
      "Executive": "10+ years experience",
      // Legacy short-form enum values
      ENTRY: "No experience required",
      MID: "1-3 years experience",
    };
    jsonLd.qualifications = qualMapping[job.experienceLevel] || "";
  }

  return jsonLd;
}

/**
 * Generate Article JSON-LD for blog posts.
 *
 * @param {Object} article - Blog article record (with author and category)
 * @returns {Object} JSON-LD structure
 */
export function generateArticleJsonLd(article) {
  const author = article.author || {};
  const category = article.category || {};

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt || "",
    image: article.featuredImage || siteConfig.seo.ogImage,
    url: article.canonicalUrl || `${SITE_URL}/career-advice/${article.slug}`,
    datePublished: article.publishedAt
      ? new Date(article.publishedAt).toISOString()
      : new Date(article.createdAt).toISOString(),
    dateModified: article.updatedAt
      ? new Date(article.updatedAt).toISOString()
      : undefined,
    author: {
      "@type": "Person",
      name: author.name || "JobReady Kenya",
      url: author.linkedinUrl || undefined,
      jobTitle: author.title || undefined,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/career-advice/${article.slug}`,
    },
    articleSection: category.name || "Career Advice",
    wordCount: article.wordCount || undefined,
  };
}

/**
 * Generate Organization JSON-LD for a company profile.
 *
 * @param {Object} company - Company record
 * @returns {Object} JSON-LD structure
 */
export function generateOrganizationJsonLd(company) {
  const socialUrls = Array.isArray(company.socialLinks)
    ? company.socialLinks.map((link) => link.url).filter(Boolean)
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: company.website || `${SITE_URL}/organizations/${company.slug}`,
    logo: company.logo || `${SITE_URL}/logo.svg`,
    description: company.description || company.tagline || "",
    address: {
      "@type": "PostalAddress",
      addressLocality: company.county || "Nairobi",
      addressCountry: "Kenya",
    },
    industry: company.industry || undefined,
  };

  if (socialUrls.length > 0) {
    jsonLd.sameAs = socialUrls;
  }

  return jsonLd;
}

/**
 * Generate BreadcrumbList JSON-LD.
 *
 * @param {Array<{name: string, href: string}>} items
 * @returns {Object} JSON-LD structure
 */
export function generateBreadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };
}

/**
 * Generate WebSite + SearchAction JSON-LD for homepage.
 *
 * @returns {Object} JSON-LD structure
 */
export function generateWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: SITE_URL,
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.svg`,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate FAQPage JSON-LD for pages with FAQ sections.
 *
 * @param {Array<{question: string, answer: string}>} faqs
 * @returns {Object} JSON-LD structure
 */
export function generateFAQJsonLd(faqs) {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Service JSON-LD for the CV services page.
 *
 * @param {Object} service - Service details
 * @param {string} service.name - Service name
 * @param {string} service.description - Service description
 * @param {string} [service.url] - Service URL
 * @param {string} [service.area] - Service area (default "Kenya")
 * @returns {Object} JSON-LD structure
 */
export function generateServiceJsonLd(service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: service.url || `${SITE_URL}/cv-services`,
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.svg`,
      },
    },
    areaServed: {
      "@type": "Country",
      name: service.area || "Kenya",
    },
    serviceType: "Professional CV Writing Service",
    ...(service.offers && {
      offers: service.offers.map((offer) => ({
        "@type": "Offer",
        name: offer.name,
        price: offer.price,
        priceCurrency: "KES",
        availability: "https://schema.org/InStock",
        eligibleRegion: {
          "@type": "Country",
          name: "Kenya",
        },
      })),
    }),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "1250",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

/**
 * Generate CollectionPage JSON-LD for listing pages (jobs, opportunities, companies).
 *
 * @param {Object} opts
 * @param {string} opts.name - Page name
 * @param {string} opts.description - Page description
 * @param {string} opts.url - Page URL
 * @param {number} [opts.totalItems] - Total number of items in the collection
 * @returns {Object} JSON-LD structure
 */
export function generateCollectionPageJsonLd({ name, description, url, totalItems }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: `${SITE_URL}${url}`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: SITE_URL,
    },
  };

  if (totalItems) {
    jsonLd.about = {
      "@type": "Thing",
      name,
      description: `${totalItems} items available`,
    };
  }

  return jsonLd;
}

/**
 * Generate ItemList JSON-LD for search results or filtered listings.
 *
 * @param {Object} opts
 * @param {string} opts.name - List name
 * @param {string} opts.url - Page URL
 * @param {number} opts.totalItems - Total items
 * @param {Array<{name: string, url: string, position: number}>} items - List items
 * @returns {Object} JSON-LD structure
 */
export function generateItemListJsonLd({ name, url, totalItems, items }) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description: `${name} on JobReady Kenya`,
    url: `${SITE_URL}${url}`,
    numberOfItems: totalItems,
    itemListElement: items.slice(0, 10).map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      url: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Generate ContactPage JSON-LD.
 *
 * @returns {Object} JSON-LD structure
 */
export function generateContactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact JobReady Kenya",
    url: `${SITE_URL}/contact`,
    description:
      "Get in touch with JobReady.co.ke via email, phone, WhatsApp, or visit our Nairobi office.",
    mainEntity: {
      "@type": "Organization",
      name: siteConfig.name,
      url: SITE_URL,
      telephone: siteConfig.whatsapp.display,
      email: siteConfig.email.support,
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: siteConfig.email.support,
          availableLanguage: ["English", "Swahili"],
        },
        {
          "@type": "ContactPoint",
          contactType: "sales",
          email: siteConfig.email.cv,
          availableLanguage: ["English", "Swahili"],
        },
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Nairobi",
        addressCountry: "KE",
      },
    },
  };
}

/**
 * Generate WebPage JSON-LD for general content pages (About, etc).
 *
 * @param {Object} opts
 * @param {string} opts.name - Page name
 * @param {string} opts.description - Page description
 * @param {string} opts.url - Page URL
 * @returns {Object} JSON-LD structure
 */
export function generateWebPageJsonLd({ name, description, url }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: `${SITE_URL}${url}`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.svg`,
      },
    },
  };
}

/**
 * Generate a merged JSON-LD script tag props object for use with <Script>.
 * Merges multiple JSON-LD objects into one (Google supports multiple schemas).
 *
 * @param {Array<Object>} jsonLdObjects
 * @returns {Array<Object>} Array of JSON-LD objects
 */
export function mergeJsonLd(...jsonLdObjects) {
  return jsonLdObjects.filter(Boolean);
}

// ─── Internal Helpers ───────────────────────────────────────────

/**
 * Map internal employment type to Google's expected format.
 */
function mapEmploymentType(type) {
  const mapping = {
    // Canonical UPPER_SNAKE_CASE values
    FULL_TIME: "FULL_TIME",
    PART_TIME: "PART_TIME",
    CONTRACT: "CONTRACTOR",
    INTERNSHIP: "INTERN",
    FREELANCE: "CONTRACTOR",
    VOLUNTEER: "VOLUNTEER",
    TEMPORARY: "TEMPORARY",
    PERMANENT: "FULL_TIME",
    // Legacy Title Case display values (backward compat)
    "Full-time": "FULL_TIME",
    "Part-time": "PART_TIME",
    "Contract": "CONTRACTOR",
    "Internship": "INTERN",
    "Freelance": "CONTRACTOR",
    "Volunteer": "VOLUNTEER",
  };
  return mapping[type] || "FULL_TIME";
}

/**
 * Parse employee size string to min/max numbers.
 */
function parseEmployeeSize(size) {
  if (!size) return { min: undefined, max: undefined };
  const match = size.match(/(\d+)/g);
  if (!match) return { min: undefined, max: undefined };
  return {
    min: parseInt(match[0], 10) || undefined,
    max: parseInt(match[match.length - 1], 10) || undefined,
  };
}
