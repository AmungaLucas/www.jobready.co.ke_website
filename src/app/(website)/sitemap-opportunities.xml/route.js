import { siteConfig } from "@/config/site-config";
import { db } from "@/lib/db";

export const revalidate = 600;

const SITE_URL = siteConfig.url;
const BATCH_SIZE = 5000;

// ─── OPPORTUNITIES SITEMAP (paginated) ─────────────────────
// Dynamically paginated — no hard cap on total opportunities.
// If <=5000, serves URLs directly. If >5000, serves a
// sitemap index pointing to sitemap-opportunities-1.xml, etc.
// ───────────────────────────────────────────────────────────

export async function GET() {
  try {
    const total = await db.opportunity.count({
      where: {
        status: "PUBLISHED",
        isActive: true,
        publishedAt: { not: null },
      },
    });

    if (total <= BATCH_SIZE) {
      const items = await db.opportunity.findMany({
        where: {
          status: "PUBLISHED",
          isActive: true,
          publishedAt: { not: null },
        },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      });

      const seen = new Set();
      const unique = items.filter((o) => {
        if (seen.has(o.slug)) return false;
        seen.add(o.slug);
        return true;
      });

      const urls = unique
        .map(
          (o) => `  <url>
    <loc>${SITE_URL}/opportunities/${o.slug}</loc>
    <lastmod>${new Date(o.updatedAt).toISOString()}</lastmod>
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

    const totalPages = Math.ceil(total / BATCH_SIZE);
    const entries = Array.from({ length: totalPages }, (_, i) => ({
      loc: `${SITE_URL}/sitemap-opportunities-${i + 1}.xml`,
    }));

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (s) => `  <sitemap>
    <loc>${s.loc}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
  </sitemap>`
  )
  .join("\n")}
</sitemapindex>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.warn("Sitemap [opportunities]: DB error:", error.message);
    return new Response("Error generating sitemap", { status: 500 });
  }
}
