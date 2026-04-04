import { NextResponse } from "next/server";
import { presets, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { sendEmail, contactFormTemplate } from "@/lib/email";
import { siteConfig } from "@/config/site-config";

/**
 * POST /api/contact
 * Handles contact form submissions.
 * Body: { name, email, subject, message }
 *
 * - Rate limited: 3 submissions per minute per IP
 * - Sends notification email to support@jobready.co.ke
 * - Validates all required fields
 */
export async function POST(request) {
  try {
    // --- Rate limiting ---
    const ip = getClientIp(request);
    const { success, resetAt } = presets.contact(ip);
    if (!success) {
      const resp = rateLimitResponse(3, resetAt);
      return NextResponse.json(resp.body, { status: resp.status, headers: resp.headers });
    }

    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name is required and must be at least 2 characters" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 }
      );
    }

    if (!subject || typeof subject !== "string" || subject.trim().length === 0) {
      return NextResponse.json(
        { error: "Subject is required" },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Trim message length
    if (message.length > 5000) {
      return NextResponse.json(
        { error: "Message is too long (max 5000 characters)" },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    // --- Send notification email to support (non-blocking) ---
    const emailResult = await sendEmail({
      to: siteConfig.email.support,
      subject: `[JobReady Contact] ${trimmedSubject}`,
      fromIdentity: "support",
      replyTo: trimmedEmail,
      ...contactFormTemplate({
        name: trimmedName,
        email: trimmedEmail,
        subject: trimmedSubject,
        message: trimmedMessage,
      }),
    });

    if (!emailResult.success) {
      console.error("[POST /api/contact] Email send failed:", emailResult.error);
      // Still return success to user — don't expose email issues
    }

    console.log("[POST /api/contact] New contact form submission:", {
      name: trimmedName,
      email: trimmedEmail,
      subject: trimmedSubject,
      messageLength: trimmedMessage.length,
      timestamp: new Date().toISOString(),
      emailSent: emailResult.success,
    });

    return NextResponse.json(
      {
        message: "Your message has been received. We'll get back to you within 24 hours.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/contact] Error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
