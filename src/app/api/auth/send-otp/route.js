import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { sendOTP } from "@/lib/sms";
import { normalizePhone } from "@/lib/account-merge";

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone } = body;

    // --- Validation ---
    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Normalize phone
    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone) {
      return NextResponse.json(
        { error: "Phone number must be a valid Kenyan number (e.g. 2547XXXXXXXX or 07XXXXXXXX)" },
        { status: 400 }
      );
    }

    // --- Rate limiting check ---
    // Check if an OTP was sent to this phone in the last 60 seconds
    const recentOtp = await db.authAccount.findFirst({
      where: {
        provider: "phone_otp",
        providerAccountId: normalizedPhone,
        createdAt: {
          gte: new Date(Date.now() - 60 * 1000),
        },
      },
    });

    if (recentOtp) {
      return NextResponse.json(
        { error: "Please wait at least 60 seconds before requesting another OTP" },
        { status: 429 }
      );
    }

    // --- Generate 6-digit OTP ---
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // --- Upsert OTP in AuthAccount ---
    // Use provider: "phone_otp" to separate from the actual "phone" auth account
    // This record is TEMPORARY — it only stores the OTP for verification
    // It does NOT create a user at this stage
    await db.authAccount.upsert({
      where: {
        providerAccountId: normalizedPhone,
      },
      create: {
        provider: "phone_otp",
        providerAccountId: normalizedPhone,
        accessToken: otp,
        expiresAt: otpExpiry,
        // userId is null at this point — user is created on verify
      },
      update: {
        provider: "phone_otp",
        accessToken: otp,
        expiresAt: otpExpiry,
      },
    });

    // --- Send OTP via SMS ---
    console.log(`[Send OTP] Phone: ${normalizedPhone}, OTP: ${otp}, Expires: ${otpExpiry.toISOString()}`);

    const smsResult = await sendOTP(normalizedPhone, otp);

    if (!smsResult.success) {
      console.error(`[Send OTP] SMS failed for ${normalizedPhone}:`, smsResult.error);
      return NextResponse.json(
        { error: "Failed to send OTP via SMS. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        message: "OTP sent successfully",
        phone: normalizedPhone,
        expiresIn: 600,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Send OTP API] Error:", error);

    return NextResponse.json(
      { error: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}
