// ============================================================
// parse-filter-segments.js
// Maps URL path segments → database filter objects
// Used by catch-all routes: /jobs/[...filters], /opportunities/[...filters], etc.
// ============================================================

import { jobCategory, organizationLocation } from "@/data/org_data";

// ─── Category: slug → { value, label } ─────────────────────
export const categorySlugMap = Object.fromEntries(
  jobCategory.map((cat) => [
    cat.value.toLowerCase().replace(/_/g, "-"),
    { value: cat.value, label: cat.label },
  ])
);

// ─── Job Type: slug → enum value ───────────────────────────
const employmentTypes = [
  { value: "FULL_TIME", label: "Full-Time", slug: "full-time" },
  { value: "PART_TIME", label: "Part-Time", slug: "part-time" },
  { value: "CONTRACT", label: "Contract", slug: "contract" },
  { value: "TEMPORARY", label: "Temporary", slug: "temporary" },
  { value: "INTERNSHIP", label: "Internship", slug: "internship" },
  { value: "VOLUNTEER", label: "Volunteer", slug: "volunteer" },
  { value: "FREELANCE", label: "Freelance", slug: "freelance" },
];
export const jobTypeSlugMap = Object.fromEntries(
  employmentTypes.map((t) => [t.slug, { value: t.value, label: t.label }])
);

// ─── Experience Level: slug → enum value ──────────────────
const experienceLevels = [
  { value: "ENTRY_LEVEL", label: "Entry Level", slug: "entry-level" },
  { value: "JUNIOR", label: "Junior", slug: "junior" },
  { value: "MID_LEVEL", label: "Mid Level", slug: "mid-level" },
  { value: "SENIOR", label: "Senior", slug: "senior" },
  { value: "LEAD", label: "Lead", slug: "lead" },
  { value: "MANAGER", label: "Manager", slug: "manager" },
  { value: "DIRECTOR", label: "Director", slug: "director" },
  { value: "EXECUTIVE", label: "Executive", slug: "executive" },
];
export const expLevelSlugMap = Object.fromEntries(
  experienceLevels.map((l) => [l.slug, { value: l.value, label: l.label }])
);

