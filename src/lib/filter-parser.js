// ──────────────────────────────────────────────────────────────
// Filter Parser — Maps URL slug segments to DB filter values
// Used by catch-all routes: /jobs/[...slug], /opportunities/[...slug], /organizations/[...slug]
// ──────────────────────────────────────────────────────────────

import { jobCategory, organizationLocation } from "@/data/org_data";

// ════════════════════════════════════════════════════════════
// 1. JOB CATEGORY SLUG → ENUM VALUE
// ════════════════════════════════════════════════════════════
const JOB_CATEGORY_MAP = {};
jobCategory.forEach((cat) => {
  JOB_CATEGORY_MAP[cat.value.toLowerCase()] = cat.value;
  // Also map the label slug: "TECHNOLOGY" → "technology"
});

// Special cases where slug ≠ enum value
const JOB_CATEGORY_SLUG_OVERRIDES = {
  "finance-accounting": "FINANCE_ACCOUNTING",
  "government-public-sector": "GOVERNMENT_PUBLIC_SECTOR",
  "sales-business": "SALES_BUSINESS",
  "marketing-communications": "MARKETING_COMMUNICATIONS",
  "human-resources": "HUMAN_RESOURCES",
  "creative-design": "CREATIVE_DESIGN",
  "legal-compliance": "LEGAL",
  "logistics-supply-chain": "SUPPLY_CHAIN",
  "customer-service": "CUSTOMER_SERVICE",
  "skilled-trades": "SKILLED_TRADES",
  "media-publishing": "MEDIA_PUBLISHING",
  "real-estate": "REAL_ESTATE",
  "fitness-wellness": "FITNESS_WELLNESS",
  "science-research": "SCIENCE_RESEARCH",
  "operations-admin": "OPERATIONS_ADMIN",
  "specialised-services": "SPECIALISED_SERVICES",
  "architecture-construction": "ARCHITECTURE_CONSTRUCTION",
  "education-training": "EDUCATION",
  // hub-config slugs
  "sales-marketing": "MARKETING_COMMUNICATIONS",
  "healthcare": "HEALTHCARE",
  "consulting": "CONSULTING",
  "ngo": "NONPROFIT",
  "engineering": "ENGINEERING",
  "government": "GOVERNMENT_PUBLIC_SECTOR",
  "creative": "CREATIVE_DESIGN",
  "legal": "LEGAL",
  "logistics": "SUPPLY_CHAIN",
  "agriculture": "AGRICULTURE",
  "insurance": "INSURANCE",
  "hospitality-tourism": "HOSPITALITY",
};

Object.assign(JOB_CATEGORY_MAP, JOB_CATEGORY_SLUG_OVERRIDES);

// ════════════════════════════════════════════════════════════
// 2. JOB CATEGORY ENUM → DISPLAY LABEL
// ════════════════════════════════════════════════════════════
const JOB_CATEGORY_LABELS = {};
jobCategory.forEach((cat) => {
  JOB_CATEGORY_LABELS[cat.value] = cat.label;
});

const JOB_CATEGORY_LABEL_OVERRIDES = {
  GOVERNMENT_PUBLIC_SECTOR: "Government & Public Sector",
  SUPPLY_CHAIN: "Logistics & Supply Chain",
  HOSPITALITY: "Hospitality & Tourism",
  CREATIVE_DESIGN: "Creative Arts & Design",
  ARCHITECTURE_CONSTRUCTION: "Architecture & Construction",
  SCIENCE_RESEARCH: "Science & Research",
  FITNESS_WELLNESS: "Fitness & Wellness",
  OPERATIONS_ADMIN: "Operations & Administration",
  SPECIALISED_SERVICES: "Specialised Services",
  MEDIA_PUBLISHING: "Media & Publishing",
};
Object.assign(JOB_CATEGORY_LABELS, JOB_CATEGORY_LABEL_OVERRIDES);

// ════════════════════════════════════════════════════════════
// 3. EMPLOYMENT TYPE SLUG → ENUM VALUE
// ════════════════════════════════════════════════════════════
const EMPLOYMENT_TYPE_MAP = {
  "full-time": "FULL_TIME",
  "part-time": "PART_TIME",
  "contract": "CONTRACT",
  "internship": "INTERNSHIP",
  "internships": "INTERNSHIP",
  "temporary": "TEMPORARY",
  "volunteer": "VOLUNTEER",
  "freelance": "FREELANCE",
};

