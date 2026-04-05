import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getMissingProfileFields } from "@/lib/auth-identity";
import { encode } from "next-auth/jwt";

/**
 * POST /api/auth/phone-session
 *
 * Creates a NextAuth JWT session for a phone-verified user and
 * redirects the browser to the callbackUrl.
 *
 * Accepts both JSON and form-data (so a native <form> submit works).
 */
export async function POST(request) {
  try {
    // Accept both JSON body and form-data (native form submission)
    let userId;
    let callbackUrl;

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      userId = body.userId;
      callbackUrl = body.callbackUrl;
    } else {
      // form-data or urlencoded (native form submission)
      const formData = await request.formData();
      userId = formData.get("userId");
      callbackUrl = formData.get("callbackUrl");
    }

    if (!userId) {
      // If called as a full page navigation (form submit), redirect back to login
      if (!contentType.includes("application/json")) {
        return NextResponse.redirect(
          new URL("/login?error=phone_session", request.url)
        );
      }
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
      if (!contentType.includes("application/json")) {
        return NextResponse.redirect(
          new URL("/login?error=phone_session", request.url)
        );
      }
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

    // Compute missing profile fields + generate JWT (mirrors NextAuth's jwt() callback)
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

    // Determine where to send the user
    const redirectUrl = callbackUrl || "/dashboard";

    // Build a redirect response — the browser follows this natively
    const response = NextResponse.redirect(
      new URL(redirectUrl, request.url)
    );

    // Attach the session cookie to the redirect response — using the correct name
    response.cookies.set(sessionCookieName, token, {
      httpOnly: true,
      secure: useSecureCookies,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    console.log(
      `[Phone Session] Session created for user ${user.id} (${user.email || user.phone}), cookie: ${sessionCookieName}, redirect: ${redirectUrl}`
    );

    return response;
  } catch (error) {
    console.error("[Phone Session API] Error:", error);

    // If called as a full page navigation, redirect back to login
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
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
