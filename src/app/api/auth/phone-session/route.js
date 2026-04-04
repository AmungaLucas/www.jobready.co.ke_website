import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getMissingProfileFields } from "@/lib/account-merge";
import { encode } from "next-auth/jwt";

/**
 * POST /api/auth/phone-session
 *
 * Creates a NextAuth JWT session for a phone-verified user.
 * This is needed because phone OTP users don't have email+password
 * to use the credentials provider, so we directly generate a JWT.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch user from DB
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Generate JWT token
    const token = await encode({
      token: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        issuedAt: Date.now(),
      },
      secret: process.env.NEXTAUTH_SECRET,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    // Set the JWT as an httpOnly cookie
    const response = NextResponse.json({
      message: "Session created",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
      },
    });

    response.cookies.set("next-auth.session-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    // Also set the callback-url cookie for NextAuth
    response.cookies.set("next-auth.callback-url", "/dashboard", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 5, // 5 minutes
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[Phone Session API] Error:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
