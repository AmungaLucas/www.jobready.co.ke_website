import { db } from "@/lib/db";
import { siteConfig } from "@/config/site-config";

export const dynamic = "force-dynamic";

const SITE_URL = siteConfig.url;

// ─── GET /feed.xml ────────────────────────────────────────
// RSS 2.0 feed of latest jobs, opportunities, AND blog articles
export async function GET() {
  try {
    const [jobs, opportunities, articles] = await Promise.allSettled([
      // Latest 30 published jobs
      db.job.findMany({
        where: { status: "PUBLISHED", isActive: true },
        select: {
          title: true,
          slug: true,
          employmentType: true,
          excerpt: true,
          createdAt: true,
          county: true,
          company: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
      // Latest 20 published opportunities
      db.opportunity.findMany({
        where: { status: "PUBLISHED", isActive: true, publishedAt: { not: null } },
        select: {
          title: true,
          slug: true,
          opportunityType: true,
          excerpt: true,
          publishedAt: true,
          company: { select: { name: true } },
        },
        orderBy: { publishedAt: "desc" },
        take: 20,
      }),
      // Latest 10 published blog articles
      db.blogArticle.findMany({
        where: { isPublished: true, publishedAt: { not: null } },
        select: {
          title: true,
          slug: true,
          excerpt: true,
          publishedAt: true,
          featuredImage: true,
          category: { select: { name: true } },
          author: { select: { name: true } },
        },
        orderBy: { publishedAt: "desc" },
        take: 10,
      }),
    ]);

    const jobsData = jobs.status === "fulfilled" ? jobs.value : [];
    const oppsData = opportunities.status === "fulfilled" ? opportunities.value : [];
    const articlesData = articles.status === "fulfilled" ? articles.value : [];

    const jobItems = jobsData
      .map(
        (job) => `
    <item>
      <title><![CDATA[${job.title} at ${job.company?.name || "Confidential"}]]></title>
      <link>${SITE_URL}/jobs/${job.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/jobs/${job.slug}</guid>
      <category>${job.employmentType || "Job"}${job.county ? `, ${job.county}` : ""}</category>
      <description><![CDATA[${job.excerpt || (job.description ? job.description.replace(/<[^>]*>/g, "").substring(0, 500) : "")}]]></description>
      <pubDate>${job.createdAt?.toUTCString()}</pubDate>
    </item>`
      )
      .join("");

    const oppItems = oppsData
      .map(
        (opp) => `
    <item>
      <title><![CDATA[${opp.title}${opp.company?.name ? ` — ${opp.company.name}` : ""}]]></title>
      <link>${SITE_URL}/opportunities/${opp.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/opportunities/${opp.slug}</guid>
      <category>${opp.opportunityType?.replace(/_/g, " ") || "Opportunity"}</category>
      <description><![CDATA[${opp.excerpt || ""}]]></description>
      <pubDate>${opp.publishedAt?.toUTCString()}</pubDate>
    </item>`
      )
      .join("");

    const articleItems = articlesData
      .map(
        (article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${SITE_URL}/career-advice/${article.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/career-advice/${article.slug}</guid>
      <category>${article.category?.name || "Career Advice"}</category>
      <author>${article.author?.name || "JobReady Kenya"}</author>
      <description><![CDATA[${article.excerpt || ""}]]></description>
      <pubDate>${article.publishedAt?.toUTCString()}</pubDate>
    </item>`
      )
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>JobReady Kenya — Latest Jobs, Opportunities &amp; Career Advice</title>
    <link>${SITE_URL}</link>
    <description>Kenya's #1 job board. Latest jobs, internships, scholarships, career advice, and opportunities updated daily.</description>
    <language>en-ke</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>JobReady.co.ke</generator>${jobItems}${oppItems}${articleItems}
  </channel>
</rss>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Feed generation error:", error);
    return new Response("Error generating feed", { status: 500 });
  }
}
