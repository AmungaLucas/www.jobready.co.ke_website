import { siteConfig } from "@/config/site-config";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export const revalidate = 600;

const SITE_URL = siteConfig.url;
const BATCH_SIZE = 5000;

// ─── PAGINATED JOBS SITEMAP ────────────────────────────────
// Serves a single page of job URLs when total jobs > 5000.
// URL pattern: /sitemap-jobs-1.xml, /sitemap-jobs-2.xml, etc.
// Only reached when sitemap-jobs.xml serves as a sitemap index.
// ───────────────────────────────────────────────────────────

export async function GET(request, { params }) {
  const { page } = await params;
  const pageNumber = parseInt(page, 10);

  if (!pageNumber || pageNumber < 1) notFound();

  try {
    const totalJobs = await db.job.count({
      where: { status: "PUBLISHED", isActive: true },
    });

    const totalPages = Math.ceil(totalJobs / BATCH_SIZE);

    // If total fits in one sitemap, this route shouldn't be accessed
    if (totalPages <= 1) notFound();
    if (pageNumber > totalPages) notFound();

    const skip = (pageNumber - 1) * BATCH_SIZE;
    const jobs = await db.job.findMany({
      where: { status: "PUBLISHED", isActive: true },
      select: { slug: true, updatedAt: true, createdAt: true, isFeatured: true },
      orderBy: { updatedAt: "desc" },
      skip,
      take: BATCH_SIZE,
    });

    const seen = new Set();
    const unique = jobs.filter((j) => {
      if (seen.has(j.slug)) return false;
      seen.add(j.slug);
      return true;
    });

    const now = new Date();
    const sevenDaysAgo = new Date(now - 7 * 86400000);
    const ninetyDaysAgo = new Date(now - 90 * 86400000);
    const urls = unique
      .map((j) => {
        const isRecent = new Date(j.createdAt) >= sevenDaysAgo;
        const isOld = new Date(j.createdAt) < ninetyDaysAgo;
        const priority = j.isFeatured || isRecent ? 0.8 : isOld ? 0.5 : 0.7;
        return `  <url>
    <loc>${SITE_URL}/jobs/${j.slug}</loc>
    <lastmod>${new Date(j.updatedAt).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>`;
      })
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
    console.warn(`Sitemap [jobs page ${pageNumber}]: DB error:`, error.message);
    return new Response("Error generating sitemap", { status: 500 });
  }
}
