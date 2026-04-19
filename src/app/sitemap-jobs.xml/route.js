import { siteConfig } from "@/config/site-config";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const SITE_URL = siteConfig.url;

// ─── JOBS SITEMAP ──────────────────────────────────────────
// Only includes published, active job detail pages from the database.
// No combo/filter URLs — those go in sitemap-filters.xml.
// ───────────────────────────────────────────────────────────

export async function GET() {
  let jobs = [];
  try {
    jobs = await db.job.findMany({
      where: {
        status: "PUBLISHED",
        isActive: true,
      },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 5000, // Increased limit to cover more jobs
    });
  } catch (error) {
    console.warn("Sitemap [jobs]: Could not fetch jobs from DB:", error.message);
  }

  // Deduplicate by slug (safety check)
  const seen = new Set();
  const uniqueJobs = jobs.filter((job) => {
    if (seen.has(job.slug)) return false;
    seen.add(job.slug);
    return true;
  });

  const urls = uniqueJobs
    .map(
      (job) => `  <url>
    <loc>${SITE_URL}/jobs/${job.slug}</loc>
    <lastmod>${new Date(job.updatedAt).toISOString()}</lastmod>
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
