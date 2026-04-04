import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/services/tiers
 * Returns all active service tiers, grouped by service type.
 * Used by the CV services pricing page and other consumers.
 * No auth required — public endpoint.
 */
export async function GET() {
  try {
    const tiers = await db.serviceTier.findMany({
      where: { isActive: true },
      orderBy: [{ serviceType: "asc" }, { sortOrder: "asc" }],
    });

    // Group by service type
    const grouped = tiers.reduce((acc, tier) => {
      const serviceType = tier.serviceType;
      if (!acc[serviceType]) {
        acc[serviceType] = {
          serviceType,
          tiers: [],
        };
      }
      acc[serviceType].tiers.push({
        id: tier.id,
        tier: tier.tier,
        name: tier.name,
        description: tier.description,
        price: tier.price,
        currency: tier.currency,
        features: tier.features || [],
        deliveryDays: tier.deliveryDays,
        revisionCount: tier.revisionCount,
        sortOrder: tier.sortOrder,
      });
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      services: Object.values(grouped),
    });
  } catch (error) {
    console.error("[Service Tiers API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
