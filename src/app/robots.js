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
          "/verify-email",
          "/verify-phone",
          "/payments",
          "/orders",
          "/billing",
          "/mpesa",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/dashboard", "/api", "/payments", "/orders", "/billing"],
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
        disallow: ["/dashboard", "/api", "/login", "/register"],
      },
      {
        userAgent: "Twitterbot",
        allow: "/",
        disallow: ["/dashboard", "/api", "/login", "/register"],
      },
      {
        userAgent: "LinkedInBot",
        allow: "/",
        disallow: ["/dashboard", "/api", "/login", "/register"],
      },
      {
        userAgent: "WhatsApp",
        allow: "/",
        disallow: ["/dashboard", "/api", "/login", "/register"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
