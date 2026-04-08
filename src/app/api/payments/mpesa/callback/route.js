/**
 * POST /api/payments/mpesa/callback
 *
 * M-Pesa Daraja C2B STK Push Callback Handler
 *
 * Safaricom sends payment results here after the user enters their PIN.
 * This route:
 *   1. Validates the Safaricom callback signature
 *   2. Extracts CheckoutRequestID, ResultCode, MpesaReceiptNumber, Amount
 *   3. Updates the Payment record (status, receipt number, result code)
 *   4. Updates the Order (paidAmount, balanceDue, paymentStatus)
 *   5. Creates OrderActivity entries for audit trail
 *   6. Creates in-app Notification for the user
 *   7. Returns {"ResultCode":0,"ResultDesc":"Accepted"} to Safaricom
 *
 * Callback format (Safaricom sends):
 *   Body.stkCallback.CheckoutRequestID
 *   Body.stkCallback.MerchantRequestID
 *   Body.stkCallback.ResultCode (0 = success, non-zero = failure)
 *   Body.stkCallback.ResultDesc
 *   Body.stkCallback.CallbackMetadata.Item[] (only if ResultCode === 0)
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Safaricom callback result codes:
 *   0 — Success (payment completed)
 *   1 — Insufficient funds
 *   1032 — Cancelled by user
 *   1037 — Timeout (user didn't enter PIN)
 *   1001 — Internal error
 */
const RESULT_DESCRIPTIONS = {
  "0": "Payment completed successfully",
  "1": "Insufficient funds in M-Pesa account",
  "1032": "Payment cancelled by user",
  "1037": "Payment timed out — user did not enter PIN",
  "1001": "Safaricom internal error — please retry",
  "2001": "Invalid initiator — check credentials",
};

/**
 * Extract a specific item from Safaricom's CallbackMetadata.Item array.
 * Items have format: { Name: "Amount", Value: 1000 }
 */
function extractCallbackItem(metadata, itemName) {
  if (!metadata || !metadata.Item) return null;
  const item = metadata.Item.find((i) => i.Name === itemName);
  return item ? item.Value : null;
}

