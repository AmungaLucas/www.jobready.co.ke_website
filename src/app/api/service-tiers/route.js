import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/service-tiers
 * Returns all active service tiers for pricing display.
 * Public endpoint — no auth required.
 */
export async function GET() {
  try {
    const tiers = await db.serviceTier.findMany({
      where: { isActive: true },
      orderBy: [{ serviceType: "asc" }, { sortOrder: "asc" }],
    });

    // Group by service type for easier display
    const grouped = tiers.reduce((acc, tier) => {
      if (!acc[tier.serviceType]) {
        acc[tier.serviceType] = [];
      }
      acc[tier.serviceType].push({
        id: tier.id,
        name: tier.name,
        tier: tier.tier,
        description: tier.description,
        price: tier.price,
        currency: tier.currency,
        features: tier.features || [],
        deliveryDays: tier.deliveryDays,
        revisionCount: tier.revisionCount,
      });
      return acc;
    }, {});

    return NextResponse.json({
      tiers: grouped,
      all: tiers,
    });
  } catch (error) {
    console.error("[GET /api/service-tiers] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
