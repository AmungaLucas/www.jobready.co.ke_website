import { siteConfig } from "@/config/site-config";
import { db } from "@/lib/db";

export const revalidate = 600;

const SITE_URL = siteConfig.url;

// ─── JOBS SITEMAP INDEX ────────────────────────────────────
// Dynamically paginated — no hard cap on total jobs.
// If there are >5000 jobs, creates multiple sub-sitemaps:
//   sitemap-jobs-1.xml, sitemap-jobs-2.xml, etc.
// If <=5000, just one: sitemap-jobs.xml itself serves the URLs.
// ───────────────────────────────────────────────────────────

const BATCH_SIZE = 5000;

export async function GET() {
  try {
    const totalJobs = await db.job.count({
      where: { status: "PUBLISHED", isActive: true },
    });

    // If under the batch size, serve URLs directly (single sitemap)
    if (totalJobs <= BATCH_SIZE) {
      const jobs = await db.job.findMany({
        where: { status: "PUBLISHED", isActive: true },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      });

      const seen = new Set();
      const unique = jobs.filter((j) => {
        if (seen.has(j.slug)) return false;
        seen.add(j.slug);
        return true;
      });

      const urls = unique
        .map(
          (j) => `  <url>
    <loc>${SITE_URL}/jobs/${j.slug}</loc>
    <lastmod>${new Date(j.updatedAt).toISOString()}</lastmod>
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

    // Over batch size → serve as sitemap index with paginated sub-sitemaps
    const totalPages = Math.ceil(totalJobs / BATCH_SIZE);
    const sitemapEntries = Array.from({ length: totalPages }, (_, i) => ({
      loc: `${SITE_URL}/sitemap-jobs-${i + 1}.xml`,
    }));

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries
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
    console.warn("Sitemap [jobs]: Could not fetch jobs from DB:", error.message);
    return new Response("Error generating sitemap", { status: 500 });
  }
}
