import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getMissingProfileFields } from "@/lib/auth-identity";
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

    // -----------------------------------------------------------------
    // Determine cookie name: NextAuth uses __Secure- prefix in production
    // (when accessed via HTTPS). If we use the wrong name, getToken() in
    // the middleware can't find the cookie → user appears unauthenticated.
    // -----------------------------------------------------------------
    const useSecureCookies =
      process.env.NODE_ENV === "production" ||
      (process.env.NEXTAUTH_URL || "").startsWith("https://");

    const sessionCookieName = useSecureCookies
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token";

    const callbackCookieName = useSecureCookies
      ? "__Secure-next-auth.callback-url"
      : "next-auth.callback-url";

    // Generate JWT token — include hasPassword + missingFields so the
    // middleware onboarding gate works correctly without needing refresh().
    const missingFields = getMissingProfileFields(user);

    const token = await encode({
      token: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        googleId: user.googleId || null,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        hasPassword: !!user.passwordHash,
        missingFields,
        issuedAt: Date.now(),
      },
      secret: process.env.NEXTAUTH_SECRET,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    // Build response
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
        missingFields,
      },
    });

    // Set the JWT as an httpOnly cookie — using the correct name
    response.cookies.set(sessionCookieName, token, {
      httpOnly: true,
      secure: useSecureCookies,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    // Also set the callback-url cookie for NextAuth
    response.cookies.set(callbackCookieName, "/dashboard", {
      httpOnly: true,
      secure: useSecureCookies,
      sameSite: "lax",
      maxAge: 60 * 5, // 5 minutes
      path: "/",
    });

    console.log(
      `[Phone Session] Session created for user ${user.id} (${user.email || user.phone}), cookie: ${sessionCookieName}`
    );

    return response;
  } catch (error) {
    console.error("[Phone Session API] Error:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
