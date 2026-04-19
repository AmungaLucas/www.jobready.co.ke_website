import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site-config";

/**
 * GET /robots.txt
 *
 * Generates robots.txt from route handler inside (website) route group.
 * Serves at URL: /robots.txt (the (website) prefix is stripped).
 */
export async function GET() {
  const SITE_URL = siteConfig.url;

  const rules = [
    // ─── All crawlers ────────────────────────────────────────
    {
      userAgent: "*",
      disallow: [
        "/dashboard",
        "/api",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/set-password",
        "/onboarding",
        "/verify-email",
        "/verify-phone",
        "/payments",
        "/orders",
        "/billing",
        "/mpesa",
        "/search?",
      ],
    },
    // ─── Googlebot ───────────────────────────────────────────
    {
      userAgent: "Googlebot",
      allow: "/",
      disallow: ["/dashboard", "/api", "/payments", "/orders", "/billing", "/search?"],
      // Google-specific: allow crawling combo filter pages but rely on noindex
      // meta tag for empty ones (set dynamically in generateMetadata)
    },
    // ─── AI scrapers — block all ──────────────────────────────
    { userAgent: "GPTBot", disallow: "/" },
    { userAgent: "ChatGPT-User", disallow: "/" },
    { userAgent: "CCBot", disallow: "/" },
    { userAgent: "anthropic-ai", disallow: "/" },
    { userAgent: "ClaudeBot", disallow: "/" },
    { userAgent: "Claude-Web", disallow: "/" },
    // ─── Social media bots ───────────────────────────────────
    {
      userAgent: "FacebookBot",
      allow: "/",
      disallow: ["/dashboard", "/api", "/login", "/register", "/search?"],
    },
    {
      userAgent: "Twitterbot",
      allow: "/",
      disallow: ["/dashboard", "/api", "/login", "/register", "/search?"],
    },
    {
      userAgent: "LinkedInBot",
      allow: "/",
      disallow: ["/dashboard", "/api", "/login", "/register", "/search?"],
    },
    {
      userAgent: "WhatsApp",
      allow: "/",
      disallow: ["/dashboard", "/api", "/login", "/register", "/search?"],
    },
  ];

  const body = rules
    .map((rule) => {
      const { userAgent, allow, disallow } = rule;
      const lines = [`User-agent: ${userAgent}`];
      if (allow) allow.forEach((path) => lines.push(`Allow: ${path}`));
      if (disallow) disallow.forEach((path) => lines.push(`Disallow: ${path}`));
      lines.push("", "");
      return lines.join("\n");
    })
    .join("");

  const text = `${body}# Sitemap
Sitemap: ${SITE_URL}/sitemap.xml
`;

  return new NextResponse(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}
