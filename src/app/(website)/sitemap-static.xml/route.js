import { siteConfig } from "@/config/site-config";
import { getJobHubs, getOpportunityHubs } from "@/config/hub-config";

export const revalidate = 600;

const SITE_URL = siteConfig.url;

// ─── STATIC & HUB PAGES SITEMAP ────────────────────────────
// Only includes hand-curated, high-quality pages — no auto-generated combos.
// These are the pages Google should crawl and index first.
// ───────────────────────────────────────────────────────────

const staticPages = [
  { url: "/", priority: 1.0, changeFrequency: "daily", lastmod: null }, // content changes daily
  { url: "/jobs", priority: 0.9, changeFrequency: "daily", lastmod: null },
  { url: "/opportunities", priority: 0.9, changeFrequency: "daily", lastmod: null },
  { url: "/organizations", priority: 0.8, changeFrequency: "weekly", lastmod: null },
  { url: "/career-advice", priority: 0.8, changeFrequency: "weekly", lastmod: null },
  { url: "/cv-services", priority: 0.9, changeFrequency: "monthly", lastmod: "2026-04-01" },
  // /search removed — it has noindex via layout.jsx and /search? is blocked by robots.txt
  { url: "/about", priority: 0.5, changeFrequency: "monthly", lastmod: "2026-01-15" },
  { url: "/contact", priority: 0.5, changeFrequency: "yearly", lastmod: "2026-01-15" },
  { url: "/privacy", priority: 0.3, changeFrequency: "yearly", lastmod: "2026-01-15" },
  { url: "/terms", priority: 0.3, changeFrequency: "yearly", lastmod: "2026-01-15" },
  { url: "/cookies", priority: 0.3, changeFrequency: "yearly", lastmod: "2026-01-15" },
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
  // Job type filters — excluding slugs already covered by hub pages (priority 0.8)
  { url: "/jobs/full-time", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/contract", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/temporary", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/volunteer", priority: 0.6, changeFrequency: "daily" },
  // NOTE: part-time, technology, finance-accounting, engineering, healthcare,
  // consulting, creative-design, customer-service, human-resources are
  // already covered by hub pages (priority 0.8).
  // Experience level filters
  { url: "/jobs/mid-level", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/senior", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/lead", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/manager", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/director", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/executive", priority: 0.6, changeFrequency: "daily" },
  // Job category filters — excluding slugs already covered by hub pages
  { url: "/jobs/marketing-communications", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/education-training", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/sales-business", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/government-public-sector", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/nonprofit", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/agriculture", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/legal-compliance", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/logistics-supply-chain", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/hospitality-tourism", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/architecture-construction", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/science-research", priority: 0.6, changeFrequency: "daily" },
  { url: "/jobs/operations-admin", priority: 0.6, changeFrequency: "daily" },
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

  const today = new Date().toISOString();
  const urls = allPages
    .map(
      (page) => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod || today}</lastmod>
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
