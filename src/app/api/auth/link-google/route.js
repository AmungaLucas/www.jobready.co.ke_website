import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  findUserByEmail,
  linkGoogleToUser,
  linkWalkInOrders,
  getMissingProfileFields,
} from "@/lib/auth-identity";

/**
 * POST /api/auth/link-google
 *
 * Links a Google account to an existing email+password account.
 * The user confirms their password, then we find the matching
 * AuthAccount with provider="google" and link the googleId.
 *
 * Body: { email, password }
 * Auth: Required (must be logged in)
 */
export async function POST(request) {
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
    const { email, password } = body;

    // --- Validation ---
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required to confirm identity" },
        { status: 400 }
      );
    }

    // --- Find user by email ---
    const user = await findUserByEmail(email.toLowerCase().trim());

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email" },
        { status: 404 }
      );
    }

    // Ensure the logged-in user matches the email account
    if (user.id !== userId) {
      return NextResponse.json(
        { error: "You can only link Google to your own account" },
        { status: 403 }
      );
    }

    // --- Verify password ---
    if (!user.passwordHash) {
      return NextResponse.json(
        { error: "This account does not have a password set. Please set a password first." },
        { status: 400 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    // --- Find a Google AuthAccount to link ---
    // Look for any Google auth account that could belong to this user
    // (orphaned records or records already linked to this user)
    const googleAuthAccount = await db.authAccount.findFirst({
      where: {
        provider: "google",
        OR: [
          { userId: null },
          { userId: user.id },
        ],
      },
    });

    if (!googleAuthAccount) {
      return NextResponse.json(
        { error: "No Google account found to link. Please sign in with Google first." },
        { status: 404 }
      );
    }

    // --- Link Google to user ---
    await linkGoogleToUser(userId, googleAuthAccount.providerAccountId);

    console.log(
      `[Link Google] Linked googleId=${googleAuthAccount.providerAccountId} to user ${userId}`
    );

    // --- Refresh user data ---
    const updatedUser = await db.user.findUnique({ where: { id: userId } });

    // --- Link walk-in orders ---
    await linkWalkInOrders(userId, updatedUser.email, updatedUser.phone);

    // --- Check missing fields ---
    const missingFields = getMissingProfileFields(updatedUser);

    return NextResponse.json(
      {
        message: "Google account linked successfully",
        user: sanitizeUser(updatedUser),
        missingFields,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Link Google API] Error:", error);

    // Handle errors from linkGoogleToUser
    if (error.message && error.message.includes("[AuthIdentity]")) {
      const msg = error.message;
      if (msg.includes("already belongs to another")) {
        return NextResponse.json(
          { error: "This Google account is already linked to another account" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to link Google account. Please try again." },
      { status: 500 }
    );
  }
}

// Remove passwordHash from user object
function sanitizeUser(user) {
  const { passwordHash: _, ...safeUser } = user;
  return safeUser;
}
