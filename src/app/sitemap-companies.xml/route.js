import { siteConfig } from "@/config/site-config";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const SITE_URL = siteConfig.url;

// ─── COMPANIES SITEMAP ─────────────────────────────────────
// Only includes verified/active company profile pages from the database.
// ───────────────────────────────────────────────────────────

export async function GET() {
  let companies = [];
  try {
    companies = await db.company.findMany({
      where: {
        isActive: true,
        // Only include companies that have published jobs OR are verified
        OR: [
          { isVerified: true },
          { jobs: { some: { status: "PUBLISHED", isActive: true } } },
        ],
      },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 2000,
    });
  } catch (error) {
    console.warn("Sitemap [companies]: Could not fetch from DB:", error.message);
  }

  const seen = new Set();
  const unique = companies.filter((c) => {
    if (seen.has(c.slug)) return false;
    seen.add(c.slug);
    return true;
  });

  const urls = unique
    .map(
      (company) => `  <url>
    <loc>${SITE_URL}/organizations/${company.slug}</loc>
    <lastmod>${new Date(company.updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
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
