import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { findOrCreateUser, linkWalkInOrders, getMissingProfileFields, normalizePhone } from "@/lib/account-merge";

export async function POST(request) {
  try {
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

    // --- Find the OTP record ---
    const authAccount = await db.authAccount.findUnique({
      where: { providerAccountId: normalizedPhone },
    });

    if (!authAccount || (authAccount.provider !== "phone_otp" && authAccount.provider !== "phone")) {
      return NextResponse.json(
        { error: "No OTP found for this phone number. Please request a new one." },
        { status: 404 }
      );
    }

    // Check if OTP matches
    if (authAccount.accessToken !== otp) {
      return NextResponse.json(
        { error: "Invalid OTP. Please try again." },
        { status: 401 }
      );
    }

    // Check if OTP is expired
    if (authAccount.expiresAt && new Date() > authAccount.expiresAt) {
      return NextResponse.json(
        { error: "OTP has expired. Please request a new one." },
        { status: 401 }
      );
    }

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
      if (password.length < 8) {
        return NextResponse.json(
          { error: "Password must be at least 8 characters" },
          { status: 400 }
        );
      }
      passwordHash = await bcrypt.hash(password, 12);
    }

    // --- Delete the OTP record (it's been consumed) ---
    await db.authAccount.delete({
      where: { id: authAccount.id },
    });

    // --- Use findOrCreateUser with merge logic ---
    const result = await findOrCreateUser({
      phone: normalizedPhone,
      email: normalizedEmail,
      name: trimmedName,
      provider: "phone",
      providerAccountId: normalizedPhone,
      passwordHash,
    });

    const user = result.user;

    console.log(
      `[Verify OTP] user=${user.id}, created=${result.created}, merged=${result.merged}, linked=${result.linkedProvider}`
    );

    // --- Link walk-in orders ---
    const linkedOrders = await linkWalkInOrders(user.id, normalizedEmail, normalizedPhone);

    // --- Check missing profile fields ---
    const missingFields = getMissingProfileFields(user);

    // --- Return success with user info + missing fields ---
    const { passwordHash: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: result.created
          ? "Account created successfully"
          : result.merged
            ? "Accounts linked successfully"
            : "Phone verified successfully",
        user: userWithoutPassword,
        created: result.created,
        merged: result.merged,
        linkedOrders,
        missingFields,
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
    }

    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
