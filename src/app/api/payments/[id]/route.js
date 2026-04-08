import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/payments/[id]
 * Check the status of a specific payment.
 *
 * Returns: payment status, receipt number (if success), amount, createdAt
 */
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;

    const paymentId = params.id;

    if (!paymentId) {
      return NextResponse.json({ error: "Payment ID is required" }, { status: 400 });
    }

    const payment = await db.payment.findUnique({
      where: { id: paymentId },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            userId: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Authorization: must own the order or match email/phone
    if (payment.order.userId && payment.order.userId !== userId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({
      id: payment.id,
      status: payment.status,
      amount: payment.amount,
      phoneNumber: payment.phoneNumber,
      mpesaReceiptNumber: payment.mpesaReceiptNumber,
      checkoutRequestId: payment.checkoutRequestId,
      resultDesc: payment.resultDesc,
      createdAt: payment.createdAt,
      order: {
        id: payment.order.id,
        orderNumber: payment.order.orderNumber,
      },
    });
  } catch (error) {
    console.error("[GET /api/payments/:id] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
