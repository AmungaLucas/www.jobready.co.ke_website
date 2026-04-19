import { siteConfig } from "@/config/site-config";
import { db } from "@/lib/db";

export const revalidate = 600;

const SITE_URL = siteConfig.url;

// ─── ARTICLES SITEMAP ──────────────────────────────────────
// Only includes published blog/career-advice articles from the database.
// ───────────────────────────────────────────────────────────

export async function GET() {
  let articles = [];
  try {
    articles = await db.blogArticle.findMany({
      where: {
        isPublished: true,
        publishedAt: { not: null },
      },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 2000,
    });
  } catch (error) {
    console.warn("Sitemap [articles]: Could not fetch from DB:", error.message);
  }

  const seen = new Set();
  const unique = articles.filter((a) => {
    if (seen.has(a.slug)) return false;
    seen.add(a.slug);
    return true;
  });

  const urls = unique
    .map(
      (article) => `  <url>
    <loc>${SITE_URL}/career-advice/${article.slug}</loc>
    <lastmod>${new Date(article.updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
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
