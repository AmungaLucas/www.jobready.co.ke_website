import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * POST /api/user/verify-email
 *
 * Verifies a 6-digit code sent to the user's email.
 * Marks emailVerified = true on the user's account.
 *
 * Body: { code: "123456" }
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
    const { code } = body;

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

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 }
      );
    }

    const email = user.email;

    // Find the OTP record
    const otpRecord = await db.otp.findFirst({
      where: {
        phone: email,
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
      `[Verify Email] Email verified for user ${session.user.id} (${email})`
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
