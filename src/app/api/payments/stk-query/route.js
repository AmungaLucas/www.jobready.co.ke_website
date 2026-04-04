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
    // Safaricom STK Query result codes:
    //   0     — Payment completed successfully
    //   1     — Insufficient funds
    //   1032  — Cancelled by user
    //   1037  — Timeout (user didn't enter PIN)
    //   4999  — Transaction still under processing (user hasn't entered PIN yet)
    //   other — Treat as failure only when query itself succeeded
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
      case "4999":
        // Transaction still under processing — user may not have entered PIN yet
        status = "PENDING";
        break;
      default:
        // Only mark as FAILED if the query itself succeeded (ResponseCode "0")
        // and we got a definitive failure ResultCode.
        // If ResponseCode is not "0", the query failed — keep as PENDING.
        // If no ResultCode, transaction is still processing — keep as PENDING.
        if (!result.ResponseCode || result.ResponseCode !== "0") {
          status = "PENDING";
        } else if (resultCode) {
          // Query API succeeded but Safaricom returned a failure result code
          status = "FAILED";
        } else {
          status = "PENDING";
        }
        break;
    }

    console.log(`[STK Query] checkoutRequestId=${checkoutRequestId}, resultCode=${resultCode}, mappedStatus=${status}`);

    // If we have a paymentId and the result is final, update the DB
    // IMPORTANT: Only update if the payment is still PENDING.
    // Never overwrite SUCCESS (set by callback) with FAILED or other status.
    if (paymentId && status !== "PENDING") {
      try {
        const existingPayment = await db.payment.findUnique({
          where: { id: paymentId },
        });

        if (existingPayment && existingPayment.status === "PENDING") {
          // Payment is still PENDING — safe to update with the final status
          await db.payment.update({
            where: { id: paymentId },
            data: {
              status,
              resultDesc,
              resultCode,
            },
          });

          console.log(`[STK Query] Payment ${paymentId} updated to ${status} (code: ${resultCode})`);

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
        } else if (existingPayment) {
          // Payment already has a final status (e.g., SUCCESS from callback) — don't overwrite
          console.log(
            `[STK Query] Payment ${paymentId} is already ${existingPayment.status} — not overwriting with ${status}`
          );
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
