import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that require authentication (prefix match)
const protectedPrefixes = ["/dashboard"];

// Route prefixes that are always public (no auth needed)
const publicPrefixes = [
  "/auth",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/set-password",
  "/onboarding",
  "/verify-email",
  "/verify-phone",
  "/jobs",
  "/job/",
  "/opportunities",
  "/career-advice",
  "/cv-services",
  "/organizations",
  "/search",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/cookies",
  "/disclaimer",
  "/refunds",
  "/data-protection",
  "/api/", // ALL API routes are public (auth checked per-route)
  "/_next",
  "/favicon",
  "/logo",
  "/robots",
  "/sitemap",
  "/manifest",
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow routes with public prefixes
  if (publicPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Allow static files and assets
  if (
    pathname.startsWith("/_next/static") ||
    pathname.startsWith("/_next/image") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/uploads") ||
    pathname.startsWith("/static")
  ) {
    return NextResponse.next();
  }

  // Check if this is a protected route
  const isProtectedRoute = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );

  if (isProtectedRoute) {
    // Get JWT token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // If no token, redirect to login with callback URL
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // ──────────────────────────────────────────────────────────────
    // Onboarding gate: force new Google/phone-only users who haven't
    // set a password to visit /onboarding before accessing dashboard.
    // ──────────────────────────────────────────────────────────────
    const missing = token.missingFields;
    if (
      missing?.needsPassword &&
      !missing?.needsName &&
      !missing?.needsEmail
    ) {
      // User has name + email (fresh Google sign-up) but no password →
      // redirect to onboarding (unless they're already there).
      if (pathname !== "/onboarding") {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }
    }

    // User is authenticated, allow access
    return NextResponse.next();
  }

  // For any other routes, allow by default
  return NextResponse.next();
}

export const config = {
  // Run middleware on all routes except static files and _next internals
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)",
  ],
};
