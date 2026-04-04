import { db } from "@/lib/db";

// ─── GET /feed.xml ────────────────────────────────────────
// RSS 2.0 feed of the latest 50 published jobs
export async function GET() {
  try {
    const jobs = await db.job.findMany({
      where: { isActive: true, publishedAt: { not: null } },
      include: { company: { select: { name: true } } },
      orderBy: { publishedAt: "desc" },
      take: 50,
    });

    const siteUrl = "https://jobready.co.ke";

    const items = jobs
      .map(
        (job) => `
    <item>
      <title><![CDATA[${job.title} at ${job.company?.name || "Confidential"}]]></title>
      <link>${siteUrl}/job/${job.slug}</link>
      <guid isPermaLink="true">${siteUrl}/job/${job.slug}</guid>
      <description><![CDATA[${job.description ? job.description.substring(0, 500) : ""}]]></description>
      <pubDate>${job.publishedAt?.toUTCString()}</pubDate>
    </item>`
      )
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>JobReady Kenya — Latest Jobs</title>
    <link>${siteUrl}</link>
    <description>Kenya's #1 job board. Latest jobs, internships, and career opportunities.</description>
    <language>en-ke</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Feed generation error:", error);
    return new Response("Error generating feed", { status: 500 });
  }
}
