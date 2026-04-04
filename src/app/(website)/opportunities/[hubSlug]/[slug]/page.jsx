import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { generateMeta } from "@/lib/seo";
import OpportunityDetailContent from "../_components/OpportunityDetailContent";

// Force dynamic rendering
export const dynamic = "force-dynamic";

// ─── Data Fetching (direct Prisma) ───────────────────────
async function fetchOpportunity(slug) {
  try {
    const opportunity = await db.opportunity.findUnique({
      where: { slug },
    });

    if (!opportunity) return null;

    // Increment view count (fire and forget)
    db.opportunity
      .update({
        where: { id: opportunity.id },
        data: { viewsCount: { increment: 1 } },
      })
      .catch(() => {});

    // Fetch similar opportunities
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const similarOpportunities = await db.opportunity.findMany({
      where: {
        id: { not: opportunity.id },
        opportunityType: opportunity.opportunityType,
        isActive: true,
        publishedAt: { not: null, lte: now },
        OR: [{ deadline: null }, { deadline: { gte: today } }],
      },
      orderBy: { publishedAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        opportunityType: true,
        category: true,
        location: true,
        isRemote: true,
        deadline: true,
        organizationName: true,
        organizationLogo: true,
        organizationType: true,
        isFeatured: true,
        viewsCount: true,
        publishedAt: true,
      },
    });

    return { opportunity, similarOpportunities };
  } catch (error) {
    console.error("[fetchOpportunity] Error:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { hubSlug, slug } = await params;

  const data = await fetchOpportunity(slug);
  if (data?.opportunity) {
    const opp = data.opportunity;
    return generateMeta({
      title: `${opp.title} — ${opp.organizationName || opp.organization || "Opportunity"}`,
      description: opp.description
        ? opp.description.replace(/<[^>]+>/g, "").substring(0, 160)
        : `Apply for ${opp.title} on JobReady Kenya.`,
      path: `/opportunities/${hubSlug}/${opp.slug}`,
    });
  }

  return {};
}

export default async function OpportunityDetailPage({ params }) {
  const { slug } = await params;

  const data = await fetchOpportunity(slug);

  if (data?.opportunity) {
    return <OpportunityDetailContent data={data} />;
  }

  notFound();
}
