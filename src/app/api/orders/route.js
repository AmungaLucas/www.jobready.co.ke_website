import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateOrderNumber } from "@/lib/slug";
import { normalizePhone } from "@/lib/account-merge";

/**
 * POST /api/orders
 * Place a new CV service order.
 *
 * Body:
 *   - email (required)
 *   - phone (required)
 *   - fullName (required)
 *   - items (required): array of { serviceType, tier }
 *   - notes (optional)
 *
 * Auth: optional — session user linked to order; walk-in orders allowed
 */
export async function POST(request) {
  try {
    // Get optional session
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;

    const body = await request.json();
    const { email, phone, fullName, items, notes } = body;

    // ── Validate required fields ──
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (!phone || typeof phone !== "string") {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }
    if (!fullName || typeof fullName !== "string") {
      return NextResponse.json({ error: "Full name is required" }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "At least one item is required" }, { status: 400 });
    }

    // ── Look up service tiers and calculate total ──
    const tierLookups = [];
    let totalAmount = 0;

    for (const item of items) {
      const { serviceType, tier } = item;

      if (!serviceType || !tier) {
        return NextResponse.json(
          { error: "Each item must have serviceType and tier" },
          { status: 400 }
        );
      }

      const serviceTier = await db.serviceTier.findFirst({
        where: {
          serviceType: serviceType.toUpperCase(),
          tier: tier.toUpperCase(),
          isActive: true,
        },
      });

      if (!serviceTier) {
        return NextResponse.json(
          { error: `Service tier not found: ${serviceType} - ${tier}` },
          { status: 404 }
        );
      }

      tierLookups.push({
        serviceTier,
        quantity: item.quantity || 1,
      });

      totalAmount += serviceTier.price * (item.quantity || 1);
    }

    if (totalAmount <= 0) {
      return NextResponse.json({ error: "Order total must be greater than zero" }, { status: 400 });
    }

    // ── Generate order number ──
    const orderNumber = generateOrderNumber();

    // ── Create order with items and activity in a transaction ──
    const order = await db.order.create({
      data: {
        orderNumber,
        userId,
        email: email.toLowerCase().trim(),
        phone: normalizePhone(phone) || phone.trim(),
        fullName: fullName.trim(),
        totalAmount,
        balanceDue: totalAmount,
        status: "PENDING",
        paymentStatus: "UNPAID",
        notes: notes?.trim() || null,
        items: {
          create: tierLookups.map(({ serviceTier, quantity }) => ({
            serviceTierId: serviceTier.id,
            serviceName: serviceTier.name,
            tierName: serviceTier.tier,
            price: serviceTier.price,
            quantity,
            subtotal: serviceTier.price * quantity,
          })),
        },
        activities: {
          create: {
            action: "ORDER_PLACED",
            description: `Order placed for KSh ${totalAmount.toLocaleString()}`,
            metadata: {
              itemCount: items.length,
              userId: userId || "walk-in",
            },
          },
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(
      {
        message: "Order placed successfully",
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          status: order.status,
          paymentStatus: order.paymentStatus,
          items: order.items,
          createdAt: order.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/orders] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
