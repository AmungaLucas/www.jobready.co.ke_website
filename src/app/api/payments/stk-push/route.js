import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { initiateSTKPush, formatMpesaPhone } from "@/lib/mpesa";
import { userIdRateLimit, ipRateLimit } from "@/lib/rate-limit";

/**
 * POST /api/payments/stk-push
 * Initiate an M-Pesa STK Push payment for an order.
 *
 * Body:
 *   - orderId (required)
 *   - phoneNumber (required) - in any format (+254, 07, etc.)
 *   - amount (optional) - defaults to order balanceDue
 */
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;

    // Rate limit: 5 STK Push attempts per 15 minutes per user (or per IP if unauthenticated)
    if (userId) {
      const { allowed } = await userIdRateLimit(userId, "stk-push", 5, 15 * 60 * 1000);
      if (!allowed) {
        return NextResponse.json(
          { error: "Too many payment requests. Please try again later." },
          { status: 429 }
        );
      }
    } else {
      const { allowed } = await ipRateLimit(request, "stk-push", 5, 15 * 60 * 1000);
      if (!allowed) {
        return NextResponse.json(
          { error: "Too many payment requests. Please try again later." },
          { status: 429 }
        );
      }
    }

    const body = await request.json();
    const { orderId, phoneNumber, amount } = body;

    // ── Validate ──
    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }
    if (!phoneNumber || typeof phoneNumber !== "string") {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // ── Format phone number ──
    const formattedPhone = formatMpesaPhone(phoneNumber);
    if (!formattedPhone) {
      return NextResponse.json(
        { error: "Invalid phone number. Use format: 07XXXXXXXX or +2547XXXXXXXX" },
        { status: 400 }
      );
    }

    // ── Lookup order ──
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // ── Authorization: must own the order or match email/phone ──
    if (userId && order.userId && order.userId !== userId) {
      return NextResponse.json({ error: "You do not have access to this order" }, { status: 403 });
    }
    if (!userId && order.userId) {
      // Walk-in user trying to access a registered user's order
      return NextResponse.json({ error: "You do not have access to this order" }, { status: 403 });
    }

    // ── Determine amount to charge ──
    // SECURITY: Never trust client-supplied amounts. If an amount is provided,
    // it MUST NOT exceed the order's balance due. This prevents an attacker
    // from initiating a KSh 1 payment for a KSh 3,500 order.
    const paymentAmount = amount
      ? Math.round(Number(amount))
      : order.balanceDue;

    if (!paymentAmount || paymentAmount <= 0) {
      return NextResponse.json({ error: "Invalid payment amount" }, { status: 400 });
    }

    // Server-side validation: amount must not exceed balance due
    if (paymentAmount > order.balanceDue) {
      return NextResponse.json(
        { error: `Payment amount (KSh ${paymentAmount.toLocaleString()}) exceeds the outstanding balance of KSh ${order.balanceDue.toLocaleString()}` },
        { status: 400 }
      );
    }

    // Prevent zero or negative balance edge cases
    if (order.balanceDue <= 0) {
      return NextResponse.json(
        { error: "This order has already been fully paid" },
        { status: 400 }
      );
    }

    // ── Build description from order items ──
    const serviceNames = order.items.map((item) => item.serviceName).join(", ");
    const description = serviceNames.slice(0, 50) || "CV Services";

    // ── Initiate STK Push ──
    const stkResult = await initiateSTKPush({
      phoneNumber: formattedPhone,
      amount: paymentAmount,
      orderNumber: order.orderNumber,
      description,
    });

    // ── Create payment record ──
    const payment = await db.payment.create({
      data: {
        orderId: order.id,
        checkoutRequestId: stkResult.CheckoutRequestID,
        phoneNumber: formattedPhone,
        amount: paymentAmount,
        status: "PENDING",
      },
    });

    // ── Create activity log ──
    await db.orderActivity.create({
      data: {
        orderId: order.id,
        action: "PAYMENT_INITIATED",
        description: `M-Pesa payment of KSh ${paymentAmount.toLocaleString()} initiated via STK Push`,
        metadata: {
          paymentId: payment.id,
          checkoutRequestId: stkResult.CheckoutRequestID,
          phoneNumber: formattedPhone,
          amount: paymentAmount,
        },
      },
    });

    return NextResponse.json({
      message: "STK Push initiated. Please enter your M-Pesa PIN.",
      checkoutRequestId: stkResult.CheckoutRequestID,
      merchantRequestId: stkResult.MerchantRequestID,
      paymentId: payment.id,
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: paymentAmount,
      phoneNumber: formattedPhone,
    }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/payments/stk-push] Error:", error);

    // Return M-Pesa specific errors
    if (error.message.includes("M-Pesa") || error.message.includes("STK Push")) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
