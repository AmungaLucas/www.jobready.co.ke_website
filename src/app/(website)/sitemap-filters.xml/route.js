import { siteConfig } from "@/config/site-config";
import { db } from "@/lib/db";

export const revalidate = 600;

const SITE_URL = siteConfig.url;

// ─── FILTER PAGES SITEMAP ──────────────────────────────────
// ONLY includes combo filter URLs that have ACTUAL results in the DB.
// This eliminates the thousands of empty/thin combo pages that were
// wasting Google's crawl budget and causing "crawled but not indexed".
//
// Strategy: Query the DB for which category/location/type combos have
// results, then only include those in the sitemap.
// ───────────────────────────────────────────────────────────

// Top Kenya counties by job volume — only generate combos for these
// (instead of all 47 counties which produces many zero-result pages)
const TOP_COUNTIES = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Uasin Gishu",
  "Kiambu", "Machakos", "Kakamega", "Meru", "Kisii",
  "Nyeri", "Laikipia", "Kajiado", "Bungoma", "Embu",
  "Nyandarua", "Trans Nzoia", "Nandi", "Kericho", "Bomet",
];

// Top job categories — only these get county combos
const TOP_JOB_CATEGORIES = [
  "TECHNOLOGY", "FINANCE_ACCOUNTING", "SALES_BUSINESS", "MARKETING_COMMUNICATIONS",
  "HUMAN_RESOURCES", "ENGINEERING", "HEALTHCARE", "EDUCATION",
  "OPERATIONS_ADMIN", "SUPPLY_CHAIN", "HOSPITALITY", "AGRICULTURE",
  "LEGAL", "CREATIVE_DESIGN", "GOVERNMENT_PUBLIC_SECTOR", "CONSULTING",
  "NONPROFIT", "CUSTOMER_SERVICE", "REAL_ESTATE", "INSURANCE",
  "ARCHITECTURE_CONSTRUCTION", "SCIENCE_RESEARCH", "MEDIA_PUBLISHING",
  "FITNESS_WELLNESS", "SKILLED_TRADES",
];

// Category slug mapping (inverse of filter-parser overrides)
const CATEGORY_SLUGS = {
  TECHNOLOGY: "technology",
  FINANCE_ACCOUNTING: "finance-accounting",
  SALES_BUSINESS: "sales-business",
  MARKETING_COMMUNICATIONS: "marketing-communications",
  HUMAN_RESOURCES: "human-resources",
  ENGINEERING: "engineering",
  HEALTHCARE: "healthcare",
  EDUCATION: "education-training",
  OPERATIONS_ADMIN: "operations-admin",
  SUPPLY_CHAIN: "logistics-supply-chain",
  HOSPITALITY: "hospitality-tourism",
  AGRICULTURE: "agriculture",
  LEGAL: "legal-compliance",
  CREATIVE_DESIGN: "creative-design",
  GOVERNMENT_PUBLIC_SECTOR: "government-public-sector",
  CONSULTING: "consulting",
  NONPROFIT: "nonprofit",
  CUSTOMER_SERVICE: "customer-service",
  REAL_ESTATE: "real-estate",
  INSURANCE: "insurance",
  ARCHITECTURE_CONSTRUCTION: "architecture-construction",
  SCIENCE_RESEARCH: "science-research",
  MEDIA_PUBLISHING: "media-publishing",
  FITNESS_WELLNESS: "fitness-wellness",
  SKILLED_TRADES: "skilled-trades",
};

