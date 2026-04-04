import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/orders/my
 * Get the current user's orders with pagination.
 * Requires authentication.
 */
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
    const skip = (page - 1) * limit;

    // Build WHERE clause: match by userId OR by email/phone (for linked walk-in orders)
    const userConditions = { userId: session.user.id };

    // Also include walk-in orders matching the user's email or phone
    const orConditions = [userConditions];
    if (session.user.email) {
      orConditions.push({ email: session.user.email.toLowerCase(), userId: null });
    }
    if (session.user.phone) {
      orConditions.push({ phone: session.user.phone, userId: null });
    }

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where: { OR: orConditions },
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
            take: 1, // Only latest payment for summary
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.order.count({
        where: { OR: orConditions },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("[GET /api/orders/my] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
