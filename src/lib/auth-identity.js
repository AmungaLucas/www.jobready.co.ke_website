import { db } from "@/lib/db";

// ============================================================
// auth-identity.js — Simplified Identity Resolution
// ============================================================
// Replaces account-merge.js. Uses direct fields on the User table
// (email, phone, googleId) as identity anchors instead of the
// AuthAccount join table for lookups.
//
// Design principles:
//   1. email, phone, googleId are UNIQUE identity anchors
//   2. Never create a user if email or phone already exists
//   3. Always verify before linking (password, OTP, or session)
//   4. Providers are access methods, not separate accounts
//
// All significant actions are logged with [AuthIdentity] prefix.
// ============================================================

const PLACEHOLDER_DOMAIN = "jobready.co.ke";

// ---------------------------------------------------------------------------
// 1. normalizePhone(phone)
// ---------------------------------------------------------------------------

/**
 * Normalize a Kenyan phone number to E.164 format: 2547XXXXXXXX
 *
 * Handles: +2547XX, 07XX, 7XX, spaces/dashes, already E.164.
 * Returns the normalized string or null if invalid.
 */
export function normalizePhone(phone) {
  if (!phone || typeof phone !== "string") return null;

  const digits = phone.replace(/[^\d]/g, "");

  if (digits.length === 10 && digits.startsWith("0")) {
    return `254${digits.substring(1)}`;
  }
  if (digits.length === 12 && digits.startsWith("254")) {
    return digits;
  }
  if (digits.length === 9 && digits.startsWith("7")) {
    return `254${digits}`;
  }

  console.warn(
    `[AuthIdentity] normalizePhone: unrecognised format "${phone}" → digits="${digits}" (${digits.length})`
  );
  return null;
}

// ---------------------------------------------------------------------------
// 2. findUserByEmail(email)
// ---------------------------------------------------------------------------

/**
 * Find user by email (case-insensitive).
 * Returns user object or null.
 */
export async function findUserByEmail(email) {
  if (!email) return null;
  const normalized = email.toLowerCase().trim();
  return db.user.findUnique({ where: { email: normalized } });
}

// ---------------------------------------------------------------------------
// 3. findUserByPhone(phone)
// ---------------------------------------------------------------------------

/**
 * Find user by normalized phone.
 * Searches both 2547XX and 07XX formats to handle legacy data.
 * Returns user object or null.
 */
export async function findUserByPhone(phone) {
  if (!phone) return null;
  const normalized = normalizePhone(phone);
  if (!normalized) return null;

  // Try E.164 format first (canonical)
  const user = await db.user.findUnique({ where: { phone: normalized } });
  if (user) return user;

  // Fallback: try 07XX format for legacy data that wasn't normalized
  if (normalized.length === 12 && normalized.startsWith("254")) {
    const local = `0${normalized.substring(3)}`;
    return db.user.findUnique({ where: { phone: local } });
  }

  return null;
}

// ---------------------------------------------------------------------------
// 4. findUserByGoogleId(googleId)
// ---------------------------------------------------------------------------

/**
 * Find user by Google sub ID.
 * Returns user object or null.
 */
export async function findUserByGoogleId(googleId) {
  if (!googleId) return null;
  return db.user.findUnique({ where: { googleId } });
}

// ---------------------------------------------------------------------------
// 5. findUserByIdentifier({ email, phone, googleId })
// ---------------------------------------------------------------------------

/**
 * Universal lookup — tries all provided identifiers.
 * Returns { user, matchedBy } where matchedBy is "email"|"phone"|"googleId"|null.
 * matchedBy tells you WHICH identifier matched (important for linking logic).
 */
export async function findUserByIdentifier({ email, phone, googleId }) {
  // Priority: googleId > email > phone (googleId is most specific)
  if (googleId) {
    const user = await findUserByGoogleId(googleId);
    if (user) return { user, matchedBy: "googleId" };
  }

  if (email) {
    const normalized = email.toLowerCase().trim();
    if (!isPlaceholderEmail(normalized)) {
      const user = await findUserByEmail(normalized);
      if (user) return { user, matchedBy: "email" };
    }
  }

  if (phone) {
    const user = await findUserByPhone(phone);
    if (user) return { user, matchedBy: "phone" };
  }

  return { user: null, matchedBy: null };
}

// ---------------------------------------------------------------------------
// 6. createUser({ email, phone, name, passwordHash, googleId, ... })
// ---------------------------------------------------------------------------

/**
 * Create a new user with the given fields.
 * For phone-only users: email is auto-generated as phone_254XXX@jobready.co.ke.
 * Returns the created user.
 * Throws if email or phone already exists (P2002).
 */
