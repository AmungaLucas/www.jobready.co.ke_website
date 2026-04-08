import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/payments/order/[orderId]
 * Get all payments for a specific order.
 *
 * Used for checking payment history and the latest payment status.
 */
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;

    const orderId = params.orderId;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    // Verify order access
    const order = await db.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        orderNumber: true,
        userId: true,
        email: true,
        phone: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.userId && order.userId !== userId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Get all payments for this order
    const payments = await db.payment.findMany({
      where: { orderId },
      orderBy: { createdAt: "desc" },
    });

    // Get latest successful payment
    const latestSuccess = payments.find((p) => p.status === "SUCCESS");
    const hasPending = payments.some((p) => p.status === "PENDING");

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      payments,
      latestSuccessfulPayment: latestSuccess
        ? {
            id: latestSuccess.id,
            amount: latestSuccess.amount,
            mpesaReceiptNumber: latestSuccess.mpesaReceiptNumber,
            createdAt: latestSuccess.createdAt,
          }
        : null,
      hasPendingPayment: hasPending,
    });
  } catch (error) {
    console.error("[GET /api/payments/order/:orderId] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