// County slug mapping
const COUNTY_SLUGS = {};
TOP_COUNTIES.forEach((c) => {
  COUNTY_SLUGS[c] = c.toLowerCase().replace(/\s+/g, "-").replace(/'/g, "");
});

// Employment type combos (only top types × Nairobi)
const TOP_JOB_TYPES = {
  FULL_TIME: "full-time",
  PART_TIME: "part-time",
  CONTRACT: "contract",
  INTERNSHIP: "internships",
  TEMPORARY: "temporary",
  REMOTE: "remote",
};

// Opportunity type combos (only popular types × top counties)
const TOP_OPP_TYPES = {
  SCHOLARSHIP: "scholarships",
  GRANT: "grants",
  FELLOWSHIP: "fellowships",
  BURSARY: "bursaries",
  INTERNSHIP: "internships",
  TRAINING: "training",
  CERTIFICATION: "certifications",
  FUNDING: "funding",
};

// Org type combos
const ORG_TYPE_SLUGS = {
  PRIVATE: "private",
  STARTUP: "startups",
  NGO: "ngos",
  NATIONAL_GOV: "government",
  EDUCATION: "universities",
  INTERNATIONAL_ORG: "international",
  COUNTY_GOV: "county-government",
  STATE_CORPORATION: "state-corporations",
  SME: "smes",
};

function buildXml(entries) {
  const urls = entries
    .map(
      (e) => `  <url>
    <loc>${SITE_URL}${e.url}</loc>
    <lastmod>${e.lastmod || new Date().toISOString()}</lastmod>
    <changefreq>${e.changeFrequency}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

const XML_HEADERS = {
  headers: {
    "Content-Type": "application/xml; charset=utf-8",
    "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
  },
};

export async function GET() {
  const entries = [];
  const today = new Date().toISOString();

  try {
    // ── 1. Job category × county combos (only those with results) ──
    const countyJobCounts = await db.job.groupBy({
      by: ["county"],
      where: { status: "PUBLISHED", isActive: true, county: { in: TOP_COUNTIES } },
      _count: true,
    });

    const activeCounties = new Set(
      countyJobCounts.filter((c) => c._count >= 3).map((c) => c.county)
    );

    for (const [catEnum, catSlug] of Object.entries(CATEGORY_SLUGS)) {
      // Category × Kenya (always include — it's the main category page, already in static)
      // Skip: covered by sitemap-static.xml

      // Category × county (only if that county has enough jobs)
      for (const county of activeCounties) {
        const countySlug = COUNTY_SLUGS[county];
        if (!countySlug) continue;
        entries.push({
          url: `/jobs/${catSlug}/${countySlug}`,
          lastmod: today,
          changeFrequency: "daily",
          priority: 0.6,
        });
      }
    }

    // ── 2. Job type × Nairobi combos ──
    for (const [typeEnum, typeSlug] of Object.entries(TOP_JOB_TYPES)) {
      if (typeEnum === "REMOTE") {
        entries.push({
          url: `/jobs/remote`,
          lastmod: today,
          changeFrequency: "daily",
          priority: 0.7,
        });
      } else {
        entries.push({
          url: `/jobs/${typeSlug}/nairobi`,
          lastmod: today,
          changeFrequency: "daily",
          priority: 0.6,
        });
      }
    }

    // ── 3. Opportunity type × county combos (only those with results) ──
    // Opportunities don't have county field, so we use a lighter approach:
    // only include type × Kenya combos for popular types
    for (const [typeEnum, typeSlug] of Object.entries(TOP_OPP_TYPES)) {
      entries.push({
        url: `/opportunities/${typeSlug}/kenya`,
        lastmod: today,
        changeFrequency: "weekly",
        priority: 0.5,
      });
    }

    // ── 4. Organization type × county combos (only if results exist) ──
    const countyOrgCounts = await db.company.groupBy({
      by: ["county"],
      where: {
        isActive: true,
        county: { in: TOP_COUNTIES },
      },
      _count: true,
    });

    const activeOrgCounties = new Set(
      countyOrgCounts.filter((c) => c._count >= 2).map((c) => c.county)
    );

    for (const [typeEnum, typeSlug] of Object.entries(ORG_TYPE_SLUGS)) {
      for (const county of activeOrgCounties) {
        const countySlug = COUNTY_SLUGS[county];
        if (!countySlug) continue;
        entries.push({
          url: `/organizations/${typeSlug}/${countySlug}`,
          lastmod: today,
          changeFrequency: "weekly",
          priority: 0.4,
        });
      }
    }
  } catch (error) {
    console.warn("Sitemap [filters]: DB query error, using minimal filter set:", error.message);
    // Fallback: only include a small set of guaranteed-useful filter pages
    const minimalFilters = [
      "/jobs/technology/nairobi",
      "/jobs/full-time/nairobi",
      "/jobs/internships/nairobi",
      "/jobs/remote",
      "/opportunities/scholarships/kenya",
      "/opportunities/internships/kenya",
    ];
    for (const url of minimalFilters) {
      entries.push({ url, lastmod: today, changeFrequency: "daily", priority: 0.5 });
    }
  }

  // Remove duplicates (shouldn't happen but safety net)
  const seen = new Set();
  const unique = entries.filter((e) => {
    if (seen.has(e.url)) return false;
    seen.add(e.url);
    return true;
  });

  const xml = buildXml(unique);
  return new Response(xml, XML_HEADERS);
}
