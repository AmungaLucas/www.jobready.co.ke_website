import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getMissingProfileFields } from "@/lib/auth-identity";
import { encode } from "next-auth/jwt";

/**
 * POST /api/auth/phone-session
 *
 * Creates a NextAuth JWT session for a phone-verified user.
 *
 * Two modes of operation:
 *   1. JSON request  → returns JSON + session cookie (no redirect).
 *      Used by the login page to create a session before showing the
 *      profile completion form (Scenario 2: new phone users).
 *   2. Form submission → returns 303 redirect + session cookie.
 *      Used by the login page after profile completion to navigate
 *      the user to the dashboard with zero React interference.
 */
export async function POST(request) {
  try {
    // Accept both JSON body and form-data (native form submission)
    let userId;
    let callbackUrl;
    const isJson =
      (request.headers.get("content-type") || "").includes("application/json");

    if (isJson) {
      const body = await request.json();
      userId = body.userId;
      callbackUrl = body.callbackUrl;
    } else {
      const formData = await request.formData();
      userId = formData.get("userId");
      callbackUrl = formData.get("callbackUrl");
    }

    // --- Validate userId ---
    if (!userId) {
      if (!isJson) {
        return NextResponse.redirect(
          new URL("/login?error=phone_session", request.url)
        );
      }
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // --- Fetch user from DB ---
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      if (!isJson) {
        return NextResponse.redirect(
          new URL("/login?error=phone_session", request.url)
        );
      }
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // --- Determine cookie name ---
    // NextAuth uses __Secure- prefix in production (HTTPS).
    // Using the wrong name makes getToken() unable to find the cookie.
    const useSecureCookies =
      process.env.NODE_ENV === "production" ||
      (process.env.NEXTAUTH_URL || "").startsWith("https://");

    const sessionCookieName = useSecureCookies
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token";

    // --- Generate JWT (mirrors NextAuth's jwt() callback) ---
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

    // --- Build response ---
    const redirectUrl = callbackUrl || "/dashboard";

    let response;

    if (isJson) {
      // JSON mode: return JSON body + cookie (no redirect).
      // The caller decides what to do next (e.g. show profile form).
      response = NextResponse.json({
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
    } else {
      // Form mode: 303 redirect (POST → GET) + cookie.
      // The browser follows the redirect natively.
      response = NextResponse.redirect(
        new URL(redirectUrl, request.url),
        303
      );
    }

    // Attach the session cookie
    response.cookies.set(sessionCookieName, token, {
      httpOnly: true,
      secure: useSecureCookies,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    console.log(
      `[Phone Session] Session created for user ${user.id} (${user.email || user.phone}), cookie: ${sessionCookieName}, mode: ${isJson ? "json" : "redirect"}`
    );

    return response;
  } catch (error) {
    console.error("[Phone Session API] Error:", error);

    const isJson =
      (request.headers.get("content-type") || "").includes("application/json");

    if (!isJson) {
      return NextResponse.redirect(
        new URL("/login?error=phone_session", request.url)
      );
    }

    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
