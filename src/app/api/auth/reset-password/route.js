import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    // --- Validation ---
    if (!token || typeof token !== "string" || token.length < 32) {
      return NextResponse.json(
        { error: "A valid reset token is required" },
        { status: 400 }
      );
    }

    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Optional: enforce password strength
    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return NextResponse.json(
        { error: "Password must contain at least one uppercase letter, one lowercase letter, and one number" },
        { status: 400 }
      );
    }

    // --- Find the reset token in AuthAccount ---
    const resetAccount = await db.authAccount.findFirst({
      where: {
        provider: "reset",
        accessToken: token,
      },
      include: {
        user: true,
      },
    });

    if (!resetAccount) {
      return NextResponse.json(
        { error: "Invalid or expired reset token. Please request a new one." },
        { status: 401 }
      );
    }

    // Check if token is expired
    if (resetAccount.expiresAt && new Date() > resetAccount.expiresAt) {
      // Delete expired token
      await db.authAccount.delete({
        where: { id: resetAccount.id },
      });

      return NextResponse.json(
        { error: "Reset token has expired. Please request a new one." },
        { status: 401 }
      );
    }

    // Check user exists and has a password
    if (!resetAccount.user) {
      return NextResponse.json(
        { error: "User account not found." },
        { status: 404 }
      );
    }

    // --- Hash new password ---
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // --- Update user password and delete reset token in a transaction ---
    await db.$transaction(async (tx) => {
      // Update user's password
      await tx.user.update({
        where: { id: resetAccount.userId },
        data: { passwordHash },
      });

      // Delete the reset token
      await tx.authAccount.delete({
        where: { id: resetAccount.id },
      });

      // Also delete any other reset tokens for this user (cleanup)
      await tx.authAccount.deleteMany({
        where: {
          userId: resetAccount.userId,
          provider: "reset",
        },
      });
    });

    console.log(`[Reset Password] Password reset successful for user: ${resetAccount.user.email}`);

    return NextResponse.json(
      {
        message: "Password reset successfully. You can now sign in with your new password.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Reset Password API] Error:", error);

    return NextResponse.json(
      { error: "Failed to reset password. Please try again." },
      { status: 500 }
    );
  }
}