const EMPLOYMENT_TYPE_LABELS = {
  FULL_TIME: "Full-Time",
  PART_TIME: "Part-Time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  TEMPORARY: "Temporary",
  VOLUNTEER: "Volunteer",
  FREELANCE: "Freelance",
};

// ════════════════════════════════════════════════════════════
// 4. EXPERIENCE LEVEL SLUG → ENUM VALUE
// ════════════════════════════════════════════════════════════
const EXPERIENCE_LEVEL_MAP = {
  "entry-level": "ENTRY_LEVEL",
  junior: "JUNIOR",
  "mid-level": "MID_LEVEL",
  senior: "SENIOR",
  lead: "LEAD",
  manager: "MANAGER",
  director: "DIRECTOR",
  executive: "EXECUTIVE",
};

const EXPERIENCE_LEVEL_LABELS = {
  ENTRY_LEVEL: "Entry Level",
  JUNIOR: "Junior",
  MID_LEVEL: "Mid Level",
  SENIOR: "Senior",
  LEAD: "Lead",
  MANAGER: "Manager",
  DIRECTOR: "Director",
  EXECUTIVE: "Executive",
};

// ════════════════════════════════════════════════════════════
// 5. LOCATION SLUG → COUNTY / COUNTRY (Kenya first)
// ════════════════════════════════════════════════════════════
const LOCATION_MAP = {};  // slug → { county, country }

