import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const SITE_URL = "https://jobready.co.ke";

// ─── Opportunity type → hub slug mapping ───────────────────
const typeToHubSlug = {
  SCHOLARSHIP: "scholarships",
  GRANT: "grants",
  FELLOWSHIP: "fellowships",
  BURSARY: "bursaries",
  COMPETITION: "competitions",
  CONFERENCE: "conferences",
  VOLUNTEER: "volunteer",
  APPRENTICESHIP: "apprenticeships",
};

// ─── GET /feed.xml ────────────────────────────────────────
// RSS 2.0 feed of latest jobs + opportunities
export async function GET() {
  try {
    const [jobs, opportunities] = await Promise.allSettled([
      // Latest 50 published jobs
      db.job.findMany({
        where: { isActive: true, publishedAt: { not: null } },
        include: {
          company: { select: { name: true } },
        },
        orderBy: { publishedAt: "desc" },
        take: 50,
      }),
      // Latest 20 published opportunities
      db.opportunity.findMany({
        where: { isPublished: true, publishedAt: { not: null } },
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
    ]);

    const jobsData = jobs.status === "fulfilled" ? jobs.value : [];
    const oppsData = opportunities.status === "fulfilled" ? opportunities.value : [];

    const jobItems = jobsData
      .map(
        (job) => `
    <item>
      <title><![CDATA[${job.title} at ${job.company?.name || "Confidential"}]]></title>
      <link>${SITE_URL}/job/${job.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/job/${job.slug}</guid>
      <category>${job.jobType || "Job"}</category>
      <description><![CDATA[${job.description ? job.description.substring(0, 500) : ""}]]></description>
      <pubDate>${job.publishedAt?.toUTCString()}</pubDate>
    </item>`
      )
      .join("");

    const oppItems = oppsData
      .map((opp) => {
        const hubSlug = typeToHubSlug[opp.opportunityType] || "scholarships";
        return `
    <item>
      <title><![CDATA[${opp.title}${opp.company?.name ? ` — ${opp.company.name}` : ""}]]></title>
      <link>${SITE_URL}/opportunities/${hubSlug}/${opp.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/opportunities/${hubSlug}/${opp.slug}</guid>
      <category>${opp.opportunityType || "Opportunity"}</category>
      <description><![CDATA[${opp.excerpt || ""}]]></description>
      <pubDate>${opp.publishedAt?.toUTCString()}</pubDate>
    </item>`;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>JobReady Kenya — Latest Jobs &amp; Opportunities</title>
    <link>${SITE_URL}</link>
    <description>Kenya's #1 job board. Latest jobs, internships, scholarships, and career opportunities updated daily.</description>
    <language>en-ke</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>JobReady.co.ke</generator>${jobItems}${oppItems}
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
