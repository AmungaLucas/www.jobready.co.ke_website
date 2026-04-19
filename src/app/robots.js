import { siteConfig } from "@/config/site-config";

export default function robots() {
  return {
    rules: [
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
          "/search?", // Prevent indexing of search result pages (they have no unique content)
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/dashboard", "/api", "/payments", "/orders", "/billing", "/search?"],
        // Google-specific: allow crawling combo filter pages but rely on noindex meta tag
        // for empty ones (set dynamically in generateMetadata)
      },
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "ChatGPT-User",
        disallow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "anthropic-ai",
        disallow: "/",
      },
      {
        userAgent: "ClaudeBot",
        disallow: "/",
      },
      {
        userAgent: "Claude-Web",
        disallow: "/",
      },
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
    ],
    // Point to sitemap index which references all sub-sitemaps
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
