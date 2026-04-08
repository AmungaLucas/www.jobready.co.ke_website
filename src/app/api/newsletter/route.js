import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { presets, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { sendEmail, newsletterConfirmationTemplate } from "@/lib/email";

const VALID_TYPES = [
  "job_alerts",
  "career_tips",
  "opportunity_alerts",
  "employer_updates",
];

/**
 * GET /api/newsletter?email=xxx
 * Check if an email is already subscribed. No auth required.
 * Rate limited: 30 checks per minute per IP
 *
 * Returns: { subscribed: boolean, active: boolean, type: string | null }
 */
export async function GET(request) {
  try {
    const ip = getClientIp(request);
    const { success, resetAt } = presets.newsletter(ip);
    if (!success) {
      const resp = rateLimitResponse(30, resetAt);
      return NextResponse.json(resp.body, { status: resp.status, headers: resp.headers });
    }

    const { searchParams } = new URL(request.url);
    const rawEmail = searchParams.get("email");

    if (!rawEmail || typeof rawEmail !== "string") {
      return NextResponse.json(
        { error: "Email query parameter is required" },
        { status: 400 }
      );
    }

    const trimmedEmail = rawEmail.toLowerCase().trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 }
      );
    }

    const existing = await db.newsletterSubscription.findUnique({
      where: { email: trimmedEmail },
      select: {
        email: true,
        type: true,
        isActive: true,
        subscribedAt: true,
        unsubscribedAt: true,
      },
    });

    if (!existing) {
      return NextResponse.json({
        subscribed: false,
        active: false,
        type: null,
      });
    }

    return NextResponse.json({
      subscribed: true,
      active: existing.isActive,
      type: existing.type,
      subscribedAt: existing.subscribedAt,
      unsubscribedAt: existing.unsubscribedAt,
    });
  } catch (error) {
    console.error("[GET /api/newsletter] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/newsletter
 * Subscribe to newsletter. Public route — no auth required.
 *
 * Body: { email: string, type?: string }
 *   type: "job_alerts" | "career_tips" | "opportunity_alerts" | "employer_updates"
 *         Defaults to "career_tips"
 *
 * Rate limited: 5 subscriptions per minute per IP
 *
 * Returns:
 *   201 — New subscription created
 *   200 — Already subscribed & active (with alreadySubscribed: true)
 *   200 — Previously unsubscribed, now re-activated (with reactivated: true)
 */
export async function POST(request) {
  try {
    // --- Rate limiting ---
    const ip = getClientIp(request);
    const { success, resetAt } = presets.newsletter(ip);
    if (!success) {
      const resp = rateLimitResponse(5, resetAt);
      return NextResponse.json(resp.body, { status: resp.status, headers: resp.headers });
    }

    const body = await request.json();
    const { email, type } = body;

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const trimmedEmail = email.toLowerCase().trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 }
      );
    }

    // Validate type if provided
    const subscriptionType =
      type && VALID_TYPES.includes(type) ? type : "career_tips";

    // Check if already subscribed
    const existing = await db.newsletterSubscription.findUnique({
      where: { email: trimmedEmail },
    });

    if (existing) {
      if (existing.isActive) {
        // Already actively subscribed — no change needed
        return NextResponse.json({
          message: "This email is already subscribed to our newsletter.",
          alreadySubscribed: true,
          subscription: {
            email: existing.email,
            type: existing.type,
            isActive: existing.isActive,
            subscribedAt: existing.subscribedAt,
          },
        });
      }

      // Previously unsubscribed — re-activate
      const updated = await db.newsletterSubscription.update({
        where: { email: trimmedEmail },
        data: {
          type: subscriptionType,
          isActive: true,
          subscribedAt: new Date(),
          unsubscribedAt: null,
        },
      });

      return NextResponse.json({
        message: "Welcome back! Your subscription has been reactivated.",
        reactivated: true,
        subscription: updated,
      });
    }

    // Create new subscription
    const subscription = await db.newsletterSubscription.create({
      data: {
        email: trimmedEmail,
        type: subscriptionType,
        isActive: true,
      },
    });

    // --- Send confirmation email (non-blocking) ---
    sendEmail({
      to: trimmedEmail,
      subject: "You're subscribed! — JobReady Kenya",
      ...newsletterConfirmationTemplate(trimmedEmail, subscriptionType),
    }).catch((err) =>
      console.error("[Newsletter] Confirmation email failed:", err.message)
    );

    return NextResponse.json(
      {
        message: "Successfully subscribed to newsletter",
        subscription,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/newsletter] Error:", error);

    if (error.code === "P2002") {
      // Unique constraint violation — race condition
      return NextResponse.json(
        { error: "This email is already subscribed" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
