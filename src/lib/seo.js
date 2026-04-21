import { siteConfig } from "@/config/site-config";
import { toGoogleJobsFormat } from "@/lib/employment";

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
  noindex = false,
} = {}) {
  const url = `${SITE_URL}${path}`;
  // Root layout's title.template already appends "| BrandName" to <title>,
  // so we only pass the raw page title here.  OG/Twitter titles bypass the
  // template, so they get the full branded string.
  const pageTitle = title || siteConfig.name;
  const brandedTitle = title ? `${title} | ${siteConfig.companyName}` : siteConfig.name;
  const image = ogImage || siteConfig.seo.ogImage;

  const meta = {
    title: pageTitle,
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
      title: brandedTitle,
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
      title: brandedTitle,
      description: description || siteConfig.description,
      images: [image],
    },
    robots: {
      index: !noindex,
      follow: true,
      googleBot: noindex ? "noindex, follow" : undefined,
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
    datePosted: job.publishedAt
      ? new Date(job.publishedAt).toISOString()
      : job.createdAt
        ? new Date(job.createdAt).toISOString()
        : new Date().toISOString(),
    url: `${SITE_URL}/jobs/${job.slug}`,
    employmentType: toGoogleJobsFormat(job.employmentType),
    hiringOrganization: {
      "@type": "Organization",
      name: company.name || siteConfig.name,
      sameAs: socialUrls,
      logo: {
        "@type": "ImageObject",
        url: logo,
      },
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

  // validThrough — GFJ required field; default 90 days from publish when no explicit deadline
  const validThrough = job.applicationDeadline
    ? new Date(job.applicationDeadline)
    : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
  jsonLd.validThrough = validThrough.toISOString();

  // Experience level → Google Jobs educationRequirements + experienceRequirements
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
    const qualText = qualMapping[job.experienceLevel] || "";

    // Google Jobs: structured educationRequirements and experienceRequirements
    // improve matching accuracy vs. a single qualifications string
    jsonLd.experienceRequirements = {
      "@type": "OccupationalExperienceRequirements",
      monthsOfExperience: mapExperienceToMonths(job.experienceLevel),
    };
    jsonLd.educationRequirements = {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: mapExperienceToEducation(job.experienceLevel),
    };
    // Keep qualifications as a readable fallback
    if (qualText) jsonLd.qualifications = qualText;
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
      name: author.name || siteConfig.name,
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
    // NOTE: aggregateRating removed — must only be included when backed by a
    // real review system. Google issues manual actions for fabricated ratings.
    // Re-add here once a verified review/rating feature is implemented.
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
    description: `${name} on ${siteConfig.companyName}`,
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
    name: `Contact ${siteConfig.companyName}`,
    url: `${SITE_URL}/contact`,
    description:
      `Get in touch with ${siteConfig.brandName} via email, phone, WhatsApp, or visit our Nairobi office.`,
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

/**
 * Generate LocalBusiness JSON-LD for the contact page.
 * Helps Google build a knowledge panel and local search features.
 *
 * @returns {Object} JSON-LD structure
 */
export function generateLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/contact#localbusiness`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.svg`,
    },
    image: `${SITE_URL}/og-default.png`,
    telephone: siteConfig.whatsapp.display,
    email: siteConfig.email.support,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Westlands",
      addressLocality: "Nairobi",
      addressRegion: "Nairobi County",
      addressCountry: "KE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -1.2667,
      longitude: 36.8,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "13:00",
      },
    ],
    sameAs: [
      siteConfig.social.twitter,
      siteConfig.social.facebook,
      siteConfig.social.linkedin,
      siteConfig.social.instagram,
      siteConfig.social.tiktok,
    ],
    priceRange: "Free to browse",
    areaServed: {
      "@type": "Country",
      name: "Kenya",
    },
  };
}

// ─── Internal Helpers ───────────────────────────────────────────

// mapEmploymentType moved to @/lib/employment (toGoogleJobsFormat)

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

/**
 * Map experience level to approximate months of experience for Google Jobs.
 */
function mapExperienceToMonths(level) {
  const mapping = {
    ENTRY_LEVEL: 0, ENTRY: 0, "Entry Level": 0,
    JUNIOR: 18, "Junior": 18, INTERNSHIP: 6,
    MID_LEVEL: 36, MID: 36, "Mid Level": 36,
    SENIOR: 60, "Senior": 60,
    LEAD: 60, "Lead": 60,
    MANAGER: 84, "Manager": 84,
    DIRECTOR: 120, "Director": 120,
    EXECUTIVE: 120, "Executive": 120,
  };
  return mapping[level] ?? 36; // default to 3 years
}

/**
 * Map experience level to education credential category for Google Jobs.
 */
function mapExperienceToEducation(level) {
  const highLevel = ["SENIOR", "LEAD", "MANAGER", "DIRECTOR", "EXECUTIVE"];
  const midLevel = ["JUNIOR", "MID_LEVEL", "MID"];
  if (highLevel.some((l) => level === l || level === l.replace("_", " "))) {
    return "bachelor degree";
  }
  if (midLevel.some((l) => level === l || level === l.replace("_", " "))) {
    return "diploma";
  }
  return "high school";
}
