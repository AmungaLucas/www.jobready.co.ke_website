import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site-config";
import { getJobHubs, getOpportunityHubs } from "@/config/hub-config";

/**
 * Main sitemap using Next.js built-in Metadata API.
 * Serves /sitemap.xml — contains the most important static + hub pages.
 * The sitemap index at /sitemap-index.xml references the sub-sitemaps for
 * individual jobs, opportunities, organizations, etc.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // ─── Static pages ──────────────────────────────────────
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

  // ─── Hub pages (from hub-config) ───────────────────────
  const jobHubs = getJobHubs().map((hub) => ({
    url: `/jobs/${hub.slug}`,
    priority: 0.8,
    changeFrequency: "daily",
    lastModified: new Date(),
  }));

  const opportunityHubs = getOpportunityHubs().map((hub) => ({
    url: `/opportunities/${hub.slug}`,
    priority: 0.8,
    changeFrequency: "daily",
    lastModified: new Date(),
  }));

  const now = new Date();

  return [
    ...staticPages.map((page) => ({
      url: `${baseUrl}${page.url}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...jobHubs,
    ...opportunityHubs,
  ];
}
