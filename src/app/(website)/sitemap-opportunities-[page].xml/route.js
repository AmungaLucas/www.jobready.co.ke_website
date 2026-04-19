import { siteConfig } from "@/config/site-config";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export const revalidate = 600;

const SITE_URL = siteConfig.url;
const BATCH_SIZE = 5000;

// ─── PAGINATED OPPORTUNITIES SITEMAP ───────────────────────
// Serves a single page of opportunity URLs when total > 5000.
// URL pattern: /sitemap-opportunities-1.xml, /sitemap-opportunities-2.xml, etc.
// ───────────────────────────────────────────────────────────

export async function GET(request, { params }) {
  const { page } = await params;
  const pageNumber = parseInt(page, 10);

  if (!pageNumber || pageNumber < 1) notFound();

  try {
    const total = await db.opportunity.count({
      where: {
        status: "PUBLISHED",
        isActive: true,
        publishedAt: { not: null },
      },
    });

    const totalPages = Math.ceil(total / BATCH_SIZE);
    if (totalPages <= 1) notFound();
    if (pageNumber > totalPages) notFound();

    const skip = (pageNumber - 1) * BATCH_SIZE;
    const items = await db.opportunity.findMany({
      where: {
        status: "PUBLISHED",
        isActive: true,
        publishedAt: { not: null },
      },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      skip,
      take: BATCH_SIZE,
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
  } catch (error) {
    console.warn(`Sitemap [opportunities page ${pageNumber}]: DB error:`, error.message);
    return new Response("Error generating sitemap", { status: 500 });
  }
}
