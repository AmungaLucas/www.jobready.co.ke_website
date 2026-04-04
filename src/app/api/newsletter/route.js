import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * POST /api/newsletter
 * Subscribe to newsletter. Public route — no auth required.
 *
 * Body: { email: string, type?: string }
 *   type: "job_alerts" | "career_tips" | "opportunity_alerts" | "employer_updates"
 *         Defaults to "career_tips"
 *
 * Note: NewsletterSubscription has a unique email constraint, so only one
 * subscription per email exists. If the email already exists, the type is
 * updated and isActive is set to true (re-subscribes if previously unsubscribed).
 */
export async function POST(request) {
  try {
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
    const VALID_TYPES = [
      "job_alerts",
      "career_tips",
      "opportunity_alerts",
      "employer_updates",
    ];

    const subscriptionType =
      type && VALID_TYPES.includes(type) ? type : "career_tips";

    // Check if already subscribed
    const existing = await db.newsletterSubscription.findUnique({
      where: { email: trimmedEmail },
    });

    if (existing) {
      // Re-activate or update the subscription
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
        message: "Newsletter subscription updated successfully",
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
