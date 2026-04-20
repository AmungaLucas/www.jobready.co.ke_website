import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
  {
    key: "Content-Security-Policy",
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; frame-src https://www.google.com https://accounts.google.com; connect-src 'self' https://*.googleapis.com https://api.mpesa.com https://sandbox.safaricom.co.ke;",
  },
  {
    key: "X-Request-ID",
    value: "true",
  },
];

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,

  // Tree-shake heavy icon/utility libraries to only import used members
  experimental: {
    optimizePackageImports: [
      "react-icons",
      "lucide-react",
      "date-fns",
      "framer-motion",
    ],
  },

  // Security headers for all routes
  async headers() {
    const siteDomain = process.env.NEXT_PUBLIC_SITE_DOMAIN || "jobnet.co.ke";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${siteDomain}`;
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // More permissive headers for API routes (needed for callbacks)
        source: "/api/(.*)",
        headers: [
          ...securityHeaders,
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.MPESA_CALLBACK_URL || siteUrl,
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,DELETE,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, X-Requested-With",
          },
        ],
      },
    ];
  },

  // Performance: compress responses
  compress: true,

  // Image optimization
  // All external images now go through /api/image proxy → next/image only sees our own domain.
  // Domain is read from NEXT_PUBLIC_SITE_DOMAIN to support one-click domain switching.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_SITE_DOMAIN || "jobnet.co.ke",
      },
    ],
    formats: ["image/avif", "image/webp"],
    // Cache optimized images at edge for 1 hour (default was 60s)
    // The /api/image proxy adds its own long Cache-Control headers for the source images
    minimumCacheTTL: 3600,
  },

  // Powered-by header removal
  poweredByHeader: false,
};

export default nextConfig;