export async function createUser({
  email,
  phone,
  name,
  passwordHash,
  googleId,
  emailVerified = false,
  phoneVerified = false,
}) {
  const normalizedPhone = normalizePhone(phone) || null;
  const normalizedEmail = email ? email.toLowerCase().trim() : null;

  // Auto-generate placeholder email for phone-only users
  const finalEmail = normalizedEmail || (normalizedPhone ? placeholderEmail(normalizedPhone) : null);
  if (!finalEmail) {
    throw new Error("[AuthIdentity] createUser: email or phone is required");
  }

  const finalName = name && name.trim().length > 0 ? name.trim() : "Phone User";

  console.log(
    `[AuthIdentity] createUser: email=${finalEmail}, phone=${normalizedPhone}, googleId=${googleId ? "yes" : "no"}`
  );

  return db.user.create({
    data: {
      email: finalEmail,
      phone: normalizedPhone,
      name: finalName,
      passwordHash: passwordHash || null,
      googleId: googleId || null,
      emailVerified,
      phoneVerified,
      lastLoginAt: new Date(),
    },
  });
}

// ---------------------------------------------------------------------------
// 7. linkGoogleToUser(userId, googleId)
// ---------------------------------------------------------------------------

/**
 * Set googleId on an existing user (after ownership verification).
 * Returns updated user.
 * Throws if googleId already belongs to another user.
 */
export async function linkGoogleToUser(userId, googleId) {
  if (!userId || !googleId) {
    throw new Error("[AuthIdentity] linkGoogleToUser: userId and googleId are required");
  }

  // Check if googleId is already taken by another user
  const existing = await db.user.findUnique({ where: { googleId } });
  if (existing && existing.id !== userId) {
    throw new Error(
      `[AuthIdentity] linkGoogleToUser: googleId "${googleId}" already belongs to user ${existing.id}`
    );
  }

  console.log(`[AuthIdentity] linkGoogleToUser: linking googleId to user ${userId}`);
  return db.user.update({
    where: { id: userId },
    data: { googleId, emailVerified: true },
  });
}

// ---------------------------------------------------------------------------
// 8. setUserPassword(userId, passwordHash)
// ---------------------------------------------------------------------------

/**
 * Set password on an existing user (e.g. Google→Email linking).
 * Returns updated user.
 */
export async function setUserPassword(userId, passwordHash) {
  if (!userId || !passwordHash) {
    throw new Error("[AuthIdentity] setUserPassword: userId and passwordHash are required");
  }

  console.log(`[AuthIdentity] setUserPassword: setting password for user ${userId}`);
  return db.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
}

// ---------------------------------------------------------------------------
// 9. linkPhoneToUser(userId, phone)
// ---------------------------------------------------------------------------

/**
 * Set phone + phoneVerified on an existing user.
 * Returns updated user.
 * Throws if phone already belongs to another user.
 */
export async function linkPhoneToUser(userId, phone) {
  const normalized = normalizePhone(phone);
  if (!normalized) {
    throw new Error(`[AuthIdentity] linkPhoneToUser: invalid phone format "${phone}"`);
  }

  // Check if phone is already taken by another user
  const existing = await findUserByPhone(normalized);
  if (existing && existing.id !== userId) {
    throw new Error(
      `[AuthIdentity] linkPhoneToUser: phone "${normalized}" already belongs to user ${existing.id}`
    );
  }

  console.log(`[AuthIdentity] linkPhoneToUser: linking phone ${normalized} to user ${userId}`);
  return db.user.update({
    where: { id: userId },
    data: { phone: normalized, phoneVerified: true },
  });
}

// ---------------------------------------------------------------------------
// 10. linkEmailToUser(userId, email)
// ---------------------------------------------------------------------------

/**
 * Set email + emailVerified on an existing user (replacing placeholder).
 * Returns updated user.
 * Throws if email already belongs to another user.
 */
export async function linkEmailToUser(userId, email) {
  if (!userId || !email) {
    throw new Error("[AuthIdentity] linkEmailToUser: userId and email are required");
  }

  const normalized = email.toLowerCase().trim();

  // Check if email is already taken by another user
  const existing = await db.user.findUnique({ where: { email: normalized } });
  if (existing && existing.id !== userId) {
    throw new Error(
      `[AuthIdentity] linkEmailToUser: email "${normalized}" already belongs to user ${existing.id}`
    );
  }

  console.log(`[AuthIdentity] linkEmailToUser: linking email ${normalized} to user ${userId}`);
  return db.user.update({
    where: { id: userId },
    data: { email: normalized, emailVerified: true },
  });
}

// ---------------------------------------------------------------------------
// 11. getMissingProfileFields(user)
// ---------------------------------------------------------------------------

/**
 * Returns { needsName, needsEmail, needsPhone, needsPassword, isComplete }.
 */
