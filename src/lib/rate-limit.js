/**
 * Rate Limiting Utilities for API Routes
 *
 * Provides two strategies:
 *
 * 1. `userIdRateLimit(session, key, limit, windowMs)` — Per-user rate limit
 *    Uses the Otp table to track request timestamps (no Redis needed).
 *    Good for authenticated endpoints like change-password, file uploads.
 *
 * 2. `ipRateLimit(request, key, limit, windowMs)` — Per-IP rate limit
 *    Also uses the Otp table. Good for unauthenticated endpoints like send-otp.
 *
 * Both return { allowed: boolean, retryAfterMs: number }.
 */

import { db } from "./db";

/**
 * Check per-user rate limit.
 * Stores a "rate_limit" purpose record in the Otp table with a JSON payload.
 *
 * @param {string} userId — the user's ID
 * @param {string} key — unique key for this rate limit (e.g. "change-password")
 * @param {number} limit — max requests in window
 * @param {number} windowMs — window in milliseconds (e.g. 15 * 60 * 1000 for 15 min)
 * @returns {{ allowed: boolean, retryAfterMs: number }}
 */
export async function userIdRateLimit(userId, key, limit, windowMs) {
  const rateKey = `rate:${key}`;
  const windowStart = new Date(Date.now() - windowMs);

  // Clean up old records for this key (fire-and-forget)
  db.otp
    .deleteMany({
      where: {
        phone: userId,
        purpose: rateKey,
        createdAt: { lt: windowStart },
      },
    })
    .catch(() => {});

  // Count recent records
  const count = await db.otp.count({
    where: {
      phone: userId,
      purpose: rateKey,
      createdAt: { gte: windowStart },
    },
  });

  if (count >= limit) {
    // Find the oldest record to calculate retry-after
    const oldest = await db.otp.findFirst({
      where: {
        phone: userId,
        purpose: rateKey,
        createdAt: { gte: windowStart },
      },
      orderBy: { createdAt: "asc" },
    });

    const retryAfterMs = oldest
      ? windowMs - (Date.now() - oldest.createdAt.getTime())
      : windowMs;

    return { allowed: false, retryAfterMs: Math.max(retryAfterMs, 1000) };
  }

  // Record this request
  await db.otp.create({
    data: {
      phone: userId,
      code: "1",
      purpose: rateKey,
      verified: true, // mark as consumed so OTP cleanup doesn't target it
      expiresAt: new Date(Date.now() + windowMs),
    },
  });

  return { allowed: true, retryAfterMs: 0 };
}

/**
 * Check per-IP rate limit.
 * Uses the Otp table with the IP as the "phone" field.
 *
 * @param {Request} request — Next.js Request object
 * @param {string} key — unique key for this rate limit
 * @param {number} limit — max requests in window
 * @param {number} windowMs — window in milliseconds
 * @returns {{ allowed: boolean, retryAfterMs: number }}
 */
export async function ipRateLimit(request, key, limit, windowMs) {
  const ip = getClientIp(request);
  if (!ip) {
    // If we can't determine IP, allow the request (don't block legitimate traffic)
    return { allowed: true, retryAfterMs: 0 };
  }

  const rateKey = `ip_rate:${key}`;
  const windowStart = new Date(Date.now() - windowMs);

  // Clean up old records
  db.otp
    .deleteMany({
      where: {
        phone: ip,
        purpose: rateKey,
        createdAt: { lt: windowStart },
      },
    })
    .catch(() => {});

  const count = await db.otp.count({
    where: {
      phone: ip,
      purpose: rateKey,
      createdAt: { gte: windowStart },
    },
  });

  if (count >= limit) {
    const oldest = await db.otp.findFirst({
      where: {
        phone: ip,
        purpose: rateKey,
        createdAt: { gte: windowStart },
      },
      orderBy: { createdAt: "asc" },
    });

    const retryAfterMs = oldest
      ? windowMs - (Date.now() - oldest.createdAt.getTime())
      : windowMs;

    return { allowed: false, retryAfterMs: Math.max(retryAfterMs, 1000) };
  }

  await db.otp.create({
    data: {
      phone: ip,
      code: "1",
      purpose: rateKey,
      verified: true,
      expiresAt: new Date(Date.now() + windowMs),
    },
  });

  return { allowed: true, retryAfterMs: 0 };
}

/**
 * Track failed OTP attempts. After MAX_FAILED_ATTEMPTS, invalidate all OTPs
 * for that identifier.
 *
 * @param {string} identifier — phone number or email
 * @param {string} purpose — OTP purpose (e.g. "auth", "email_link", "email_verify")
 * @param {number} maxAttempts — max failed attempts before lockout (default: 5)
 * @returns {{ allowed: boolean, attemptsRemaining: number, lockedUntil: Date|null }}
 */
export async function checkOtpAttempts(identifier, purpose, maxAttempts = 5) {
  const failKey = `otp_fail:${purpose}`;

  // Count recent failures
  const windowStart = new Date(Date.now() - 30 * 60 * 1000); // 30 min window
  const failures = await db.otp.count({
    where: {
      phone: identifier,
      purpose: failKey,
      createdAt: { gte: windowStart },
    },
  });

  if (failures >= maxAttempts) {
    // Lock out for 30 minutes
    const oldest = await db.otp.findFirst({
      where: {
        phone: identifier,
        purpose: failKey,
        createdAt: { gte: windowStart },
      },
      orderBy: { createdAt: "asc" },
    });

    const lockedUntil = oldest
      ? new Date(oldest.createdAt.getTime() + 30 * 60 * 1000)
      : new Date(Date.now() + 30 * 60 * 1000);

    return {
      allowed: false,
      attemptsRemaining: 0,
      lockedUntil,
    };
  }

  return {
    allowed: true,
    attemptsRemaining: maxAttempts - failures,
    lockedUntil: null,
  };
}

/**
 * Record a failed OTP attempt.
 * @param {string} identifier — phone or email
 * @param {string} purpose — OTP purpose
 */
export async function recordOtpFailure(identifier, purpose) {
  const failKey = `otp_fail:${purpose}`;
  await db.otp.create({
    data: {
      phone: identifier,
      code: "FAIL",
      purpose: failKey,
      verified: true,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    },
  });
}

/**
 * Clear failed OTP attempts after a successful verification.
 * @param {string} identifier — phone or email
 * @param {string} purpose — OTP purpose
 */
export async function clearOtpFailures(identifier, purpose) {
  const failKey = `otp_fail:${purpose}`;
  await db.otp.deleteMany({
    where: { phone: identifier, purpose: failKey },
  });
}

/**
 * Extract client IP from request headers.
 * @param {Request} request
 * @returns {string|null}
 */
export function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return null;
}
