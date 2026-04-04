import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that require authentication (prefix match)
const protectedPrefixes = ["/dashboard"];

// Routes that are always public (exact match)
const publicRoutes = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/verify-phone",
];

// Route prefixes that are always public (no auth needed)
const publicPrefixes = [
  "/auth",
  "/jobs",
  "/job/",
  "/opportunities",
  "/career-advice",
  "/cv-services",
  "/organizations",
  "/search",
  "/api/auth",
  "/api/user",
  "/api/newsletter",
  "/api/jobs",
  "/api/opportunities",
  "/api/blog",
  "/api/companies",
  "/_next",
  "/favicon",
  "/logo",
  "/robots",
  "/sitemap",
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow public routes (exact match)
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

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
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
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
