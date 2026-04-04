import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

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

    // Normalize phone: strip spaces, dashes, leading +
    let normalizedPhone = phone.replace(/[\s\-\+]/g, "");

    if (!/^(254|0)\d{9}$/.test(normalizedPhone)) {
      return NextResponse.json(
        { error: "Phone number must be a valid Kenyan number (e.g. 2547XXXXXXXX or 07XXXXXXXX)" },
        { status: 400 }
      );
    }

    // Convert 07XX... to 2547XX...
    if (normalizedPhone.startsWith("0")) {
      normalizedPhone = "254" + normalizedPhone.substring(1);
    }

    // --- Rate limiting check ---
    // Check if an OTP was sent to this phone in the last 60 seconds
    const recentOtp = await db.authAccount.findFirst({
      where: {
        provider: "phone",
        providerAccountId: normalizedPhone,
        createdAt: {
          gte: new Date(Date.now() - 60 * 1000), // last 60 seconds
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
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // --- Upsert OTP in AuthAccount ---
    // First, find or create the user for this phone number
    let user = await db.user.findUnique({
      where: { phone: normalizedPhone },
    });

    if (!user) {
      // Create a minimal user record for phone-based auth
      user = await db.user.create({
        data: {
          phone: normalizedPhone,
          name: "Phone User",
          email: `phone_${normalizedPhone}@jobready.co.ke`, // placeholder email
          passwordHash: null, // No password — phone-only auth
        },
      });
    }

    // Upsert the OTP auth account, linked to the user
    await db.authAccount.upsert({
      where: {
        providerAccountId: normalizedPhone,
      },
      create: {
        provider: "phone",
        providerAccountId: normalizedPhone,
        accessToken: otp,       // Store OTP in accessToken field
        expiresAt: otpExpiry,
        userId: user.id,
      },
      update: {
        provider: "phone",      // Ensure provider stays "phone"
        accessToken: otp,
        expiresAt: otpExpiry,
      },
    });

    // --- Send OTP via SMS ---
    // TODO: Connect actual SMS provider (Africa's Talking, Twilio, etc.)
    // For now, log the OTP to console for development
    console.log(`[Send OTP] Phone: ${normalizedPhone}, OTP: ${otp}, Expires: ${otpExpiry.toISOString()}`);

    // In production, send via SMS:
    // await sendSMS(normalizedPhone, `Your JobReady.co.ke verification code is ${otp}. Valid for 10 minutes.`);

    return NextResponse.json(
      {
        message: "OTP sent successfully",
        phone: normalizedPhone,
        expiresIn: 600, // seconds
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
