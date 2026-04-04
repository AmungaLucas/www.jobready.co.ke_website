import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { querySTKStatus } from "@/lib/mpesa";

/**
 * POST /api/payments/stk-query
 *
 * Query Safaricom directly for the status of an STK Push request.
 * This is used as a fallback when the callback hasn't arrived yet.
 *
 * Body:
 *   - checkoutRequestId (required)
 *   - paymentId (optional) - if provided, will also update the Payment record
 *
 * Returns:
 *   - resultCode: "0" (success), "1032" (cancelled), "1037" (timeout), etc.
 *   - resultDesc: Human-readable description
 *   - status: "SUCCESS", "FAILED", "CANCELLED", "TIMEOUT", or "PENDING"
 */
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;

    const body = await request.json();
    const { checkoutRequestId, paymentId } = body;

    if (!checkoutRequestId) {
      return NextResponse.json(
        { error: "CheckoutRequestID is required" },
        { status: 400 }
      );
    }

    // Query Safaricom directly
    const result = await querySTKStatus(checkoutRequestId);

    // Parse the response
    const resultCode = String(result.ResultCode || "");
    const resultDesc = result.ResultDesc || result.ResponseDescription || "Unknown";

    // Determine payment status from Safaricom's result
    let status;
    switch (resultCode) {
      case "0":
        status = "SUCCESS";
        break;
      case "1032":
        status = "CANCELLED";
        break;
      case "1037":
        status = "TIMEOUT";
        break;
      default:
        // If ResultCode is present but not 0, it's a failure
        // If ResponseCode is "0" but no ResultCode, the transaction is still being processed
        if (resultCode && result.ResponseCode === "0") {
          status = "FAILED";
        } else if (result.ResponseCode !== "0") {
          status = "PENDING";
        } else {
          status = "PENDING";
        }
        break;
    }

    // If we have a paymentId and the result is final, update the DB
    if (paymentId && status !== "PENDING") {
      try {
        const existingPayment = await db.payment.findUnique({
          where: { id: paymentId },
        });

        if (existingPayment && existingPayment.status === "PENDING") {
          await db.payment.update({
            where: { id: paymentId },
            data: {
              status,
              resultDesc,
              resultCode,
            },
          });

          // If success, also update the order
          if (status === "SUCCESS") {
            const order = await db.order.findUnique({
              where: { id: existingPayment.orderId },
            });
            if (order) {
              const newPaidAmount = order.paidAmount + existingPayment.amount;
              const newBalanceDue = order.totalAmount - newPaidAmount;
              const newPaymentStatus =
                newBalanceDue <= 0
                  ? "PAID"
                  : order.paidAmount > 0
                  ? "PARTIALLY_PAID"
                  : "UNPAID";

              await db.order.update({
                where: { id: order.id },
                data: {
                  paidAmount: newPaidAmount,
                  balanceDue: Math.max(0, newBalanceDue),
                  paymentStatus: newPaymentStatus,
                  ...(newPaymentStatus === "PAID" ? { confirmedAt: new Date() } : {}),
                },
              });

              await db.orderActivity.create({
                data: {
                  orderId: order.id,
                  action: "PAYMENT_RECEIVED",
                  description: `Payment of KSh ${existingPayment.amount.toLocaleString()} confirmed via STK Query`,
                  metadata: { paymentId, checkoutRequestId, resultCode },
                },
              });
            }
          }
        }
      } catch (dbError) {
        console.error("[STK Query] DB update error:", dbError);
        // Don't fail the request — still return the Safaricom result
      }
    }

    return NextResponse.json({
      resultCode,
      resultDesc,
      status,
      checkoutRequestId,
    });
  } catch (error) {
    console.error("[POST /api/payments/stk-query] Error:", error);
    return NextResponse.json(
      { error: "Failed to query payment status" },
      { status: 500 }
    );
  }
}
