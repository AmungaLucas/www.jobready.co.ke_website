import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { sendEmail, emailVerificationCodeTemplate } from "@/lib/email";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { findUserByEmail, isPlaceholderEmail } from "@/lib/auth-identity";

/**
 * POST /api/user/send-update-email
 *
 * For placeholder-email users: sends a 6-digit OTP to a NEW real email
 * address so they can replace their placeholder.
 *
 * Body: { newEmail: "user@example.com" }
 *
 * Rate limited: one code per newEmail per 60 seconds.
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
    const { newEmail } = body;

    if (!newEmail || typeof newEmail !== "string") {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      );
    }

    const normalized = newEmail.toLowerCase().trim();

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalized)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Don't allow another placeholder
    if (isPlaceholderEmail(normalized)) {
      return NextResponse.json(
        { error: "Please enter a real email address, not a placeholder" },
        { status: 400 }
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

    // User must have a placeholder email to use this endpoint
    if (!isPlaceholderEmail(user.email)) {
      return NextResponse.json(
        { error: "Your email is already a real address. Use the regular verification flow." },
        { status: 400 }
      );
    }

    // Check if the new email is already taken by another user
    const existingUser = await findUserByEmail(normalized);
    if (existingUser && existingUser.id !== session.user.id) {
      // Don't block — send OTP anyway. Ownership is proven by receiving the code.
      // The verify step will handle merging the other account into this one.
      console.log(
        `[Send Update Email] Email ${normalized} belongs to user ${existingUser.id} — sending OTP, will merge on verify`
      );
    }

    // Rate limit: check if a code was sent recently (within 60s) for this new email
    const recentOtp = await db.otp.findFirst({
      where: {
        phone: normalized,
        purpose: "email_update",
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
        phone: normalized,
        code,
        purpose: "email_update",
        verified: false,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    });

    // Send the email
    const { html, text } = emailVerificationCodeTemplate(user.name, code);

    const result = await sendEmail({
      to: normalized,
      subject: "Confirm your email address — JobReady",
      html,
      text,
    });

    if (!result.success) {
      console.error(
        `[Send Update Email] Failed to send email to ${normalized}:`,
        result.error
      );
      return NextResponse.json(
        { error: "Failed to send verification email. Please try again." },
        { status: 500 }
      );
    }

    console.log(
      `[Send Update Email] Code sent to ${normalized} for user ${session.user.id}, replacing placeholder ${user.email}`
    );

    return NextResponse.json({
      message: "Verification code sent to your new email",
      newEmail: normalized,
    });
  } catch (error) {
    console.error("[Send Update Email API] Error:", error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
