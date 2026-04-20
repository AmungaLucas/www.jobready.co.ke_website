import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site-config";
import crypto from "crypto";
import { db } from "@/lib/db";
import { presets, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { sendEmail, passwordResetTemplate } from "@/lib/email";

export async function POST(request) {
  try {
    // --- Rate limiting ---
    const ip = getClientIp(request);
    const { success, resetAt } = await presets.forgotPassword(ip);
    if (!success) {
      const resp = rateLimitResponse(3, resetAt);
      return NextResponse.json(resp.body, { status: resp.status, headers: resp.headers });
    }

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
    const resetUrl = `${process.env.NEXTAUTH_URL || siteConfig.url}/auth/reset-password?token=${resetToken}`;

    await sendEmail({
      to: trimmedEmail,
      subject: `Reset Your ${siteConfig.shortName} Password`,
      ...passwordResetTemplate(user.name, resetUrl),
    });

    console.log(`[Forgot Password] Reset email sent to: ${trimmedEmail}`);

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
