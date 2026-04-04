import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { presets, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { sendEmail, welcomeTemplate } from "@/lib/email";
import { findOrCreateUser, linkWalkInOrders, getMissingProfileFields, normalizePhone } from "@/lib/account-merge";

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

    let normalizedPhone = null;
    if (phone && typeof phone === "string") {
      normalizedPhone = normalizePhone(phone);
      if (!normalizedPhone) {
        return NextResponse.json(
          { error: "Phone number must be a valid Kenyan number (e.g. 2547XXXXXXXX or 07XXXXXXXX)" },
          { status: 400 }
        );
      }
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const trimmedEmail = email.toLowerCase().trim();
    const trimmedName = name.trim();

    // --- Hash password ---
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // --- Use findOrCreateUser with merge logic ---
    const result = await findOrCreateUser({
      email: trimmedEmail,
      phone: normalizedPhone,
      name: trimmedName,
      provider: "email",
      providerAccountId: trimmedEmail,
      passwordHash,
    });

    const user = result.user;

    console.log(
      `[Register] user=${user.id}, created=${result.created}, merged=${result.merged}, linked=${result.linkedProvider}`
    );

    // --- Link walk-in orders ---
    const linkedOrders = await linkWalkInOrders(user.id, trimmedEmail, normalizedPhone);

    // --- Check missing profile fields ---
    const missingFields = getMissingProfileFields(user);

    // --- Return user without passwordHash ---
    const { passwordHash: _, ...userWithoutPassword } = user;

    // --- Send welcome email (non-blocking) ---
    if (result.created) {
      sendEmail({
        to: trimmedEmail,
        subject: "Welcome to JobReady!",
        ...welcomeTemplate(trimmedName, trimmedEmail),
      }).catch((err) => console.error("[Register] Welcome email failed:", err.message));
    }

    return NextResponse.json(
      {
        message: result.created
          ? "Account created successfully"
          : result.merged
            ? "Account linked successfully"
            : "You already have an account. Please sign in.",
        user: userWithoutPassword,
        created: result.created,
        merged: result.merged,
        linkedOrders,
        missingFields,
      },
      { status: result.created ? 201 : 200 }
    );
  } catch (error) {
    console.error("[Register API] Error:", error);

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
