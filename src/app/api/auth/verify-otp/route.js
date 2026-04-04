import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, otp } = body;

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
    let normalizedPhone = phone.replace(/[\s\-\+]/g, "");
    if (normalizedPhone.startsWith("0")) {
      normalizedPhone = "254" + normalizedPhone.substring(1);
    }

    // --- Find the OTP record ---
    const authAccount = await db.authAccount.findUnique({
      where: { providerAccountId: normalizedPhone },
    });

    if (!authAccount || authAccount.provider !== "phone") {
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

    // --- Find or create user ---
    // Check if a user with this phone already exists
    let user = await db.user.findUnique({
      where: { phone: normalizedPhone },
    });

    if (!user) {
      // Create a new user with phone only (no email yet)
      user = await db.user.create({
        data: {
          email: `${normalizedPhone}@phone.jobready.co.ke`, // placeholder email
          phone: normalizedPhone,
          name: "Phone User",
          phoneVerified: true,
        },
      });

      // ── Link existing walk-in orders to this new user ──
      await db.order.updateMany({
        where: { phone: normalizedPhone, userId: null },
        data: { userId: user.id },
      });
    } else {
      // Update existing user to mark phone as verified
      user = await db.user.update({
        where: { id: user.id },
        data: {
          phoneVerified: true,
          lastLoginAt: new Date(),
        },
      });

      // ── Link any unlinked walk-in orders matching this phone ──
      const linkedCount = await db.order.updateMany({
        where: { phone: normalizedPhone, userId: null },
        data: { userId: user.id },
      });
      if (linkedCount.count > 0) {
        console.log(`[Verify OTP] Linked ${linkedCount.count} existing orders to user ${user.id}`);
      }
    }

    // --- Link phone auth account to user if not already ---
    if (authAccount.userId !== user.id) {
      await db.authAccount.update({
        where: { id: authAccount.id },
        data: { userId: user.id },
      });
    }

    // --- Clear the OTP (delete the phone auth account record) ---
    await db.authAccount.delete({
      where: { id: authAccount.id },
    });

    // --- Return success with user info ---
    const { passwordHash: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "Phone verified successfully",
        user: userWithoutPassword,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Verify OTP API] Error:", error);

    if (error.code === "P2002") {
      // Unique constraint violation (e.g., email already taken)
      const field = error.meta?.target?.[0];
      if (field === "email") {
        return NextResponse.json(
          { error: "Could not create account. Please sign up with email first." },
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