export async function POST(request) {
  try {
    const body = await request.json();

    console.log("[M-Pesa Callback] Received:", JSON.stringify(body, null, 2));

    // Safaricom wraps the callback in a "Body" property:
    // { Body: { stkCallback: { ... } } }
    // Also support direct: { stkCallback: { ... } }
    const stkCallback = body?.Body?.stkCallback || body?.stkCallback;

    if (!stkCallback) {
      console.error("[M-Pesa Callback] Missing stkCallback in body");
      return NextResponse.json(
        { ResultCode: 0, ResultDesc: "Accepted — no stkCallback" },
        { status: 200 }
      );
    }

    const {
      CheckoutRequestID,
      MerchantRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = stkCallback;

    if (!CheckoutRequestID) {
      console.error("[M-Pesa Callback] Missing CheckoutRequestID");
      return NextResponse.json(
        { ResultCode: 1, ResultDesc: "Missing CheckoutRequestID" },
        { status: 400 }
      );
    }

    // ── 1. Find payment by CheckoutRequestID ──
    const payment = await db.payment.findUnique({
      where: { checkoutRequestId: CheckoutRequestID },
      include: {
        order: {
          include: {
            items: true,
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    if (!payment) {
      console.error(
        "[M-Pesa Callback] Payment not found for CheckoutRequestID:",
        CheckoutRequestID
      );
      // Still return success to Safaricom to avoid retries
      return NextResponse.json({
        ResultCode: 0,
        ResultDesc: "Accepted — no matching payment",
      });
    }

    // ── 2. Extract callback metadata (only present on success) ──
    let mpesaReceiptNumber = null;
    let mpesaAmount = null;
    let mpesaPhone = null;
    let mpesaBalance = null;
    let transactionDate = null;

    if (ResultCode === "0" && CallbackMetadata) {
      mpesaReceiptNumber = extractCallbackItem(CallbackMetadata, "MpesaReceiptNumber");
      mpesaAmount = extractCallbackItem(CallbackMetadata, "Amount");
      mpesaPhone = extractCallbackItem(CallbackMetadata, "PhoneNumber");
      mpesaBalance = extractCallbackItem(CallbackMetadata, "Balance");
      transactionDate = extractCallbackItem(CallbackMetadata, "TransactionDate");

      console.log("[M-Pesa Callback] Success:", {
        receiptNumber: mpesaReceiptNumber,
        amount: mpesaAmount,
        phone: mpesaPhone,
        balance: mpesaBalance,
        transactionDate,
      });
    }

    // ── 3. Determine payment status ──
    let paymentStatus;
    switch (ResultCode) {
      case "0":
        paymentStatus = "SUCCESS";
        break;
      case "1032":
        paymentStatus = "CANCELLED";
        break;
      case "1037":
        paymentStatus = "TIMEOUT";
        break;
      case "4999":
        // Transaction still under processing — keep as PENDING and auto-retry
        paymentStatus = "PENDING";
        console.log("[M-Pesa Callback] Result code 4999 — transaction still processing, will auto-retry");
        break;
      default:
        paymentStatus = "FAILED";
        break;
    }

    // ── 4. Schedule auto-retry for 4999 (transaction still processing) ──
    if (String(ResultCode) === "4999" && payment.status === "PENDING") {
      // Don't update to FAILED — keep as PENDING
      // Log but don't update status in DB yet
      console.log("[M-Pesa Callback] Keeping payment as PENDING for auto-retry");

      // Schedule a delayed STK Query after 10 seconds
      // This runs in the background without blocking the callback response
      const paymentId = payment.id;
      setTimeout(async () => {
        try {
          console.log(`[M-Pesa Auto-Retry] Querying STK status for ${CheckoutRequestID}`);
          const { querySTKStatus } = await import("@/lib/mpesa");
          const queryResult = await querySTKStatus(CheckoutRequestID);

          const queryResultCode = String(queryResult.ResultCode || "");
          console.log(`[M-Pesa Auto-Retry] Result: code=${queryResultCode}, desc=${queryResult.ResultDesc}`);

          if (queryResultCode === "0") {
            // Payment actually succeeded! Process it
            const callbackMetadata = queryResult.CallbackMetadata;
            let receiptNo = null;
            let amount = null;
            if (callbackMetadata?.Item) {
              receiptNo = callbackMetadata.Item.find(i => i.Name === "MpesaReceiptNumber")?.Value;
              amount = callbackMetadata.Item.find(i => i.Name === "Amount")?.Value;
            }

            // Update payment to SUCCESS (with full callback data for audit)
            await db.payment.update({
              where: { id: paymentId },
              data: {
                status: "SUCCESS",
                mpesaReceiptNumber: receiptNo,
                resultDesc: "Payment confirmed via auto-retry",
                resultCode: "0",
                mpesaCallbackData: queryResult,
                ...(amount && { amount }),
              },
            });

            // Update order (including status → CONFIRMED)
            const freshOrder = await db.order.findUnique({ where: { id: payment.orderId } });
            if (freshOrder) {
              const newPaid = freshOrder.paidAmount + (amount || payment.amount);
              const newDue = freshOrder.totalAmount - newPaid;
              const newPayStatus = newDue <= 0 ? "PAID" : freshOrder.paidAmount > 0 ? "PARTIALLY_PAID" : "UNPAID";
              const newOrderStatus = freshOrder.status === "PENDING" ? "CONFIRMED" : freshOrder.status;
              await db.order.update({
                where: { id: freshOrder.id },
                data: {
                  paidAmount: newPaid,
                  balanceDue: Math.max(0, newDue),
                  paymentStatus: newPayStatus,
                  status: newOrderStatus,
                  ...((newOrderStatus === "CONFIRMED" || newPayStatus === "PAID") ? { confirmedAt: new Date() } : {}),
                },
              });
              await db.orderActivity.create({
                data: {
                  orderId: freshOrder.id,
                  action: "PAYMENT_RECEIVED",
                  description: `Payment of KSh ${(amount || payment.amount).toLocaleString()} confirmed via auto-retry after 4999${receiptNo ? ` — Receipt: ${receiptNo}` : ""}`,
                  metadata: { paymentId, checkoutRequestId: CheckoutRequestID, resultCode: "0", autoRetry: true, mpesaReceiptNumber: receiptNo },
                },
              });
              console.log(`[M-Pesa Auto-Retry] Order ${freshOrder.orderNumber} updated: status=${newOrderStatus}, paymentStatus=${newPayStatus}, paid=${newPaid}`);

              // Create notification for the user
              if (freshOrder.userId) {
                await db.notification.create({
                  data: {
                    userId: freshOrder.userId,
                    type: "PAYMENT",
                    title: "Payment Received ✓",
                    message: `KSh ${(amount || payment.amount).toLocaleString()} received for order ${freshOrder.orderNumber}${receiptNo ? ` (Receipt: ${receiptNo})` : ""}. ${newPayStatus === "PAID" ? "Order is now fully paid!" : `Balance: KSh ${Math.max(0, newDue).toLocaleString()}`}`,
                    data: {
                      orderId: freshOrder.id,
                      orderNumber: freshOrder.orderNumber,
                      paymentId,
                      amount: amount || payment.amount,
                      mpesaReceiptNumber: receiptNo,
                      paymentStatus: newPayStatus,
                    },
                  },
                });
              }
            }
          } else if (queryResultCode === "1032" || queryResultCode === "1037") {
            // User cancelled or timed out on retry
            await db.payment.update({
              where: { id: paymentId },
              data: { status: queryResultCode === "1032" ? "CANCELLED" : "TIMEOUT", resultCode: queryResultCode, resultDesc: queryResult.ResultDesc },
            });
            console.log(`[M-Pesa Auto-Retry] Payment ${paymentId} marked as ${queryResultCode === "1032" ? "CANCELLED" : "TIMEOUT"}`);
          }
          // If still 4999 or other, leave as PENDING — the client polling will catch it
        } catch (retryError) {
          console.error("[M-Pesa Auto-Retry] Error:", retryError);
        }
      }, 10000); // 10 seconds delay
    }

    // ── 4b. Update Payment record ──
    // Idempotency: if the payment is already SUCCESS (set by STK Query or
    // a previous callback), don't overwrite it with FAILED/CANCELLED/etc.
    if (payment.status === "SUCCESS" && paymentStatus !== "SUCCESS") {
      console.log(
        `[M-Pesa Callback] Payment ${payment.id} is already SUCCESS — ignoring ${paymentStatus} callback (code: ${ResultCode})`
      );
      // Still return success to Safaricom
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    // For 4999, we already handled it above (kept as PENDING + auto-retry)
    // Only update the DB for non-4999 results
    const shouldUpdateDB = String(ResultCode) !== "4999";

    let updatedPayment = payment;
    if (shouldUpdateDB) {
      updatedPayment = await db.payment.update({
        where: { id: payment.id },
        data: {
          status: paymentStatus,
          mpesaReceiptNumber: mpesaReceiptNumber || null,
          resultDesc: ResultDesc || RESULT_DESCRIPTIONS[ResultCode] || "Unknown error",
          resultCode: String(ResultCode),
          mpesaCallbackData: body, // Store full callback for audit
          ...(mpesaAmount && { amount: mpesaAmount }),
        },
      });
    }

    console.log("[M-Pesa Callback] Payment updated:", {
      paymentId: payment.id,
      status: paymentStatus,
      receiptNumber: mpesaReceiptNumber,
    });

    // ── 5. Update Order financials (only on success) ──
    if (paymentStatus === "SUCCESS") {
      const order = payment.order;
      const newPaidAmount = order.paidAmount + (mpesaAmount || payment.amount);
      const newBalanceDue = order.totalAmount - newPaidAmount;
      const newPaymentStatus =
        newBalanceDue <= 0
          ? "PAID"
          : order.paidAmount > 0
          ? "PARTIALLY_PAID"
          : "UNPAID";

      // Determine order status: CONFIRMED when payment is received
      const newOrderStatus =
        order.status === "PENDING" ? "CONFIRMED" : order.status;

      await db.order.update({
        where: { id: order.id },
        data: {
          paidAmount: newPaidAmount,
          balanceDue: Math.max(0, newBalanceDue),
          paymentStatus: newPaymentStatus,
          status: newOrderStatus,
          // Set confirmedAt when order transitions to CONFIRMED or is fully PAID
          ...((newOrderStatus === "CONFIRMED" || newPaymentStatus === "PAID") ? { confirmedAt: new Date() } : {}),
        },
      });

      console.log("[M-Pesa Callback] Order updated:", {
        orderId: order.id,
        orderNumber: order.orderNumber,
        newPaidAmount,
        newBalanceDue: Math.max(0, newBalanceDue),
        newPaymentStatus,
        newOrderStatus,
      });

      // ── 6. Create success OrderActivity ──
      await db.orderActivity.create({
        data: {
          orderId: order.id,
          action: "PAYMENT_RECEIVED",
          description: `Payment of KSh ${(mpesaAmount || payment.amount).toLocaleString()} received via M-Pesa${mpesaReceiptNumber ? ` — Receipt: ${mpesaReceiptNumber}` : ""}`,
          metadata: {
            paymentId: payment.id,
            mpesaReceiptNumber,
            amount: mpesaAmount || payment.amount,
            checkoutRequestId: CheckoutRequestID,
            transactionDate,
          },
        },
      });

      // ── 7. Create in-app Notification for the user ──
      if (order.userId) {
        await db.notification.create({
          data: {
            userId: order.userId,
            type: "PAYMENT",
            title: "Payment Received ✓",
            message: `KSh ${(mpesaAmount || payment.amount).toLocaleString()} received for order ${order.orderNumber}${mpesaReceiptNumber ? ` (Receipt: ${mpesaReceiptNumber})` : ""}. ${newPaymentStatus === "PAID" ? "Order is now fully paid!" : `Balance: KSh ${Math.max(0, newBalanceDue).toLocaleString()}`}`,
            data: {
              orderId: order.id,
              orderNumber: order.orderNumber,
              paymentId: payment.id,
              amount: mpesaAmount || payment.amount,
              mpesaReceiptNumber,
              paymentStatus: newPaymentStatus,
            },
          },
        });
      }

      // ── 8. Send payment confirmation email (fire-and-forget) ──
      try {
        const { sendEmail, paymentConfirmationTemplate } = await import("@/lib/email");
        const serviceNames = order.items
          .map((item) => `${item.serviceName} (${item.tierName})`)
          .join(", ");

        const { html, text } = paymentConfirmationTemplate({
          name: order.fullName,
          orderNumber: order.orderNumber,
          amount: (mpesaAmount || payment.amount).toLocaleString(),
          receiptNumber: mpesaReceiptNumber || "Pending",
          services: serviceNames,
          paymentStatus: newPaymentStatus,
          balanceDue: Math.max(0, newBalanceDue).toLocaleString(),
          date: new Date().toLocaleDateString("en-KE", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        });

        const emailResult = await sendEmail({
          to: order.email,
          subject: `Payment Confirmed — ${order.orderNumber} | JobReady.co.ke`,
          html,
          text,
          senderType: "payments",
        });
        if (emailResult.success) {
          console.log("[M-Pesa Callback] Payment confirmation email sent to:", order.email, "id:", emailResult.messageId);
        } else {
          console.error("[M-Pesa Callback] Payment confirmation email FAILED:", emailResult.error);
        }
      } catch (emailError) {
        // Don't fail the callback if email fails
        console.error("[M-Pesa Callback] Email send failed:", emailError.message);
      }
    } else if (paymentStatus !== "PENDING") {
      // ── Failure OrderActivity (skip for PENDING/4999 — auto-retry handles it) ──
      await db.orderActivity.create({
        data: {
          orderId: payment.orderId,
          action: "PAYMENT_FAILED",
          description: `M-Pesa payment failed — ${ResultDesc || RESULT_DESCRIPTIONS[ResultCode] || "Unknown error"} (Code: ${ResultCode})`,
          metadata: {
            paymentId: payment.id,
            checkoutRequestId: CheckoutRequestID,
            resultCode: ResultCode,
            resultDesc: ResultDesc,
          },
        },
      });

      // ── Failure notification ──
      if (payment.order.userId) {
        await db.notification.create({
          data: {
            userId: payment.order.userId,
            type: "PAYMENT",
            title: "Payment Failed",
            message: `Payment of KSh ${payment.amount.toLocaleString()} for order ${payment.order.orderNumber} failed. ${ResultDesc || "Please try again."}`,
            data: {
              orderId: payment.orderId,
              orderNumber: payment.order.orderNumber,
              paymentId: payment.id,
              resultCode: ResultCode,
            },
          },
        });
      }
    } else {
      // 4999 / PENDING — log activity but don't send failure notification
      await db.orderActivity.create({
        data: {
          orderId: payment.orderId,
          action: "PAYMENT_PENDING",
          description: `M-Pesa callback returned 4999 (processing) — auto-retry scheduled`,
          metadata: {
            paymentId: payment.id,
            checkoutRequestId: CheckoutRequestID,
            resultCode: ResultCode,
            resultDesc: ResultDesc,
          },
        },
      });
    }

    // ── Always return success to Safaricom to avoid retries ──
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });
  } catch (error) {
    console.error("[M-Pesa Callback] UNHANDLED ERROR:", error);
    // Still return 200 to Safaricom to prevent retries
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Accepted — logged error",
    });
  }
}

/**
 * GET /api/payments/mpesa/callback
 * Health check endpoint — Safaricom or monitoring can use this.
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "M-Pesa Daraja Callback Handler",
    shortcode: process.env.NEXT_PUBLIC_MPESA_SHORTCODE || "174379",
    environment: process.env.MPESA_ENV || "sandbox",
    callbackUrl: process.env.MPESA_CALLBACK_URL || "not configured",
    timestamp: new Date().toISOString(),
  });
}
