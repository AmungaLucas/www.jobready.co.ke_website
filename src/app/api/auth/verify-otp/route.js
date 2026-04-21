import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import {
  normalizePhone,
  findUserByPhone,
  createUser,
  linkWalkInOrders,
  getMissingProfileFields,
  cleanupOrphanedGhosts,
  validatePasswordStrength,
} from "@/lib/auth-identity";
import { checkOtpAttempts, recordOtpFailure, clearOtpFailures } from "@/lib/rate-limit";

export async function POST(request) {
  try {
    // Fire-and-forget: clean up any orphaned ghost accounts in the background.
    // These are unreachable records left from partial merges before the
    // deletion logic was added. Non-blocking — errors are caught internally.
    cleanupOrphanedGhosts().catch(() => {});

    const body = await request.json();
    const { phone, otp, name, email, password } = body;

    // --- Validation ---
    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    if (!otp || typeof otp !== "string" || !/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: "A valid 6-digit OTP is required" },
        { status: 400 }
      );
    }

    // Normalize phone
    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    // --- Check OTP attempt lockout (5 fails → 30 min lockout) ---
    const otpCheck = await checkOtpAttempts(normalizedPhone, "auth", 5);
    if (!otpCheck.allowed) {
      return NextResponse.json(
        { error: "Too many failed attempts. Please wait 30 minutes before trying again." },
        { status: 429 }
      );
    }

    // --- Find the OTP record from the Otp table ---
    const now = new Date();
    const otpRecord = await db.otp.findFirst({
      where: {
        phone: normalizedPhone,
        code: otp,
        purpose: "auth",
        verified: false,
        expiresAt: { gte: now },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      await recordOtpFailure(normalizedPhone, "auth");
      return NextResponse.json(
        { error: "No valid OTP found for this phone number. Please request a new one." },
        { status: 404 }
      );
    }

    // --- Mark OTP as verified (consumed) ---
    await db.otp.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    // Clear failed attempt counter on success
    await clearOtpFailures(normalizedPhone, "auth");

    // --- Validate optional profile fields ---
    let normalizedEmail = null;
    let passwordHash = null;
    let trimmedName = null;

    if (email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return NextResponse.json(
          { error: "Invalid email address" },
          { status: 400 }
        );
      }
      normalizedEmail = email.toLowerCase().trim();
    }

    if (name) {
      trimmedName = name.trim();
      if (trimmedName.length < 2) {
        return NextResponse.json(
          { error: "Name must be at least 2 characters" },
          { status: 400 }
        );
      }
    }

    if (password) {
      const passwordCheck = validatePasswordStrength(password);
      if (!passwordCheck.valid) {
        return NextResponse.json(
          { error: passwordCheck.error },
          { status: 400 }
        );
      }
      passwordHash = await bcrypt.hash(password, 12);
    }

    // --- Find or create user ---
    let user = await findUserByPhone(normalizedPhone);
    let created = false;

    if (!user) {
      // New user — create via auth-identity
      user = await createUser({
        phone: normalizedPhone,
        email: normalizedEmail,
        name: trimmedName,
        passwordHash,
        phoneVerified: true,
      });
      created = true;

      // Link walk-in orders for new users
      await linkWalkInOrders(user.id, normalizedEmail, normalizedPhone);
    }

    // --- Check missing profile fields ---
    const missingFields = getMissingProfileFields(user);

    // --- Generate a one-time session grant token ---
    // This token must be passed to /api/auth/phone-session to prove
    // that OTP was actually verified. Prevents session creation by
    // anyone who merely knows a userId.
    const sessionGrantToken = crypto.randomBytes(32).toString("hex");

    await db.otp.create({
      data: {
        phone: user.phone || user.email || user.id,
        code: sessionGrantToken,
        purpose: "session_grant",
        verified: false,
        expiresAt: new Date(Date.now() + 60 * 1000), // 60 seconds only
      },
    });

    // --- Return success with user info + missing fields + session grant token ---
    const { passwordHash: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: created
          ? "Account created successfully"
          : "Phone verified successfully",
        user: userWithoutPassword,
        created,
        linkedOrders: created ? undefined : undefined,
        missingFields,
        sessionGrantToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Verify OTP API] Error:", error);

    if (error.code === "P2002") {
      const field = error.meta?.target?.[0];
      if (field === "email") {
        return NextResponse.json(
          { error: "This email is already linked to another account. Please sign in with that account first." },
          { status: 409 }
        );
      }
      if (field === "phone") {
        return NextResponse.json(
          { error: "This phone number is already linked to another account." },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
