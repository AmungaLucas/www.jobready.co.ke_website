import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isPlaceholderEmail, findUserByEmail, linkWalkInOrders } from "@/lib/auth-identity";

/**
 * POST /api/user/verify-email
 *
 * Verifies a 6-digit code sent to the user's email.
 *
 * Two purposes:
 *   - "email_verify": marks emailVerified = true on the current email
 *   - "email_update": replaces placeholder email with the verified new email
 *
 * Body: { code: "123456", newEmail?: "user@example.com" }
 *   newEmail is required when purpose was "email_update"
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
    const { code, newEmail } = body;

    if (!code || typeof code !== "string" || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: "A valid 6-digit code is required" },
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

    // Determine purpose: if newEmail is provided, this is an email update (placeholder → real)
    const purpose = newEmail ? "email_update" : "email_verify";
    const targetEmail = (newEmail || user.email).toLowerCase().trim();

    // ── email_update: replacing placeholder ──
    if (purpose === "email_update") {
      if (!isPlaceholderEmail(user.email)) {
        return NextResponse.json(
          { error: "Your email is already set. Use the regular verification flow." },
          { status: 400 }
        );
      }

      // Find the OTP record for the NEW email
      const otpRecord = await db.otp.findFirst({
        where: {
          phone: targetEmail,
          code,
          purpose: "email_update",
          verified: false,
          expiresAt: { gte: new Date() },
        },
        orderBy: { createdAt: "desc" },
      });

      if (!otpRecord) {
        return NextResponse.json(
          { error: "Invalid or expired verification code. Please request a new one." },
          { status: 400 }
        );
      }

      // Mark OTP as consumed
      await db.otp.update({
        where: { id: otpRecord.id },
        data: { verified: true },
      });

      // Double-check email isn't taken by someone else (race condition guard)
      const existingUser = await findUserByEmail(targetEmail);
      if (existingUser && existingUser.id !== session.user.id) {
        return NextResponse.json(
          { error: "This email is already linked to another account" },
          { status: 409 }
        );
      }

      // Update user's email and mark verified
      await db.user.update({
        where: { id: session.user.id },
        data: { email: targetEmail, emailVerified: true },
      });

      // Link any walk-in orders that match the new email
      await linkWalkInOrders(session.user.id, targetEmail, user.phone);

      console.log(
        `[Verify Email] Email updated from "${user.email}" → "${targetEmail}" for user ${session.user.id}`
      );

      return NextResponse.json({
        message: "Email updated and verified successfully",
      });
    }

    // ── email_verify: just marking existing email as verified ──
    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 }
      );
    }

    const otpRecord = await db.otp.findFirst({
      where: {
        phone: user.email,
        code,
        purpose: "email_verify",
        verified: false,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Invalid or expired verification code. Please request a new one." },
        { status: 400 }
      );
    }

    // Mark OTP as consumed
    await db.otp.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    // Mark email as verified
    await db.user.update({
      where: { id: session.user.id },
      data: { emailVerified: true },
    });

    console.log(
      `[Verify Email] Email verified for user ${session.user.id} (${user.email})`
    );

    return NextResponse.json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("[Verify Email API] Error:", error);
    return NextResponse.json(
      { error: "Failed to verify email. Please try again." },
      { status: 500 }
    );
  }
}
