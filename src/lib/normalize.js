/**
 * Normalization helpers — transform API responses into the shapes
 * expected by UI components (JobCard, OpportunityCard, CompanyProfileHeader, etc.).
 */

import { formatJobType, formatExperienceLevel } from "./format";

// ─── General helpers ──────────────────────────────────────────

/**
 * Extract initials from a name. "Safaricom PLC" → "SP"
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/**
 * Format a time-left countdown from a deadline date.
 * "5h 23m", "1d 5h", "2d 12h", "12d"
 * @param {Date|string} deadline
 * @returns {string}
 */
export function formatTimeLeft(deadline) {
  if (!deadline) return "";
  const d = typeof deadline === "string" ? new Date(deadline) : deadline;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();

  if (diffMs <= 0) return "Closed";

  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays >= 1) {
    const hours = diffHours % 24;
    if (hours === 0) return `${diffDays}d`;
    return `${diffDays}d ${hours}h`;
  }
  if (diffHours >= 1) {
    const mins = diffMins % 60;
    if (mins === 0) return `${diffHours}h`;
    return `${diffHours}h ${mins}m`;
  }
  return `${diffMins}m`;
}

// ─── Job normalization ────────────────────────────────────────

/**
 * Normalize a job from the API into the shape expected by JobCard.
 * Adds display-formatted jobType / experienceLevel.
 * @param {object} job — API job record (with nested company)
 * @returns {object}
 */
export function normalizeJobForCard(job) {
  return {
    ...job,
    jobType: formatJobType(job.jobType),
    experienceLevel: formatExperienceLevel(job.experienceLevel),
  };
}

/**
 * Normalize an array of jobs from the API.
 * @param {object[]} jobs
 * @returns {object[]}
 */
export function normalizeJobs(jobs) {
  if (!Array.isArray(jobs)) return [];
  return jobs.map(normalizeJobForCard);
}

// ─── Company normalization ────────────────────────────────────

/**
 * Normalize a company from the API into the shape expected by
 * CompanyProfileHeader, CompanyStats, and the about section.
 * @param {object} company — raw API company record
 * @param {object} pagination — { total } active jobs count
 * @returns {object} enriched company
 */
export function normalizeCompany(company, pagination) {
  const location = [company.city, company.country].filter(Boolean).join(", ");

  // Split description into paragraphs
  const description = company.description
    ? company.description.split(/\n{2,}/).filter(Boolean)
    : [];

  const openJobs = pagination?.total ?? company.jobCount ?? 0;

  // Build key details grid
  const keyDetails = [];
  if (company.industry) keyDetails.push({ label: "Industry", value: company.industry });
  if (company.foundedYear) keyDetails.push({ label: "Founded", value: String(company.foundedYear) });
  if (company.employeeSize) keyDetails.push({ label: "Size", value: `${company.employeeSize} employees` });
  if (location) keyDetails.push({ label: "Location", value: location });
  if (company.website) {
    const displayUrl = company.website.replace(/^https?:\/\//, "").replace(/\/$/, "");
    keyDetails.push({ label: "Website", value: displayUrl, href: company.website });
  }
  if (company.companyType) {
    const label = company.tickerSymbol
      ? `NSE Listed (${company.tickerSymbol})`
      : company.companyType;
    keyDetails.push({ label: "Type", value: label });
  }

  return {
    ...company,
    initials: getInitials(company.name),
    location,
    description,
    keyDetails,
    stats: {
      openJobs,
      totalHires: "—",
      employees: company.employeeSize || "—",
    },
    employeeCount: company.employeeSize || "—",
    type: company.companyType || "",
  };
}

/**
 * Normalize similar companies from the API for the sidebar list.
 * Adds initials, maps jobCount to openJobs.
 * @param {object[]} companies
 * @returns {object[]}
 */
export function normalizeSimilarCompanies(companies) {
  if (!Array.isArray(companies)) return [];
  return companies.map((c) => ({
    slug: c.slug,
    name: c.name,
    initials: getInitials(c.name),
    logoColor: c.logoColor || "#1a56db",
    openJobs: c.jobCount ?? 0,
  }));
}

// ─── Opportunity normalization ────────────────────────────────

/**
 * Normalize an opportunity from the API for the OpportunityCard.
 * Adds lowercase `type` for color mapping.
 * @param {object} opp — raw API opportunity record
 * @returns {object}
 */
export function normalizeOpportunity(opp) {
  return {
    title: opp.title,
    slug: opp.slug,
    organizationName: opp.organizationName,
    opportunityType: opp.opportunityType || "",
    type: opp.opportunityType ? opp.opportunityType.toLowerCase() : "",
    deadline: opp.deadline,
    value: null, // API doesn't return this field
  };
}

/**
 * Normalize an array of opportunities from the API.
 * @param {object[]} opportunities
 * @returns {object[]}
 */
export function normalizeOpportunities(opportunities) {
  if (!Array.isArray(opportunities)) return [];
  return opportunities.map(normalizeOpportunity);
}
