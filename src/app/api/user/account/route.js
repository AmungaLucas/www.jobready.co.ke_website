import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site-config";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * POST /api/user/account
 *
 * Requests a deletion confirmation code.
 * For users with a password: they must provide their password.
 * For OAuth-only users (no password): a 6-digit code is sent to their email.
 *
 * This two-step flow prevents accidental or unauthorized deletion,
 * especially for OAuth users who have no password to verify.
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

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, passwordHash: true, email: true, name: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // OAuth-only user: send a verification code to their email
    if (!user.passwordHash) {
      if (!user.email) {
        return NextResponse.json(
          { error: "No email address associated with this account. Please contact support." },
          { status: 400 }
        );
      }

      // Rate limit: one deletion code per 60 seconds
      const recentOtp = await db.otp.findFirst({
        where: {
          phone: user.email,
          purpose: "ACCOUNT_DELETE",
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

      const code = crypto.randomInt(100000, 999999).toString();

      await db.otp.create({
        data: {
          phone: user.email,
          code,
          purpose: "ACCOUNT_DELETE",
          verified: false,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        },
      });

      // Send the code via email
      try {
        const { sendEmail, emailVerificationCodeTemplate } = await import("@/lib/email");
        const { html, text } = emailVerificationCodeTemplate(user.name, code);
        const result = await sendEmail({
          to: user.email,
          subject: `Account Deletion Confirmation — ${siteConfig.shortName}`,
          html,
          text,
        });

        if (!result.success) {
          console.error("[Delete Account] Failed to send deletion code:", result.error);
          return NextResponse.json(
            { error: "Failed to send verification code. Please try again." },
            { status: 500 }
          );
        }
      } catch (emailErr) {
        console.error("[Delete Account] Email error:", emailErr.message);
        return NextResponse.json(
          { error: "Failed to send verification code. Please try again." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: "Verification code sent to your email",
        requiresCode: true,
      });
    }

    // User has a password — no code needed, just provide password on DELETE
    return NextResponse.json({
      message: "Please provide your password to confirm deletion",
      requiresCode: false,
    });
  } catch (error) {
    console.error("[Request Delete Account] Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/user/account
 *
 * Permanently deletes the current user's account and all associated data.
 * Cascade deletes handle: SavedJob, SavedArticle, Application, JobAlert,
 * ArticleReaction, Notification, AuthAccount.
 * Orders get userId set to null (SetNull), preserving billing records.
 *
 * Authentication requirements:
 *   - Users WITH a password: must provide confirmPassword matching their hash.
 *   - OAuth-only users (no password): must provide a valid 6-digit code
 *     that was sent to their email via POST /api/user/account.
 */
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { confirmPassword, deleteCode } = body;

    // Fetch user with password
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, passwordHash: true, email: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.passwordHash) {
      // ── Password user: verify password ──
      if (!confirmPassword || typeof confirmPassword !== "string") {
        return NextResponse.json(
          { error: "Password confirmation is required to delete your account" },
          { status: 400 }
        );
      }

      const { default: bcrypt } = await import("bcryptjs");
      const isMatch = await bcrypt.compare(confirmPassword, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Incorrect password" },
          { status: 401 }
        );
      }
    } else {
      // ── OAuth-only user: verify email deletion code ──
      if (!deleteCode || typeof deleteCode !== "string" || !/^\d{6}$/.test(deleteCode)) {
        return NextResponse.json(
          { error: "A valid 6-digit verification code is required. Please request one first." },
          { status: 400 }
        );
      }

      const otpRecord = await db.otp.findFirst({
        where: {
          phone: user.email,
          code: deleteCode,
          purpose: "ACCOUNT_DELETE",
          verified: false,
          expiresAt: { gte: new Date() },
        },
        orderBy: { createdAt: "desc" },
      });

      if (!otpRecord) {
        return NextResponse.json(
          { error: "Invalid or expired verification code. Please request a new one." },
          { status: 401 }
        );
      }

      // Consume the OTP (one-time use)
      await db.otp.update({
        where: { id: otpRecord.id },
        data: { verified: true },
      });
    }

    // Delete user (cascade handles related records)
    await db.user.delete({ where: { id: session.user.id } });

    console.log(`[Delete Account] User ${session.user.id} (${user.email}) deleted their account`);

    return NextResponse.json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("[Delete Account API] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
