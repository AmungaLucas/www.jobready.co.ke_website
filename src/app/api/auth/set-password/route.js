import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { setUserPassword, getMissingProfileFields, validatePasswordStrength } from "@/lib/auth-identity";

/**
 * POST /api/auth/set-password
 *
 * Sets a password for users who signed up via Google or phone OTP
 * and want to add password-based login.
 *
 * Body: { password }
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
    const { password } = body;

    // --- Validation ---
    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const passwordCheck = validatePasswordStrength(password);
    if (!passwordCheck.valid) {
      return NextResponse.json(
        { error: passwordCheck.error },
        { status: 400 }
      );
    }

    // --- Hash password ---
    const passwordHash = await bcrypt.hash(password, 12);

    // --- Set password via auth-identity ---
    const updatedUser = await setUserPassword(userId, passwordHash);

    console.log(`[Set Password] Password set for user ${userId}`);

    // --- Check missing fields ---
    const missingFields = getMissingProfileFields(updatedUser);

    return NextResponse.json(
      {
        message: "Password set successfully",
        user: sanitizeUser(updatedUser),
        missingFields,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Set Password API] Error:", error);

    // Handle errors from setUserPassword
    if (error.message && error.message.includes("[AuthIdentity]")) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to set password. Please try again." },
      { status: 500 }
    );
  }
}

// Remove passwordHash from user object
function sanitizeUser(user) {
  const { passwordHash: _, ...safeUser } = user;
  return safeUser;
}
