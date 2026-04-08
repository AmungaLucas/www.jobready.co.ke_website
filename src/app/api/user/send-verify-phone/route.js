import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { sendOTP } from "@/lib/sms";
import { normalizePhone, findUserByPhone } from "@/lib/auth-identity";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * POST /api/user/send-verify-phone
 *
 * Sends a 6-digit OTP to the given phone number for adding or verifying
 * a phone number from the dashboard settings.
 *
 * Two modes:
 *   1. "add" — user has no phone, providing a new one
 *   2. "verify" — user has a phone but it's unverified, re-sending OTP
 *
 * Rate limited: one code per phone per 60 seconds.
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
    const { phone } = body;

    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone) {
      return NextResponse.json(
        { error: "Phone number must be a valid Kenyan number (e.g. 07XXXXXXXX)" },
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

    // Already verified with this exact number
    if (user.phoneVerified && user.phone === normalizedPhone) {
      return NextResponse.json(
        { error: "This phone number is already verified on your account" },
        { status: 400 }
      );
    }

    // If user already has a DIFFERENT phone, they can't just add a new one
    // without first going through a change flow. For now, only allow:
    // - No phone → add
    // - Phone but not verified → re-verify same phone or update
    if (user.phone && user.phone !== normalizedPhone && user.phoneVerified) {
      return NextResponse.json(
        { error: "Your phone is already verified. To change it, please contact support." },
        { status: 400 }
      );
    }

    // Check if phone belongs to ANOTHER user
    let willMerge = false;
    let existingAccountName = null;
    if (user.phone !== normalizedPhone) {
      const phoneOwner = await findUserByPhone(normalizedPhone);
      if (phoneOwner && phoneOwner.id !== session.user.id) {
        // Don't block — send OTP anyway. Ownership is proven by receiving the code.
        // The verify step will handle merging the other account into this one.
        willMerge = true;
        existingAccountName = phoneOwner.name || "another account";
        console.log(
          `[Send Verify Phone] Phone ${normalizedPhone} belongs to user ${phoneOwner.id} — sending OTP, will merge on verify`
        );
      }
    }

    // Rate limit: check if an OTP was sent recently (within 60s)
    const recentOtp = await db.otp.findFirst({
      where: {
        phone: normalizedPhone,
        purpose: "phone_verify",
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

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Store OTP
    await db.otp.create({
      data: {
        phone: normalizedPhone,
        code: otp,
        purpose: "phone_verify",
        verified: false,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    });

    // Send OTP via SMS
    console.log(
      `[Send Verify Phone] Phone: ${normalizedPhone}, OTP: ${otp}, User: ${session.user.id}`
    );

    const smsResult = await sendOTP(normalizedPhone, otp);

    if (!smsResult.success) {
      console.error(
        `[Send Verify Phone] SMS failed for ${normalizedPhone}:`,
        smsResult.error
      );
      return NextResponse.json(
        { error: "Failed to send OTP via SMS. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      message: "OTP sent successfully",
      phone: normalizedPhone,
      expiresIn: 600,
      ...(willMerge && { willMerge: true, existingAccountName }),
    });
  } catch (error) {
    console.error("[Send Verify Phone API] Error:", error);
    return NextResponse.json(
      { error: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}
