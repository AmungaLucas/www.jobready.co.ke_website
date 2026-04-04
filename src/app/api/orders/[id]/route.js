import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/orders/[id]
 * Get full order detail with items, payments, and activity timeline.
 */
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;

    const orderId = params.id;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            serviceTier: {
              select: {
                id: true,
                serviceType: true,
                tier: true,
                name: true,
              },
            },
          },
        },
        payments: {
          orderBy: { createdAt: "desc" },
        },
        activities: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Authorization check
    if (order.userId && order.userId !== userId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("[GET /api/orders/:id] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
