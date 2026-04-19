import { siteConfig } from "@/config/site-config";
import { getJobHubs, getOpportunityHubs } from "@/config/hub-config";

export const revalidate = 600;

const SITE_URL = siteConfig.url;

// ─── STATIC & HUB PAGES SITEMAP ────────────────────────────
// Only includes hand-curated, high-quality pages — no auto-generated combos.
// These are the pages Google should crawl and index first.
// ───────────────────────────────────────────────────────────

const staticPages = [
  { url: "/", priority: 1.0, changeFrequency: "daily" },
  { url: "/jobs", priority: 0.9, changeFrequency: "daily" },
  { url: "/opportunities", priority: 0.9, changeFrequency: "daily" },
  { url: "/organizations", priority: 0.8, changeFrequency: "weekly" },
  { url: "/career-advice", priority: 0.8, changeFrequency: "weekly" },
  { url: "/cv-services", priority: 0.9, changeFrequency: "monthly" },
  { url: "/search", priority: 0.7, changeFrequency: "daily" },
  { url: "/about", priority: 0.5, changeFrequency: "monthly" },
  { url: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { url: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { url: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { url: "/cookies", priority: 0.3, changeFrequency: "yearly" },
];

// Hub landing pages — high-intent, curated category pages
const jobHubs = getJobHubs().map((hub) => ({
  url: `/jobs/${hub.slug}`,
  priority: 0.8,
  changeFrequency: "daily",
}));

const opportunityHubs = getOpportunityHubs().map((hub) => ({
  url: `/opportunities/${hub.slug}`,
  priority: 0.8,
  changeFrequency: "daily",
}));

// Filter pages — handled by the [...slug] catch-all route.
// These URLs still work (the dynamic route parses the slug), so we keep them
// in the sitemap for Google to discover. Duplicates with hub pages are fine.
const curatedFilterPages = [
  // Job type filters (handled by [...slug] catch-all)
  { url: "/jobs/full-time", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/part-time", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/contract", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/internship", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/temporary", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/volunteer", priority: 0.6, changeFrequency: "daily" },
  // Experience level filters
  { url: "/jobs/mid-level", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/senior", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/lead", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/manager", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/director", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/executive", priority: 0.6, changeFrequency: "daily" },
  // Job category filters
  { url: "/jobs/technology", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/finance-accounting", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/marketing-communications", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/human-resources", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/engineering", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/healthcare", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/education-training", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/sales-business", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/consulting", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/government-public-sector", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/nonprofit", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/agriculture", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/creative-design", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/legal-compliance", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/logistics-supply-chain", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/hospitality-tourism", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/architecture-construction", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/science-research", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/operations-admin", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/customer-service", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/skilled-trades", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/media-publishing", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/specialised-services", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/insurance", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/real-estate", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/fitness-wellness", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/transportation", priority: 0.6, changeFrequency: "daily" },
  // Opportunity type filters
  { url: "/opportunities/training", priority: 0.6, changeFrequency: "daily" },
  { url: "/opportunities/certifications", priority: 0.6, changeFrequency: "daily" },
  { url: "/opportunities/funding", priority: 0.6, changeFrequency: "daily" },
  { url: "/opportunities/competitions", priority: 0.6, changeFrequency: "daily" },
  { url: "/opportunities/conferences", priority: 0.6, changeFrequency: "daily" },
  { url: "/opportunities/volunteer", priority: 0.6, changeFrequency: "daily" },
  { url: "/opportunities/apprenticeships", priority: 0.6, changeFrequency: "daily" },
  { url: "/opportunities/bootcamps", priority: 0.6, changeFrequency: "daily" },
  { url: "/opportunities/mentorships", priority: 0.6, changeFrequency: "daily" },
  { url: "/opportunities/sponsorships", priority: 0.6, changeFrequency: "daily" },
  { url: "/opportunities/incubators", priority: 0.6, changeFrequency: "daily" },
  { url: "/opportunities/accelerators", priority: 0.6, changeFrequency: "daily" },
  { url: "/opportunities/awards", priority: 0.6, changeFrequency: "daily" },
  { url: "/opportunities/residencies", priority: 0.6, changeFrequency: "daily" },
  { url: "/opportunities/exchanges", priority: 0.6, changeFrequency: "daily" },
  { url: "/opportunities/research", priority: 0.6, changeFrequency: "daily" },
  { url: "/opportunities/university-admissions", priority: 0.6, changeFrequency: "daily" },
  { url: "/opportunities/workshops", priority: 0.6, changeFrequency: "daily" },
  // Organization type filters
  { url: "/organizations/ngos", priority: 0.6, changeFrequency: "weekly" },
  { url: "/organizations/private", priority: 0.6, changeFrequency: "weekly" },
  { url: "/organizations/startups", priority: 0.6, changeFrequency: "weekly" },
  { url: "/organizations/government", priority: 0.6, changeFrequency: "weekly" },
  { url: "/organizations/international", priority: 0.6, changeFrequency: "weekly" },
  { url: "/organizations/county-government", priority: 0.6, changeFrequency: "weekly" },
  { url: "/organizations/state-corporations", priority: 0.6, changeFrequency: "weekly" },
  { url: "/organizations/universities", priority: 0.6, changeFrequency: "weekly" },
  { url: "/organizations/smes", priority: 0.6, changeFrequency: "weekly" },
  { url: "/organizations/foundations", priority: 0.6, changeFrequency: "weekly" },
  { url: "/organizations/religious", priority: 0.6, changeFrequency: "weekly" },
];

export async function GET() {
  const allPages = [
    ...staticPages,
    ...jobHubs,
    ...opportunityHubs,
    ...curatedFilterPages,
  ];

  const urls = allPages
    .map(
      (page) => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
