import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { sendEmail, emailVerificationCodeTemplate } from "@/lib/email";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * POST /api/user/send-verify-email
 *
 * Sends a 6-digit verification code to the current user's email address.
 * Used when the user's email is registered but not yet verified.
 * The code is stored in the Otp table with purpose "email_verify".
 *
 * Rate limited: one code per 60 seconds.
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

    // Fetch current user
    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 }
      );
    }

    // Don't allow verification of placeholder emails
    if (user.email.startsWith("phone_")) {
      return NextResponse.json(
        { error: "This is a placeholder email. Please add a real email address first." },
        { status: 400 }
      );
    }

    const email = user.email;

    // Rate limit: check if a code was sent recently (within 60s)
    const recentOtp = await db.otp.findFirst({
      where: {
        phone: email,
        purpose: "email_verify",
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
    const code = crypto.randomInt(100000, 999999).toString();

    // Store OTP — reuse the phone field for the email address
    await db.otp.create({
      data: {
        phone: email,
        code,
        purpose: "email_verify",
        verified: false,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    });

    // Send the email
    const { html, text } = emailVerificationCodeTemplate(user.name, code);

    const result = await sendEmail({
      to: email,
      subject: "Verify your email address — JobReady",
      html,
      text,
    });

    if (!result.success) {
      console.error(
        `[Send Verify Email] Failed to send email to ${email}:`,
        result.error
      );
      return NextResponse.json(
        { error: "Failed to send verification email. Please try again.", debug: result.error },
        { status: 500 }
      );
    }

    console.log(
      `[Send Verify Email] Code sent to ${email} for user ${session.user.id}, messageId: ${result.messageId}`
    );

    return NextResponse.json({
      message: "Verification code sent to your email",
      email,
      debug: result.messageId,
    });
  } catch (error) {
    console.error("[Send Verify Email API] Error:", error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
