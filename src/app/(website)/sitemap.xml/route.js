import { getJobHubs, getOpportunityHubs } from "@/config/hub-config";
import { db } from "@/lib/db";
import {
  generateJobComboUrls,
  generateOppComboUrls,
  generateOrgComboUrls,
} from "@/lib/filter-parser";

export const dynamic = "force-dynamic";

const SITE_URL = "https://jobnet.co.ke";

// ─── Static pages ──────────────────────────────────────────
const staticPages = [
  { url: "/", priority: 1.0, changeFrequency: "daily" },
  { url: "/jobs", priority: 0.9, changeFrequency: "daily" },
  { url: "/opportunities", priority: 0.9, changeFrequency: "daily" },
  { url: "/organizations", priority: 0.8, changeFrequency: "weekly" },
  { url: "/career-advice", priority: 0.8, changeFrequency: "weekly" },
  { url: "/cv-services", priority: 0.9, changeFrequency: "monthly" },
  { url: "/search", priority: 0.7, changeFrequency: "daily" },
  { url: "/about", priority: 0.5, changeFrequency: "monthly" },
  { url: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { url: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { url: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { url: "/cookies", priority: 0.3, changeFrequency: "yearly" },
];

// ─── Hub pages ─────────────────────────────────────────────
const jobHubs = getJobHubs().map((hub) => ({
  url: `/jobs/${hub.slug}`,
  priority: 0.8,
  changeFrequency: "daily",
}));

const opportunityHubs = getOpportunityHubs().map((hub) => ({
  url: `/opportunities/${hub.slug}`,
  priority: 0.8,
  changeFrequency: "daily",
}));

// ─── Organization filter pages ──────────────────────────────
const orgFilterPages = [
  { slug: "ngos", label: "NGOs" },
  { slug: "private", label: "Private Sector" },
  { slug: "startups", label: "Startups" },
  { slug: "government", label: "Government" },
  { slug: "international", label: "International Orgs" },
  { slug: "county-government", label: "County Gov" },
  { slug: "state-corporations", label: "State Corps" },
  { slug: "universities", label: "Universities" },
  { slug: "smes", label: "SMEs" },
  { slug: "foundations", label: "Foundations" },
  { slug: "religious", label: "Religious Orgs" },
].map((p) => ({
  url: `/organizations/${p.slug}`,
  priority: 0.7,
  changeFrequency: "weekly",
}));

// ─── Combo filter URLs (auto-generated from data) ──────────
const jobComboUrls = generateJobComboUrls();
const oppComboUrls = generateOppComboUrls();
const orgComboUrls = generateOrgComboUrls();

// ─── GET /sitemap.xml ─────────────────────────────────────
export async function GET() {
  // Build static entries
  const staticEntries = [
    ...staticPages,
    ...jobHubs,
    ...opportunityHubs,
  ].map((page) => ({
    url: `${SITE_URL}${page.url}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  // Try to fetch dynamic entries from database
  let dynamicEntries = [];
  try {
    const [jobs, opportunities, articles, companies] = await Promise.allSettled([
      // Published jobs (most recent 500)
      db.job.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
        take: 500,
      }),
      // Published opportunities (most recent 500)
      db.opportunity.findMany({
        where: { status: "PUBLISHED", publishedAt: { not: null } },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
        take: 500,
      }),
      // Published articles (most recent 200)
      db.blogArticle.findMany({
        where: { isPublished: true, publishedAt: { not: null } },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
        take: 200,
      }),
      // Verified companies (most recent 200)
      db.company.findMany({
        where: { isVerified: true },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
        take: 200,
      }),
    ]);

    const jobsData = jobs.status === "fulfilled" ? jobs.value : [];
    const oppsData = opportunities.status === "fulfilled" ? opportunities.value : [];
    const articlesData = articles.status === "fulfilled" ? articles.value : [];
    const companiesData = companies.status === "fulfilled" ? companies.value : [];

    dynamicEntries = [
      ...jobsData.map((job) => ({
        url: `${SITE_URL}/jobs/${job.slug}`,
        lastModified: new Date(job.updatedAt),
        changeFrequency: "daily",
        priority: 0.7,
      })),
      ...oppsData.map((opp) => ({
        url: `${SITE_URL}/opportunities/${opp.slug}`,
        lastModified: new Date(opp.updatedAt),
        changeFrequency: "daily",
        priority: 0.7,
      })),
      ...articlesData.map((article) => ({
        url: `${SITE_URL}/career-advice/${article.slug}`,
        lastModified: new Date(article.updatedAt),
        changeFrequency: "weekly",
        priority: 0.7,
      })),
      ...companiesData.map((company) => ({
        url: `${SITE_URL}/organizations/${company.slug}`,
        lastModified: new Date(company.updatedAt),
        changeFrequency: "weekly",
        priority: 0.6,
      })),
    ];
  } catch (error) {
    console.warn("Sitemap: Could not fetch dynamic entries, using static-only sitemap.");
  }

  // ─── Combo filter entries (static, auto-generated) ─────────
  const comboEntries = [
    ...orgFilterPages,
    ...jobComboUrls,
    ...oppComboUrls,
    ...orgComboUrls,
  ].map((page) => ({
    url: `${SITE_URL}${page.url}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  // Build XML
  const allEntries = [...staticEntries, ...comboEntries, ...dynamicEntries];
  const urls = allEntries
    .map(
      (entry) => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified.toISOString()}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
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
