import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    // --- Validation ---
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 }
      );
    }

    const trimmedEmail = email.toLowerCase().trim();

    // --- Find user by email ---
    const user = await db.user.findUnique({
      where: { email: trimmedEmail },
    });

    // Always return success even if user doesn't exist (security: prevent email enumeration)
    if (!user) {
      return NextResponse.json(
        {
          message: "If an account exists with this email, a password reset link has been sent.",
        },
        { status: 200 }
      );
    }

    // Check user has a password (OAuth-only users can't reset password)
    if (!user.passwordHash) {
      return NextResponse.json(
        {
          message: "If an account exists with this email, a password reset link has been sent.",
        },
        { status: 200 }
      );
    }

    // --- Generate reset token ---
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Create a unique providerAccountId for the reset token
    const resetAccountId = `reset:${trimmedEmail}:${resetToken.substring(0, 8)}`;

    // --- Store reset token in AuthAccount ---
    // Delete any existing reset tokens for this user
    await db.authAccount.deleteMany({
      where: {
        userId: user.id,
        provider: "reset",
      },
    });

    // Create new reset token record
    await db.authAccount.create({
      data: {
        userId: user.id,
        provider: "reset",
        providerAccountId: resetAccountId,
        accessToken: resetToken,
        expiresAt: tokenExpiry,
      },
    });

    // --- Send password reset email ---
    // TODO: Connect actual email service (Resend, SendGrid, etc.)
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
    console.log(`[Forgot Password] Email: ${trimmedEmail}, Reset URL: ${resetUrl}`);

    // In production, send via email:
    // await sendEmail(trimmedEmail, "Reset Your JobReady Password", resetTemplate(resetUrl));

    return NextResponse.json(
      {
        message: "If an account exists with this email, a password reset link has been sent.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Forgot Password API] Error:", error);

    // Still return success message to prevent email enumeration
    return NextResponse.json(
      {
        message: "If an account exists with this email, a password reset link has been sent.",
      },
      { status: 200 }
    );
  }
}
