import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  findOrCreateUser,
  isProfileComplete,
  getMissingProfileFields,
  linkWalkInOrders,
} from "@/lib/account-merge";

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, otp, name, email: userEmail } = body;

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

    if (authAccount.accessToken !== otp) {
      return NextResponse.json(
        { error: "Invalid OTP. Please try again." },
        { status: 401 }
      );
    }

    if (authAccount.expiresAt && new Date() > authAccount.expiresAt) {
      return NextResponse.json(
        { error: "OTP has expired. Please request a new one." },
        { status: 401 }
      );
    }

    // --- Find or create user using merge logic ---
    const realEmail =
      userEmail && userEmail.trim() ? userEmail.toLowerCase().trim() : null;
    const {
      user: foundUser,
      merged,
      isNewUser,
    } = await findOrCreateUser({
      phone: normalizedPhone,
      email: realEmail,
      name: name?.trim() || null,
      provider: "phone",
    });

    // Update user data from this OTP session
    const updateData = {
      phoneVerified: true,
      phone: normalizedPhone, // ensure phone is set
      lastLoginAt: new Date(),
    };

    // If user provided name and current name is placeholder, update it
    if (
      name?.trim() &&
      (!foundUser.name || foundUser.name === "Phone User")
    ) {
      updateData.name = name.trim();
    }

    // If user provided email and current email is placeholder, update it
    if (
      realEmail &&
      (!foundUser.email ||
        foundUser.email.startsWith("phone_") ||
        foundUser.email.includes("@phone.jobready.co.ke"))
    ) {
      // Check if another user already has this email
      const existingEmailUser = await db.user.findUnique({
        where: { email: realEmail },
      });
      if (!existingEmailUser || existingEmailUser.id === foundUser.id) {
        updateData.email = realEmail;
      }
      // If email is taken by another user, the merge already handled it in findOrCreateUser
    }

    // Apply updates
    let user = await db.user.update({
      where: { id: foundUser.id },
      data: updateData,
    });

    // --- Link auth account to user ---
    if (authAccount.userId !== user.id) {
      await db.authAccount.update({
        where: { id: authAccount.id },
        data: { userId: user.id },
      });
    }

    // --- Link walk-in orders ---
    await linkWalkInOrders(user.id, user.email, normalizedPhone);

    // --- Recompute profileComplete ---
    const complete = isProfileComplete(user);
    if (complete !== user.profileComplete) {
      user = await db.user.update({
        where: { id: user.id },
        data: { profileComplete: complete },
      });
    }

    // --- Create permanent phone auth account if not exists ---
    const existingPhoneAuth = await db.authAccount.findFirst({
      where: {
        userId: user.id,
        provider: "phone",
        providerAccountId: normalizedPhone,
      },
    });
    if (!existingPhoneAuth) {
      await db.authAccount.create({
        data: {
          userId: user.id,
          provider: "phone",
          providerAccountId: normalizedPhone,
        },
      });
    }

    // --- Delete the OTP auth account (if it's different from the permanent one) ---
    if (authAccount.id !== existingPhoneAuth?.id) {
      await db.authAccount
        .delete({ where: { id: authAccount.id } })
        .catch(() => {});
    }

    // --- Return success ---
    const { passwordHash: _, ...userWithoutPassword } = user;
    const missingFields = getMissingProfileFields(user);

    return NextResponse.json(
      {
        message: "Phone verified successfully",
        user: userWithoutPassword,
        profileComplete: user.profileComplete,
        merged,
        isNewUser,
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
          { error: "This email is already linked to another account. Please sign in with that account." },
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
