import { generateMeta } from "@/lib/seo";
import { db } from "@/lib/db";
import OpportunityDetailClient from "./_components/OpportunityDetailClient";

// ─── SSG: Pre-render all published opportunity pages at build time ───
export async function generateStaticParams() {
  try {
    const opportunities = await db.opportunity.findMany({
      where: {
        isActive: true,
        status: "PUBLISHED",
        publishedAt: { not: null },
      },
      select: { slug: true, opportunityType: true },
    });

    // Map opportunity types to hub slugs
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

    return opportunities.map((opp) => ({
      hubSlug: typeToHubSlug[opp.opportunityType] || "scholarships",
      slug: opp.slug,
    }));
  } catch (error) {
    console.error("[generateStaticParams] Error:", error);
    return [];
  }
}

// ─── ISR: Revalidate pages every hour ───
export const revalidate = 3600;

// ─── Metadata (SSG-friendly — fetches from DB at build time) ───
export async function generateMetadata({ params }) {
  try {
    const { hubSlug, slug } = await params;

    const opportunity = await db.opportunity.findUnique({
      where: { slug },
      select: {
        title: true,
        description: true,
        slug: true,
        company: { select: { name: true } },
      },
    });

    if (opportunity) {
      return generateMeta({
        title: `${opportunity.title} — ${opportunity.company?.name || "Opportunity"}`,
        description: opportunity.description
          ? opportunity.description.replace(/<[^>]+>/g, "").substring(0, 160)
          : `Apply for ${opportunity.title} on JobReady Kenya.`,
        path: `/opportunities/${hubSlug}/${opportunity.slug}`,
      });
    }
    return {};
  } catch {
    return {};
  }
}

// ─── Page Component (thin shell — data fetched client-side) ───
export default async function OpportunityDetailPage({ params }) {
  const { hubSlug, slug } = await params;

  return <OpportunityDetailClient hubSlug={hubSlug} slug={slug} />;
}
