import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import {
  linkWalkInOrders,
  getMissingProfileFields,
  normalizePhone,
  linkPhoneToUser,
  linkEmailToUser,
  setUserPassword,
} from "@/lib/auth-identity";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * PATCH /api/auth/complete-profile
 *
 * Updates the current user's profile fields that are missing/incomplete.
 * Accepts any combination of: name, email, phone, password
 * Validates that only genuinely missing fields are being set.
 */
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    const { name, email, phone, password } = body;

    // --- Fetch current user ---
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // --- Check what's missing ---
    const missing = getMissingProfileFields(user);
    const updateResults = [];
    let updatedUser = user;

    // Name — only allow if currently missing/placeholder
    if (name && missing.needsName) {
      const trimmedName = name.trim();
      if (trimmedName.length < 2) {
        return NextResponse.json(
          { error: "Name must be at least 2 characters" },
          { status: 400 }
        );
      }
      updatedUser = await db.user.update({
        where: { id: userId },
        data: { name: trimmedName },
      });
      updateResults.push("name");
    }

    // Email — only allow if currently placeholder
    if (email && missing.needsEmail) {
      const trimmedEmail = email.toLowerCase().trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        return NextResponse.json(
          { error: "Invalid email address" },
          { status: 400 }
        );
      }
      updatedUser = await linkEmailToUser(userId, trimmedEmail);
      updateResults.push("email");
    }

    // Phone — only allow if currently missing
    if (phone && missing.needsPhone) {
      const normalizedPhone = normalizePhone(phone);
      if (!normalizedPhone) {
        return NextResponse.json(
          { error: "Invalid phone number format" },
          { status: 400 }
        );
      }
      updatedUser = await linkPhoneToUser(userId, normalizedPhone);
      updateResults.push("phone");
    }

    // Password — only allow if currently missing
    if (password && missing.needsPassword) {
      if (password.length < 8) {
        return NextResponse.json(
          { error: "Password must be at least 8 characters" },
          { status: 400 }
        );
      }
      const passwordHash = await bcrypt.hash(password, 12);
      updatedUser = await setUserPassword(userId, passwordHash);
      updateResults.push("password");
    }

    // --- Check if there's anything to update ---
    if (updateResults.length === 0) {
      return NextResponse.json(
        {
          message: "No fields to update",
          user: sanitizeUser(user),
          missingFields: missing,
        },
        { status: 200 }
      );
    }

    console.log(
      `[Complete Profile] Updated user ${userId}: ${updateResults.join(", ")}`
    );

    // --- Link walk-in orders ---
    const linkedOrders = await linkWalkInOrders(
      userId,
      updatedUser.email,
      updatedUser.phone
    );

    // --- Re-check missing fields ---
    const newMissing = getMissingProfileFields(updatedUser);

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: sanitizeUser(updatedUser),
        linkedOrders,
        missingFields: newMissing,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Complete Profile API] Error:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A conflict occurred. This identifier may already be in use." },
        { status: 409 }
      );
    }

    // Handle errors thrown by linkPhoneToUser/linkEmailToUser
    if (error.message && error.message.includes("[AuthIdentity]")) {
      const msg = error.message;
      if (msg.includes("already belongs to another")) {
        return NextResponse.json(
          { error: "This identifier is already linked to another account" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to update profile. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/complete-profile
 *
 * Returns the current user's missing profile fields.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const missingFields = getMissingProfileFields(user);

    return NextResponse.json({
      user: sanitizeUser(user),
      missingFields,
    });
  } catch (error) {
    console.error("[Complete Profile API] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile data" },
      { status: 500 }
    );
  }
}

// Remove passwordHash from user object
function sanitizeUser(user) {
  const { passwordHash: _, ...safeUser } = user;
  return safeUser;
}