export function getMissingProfileFields(user) {
  const needsName =
    !user.name ||
    user.name.trim().length === 0 ||
    user.name.trim() === "Phone User";

  const needsEmail = !user.email || isPlaceholderEmail(user.email);

  const needsPhone = !user.phone;

  // Support both passwordHash (Prisma model) and hasPassword (NextAuth user stub)
  const hasPassword = !!(user.passwordHash || user.hasPassword);
  const needsPassword = !hasPassword;

  const isComplete = !needsName && !needsEmail && !needsPhone && !needsPassword;

  return { needsName, needsEmail, needsPhone, needsPassword, isComplete };
}

// ---------------------------------------------------------------------------
// 12. migrateExistingGoogleUsers()
// ---------------------------------------------------------------------------

/**
 * ONE-TIME migration: Copy googleId from AuthAccount to User table.
 * For existing users who have AuthAccount(provider="google", providerAccountId=google_sub).
 * Should be called once during deployment.
 * Returns { migrated: number, errors: number }.
 */
export async function migrateExistingGoogleUsers() {
  console.log("[AuthIdentity] migrateExistingGoogleUsers: starting migration");

  let migrated = 0;
  let errors = 0;

  // Find all Google auth accounts
  const googleAccounts = await db.authAccount.findMany({
    where: { provider: "google" },
    include: { user: true },
  });

  console.log(
    `[AuthIdentity] found ${googleAccounts.length} Google auth accounts to process`
  );

  for (const account of googleAccounts) {
    if (!account.userId || !account.user) {
      console.warn(
        `[AuthIdentity]   skipping auth account ${account.id} — no linked user`
      );
      continue;
    }

    const user = account.user;

    // Skip if user already has googleId set
    if (user.googleId) {
      console.log(
        `[AuthIdentity]   skip user ${user.id} — googleId already set (${user.googleId})`
      );
      continue;
    }

    // Check if this googleId is already claimed by another user
    const existing = await db.user.findUnique({
      where: { googleId: account.providerAccountId },
    });

    if (existing && existing.id !== user.id) {
      console.warn(
        `[AuthIdentity]   skip user ${user.id} — googleId "${account.providerAccountId}" already belongs to user ${existing.id}`
      );
      errors++;
      continue;
    }

    try {
      await db.user.update({
        where: { id: user.id },
        data: { googleId: account.providerAccountId },
      });
      migrated++;
      console.log(
        `[AuthIdentity]   migrated googleId "${account.providerAccountId}" → user ${user.id} (${user.email})`
      );
    } catch (err) {
      console.error(
        `[AuthIdentity]   error migrating googleId for user ${user.id}:`,
        err
      );
      errors++;
    }
  }

  console.log(
    `[AuthIdentity] migrateExistingGoogleUsers: complete — migrated=${migrated}, errors=${errors}`
  );

  return { migrated, errors };
}

// ---------------------------------------------------------------------------
// 13. isPlaceholderEmail(email)
// ---------------------------------------------------------------------------

/**
 * Returns true if email looks like auto-generated: phone_XXX@jobready.co.ke
 */
export function isPlaceholderEmail(email) {
  if (!email) return false;
  return (
    email.includes("@phone.jobready.co.ke") ||
    email.includes(`@${PLACEHOLDER_DOMAIN}`)
  );
}

// ---------------------------------------------------------------------------
// 14. placeholderEmail(phone)
// ---------------------------------------------------------------------------

/**
 * Generate: phone_2547XXXXXXXX@jobready.co.ke
 */
export function placeholderEmail(phone) {
  return `phone_${phone}@${PLACEHOLDER_DOMAIN}`;
}

// ---------------------------------------------------------------------------
// 15. linkWalkInOrders(userId, email, phone)
// ---------------------------------------------------------------------------

/**
 * Attach orphan orders (userId IS NULL) that share the same email or phone.
 * Returns the count of orders linked.
 */
export async function linkWalkInOrders(userId, email, phone) {
  if (!userId) return 0;

  const conditions = [];
  if (email && !isPlaceholderEmail(email)) {
    conditions.push({ email: email.toLowerCase().trim() });
  }
  if (phone) {
    conditions.push({ phone });

    // Also search common un-normalized formats for existing orders
    if (phone.startsWith("254") && phone.length === 12) {
      conditions.push({ phone: `0${phone.substring(3)}` });
      conditions.push({ phone: `+${phone}` });
    } else if (phone.startsWith("0") && phone.length === 10) {
      conditions.push({ phone: `254${phone.substring(1)}` });
      conditions.push({ phone: `+${phone}` });
    }
  }

  if (conditions.length === 0) return 0;

  try {
    const result = await db.order.updateMany({
      where: { userId: null, OR: conditions },
      data: { userId },
    });

    if (result.count > 0) {
      console.log(
        `[AuthIdentity] linkWalkInOrders: linked ${result.count} walk-in order(s) to user ${userId}`
      );
    }

    return result.count;
  } catch (error) {
    console.error("[AuthIdentity] linkWalkInOrders error:", error);
    return 0;
  }
}
