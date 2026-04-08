/**
 * Simple in-memory rate limiter for Next.js API routes.
 *
 * No external dependencies — uses a Map with automatic cleanup.
 * For production with multiple server instances, consider using
 * @upstash/ratelimit (Redis-backed) instead.
 *
 * Usage:
 *   import { rateLimit } from "@/lib/rate-limit";
 *   const limited = rateLimit({ max: 5, windowMs: 60_000 }); // 5 per minute
 *   const { success, remaining, resetAt } = limited(identifier);
 *   if (!success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
 */

const store = new Map();
let cleanupTimer = null;

/**
 * Create a rate limiter instance
 * @param {Object} options
 * @param {number} options.max - Max requests in the window
 * @param {number} options.windowMs - Window duration in milliseconds
 * @returns {{ (identifier: string): { success: boolean, remaining: number, resetAt: number } }}
 */
export function rateLimit({ max, windowMs }) {
  return function check(identifier) {
    const now = Date.now();

    // Get or create bucket
    let bucket = store.get(identifier);

    // Reset if window expired or doesn't exist
    if (!bucket || now > bucket.resetAt) {
      bucket = {
        count: 0,
        resetAt: now + windowMs,
      };
      store.set(identifier, bucket);
    }

    // Increment
    bucket.count += 1;

    const remaining = Math.max(0, max - bucket.count);
    const success = bucket.count <= max;

    // Schedule cleanup of expired entries (run once)
    scheduleCleanup(windowMs);

    return {
      success,
      remaining,
      resetAt: bucket.resetAt,
      limit: max,
    };
  };
}

/**
 * Rate limit presets for common endpoints
 */
export const presets = {
  // Auth endpoints — stricter (prevent brute force)
  register: rateLimit({ max: 5, windowMs: 60_000 }),       // 5 per minute
  forgotPassword: rateLimit({ max: 3, windowMs: 60_000 }),  // 3 per minute
  resetPassword: rateLimit({ max: 3, windowMs: 60_000 }),   // 3 per minute
  login: rateLimit({ max: 10, windowMs: 60_000 }),          // 10 per minute

  // Form submissions
  contact: rateLimit({ max: 3, windowMs: 60_000 }),         // 3 per minute
  newsletter: rateLimit({ max: 5, windowMs: 60_000 }),      // 5 per minute

  // Job actions (authenticated but still rate-limited)
  applyJob: rateLimit({ max: 10, windowMs: 60_000 }),       // 10 per minute
  sendOtp: rateLimit({ max: 1, windowMs: 60_000 }),         // 1 per minute (handled in route)
};

/**
 * Extract client IP from request
 * Works behind proxies (Vercel, Cloudflare, Nginx, Caddy)
 */
export function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

/**
 * Standard 429 rate limit response
 */
export function rateLimitResponse(limit, resetAt) {
  const secondsUntilReset = Math.ceil((resetAt - Date.now()) / 1000);
  return {
    status: 429,
    headers: {
      "Retry-After": String(secondsUntilReset),
    },
    body: {
      error: "Too many requests. Please slow down and try again.",
      retryAfter: secondsUntilReset,
      limit,
    },
  };
}

// ─── Cleanup ────────────────────────────────────────────────────────

function scheduleCleanup(windowMs) {
  if (cleanupTimer) return;
  // Run cleanup after 2x the largest window (safe margin)
  cleanupTimer = setTimeout(() => {
    const now = Date.now();
    for (const [key, bucket] of store) {
      if (now > bucket.resetAt) {
        store.delete(key);
      }
    }
    cleanupTimer = null;
  }, windowMs * 2);
}
