import { getJobHubs, getOpportunityHubs } from "@/config/hub-config";

const SITE_URL = "https://jobready.co.ke";

// ─── Static pages ───────────────────────────────────────────
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

// ─── Hub pages from config ───────────────────────────────────
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

// ─── Auth & dashboard pages (exclude from sitemap) ───────────
// /dashboard/*, /login, /register, /forgot-password, etc.

export default function sitemap() {
  const allPages = [
    ...staticPages,
    ...jobHubs,
    ...opportunityHubs,
  ];

  return allPages.map((page) => ({
    url: `${SITE_URL}${page.url}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
