import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { presets, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { sendEmail, welcomeTemplate } from "@/lib/email";
import { isPlaceholderEmail, isProfileComplete, linkWalkInOrders } from "@/lib/account-merge";

export async function POST(request) {
  try {
    // --- Rate limiting ---
    const ip = getClientIp(request);
    const { success, remaining, resetAt } = presets.register(ip);
    if (!success) {
      const resp = rateLimitResponse(5, resetAt);
      return NextResponse.json(resp.body, { status: resp.status, headers: resp.headers });
    }
    const body = await request.json();
    const { name, email, phone, password } = body;

    // --- Validation ---
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Normalize phone: strip spaces, dashes, leading +
    const rawPhone = phone.replace(/[\s\-\+]/g, "");
    if (!/^(254|0)\d{9}$/.test(rawPhone)) {
      return NextResponse.json(
        { error: "Phone number must be a valid Kenyan number (e.g. 2547XXXXXXXX or 07XXXXXXXX)" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const trimmedEmail = email.toLowerCase().trim();
    const trimmedName = name.trim();
    let normalizedPhone = phone.replace(/[\s\-\+]/g, "");
    if (normalizedPhone.startsWith("0")) {
      normalizedPhone = "254" + normalizedPhone.substring(1);
    }

    // --- Hash password ---
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // --- Check for existing user by email ---
    const existingUser = await db.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // --- Check for existing user by phone — MERGE if placeholder email ---
    if (normalizedPhone) {
      const existingPhoneUser = await db.user.findUnique({
        where: { phone: normalizedPhone },
      });

      if (existingPhoneUser) {
        // If the phone user has a placeholder email, merge: add email+password
        if (isPlaceholderEmail(existingPhoneUser.email)) {
          const updateData = {
            email: trimmedEmail,
            passwordHash,
            name: existingPhoneUser.name === "Phone User" ? trimmedName : existingPhoneUser.name,
          };

          const updatedUser = await db.$transaction(async (tx) => {
            const user = await tx.user.update({
              where: { id: existingPhoneUser.id },
              data: updateData,
            });

            // Create email auth account
            await tx.authAccount.create({
              data: {
                userId: user.id,
                provider: "email",
                providerAccountId: trimmedEmail,
              },
            });

            // Link walk-in orders
            await linkWalkInOrders(user.id, trimmedEmail, normalizedPhone);

            return user;
          });

          const complete = isProfileComplete(updatedUser);
          await db.user.update({
            where: { id: updatedUser.id },
            data: { profileComplete: complete },
          });

          const { passwordHash: _, ...userWithoutPassword } = updatedUser;
          return NextResponse.json({
            message: "Account linked successfully. You can now sign in with email/password.",
            user: { ...userWithoutPassword, profileComplete: complete },
            merged: true,
          }, { status: 200 });
        }

        // Phone user has a real email — can't merge safely
        return NextResponse.json(
          { error: "An account with this phone number already exists. Please sign in instead." },
          { status: 409 }
        );
      }
    }

    // --- Create User + AuthAccount in a transaction ---
    const user = await db.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: trimmedEmail,
          phone: normalizedPhone,
          name: trimmedName,
          passwordHash,
          emailVerified: false,
          phoneVerified: false,
        },
      });

      // Create email auth account
      await tx.authAccount.create({
        data: {
          userId: newUser.id,
          provider: "email",
          providerAccountId: trimmedEmail,
        },
      });

      // ── Link existing walk-in orders to this new user ──
      const emailOrders = await tx.order.findMany({
        where: { email: trimmedEmail, userId: null },
        select: { id: true },
      });
      if (emailOrders.length > 0) {
        await tx.order.updateMany({
          where: { id: { in: emailOrders.map((o) => o.id) } },
          data: { userId: newUser.id },
        });
      }

      if (normalizedPhone) {
        const phoneOrders = await tx.order.findMany({
          where: { phone: normalizedPhone, userId: null },
          select: { id: true },
        });
        if (phoneOrders.length > 0) {
          await tx.order.updateMany({
            where: { id: { in: phoneOrders.map((o) => o.id) } },
            data: { userId: newUser.id },
          });
        }
      }

      // Compute profileComplete
      const complete = isProfileComplete(newUser);
      if (complete !== newUser.profileComplete) {
        await tx.user.update({
          where: { id: newUser.id },
          data: { profileComplete: complete },
        });
      }

      return { ...newUser, profileComplete: isProfileComplete(newUser) };
    });

    // --- Return user without passwordHash ---
    const { passwordHash: _, ...userWithoutPassword } = user;

    // --- Send welcome email (non-blocking) ---
    sendEmail({
      to: trimmedEmail,
      subject: "Welcome to JobReady!",
      ...welcomeTemplate(trimmedName, trimmedEmail),
    }).catch((err) => console.error("[Register] Welcome email failed:", err.message));

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Register API] Error:", error);

    // Handle Prisma unique constraint violations
    if (error.code === "P2002") {
      const field = error.meta?.target?.[0];
      if (field === "email") {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 409 }
        );
      }
      if (field === "phone") {
        return NextResponse.json(
          { error: "An account with this phone number already exists" },
          { status: 409 }
        );
      }
      if (field === "provider_account_id") {
        return NextResponse.json(
          { error: "An auth account with this identifier already exists" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
