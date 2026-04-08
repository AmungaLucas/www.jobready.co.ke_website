import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/services/tiers
 *
 * Returns all active service tiers, both flat and grouped by serviceType.
 * Used by the CV Services page and any component that needs pricing data.
 *
 * Response:
 * {
 *   tiers: [...],
 *   grouped: { CV_WRITING: [...], COVER_LETTER: [...], LINKEDIN_PROFILE: [...] }
 * }
 */
export async function GET() {
  try {
    const tiers = await db.serviceTier.findMany({
      where: { isActive: true },
      orderBy: [{ serviceType: "asc" }, { sortOrder: "asc" }],
    });

    // Group by serviceType
    const grouped = tiers.reduce((acc, tier) => {
      const key = tier.serviceType;
      if (!acc[key]) acc[key] = [];
      acc[key].push({
        id: tier.id,
        serviceType: tier.serviceType,
        tier: tier.tier,
        name: tier.name,
        description: tier.description,
        price: tier.price,
        currency: tier.currency,
        features: tier.features,
        deliveryDays: tier.deliveryDays,
        revisionCount: tier.revisionCount,
        sortOrder: tier.sortOrder,
      });
      return acc;
    }, {});

    return NextResponse.json(
      { tiers: grouped, grouped },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    console.error("[API /api/services/tiers] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch service tiers" },
      { status: 500 }
    );
  }
}
