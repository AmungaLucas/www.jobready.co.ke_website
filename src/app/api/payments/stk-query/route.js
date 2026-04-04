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
    const resultDescRaw = result.ResultDesc || result.ResponseDescription || "";
    const resultDescLower = resultDescRaw.toLowerCase();

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
        // CRITICAL FIX: If the result description indicates the transaction is still
        // being processed by Safaricom, treat as PENDING — NOT FAILED.
        // Safaricom often returns a non-zero ResultCode while the transaction is
        // still settling. Examples: "The transaction is still under processing",
        // "Request cancelled by user" (1032 is handled above), timeout (1037 above).
        if (
          resultDescLower.includes("processing") ||
          resultDescLower.includes("pending") ||
          resultDescLower.includes("still") ||
          resultDescLower.includes("timeout")
        ) {
          status = "PENDING";
        } else if (resultCode && result.ResponseCode === "0" && resultDescRaw.length > 0) {
          // ResultCode present, ResponseCode OK, but no "processing" keyword
          // — this is a definitive failure (e.g. insufficient funds, internal error)
          status = "FAILED";
        } else if (result.ResponseCode !== "0") {
          // Safaricom API-level error — retry later
          status = "PENDING";
        } else {
          status = "PENDING";
        }
        break;
    }

    // If we have a paymentId and the result is FINAL (not still processing),
    // update the DB. Only update for definitive outcomes to avoid race conditions
    // with the Safaricom callback.
    // NOTE: We only update if the payment is still PENDING in the DB —
    // this prevents overwriting a SUCCESS that the callback already set.
    const isFinalResult = status === "SUCCESS" || status === "CANCELLED" || status === "TIMEOUT" || status === "FAILED";

    if (paymentId && isFinalResult) {
      try {
        const existingPayment = await db.payment.findUnique({
          where: { id: paymentId },
        });

        if (existingPayment && existingPayment.status === "PENDING") {
          await db.payment.update({
            where: { id: paymentId },
            data: {
              status,
              resultDesc: resultDescRaw || "Unknown",
              resultCode,
            },
          });

          console.log("[STK Query] Payment updated via STK Query:", {
            paymentId,
            status,
            resultCode,
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

              console.log("[STK Query] Order updated:", {
                orderId: order.id,
                newPaymentStatus,
                newPaidAmount,
              });
            }
          }
        } else if (existingPayment && existingPayment.status !== "PENDING") {
          // Payment already finalized by callback — don't overwrite
          console.log("[STK Query] Payment already finalized (status: %s), skipping DB update", existingPayment.status);
        }
      } catch (dbError) {
        console.error("[STK Query] DB update error:", dbError);
        // Don't fail the request — still return the Safaricom result
      }
    }

    return NextResponse.json({
      resultCode,
      resultDesc: resultDescRaw || "Unknown",
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
