import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail, emailLinkVerificationTemplate } from "@/lib/email";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * POST /api/auth/send-email-verification
 *
 * Sends a 6-digit verification code to the given email address.
 * Used when a phone-only user tries to link an email that already
 * belongs to another account. The code is stored in the Otp table
 * with purpose "email_link" (reuses the phone field for the email).
 *
 * Rate limited: one code per email per 60 seconds.
 */
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Verify this email actually belongs to an existing user
    const emailOwner = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!emailOwner) {
      return NextResponse.json(
        { error: "No account found with this email address" },
        { status: 404 }
      );
    }

    // Don't allow linking to yourself
    if (emailOwner.id === session.user.id) {
      return NextResponse.json(
        { error: "This email is already linked to your account" },
        { status: 400 }
      );
    }

    // Rate limit: check if a code was sent to this email recently (within 60s)
    const recentOtp = await db.otp.findFirst({
      where: {
        phone: normalizedEmail,
        purpose: "email_link",
        createdAt: { gte: new Date(Date.now() - 60 * 1000) },
      },
      orderBy: { createdAt: "desc" },
    });

    if (recentOtp) {
      return NextResponse.json(
        { error: "Please wait before requesting another code" },
        { status: 429 }
      );
    }

    // Generate 6-digit code
    const code = String(Math.floor(100000 + Math.random() * 900000));

    // Store OTP — reuse the phone field for the email address
    await db.otp.create({
      data: {
        phone: normalizedEmail,
        code,
        purpose: "email_link",
        verified: false,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    });

    // Send the email
    const { html, text } = emailLinkVerificationTemplate(
      emailOwner.name,
      code
    );

    const result = await sendEmail({
      to: normalizedEmail,
      subject: "Verify your email to link accounts — JobReady",
      html,
      text,
    });

    if (!result.success) {
      console.error(
        `[Send Email Verification] Failed to send email to ${normalizedEmail}:`,
        result.error
      );
      return NextResponse.json(
        { error: "Failed to send verification email. Please try again." },
        { status: 500 }
      );
    }

    console.log(
      `[Send Email Verification] Code sent to ${normalizedEmail} for user ${session.user.id} → link to ${emailOwner.id}`
    );

    return NextResponse.json({
      message: "Verification code sent",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("[Send Email Verification API] Error:", error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
