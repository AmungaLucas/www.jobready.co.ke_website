import { getJobHubs, getOpportunityHubs } from "@/config/hub-config";
import { db } from "@/lib/db";

const SITE_URL = "https://jobready.co.ke";

// Static pages
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

// Hub pages
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

export default async function sitemap() {
  // Build static sitemap always
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

  // Try to add dynamic entries from database
  let dynamicEntries = [];
  try {
    // Fetch published jobs (limit to most recent 500)
    const jobs = await db.job.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 500,
    });

    // Fetch published articles (limit to most recent 200)
    const articles = await db.blogArticle.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 200,
    });

    // Fetch companies with open jobs (limit to 200)
    const companies = await db.company.findMany({
      where: { isVerified: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 200,
    });

    dynamicEntries = [
      ...jobs.map((job) => ({
        url: `${SITE_URL}/job/${job.slug}`,
        lastModified: new Date(job.updatedAt),
        changeFrequency: "daily",
        priority: 0.7,
      })),
      ...articles.map((article) => ({
        url: `${SITE_URL}/career-advice/${article.slug}`,
        lastModified: new Date(article.updatedAt),
        changeFrequency: "weekly",
        priority: 0.7,
      })),
      ...companies.map((company) => ({
        url: `${SITE_URL}/organizations/${company.slug}`,
        lastModified: new Date(company.updatedAt),
        changeFrequency: "weekly",
        priority: 0.6,
      })),
    ];
  } catch (error) {
    // Database unavailable — return static-only sitemap
    console.warn("Sitemap: Could not fetch dynamic entries, using static-only sitemap.");
  }

  return [...staticEntries, ...dynamicEntries];
}
