import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site-config";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { presets, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { sendEmail, welcomeCredentialSignup } from "@/lib/email";
import {
  normalizePhone,
  findUserByEmail,
  findUserByPhone,
  createUser,
  linkWalkInOrders,
  getMissingProfileFields,
  validatePasswordStrength,
} from "@/lib/auth-identity";

export async function POST(request) {
  try {
    // --- Rate limiting ---
    const ip = getClientIp(request);
    const { success, remaining, resetAt } = await presets.register(ip);
    if (!success) {
      const resp = rateLimitResponse(5, resetAt);
      return NextResponse.json(resp.body, { status: resp.status, headers: resp.headers });
    }
    const body = await request.json();
    const { name, email, phone, password } = body;

    // --- Validation ---
    if (!name || typeof name !== "string" || name.trim().length < 2 || name.length > 100) {
      return NextResponse.json(
        { error: "Name must be between 2 and 100 characters" },
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

    const passwordCheck = validatePasswordStrength(password);
    if (!passwordCheck.valid) {
      return NextResponse.json(
        { error: passwordCheck.error },
        { status: 400 }
      );
    }

    const trimmedEmail = email.toLowerCase().trim();
    const trimmedName = name.trim();

    // --- Check uniqueness via auth-identity ---
    const existingEmail = await findUserByEmail(trimmedEmail);
    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    if (normalizedPhone) {
      const existingPhone = await findUserByPhone(normalizedPhone);
      if (existingPhone) {
        return NextResponse.json(
          { error: "An account with this phone number already exists" },
          { status: 409 }
        );
      }
    }

    // --- Hash password ---
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // --- Create user via auth-identity (simple create, no merge) ---
    const user = await createUser({
      email: trimmedEmail,
      phone: normalizedPhone,
      name: trimmedName,
      passwordHash,
      emailVerified: false,
      phoneVerified: false,
    });

    console.log(`[Register] user=${user.id}, created=true`);

    // --- Link walk-in orders ---
    const linkedOrders = await linkWalkInOrders(user.id, trimmedEmail, normalizedPhone);

    // --- Check missing profile fields ---
    const missingFields = getMissingProfileFields(user);

    // --- Return user without passwordHash ---
    const { passwordHash: _, ...userWithoutPassword } = user;

    // --- Send welcome email (non-blocking) ---
    sendEmail({
      to: trimmedEmail,
      subject: `Welcome to ${siteConfig.shortName}!`,
      ...welcomeCredentialSignup({ name: trimmedName, email: trimmedEmail, hasPhone: !!normalizedPhone }),
    }).catch((err) => console.error("[Register] Welcome email failed:", err.message));

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: userWithoutPassword,
        created: true,
        merged: false,
        linkedOrders,
        missingFields,
      },
      { status: 201 }
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
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
