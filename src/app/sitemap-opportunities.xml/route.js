import { siteConfig } from "@/config/site-config";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const SITE_URL = siteConfig.url;

// ─── OPPORTUNITIES SITEMAP ─────────────────────────────────
// Only includes published opportunity detail pages from the database.
// ───────────────────────────────────────────────────────────

export async function GET() {
  let opportunities = [];
  try {
    opportunities = await db.opportunity.findMany({
      where: {
        status: "PUBLISHED",
        isActive: true,
        publishedAt: { not: null },
      },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 5000,
    });
  } catch (error) {
    console.warn("Sitemap [opportunities]: Could not fetch from DB:", error.message);
  }

  const seen = new Set();
  const unique = opportunities.filter((opp) => {
    if (seen.has(opp.slug)) return false;
    seen.add(opp.slug);
    return true;
  });

  const urls = unique
    .map(
      (opp) => `  <url>
    <loc>${SITE_URL}/opportunities/${opp.slug}</loc>
    <lastmod>${new Date(opp.updatedAt).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
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
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
    },
  });
}
