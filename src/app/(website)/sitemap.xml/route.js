import { siteConfig } from "@/config/site-config";

export const dynamic = "force-dynamic";

const SITE_URL = siteConfig.url;

/**
 * GET /sitemap.xml — Sitemap Index
 *
 * Serves the sitemap index that references all sub-sitemaps.
 * This is the URL submitted to Google Search Console.
 *
 * Sub-sitemaps (all inside this same route group):
 *   /sitemap-static.xml       — Static pages + hub landing pages
 *   /sitemap-jobs.xml          — Individual job detail pages
 *   /sitemap-opportunities.xml — Individual opportunity pages
 *   /sitemap-companies.xml     — Company profile pages
 *   /sitemap-articles.xml      — Blog article pages
 *   /sitemap-filters.xml       — Filter combo pages with results
 */
export async function GET() {
  const today = new Date().toISOString().split("T")[0];

  const sitemaps = [
    { loc: `${SITE_URL}/sitemap-static.xml`, lastmod: today },
    { loc: `${SITE_URL}/sitemap-jobs.xml`, lastmod: today },
    { loc: `${SITE_URL}/sitemap-opportunities.xml`, lastmod: today },
    { loc: `${SITE_URL}/sitemap-companies.xml`, lastmod: today },
    { loc: `${SITE_URL}/sitemap-articles.xml`, lastmod: today },
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
