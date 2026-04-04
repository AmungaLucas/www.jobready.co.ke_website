import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ─── GET /api/opportunities/[slug] ──────────────────────────────
// Get single opportunity by slug + similar opportunities
export async function GET(request, { params }) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: "Opportunity slug is required" },
        { status: 400 }
      );
    }

    // Find opportunity
    const opportunity = await db.opportunity.findUnique({
      where: { slug },
    });

    if (!opportunity) {
      return NextResponse.json(
        { error: "Opportunity not found" },
        { status: 404 }
      );
    }

    // Increment view count (fire and forget — no await for performance)
    db.opportunity.update({
      where: { id: opportunity.id },
      data: { viewsCount: { increment: 1 } },
    }).catch(() => {});

    // Fetch similar opportunities (same opportunityType, different id, active, published)
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const similarOpportunities = await db.opportunity.findMany({
      where: {
        id: { not: opportunity.id },
        opportunityType: opportunity.opportunityType,
        isActive: true,
        publishedAt: { not: null, lte: now },
        OR: [
          { deadline: null },
          { deadline: { gte: today } },
        ],
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

    return NextResponse.json({
      opportunity,
      similarOpportunities,
    });
  } catch (error) {
    console.error("[GET /api/opportunities/[slug]] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