// ─── Location: slug → county/country name ──────────────────
// Build from org_data.js: includes all 47 Kenyan counties + regions from 11 countries
export const locationSlugMap = {};
organizationLocation.forEach((country) => {
  country.regions.forEach((region) => {
    const slug = region.toLowerCase().replace(/[\s']/g, "-");
    locationSlugMap[slug] = { value: region, label: `${region}, ${country.name}`, country: country.name };
  });
});

// ─── Opportunity Type: slug → enum value ──────────────────
const opportunityTypes = [
  { value: "INTERNSHIP", label: "Internships", slug: "internships" },
  { value: "SPONSORSHIP", label: "Sponsorships", slug: "sponsorships" },
  { value: "BURSARY", label: "Bursaries", slug: "bursaries" },
  { value: "SCHOLARSHIP", label: "Scholarships", slug: "scholarships" },
  { value: "UNIVERSITY_ADMISSION", label: "University Admissions", slug: "university-admissions" },
  { value: "VOLUNTEER", label: "Volunteer Opportunities", slug: "volunteer" },
  { value: "TRAINING", label: "Training Programs", slug: "training" },
  { value: "GRANT", label: "Grants & Funding", slug: "grants" },
  { value: "FUNDING", label: "Funding Opportunities", slug: "funding" },
  { value: "CERTIFICATION", label: "Certifications", slug: "certifications" },
  { value: "FELLOWSHIP", label: "Fellowships", slug: "fellowships" },
  { value: "APPRENTICESHIP", label: "Apprenticeships", slug: "apprenticeships" },
  { value: "WORKSHOP", label: "Workshops", slug: "workshops" },
  { value: "CONFERENCE", label: "Conferences", slug: "conferences" },
  { value: "COMPETITION", label: "Competitions", slug: "competitions" },
  { value: "AWARD", label: "Awards", slug: "awards" },
  { value: "RESIDENCY", label: "Residencies", slug: "residencies" },
  { value: "MENTORSHIP", label: "Mentorships", slug: "mentorships" },
  { value: "ACCELERATOR", label: "Accelerators", slug: "accelerators" },
  { value: "INCUBATOR", label: "Incubators", slug: "incubators" },
  { value: "BOOTCAMP", label: "Bootcamps", slug: "bootcamps" },
  { value: "EXCHANGE", label: "Exchange Programs", slug: "exchanges" },
  { value: "RESEARCH", label: "Research Opportunities", slug: "research" },
];
export const oppTypeSlugMap = Object.fromEntries(
  opportunityTypes.map((t) => [t.slug, { value: t.value, label: t.label }])
);

// ─── Organization Type: slug → enum value ─────────────────
const orgTypes = [
  { value: "PRIVATE", label: "Private Sector", slug: "private" },
  { value: "SMALL_BUSINESS", label: "SMEs", slug: "smes" },
  { value: "STARTUP", label: "Startups", slug: "startups" },
  { value: "NGO", label: "NGOs", slug: "ngos" },
  { value: "INTERNATIONAL_ORG", label: "International Orgs", slug: "international" },
  { value: "NATIONAL_GOV", label: "Government", slug: "government" },
  { value: "COUNTY_GOV", label: "County Governments", slug: "county-government" },
  { value: "STATE_CORPORATION", label: "State Corporations", slug: "state-corporations" },
  { value: "EDUCATION", label: "Universities", slug: "universities" },
  { value: "FOUNDATION", label: "Foundations", slug: "foundations" },
  { value: "RELIGIOUS_ORG", label: "Religious Orgs", slug: "religious" },
];
export const orgTypeSlugMap = Object.fromEntries(
  orgTypes.map((t) => [t.slug, { value: t.value, label: t.label }])
);

// ─── Master lookup: all known filter slugs (for route resolution) ──
export const allKnownFilterSlugs = new Set([
  ...Object.keys(categorySlugMap),
  ...Object.keys(jobTypeSlugMap),
  ...Object.keys(expLevelSlugMap),
  ...Object.keys(locationSlugMap),
  ...Object.keys(oppTypeSlugMap),
  ...Object.keys(orgTypeSlugMap),
  "remote",
]);

// ─── Classifier: what type of filter is a slug? ───────────
export function classifySegment(slug) {
  if (slug === "remote") return { type: "remote", value: true, label: "Remote" };
  if (categorySlugMap[slug]) return { type: "category", ...categorySlugMap[slug] };
  if (jobTypeSlugMap[slug]) return { type: "employmentType", ...jobTypeSlugMap[slug] };
  if (expLevelSlugMap[slug]) return { type: "experienceLevel", ...expLevelSlugMap[slug] };
  if (locationSlugMap[slug]) return { type: "location", ...locationSlugMap[slug] };
  if (oppTypeSlugMap[slug]) return { type: "opportunityType", ...oppTypeSlugMap[slug] };
  if (orgTypeSlugMap[slug]) return { type: "organizationType", ...orgTypeSlugMap[slug] };
  return null; // unknown slug
}

// ─── Job combo parser ─────────────────────────────────────
export function parseJobFilterSegments(segments) {
  const filters = [];
  for (const seg of segments) {
    const classified = classifySegment(seg);
    if (!classified) return null; // invalid segment → 404
    if (classified.type === "remote") {
      filters.push({ key: "isRemote", value: true, label: "Remote" });
    } else {
      filters.push({ key: classified.type, value: classified.value, label: classified.label });
    }
  }
  return filters;
}

// ─── Opportunity combo parser ─────────────────────────────
export function parseOpportunityFilterSegments(segments) {
  const filters = [];
  for (const seg of segments) {
    const classified = classifySegment(seg);
    if (!classified) return null;
    // For opportunities, accept: opportunityType, location
    if (["opportunityType", "location"].includes(classified.type)) {
      filters.push({ key: classified.type, value: classified.value, label: classified.label });
    }
  }
  return filters.length > 0 ? filters : null;
}

// ─── Organization combo parser ────────────────────────────
export function parseOrganizationFilterSegments(segments) {
  const filters = [];
  for (const seg of segments) {
    const classified = classifySegment(seg);
    if (!classified) return null;
    // For organizations, accept: organizationType, location
    if (["organizationType", "location"].includes(classified.type)) {
      filters.push({ key: classified.type, value: classified.value, label: classified.label });
    }
  }
  return filters.length > 0 ? filters : null;
}

// ─── Title builder for combo pages ────────────────────────
export function buildComboTitle(filters, contentType = "jobs") {
  const parts = [];
  let locationPart = null;

  for (const f of filters) {
    if (f.key === "location") {
      locationPart = f.label;
    } else {
      parts.push(f.label);
    }
  }

  let title;
  if (parts.length === 0 && locationPart) {
    title = `${contentType === "jobs" ? "Jobs" : "Opportunities"} in ${locationPart}`;
  } else if (locationPart) {
    title = `${parts.join(" ")} ${contentType === "jobs" ? "Jobs" : "Opportunities"} in ${locationPart}`;
  } else {
    title = `${parts.join(" ")} ${contentType === "jobs" ? "Jobs" : "Opportunities"}`;
  }

  return title;
}

// ─── Generate all valid combo URL paths for sitemap ───────
export function generateJobComboPaths() {
  const paths = [];
  const categorySlugs = Object.keys(categorySlugMap);
  const locationSlugs = Object.keys(locationSlugMap);
  const jobTypeSlugs = Object.keys(jobTypeSlugMap);
  const expLevelSlugs = Object.keys(expLevelSlugMap);

  // Category × Location (Kenya only — 47 counties)
  const kenyaCounties = organizationLocation
    .find((c) => c.code === "KE")
    ?.regions.map((r) => r.toLowerCase().replace(/[\s']/g, "-")) || [];
  for (const cat of categorySlugs) {
    for (const loc of kenyaCounties) {
      paths.push(`/jobs/${cat}/${loc}`);
    }
  }

  // Category × Remote
  for (const cat of categorySlugs) {
    paths.push(`/jobs/${cat}/remote`);
  }

  // Job Type × Location (Kenya counties)
  for (const jt of jobTypeSlugs) {
    for (const loc of kenyaCounties) {
      paths.push(`/jobs/${jt}/${loc}`);
    }
  }

  // Experience Level × Location (Kenya counties)
  for (const el of expLevelSlugs) {
    for (const loc of kenyaCounties) {
      paths.push(`/jobs/${el}/${loc}`);
    }
  }

  // Category × Location (top non-Kenya cities)
  const topCities = ["nairobi", "mombasa", "kisumu", "nakuru"];
  for (const country of organizationLocation.filter((c) => c.code !== "KE")) {
    for (const cat of categorySlugs.slice(0, 5)) {
      // top 5 categories only for international
      for (const region of country.regions.slice(0, 3)) {
        const loc = region.toLowerCase().replace(/[\s']/g, "-");
        if (!paths.includes(`/jobs/${cat}/${loc}`)) {
          paths.push(`/jobs/${cat}/${loc}`);
        }
      }
    }
  }

  return paths;
}

export function generateOpportunityComboPaths() {
  const paths = [];
  const oppSlugs = Object.keys(oppTypeSlugMap);
  const locationSlugs = Object.keys(locationSlugMap);

  // Opportunity Type × all locations
  for (const opp of oppSlugs) {
    for (const loc of locationSlugs) {
      paths.push(`/opportunities/${opp}/${loc}`);
    }
  }

  return paths;
}

export function generateOrganizationComboPaths() {
  const paths = [];
  const orgSlugs = Object.keys(orgTypeSlugMap);
  const locationSlugs = Object.keys(locationSlugMap);

  // Org Type × all locations
  for (const org of orgSlugs) {
    for (const loc of locationSlugs) {
      paths.push(`/organizations/${org}/${loc}`);
    }
  }

  return paths;
}
