import { siteConfig } from "@/config/site-config";

export const dynamic = "force-dynamic";

const SITE_URL = siteConfig.url;

// ─── SITEMAP INDEX ─────────────────────────────────────────
// This replaces the monolithic sitemap with focused sub-sitemaps
// so Google can prioritize crawling high-value pages first.
// ───────────────────────────────────────────────────────────

export async function GET() {
  const today = new Date().toISOString().split("T")[0];

  const sitemaps = [
    // Highest priority — static pages and hub landing pages
    { loc: `${SITE_URL}/sitemap-static.xml`, lastmod: today },
    // Dynamic content — individual job/opportunity/company/article pages
    { loc: `${SITE_URL}/sitemap-jobs.xml`, lastmod: today },
    { loc: `${SITE_URL}/sitemap-opportunities.xml`, lastmod: today },
    { loc: `${SITE_URL}/sitemap-companies.xml`, lastmod: today },
    { loc: `${SITE_URL}/sitemap-articles.xml`, lastmod: today },
    // Filter landing pages — only high-value combinations
    { loc: `${SITE_URL}/sitemap-filters.xml`, lastmod: today },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (s) => `  <sitemap>
    <loc>${s.loc}</loc>
    <lastmod>${s.lastmod}</lastmod>
  </sitemap>`
  )
  .join("\n")}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
