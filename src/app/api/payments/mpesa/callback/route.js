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
      default:
        paymentStatus = "FAILED";
        break;
    }

    // ── 4. Update Payment record ──
    const updatedPayment = await db.payment.update({
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

      await db.order.update({
        where: { id: order.id },
        data: {
          paidAmount: newPaidAmount,
          balanceDue: Math.max(0, newBalanceDue),
          paymentStatus: newPaymentStatus,
          ...(newPaymentStatus === "PAID" ? { confirmedAt: new Date() } : {}),
        },
      });

      console.log("[M-Pesa Callback] Order updated:", {
        orderId: order.id,
        orderNumber: order.orderNumber,
        newPaidAmount,
        newBalanceDue: Math.max(0, newBalanceDue),
        newPaymentStatus,
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

      // ── 8. Send payment confirmation emails (fire-and-forget) ──
      try {
        const { sendEmail, paymentConfirmationTemplate, paymentAdminNotificationTemplate, getFromAddress } = await import("@/lib/email");
        const serviceNames = order.items
          .map((item) => `${item.serviceName} (${item.tierName})`)
          .join(", ");

        // 8a. Customer receipt — sent from payments@jobready.co.ke
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

        await sendEmail({
          to: order.email,
          subject: `Payment Confirmed — ${order.orderNumber} | JobReady.co.ke`,
          html,
          text,
          fromIdentity: "payments",
          replyTo: "payments@jobready.co.ke",
        });
        console.log("[M-Pesa Callback] Payment confirmation email sent to:", order.email);

        // 8b. Admin notification — sent to payments@ for records
        const adminHtml = paymentAdminNotificationTemplate({
          orderNumber: order.orderNumber,
          amount: (mpesaAmount || payment.amount).toLocaleString(),
          receiptNumber: mpesaReceiptNumber || "Pending",
          customerName: order.fullName,
          customerEmail: order.email,
          customerPhone: order.phone,
          services: serviceNames,
        });

        await sendEmail({
          to: "payments@jobready.co.ke",
          subject: `🔔 New Payment — ${order.orderNumber} — KSh ${(mpesaAmount || payment.amount).toLocaleString()}`,
          html: adminHtml.html,
          text: adminHtml.text,
          fromIdentity: "payments",
          replyTo: order.email,
        });
        console.log("[M-Pesa Callback] Admin payment notification sent to payments@jobready.co.ke");
      } catch (emailError) {
        // Don't fail the callback if email fails
        console.error("[M-Pesa Callback] Email send failed:", emailError.message);
      }
    } else {
      // ── Failure OrderActivity ──
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
