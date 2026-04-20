import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site-config";

/**
 * Image Proxy API Route
 *
 * Fetches external images and serves them through the site's own domain.
 * This lets us use next/image optimization on ANY external image without
 * adding each host to next.config.js remotePatterns.
 *
 * Usage:
 *   GET /api/image?url=https://example.com/photo.jpg&w=400&q=80
 *
 * Features:
 *   - Validates URL (HTTPS only, image content-type only)
 *   - Streams response through (low memory, fast TTFB)
 *   - Sets aggressive cache headers (public, immutable)
 *   - Supports width/quality params for next/image loader integration
 *   - Blocks private/internal IPs (SSRF prevention)
 *   - Rate limiting via response caching (CDN-friendly)
 */

// Allowed image content types
const ALLOWED_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
  "image/svg+xml",
  "image/bmp",
  "image/tiff",
]);

// Max file size: 10MB
const MAX_SIZE = 10 * 1024 * 1024;

// Cache duration: 30 days (images rarely change)
const CACHE_MAX_AGE = 30 * 24 * 60 * 60;
const CACHE_STALE = 365 * 24 * 60 * 60; // stale-while-revalidate: 1 year

// Regex to detect private/internal IPs (SSRF prevention)
const PRIVATE_IP_REGEX = /^(127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|0\.|169\.254\.)/;

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const url = searchParams.get("url");
  const w = searchParams.get("w"); // width (passed by next/image, forwarded for CDN)
  const q = searchParams.get("q"); // quality (passed by next/image)

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  // Parse and validate the URL
  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  // Only allow HTTPS
  if (parsedUrl.protocol !== "https:") {
    return NextResponse.json({ error: "Only HTTPS URLs allowed" }, { status: 400 });
  }

  // Block private/internal IPs
  const hostname = parsedUrl.hostname.replace(/^\[|\]$/g, ""); // remove IPv6 brackets
  if (PRIVATE_IP_REGEX.test(hostname)) {
    return NextResponse.json({ error: "Private/internal IPs not allowed" }, { status: 400 });
  }

  // Only allow http(s) protocols
  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return NextResponse.json({ error: "Only HTTP(S) protocols allowed" }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

    const response = await fetch(parsedUrl.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": `JobNetBot/1.0 (Image Proxy; +${siteConfig.url})`,
        Accept: "image/*",
        // Pass width/quality for CDNs that support on-the-fly resizing
        ...(w ? { "X-Image-Width": w } : {}),
        ...(q ? { "X-Image-Quality": q } : {}),
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${response.status}` },
        { status: response.status === 404 ? 404 : 502 }
      );
    }

    const contentType = response.headers.get("content-type") || "";
    const baseContentType = contentType.split(";")[0].trim().toLowerCase();

    // Validate it's actually an image
    if (!ALLOWED_CONTENT_TYPES.has(baseContentType)) {
      return NextResponse.json(
        { error: `Invalid content type: ${baseContentType}` },
        { status: 400 }
      );
    }

    // Check content length if available
    const contentLength = parseInt(response.headers.get("content-length") || "0", 10);
    if (contentLength > MAX_SIZE) {
      return NextResponse.json({ error: "Image too large (max 10MB)" }, { status: 413 });
    }

    // For chunked responses without content-length, we need to track size
    if (!contentLength) {
      const reader = response.body.getReader();
      const chunks = [];
      let totalSize = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        totalSize += value.length;
        if (totalSize > MAX_SIZE) {
          reader.cancel();
          return NextResponse.json({ error: "Image too large (max 10MB)" }, { status: 413 });
        }
        chunks.push(value);
      }

      const body = new Uint8Array(totalSize);
      let pos = 0;
      for (const chunk of chunks) {
        body.set(chunk, pos);
        pos += chunk.length;
      }

      return new NextResponse(body, {
        status: 200,
        headers: {
          "Content-Type": baseContentType,
          "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, stale-while-revalidate=${CACHE_STALE}, immutable`,
          "X-Content-Type-Options": "nosniff",
          Vary: "Accept-Encoding",
        },
      });
    }

    // For responses with content-length, stream through
    return new NextResponse(response.body, {
      status: 200,
      headers: {
        "Content-Type": baseContentType,
        "Content-Length": contentLength.toString(),
        "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, stale-while-revalidate=${CACHE_STALE}, immutable`,
        "X-Content-Type-Options": "nosniff",
        Vary: "Accept-Encoding",
      },
    });
  } catch (error) {
    if (error.name === "AbortError") {
      return NextResponse.json({ error: "Upstream timeout" }, { status: 504 });
    }
    console.error("[Image Proxy Error]", error.message);
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 502 });
  }
}