organizationLocation.forEach((loc) => {
  loc.regions.forEach((region) => {
    const slug = region.toLowerCase().replace(/\s+/g, "-").replace(/'/g, "");
    if (!LOCATION_MAP[slug]) {
      LOCATION_MAP[slug] = { county: region, country: loc.name };
    }
  });
});

// Country-level slugs (for cross-country filtering)
const COUNTRY_SLUG_MAP = {};
organizationLocation.forEach((loc) => {
  const slug = loc.name.toLowerCase().replace(/\s+/g, "-");
  COUNTRY_SLUG_MAP[slug] = loc.name;
});

// ════════════════════════════════════════════════════════════
// 6. OPPORTUNITY TYPE SLUG → ENUM VALUE
// ════════════════════════════════════════════════════════════
const OPP_TYPE_MAP = {
  internships: "INTERNSHIP",
  internships: "INTERNSHIP",
  sponsorships: "SPONSORSHIP",
  bursaries: "BURSARY",
  scholarships: "SCHOLARSHIP",
  "university-admissions": "UNIVERSITY_ADMISSION",
  "university-admission": "UNIVERSITY_ADMISSION",
  volunteer: "VOLUNTEER",
  training: "TRAINING",
  grants: "GRANT",
  certifications: "CERTIFICATION",
  certification: "CERTIFICATION",
  funding: "FUNDING",
  fellowships: "FELLOWSHIP",
  apprenticeships: "APPRENTICESHIP",
  workshops: "WORKSHOP",
  conferences: "CONFERENCE",
  competitions: "COMPETITION",
  awards: "AWARD",
  residencies: "RESIDENCY",
  residencies: "RESIDENCY",
  mentorships: "MENTORSHIP",
  accelerators: "ACCELERATOR",
  incubators: "INCUBATOR",
  bootcamps: "BOOTCAMP",
  exchanges: "EXCHANGE",
  research: "RESEARCH",
};

const OPP_TYPE_LABELS = {
  INTERNSHIP: "Internships",
  SPONSORSHIP: "Sponsorships",
  BURSARY: "Bursaries",
  SCHOLARSHIP: "Scholarships",
  UNIVERSITY_ADMISSION: "University Admissions",
  VOLUNTEER: "Volunteer Opportunities",
  TRAINING: "Training Programs",
  GRANT: "Grants",
  CERTIFICATION: "Certification Programs",
  FUNDING: "Funding Opportunities",
  FELLOWSHIP: "Fellowships",
  APPRENTICESHIP: "Apprenticeships",
  WORKSHOP: "Workshops",
  CONFERENCE: "Conferences",
  COMPETITION: "Competitions",
  AWARD: "Awards",
  RESIDENCY: "Residencies",
  MENTORSHIP: "Mentorships",
  ACCELERATOR: "Accelerator Programs",
  INCUBATOR: "Incubator Programs",
  BOOTCAMP: "Bootcamps",
  EXCHANGE: "Exchange Programs",
  RESEARCH: "Research Opportunities",
};

// ════════════════════════════════════════════════════════════
// 7. ORGANIZATION TYPE SLUG → ENUM VALUE
// ════════════════════════════════════════════════════════════
const ORG_TYPE_MAP = {
  private: "PRIVATE",
  smes: "SMALL_BUSINESS",
  startups: "STARTUP",
  ngos: "NGO",
  ngo: "NGO",
  international: "INTERNATIONAL_ORG",
  government: "NATIONAL_GOV",
  "county-government": "COUNTY_GOV",
  "state-corporations": "STATE_CORPORATION",
  universities: "EDUCATION",
  foundations: "FOUNDATION",
  religious: "RELIGIOUS_ORG",
};

const ORG_TYPE_LABELS = {
  PRIVATE: "Private Sector Companies",
  SMALL_BUSINESS: "SMEs",
  STARTUP: "Startups",
  NGO: "NGOs",
  INTERNATIONAL_ORG: "International Organizations",
  NATIONAL_GOV: "Government",
  COUNTY_GOV: "County Governments",
  STATE_CORPORATION: "State Corporations",
  EDUCATION: "Universities",
  FOUNDATION: "Foundations",
  RELIGIOUS_ORG: "Religious Organizations",
};

// ════════════════════════════════════════════════════════════
// 8. SPECIAL FILTERS
// ════════════════════════════════════════════════════════════
const SPECIAL_FILTERS = {
  remote: { type: "remote", value: true, label: "Remote" },
};

// ════════════════════════════════════════════════════════════
// PARSER FUNCTIONS
// ════════════════════════════════════════════════════════════

/**
 * Parse URL segments into job filters.
 * Examples:
 *   ["technology", "nairobi"]          → { category: "TECHNOLOGY", county: "Nairobi" }
 *   ["full-time", "mombasa"]          → { employmentType: "FULL_TIME", county: "Mombasa" }
 *   ["entry-level", "technology"]     → { experienceLevel: "ENTRY_LEVEL", category: "TECHNOLOGY" }
 *   ["remote", "technology"]          → { isRemote: true, category: "TECHNOLOGY" }
 *   ["senior-accountant-safaricom"]   → null (not a filter combo — it's a job slug)
 *
 * Returns { filters, labels, valid }
 *   filters: { category?, employmentType?, experienceLevel?, county?, country?, isRemote? }
 *   labels: human-readable names for matched filters
 *   valid: boolean — whether all segments were recognized as filters
 */
export function parseJobFilters(segments) {
  if (!segments || segments.length < 2) return null; // Single segments are job detail pages

  const filters = {};
  const labels = {};
  let matched = 0;

  for (const segment of segments) {
    // Check special filters first
    if (SPECIAL_FILTERS[segment]) {
      filters.isRemote = true;
      labels.isRemote = SPECIAL_FILTERS[segment].label;
      matched++;
      continue;
    }

    // Check category
    if (JOB_CATEGORY_MAP[segment]) {
      filters.category = JOB_CATEGORY_MAP[segment];
      labels.category = JOB_CATEGORY_LABELS[filters.category] || filters.category.replace(/_/g, " ");
      matched++;
      continue;
    }

    // Check employment type
    if (EMPLOYMENT_TYPE_MAP[segment]) {
      filters.employmentType = EMPLOYMENT_TYPE_MAP[segment];
      labels.employmentType = EMPLOYMENT_TYPE_LABELS[filters.employmentType] || filters.employmentType;
      matched++;
      continue;
    }

    // Check experience level
    if (EXPERIENCE_LEVEL_MAP[segment]) {
      filters.experienceLevel = EXPERIENCE_LEVEL_MAP[segment];
      labels.experienceLevel = EXPERIENCE_LEVEL_LABELS[filters.experienceLevel] || filters.experienceLevel;
      matched++;
      continue;
    }

    // Check location (county)
    if (LOCATION_MAP[segment]) {
      filters.county = LOCATION_MAP[segment].county;
      filters.country = LOCATION_MAP[segment].country;
      labels.location = LOCATION_MAP[segment].county;
      matched++;
      continue;
    }

    // Check country
    if (COUNTRY_SLUG_MAP[segment]) {
      filters.country = COUNTRY_SLUG_MAP[segment];
      labels.location = COUNTRY_SLUG_MAP[segment];
      matched++;
      continue;
    }

    // Unknown segment — not a valid filter combo
    return null;
  }

  // Must match ALL segments
  if (matched !== segments.length) return null;

  return { filters, labels, valid: true };
}

/**
 * Parse URL segments into opportunity filters.
 * Examples:
 *   ["scholarships", "kenya"]          → { opportunityType: "SCHOLARSHIP", country: "Kenya" }
 *   ["grants", "nairobi"]             → { opportunityType: "GRANT", county: "Nairobi" }
 *   ["fellowships"]                    → null (single segment = detail page)
 */
export function parseOpportunityFilters(segments) {
  if (!segments || segments.length < 2) return null;

  const filters = {};
  const labels = {};
  let matched = 0;

  for (const segment of segments) {
    // Check opportunity type
    if (OPP_TYPE_MAP[segment]) {
      filters.opportunityType = OPP_TYPE_MAP[segment];
      labels.type = OPP_TYPE_LABELS[filters.opportunityType] || filters.opportunityType;
      matched++;
      continue;
    }

    // Check location
    if (LOCATION_MAP[segment]) {
      filters.county = LOCATION_MAP[segment].county;
      filters.country = LOCATION_MAP[segment].country;
      labels.location = LOCATION_MAP[segment].county;
      matched++;
      continue;
    }

    // Check country
    if (COUNTRY_SLUG_MAP[segment]) {
      filters.country = COUNTRY_SLUG_MAP[segment];
      labels.location = COUNTRY_SLUG_MAP[segment];
      matched++;
      continue;
    }

    return null;
  }

  if (matched !== segments.length) return null;
  return { filters, labels, valid: true };
}

/**
 * Parse URL segments into organization filters.
 * Examples:
 *   ["ngos", "nairobi"]               → { organizationType: "NGO", county: "Nairobi" }
 *   ["startups", "kenya"]             → { organizationType: "STARTUP", country: "Kenya" }
 */
export function parseOrganizationFilters(segments) {
  if (!segments || segments.length < 2) return null;

  const filters = {};
  const labels = {};
  let matched = 0;

  for (const segment of segments) {
    // Check org type
    if (ORG_TYPE_MAP[segment]) {
      filters.organizationType = ORG_TYPE_MAP[segment];
      labels.type = ORG_TYPE_LABELS[filters.organizationType] || filters.organizationType;
      matched++;
      continue;
    }

    // Check location
    if (LOCATION_MAP[segment]) {
      filters.county = LOCATION_MAP[segment].county;
      filters.country = LOCATION_MAP[segment].country;
      labels.location = LOCATION_MAP[segment].county;
      matched++;
      continue;
    }

    // Check country
    if (COUNTRY_SLUG_MAP[segment]) {
      filters.country = COUNTRY_SLUG_MAP[segment];
      labels.location = COUNTRY_SLUG_MAP[segment];
      matched++;
      continue;
    }

    return null;
  }

  if (matched !== segments.length) return null;
  return { filters, labels, valid: true };
}

// ════════════════════════════════════════════════════════════
// METADATA GENERATORS
// ════════════════════════════════════════════════════════════

/**
 * Generate SEO title for job filter combo
 */
export function generateJobComboTitle(labels) {
  const parts = [];
  if (labels.category) parts.push(labels.category);
  else if (labels.employmentType) parts.push(labels.employmentType);
  else if (labels.experienceLevel) parts.push(labels.experienceLevel);
  else if (labels.isRemote) parts.push("Remote");

  if (labels.location) parts.push(`in ${labels.location}`);

  const base = parts.join(" Jobs ");
  return base ? `${base} in Kenya 2026 | JobNet.co.ke` : "Jobs in Kenya 2026 | JobNet.co.ke";
}

/**
 * Generate SEO description for job filter combo
 */
export function generateJobComboDescription(labels) {
  const filterParts = [];
  if (labels.category) filterParts.push(labels.category);
  if (labels.employmentType) filterParts.push(labels.employmentType);
  if (labels.experienceLevel) filterParts.push(labels.experienceLevel);
  if (labels.isRemote) filterParts.push("Remote");

  const filterStr = filterParts.join(" ");
  const locationStr = labels.location ? ` in ${labels.location}` : " in Kenya";

  return `Browse ${filterStr.toLowerCase()} jobs${locationStr}. Updated daily. Apply now on JobNet.co.ke — Kenya's #1 job board.`;
}

/**
 * Generate SEO title for opportunity filter combo
 */
export function generateOppComboTitle(labels) {
  const parts = [];
  if (labels.type) parts.push(labels.type);
  if (labels.location) parts.push(`in ${labels.location}`);

  const base = parts.join(" ");
  return base ? `${base} 2026 | JobNet.co.ke` : "Opportunities 2026 | JobNet.co.ke";
}

/**
 * Generate SEO description for opportunity filter combo
 */
export function generateOppComboDescription(labels) {
  const typeStr = labels.type ? labels.type.toLowerCase() : "opportunities";
  const locationStr = labels.location ? ` in ${labels.location}` : " in Kenya";
  return `Find the latest ${typeStr}${locationStr}. Updated daily. Apply now on JobNet.co.ke.`;
}

/**
 * Generate SEO title for organization filter combo
 */
export function generateOrgComboTitle(labels) {
  const parts = [];
  if (labels.type) parts.push(labels.type);
  if (labels.location) parts.push(`in ${labels.location}`);

  const base = parts.join(" ");
  return base ? `${base} — Company Profiles | JobNet.co.ke` : "Companies & Organizations | JobNet.co.ke";
}

/**
 * Generate SEO description for organization filter combo
 */
export function generateOrgComboDescription(labels) {
  const typeStr = labels.type ? labels.type.toLowerCase() : "companies and organizations";
  const locationStr = labels.location ? ` in ${labels.location}` : " in Kenya";
  return `Browse ${typeStr}${locationStr}. View profiles, open positions, and apply on JobNet.co.ke.`;
}

// ════════════════════════════════════════════════════════════
// SITEMAP URL GENERATORS
// ════════════════════════════════════════════════════════════

/**
 * Generate all valid job combo URLs for sitemap.
 * Returns array of { url, priority, changeFrequency }
 */
export function generateJobComboUrls() {
  const urls = [];
  const categories = Object.keys(JOB_CATEGORY_MAP);
  const jobTypes = Object.keys(EMPLOYMENT_TYPE_MAP);
  const expLevels = Object.keys(EXPERIENCE_LEVEL_MAP);
  const locations = Object.keys(LOCATION_MAP);

  // Category × Location (Kenya counties only — 47)
  const kenyanCounties = Object.entries(LOCATION_MAP)
    .filter(([, v]) => v.country === "Kenya")
    .map(([slug]) => slug);

  for (const cat of categories) {
    for (const loc of kenyanCounties) {
      urls.push({ url: `/jobs/${cat}/${loc}`, priority: 0.7, changeFrequency: "daily" });
    }
  }

  // Category × Country
  const countries = Object.keys(COUNTRY_SLUG_MAP);
  for (const cat of categories) {
    for (const country of countries) {
      urls.push({ url: `/jobs/${cat}/${country}`, priority: 0.6, changeFrequency: "weekly" });
    }
  }

  // Employment Type × County
  for (const jt of jobTypes) {
    for (const loc of kenyanCounties) {
      urls.push({ url: `/jobs/${jt}/${loc}`, priority: 0.6, changeFrequency: "daily" });
    }
  }

  // Experience Level × County
  for (const el of expLevels) {
    for (const loc of kenyanCounties) {
      urls.push({ url: `/jobs/${el}/${loc}`, priority: 0.6, changeFrequency: "daily" });
    }
  }

  return urls;
}

/**
 * Generate all valid opportunity combo URLs for sitemap.
 */
export function generateOppComboUrls() {
  const urls = [];
  const types = Object.keys(OPP_TYPE_MAP);
  const countries = Object.keys(COUNTRY_SLUG_MAP);
  const kenyanCounties = Object.entries(LOCATION_MAP)
    .filter(([, v]) => v.country === "Kenya")
    .map(([slug]) => slug);

  // Opportunity Type × Country
  for (const type of types) {
    for (const country of countries) {
      urls.push({ url: `/opportunities/${type}/${country}`, priority: 0.6, changeFrequency: "weekly" });
    }
  }

  // Opportunity Type × County
  for (const type of types) {
    for (const loc of kenyanCounties) {
      urls.push({ url: `/opportunities/${type}/${loc}`, priority: 0.6, changeFrequency: "daily" });
    }
  }

  return urls;
}

/**
 * Generate all valid organization combo URLs for sitemap.
 */
export function generateOrgComboUrls() {
  const urls = [];
  const types = Object.keys(ORG_TYPE_MAP);
  const kenyanCounties = Object.entries(LOCATION_MAP)
    .filter(([, v]) => v.country === "Kenya")
    .map(([slug]) => slug);

  // Org Type × County
  for (const type of types) {
    for (const loc of kenyanCounties) {
      urls.push({ url: `/organizations/${type}/${loc}`, priority: 0.5, changeFrequency: "weekly" });
    }
  }

  return urls;
}
