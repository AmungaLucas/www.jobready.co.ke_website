import { db } from "@/lib/db";

// ============================================================
// account-merge.js — Unified account merge / link logic
// ============================================================
// Handles identity resolution across 3 auth entry points:
//   1. Phone OTP   (send-otp → verify-otp)
//   2. Google OAuth (NextAuth signIn callback)
//   3. Email+Password (register → credentials login)
//
// All write operations use Prisma transactions.
// Every significant action is logged with [AccountMerge] prefix.
// ============================================================

// ---------------------------------------------------------------------------
// Placeholder domain used for phone-only accounts
// ---------------------------------------------------------------------------
const PLACEHOLDER_DOMAIN = "jobready.co.ke";

/**
 * Build the placeholder email for a phone-only user.
 * Format: phone_2547XXXXXXXX@jobready.co.ke
 */
function placeholderEmail(phone) {
  return `phone_${phone}@${PLACEHOLDER_DOMAIN}`;
}

/**
 * Returns true when an email looks like a generated placeholder.
 */
function isPlaceholderEmail(email) {
  if (!email) return false;
  return (
    email.includes("@phone.jobready.co.ke") ||
    email.includes(`@${PLACEHOLDER_DOMAIN}`)
  );
}

// ===========================================================================
// 1. normalizePhone(phone)
// ===========================================================================

/**
 * Normalize a Kenyan phone number to E.164 format: 2547XXXXXXXX
 *
 * Handles:
 *   - Leading +      → "+254712345678"
 *   - Leading 0      → "0712345678"
 *   - Spaces/dashes  → "0712 345 678"
 *   - Already E.164  → "254712345678"
 *
 * Returns the normalized string or null if the input is falsy / invalid.
 */
export function normalizePhone(phone) {
  if (!phone || typeof phone !== "string") return null;

  // Strip everything that isn't a digit
  const digits = phone.replace(/[^\d]/g, "");

  // Must be 10 (07XX...) or 12 (2547XX...) digits
  if (digits.length === 10 && digits.startsWith("0")) {
    return `254${digits.substring(1)}`;
  }

  if (digits.length === 12 && digits.startsWith("254")) {
    return digits;
  }

  // If it's 9 digits starting with 7, prepend 254
  if (digits.length === 9 && digits.startsWith("7")) {
    return `254${digits}`;
  }

  // Return null for unrecognised formats — caller should decide what to do
  console.warn(
    `[AccountMerge] normalizePhone: unrecognised format "${phone}" → digits="${digits}" (${digits.length})`
  );
  return null;
}

// ===========================================================================
// 2. getMissingProfileFields(user)
// ===========================================================================

/**
 * Inspect a user object and return which fields are missing / incomplete
 * for the "Complete Profile" popup.
 */
export function getMissingProfileFields(user) {
  const needsName =
    !user.name ||
    user.name.trim().length === 0 ||
    user.name.trim() === "Phone User";

  const needsEmail =
    !user.email || isPlaceholderEmail(user.email);

  const needsPhone = !user.phone;

  const needsPassword = !user.passwordHash;

  const isComplete =
    !needsName && !needsEmail && !needsPhone && !needsPassword;

  return {
    needsName,
    needsEmail,
    needsPhone,
    needsPassword,
    emailVerified: !user.emailVerified,
    phoneVerified: !user.phoneVerified,
    isComplete,
  };
}

// ===========================================================================
// 3. linkWalkInOrders(userId, email, phone)
// ===========================================================================

/**
 * After a user is found or created, attach any "walk-in" orders that were
 * placed without an account (userId IS NULL) but share the same email or phone.
 *
 * Returns the count of orders that were linked.
 */
export async function linkWalkInOrders(userId, email, phone) {
  if (!userId) return 0;

  const conditions = [];
  if (email && !isPlaceholderEmail(email)) {
    conditions.push({ email: email.toLowerCase().trim() });
  }
  if (phone) {
    // Search normalized phone (2547XXXXXXXX)
    conditions.push({ phone });

    // Also search common un-normalized formats for existing orders
    // e.g. 07XXXXXXXX, +2547XXXXXXXX
    if (phone.startsWith("254") && phone.length === 12) {
      conditions.push({ phone: `0${phone.substring(3)}` }); // 07XX...
      conditions.push({ phone: `+${phone}` });           // +2547XX...
    } else if (phone.startsWith("0") && phone.length === 10) {
      conditions.push({ phone: `254${phone.substring(1)}` }); // 2547XX...
      conditions.push({ phone: `+${phone}` });              // +07XX...
    }
  }

  if (conditions.length === 0) return 0;

  try {
    // Link orders with no user (walk-in orders)
    const result = await db.order.updateMany({
      where: {
        userId: null,
        OR: conditions,
      },
      data: { userId },
    });

    if (result.count > 0) {
      console.log(
        `[AccountMerge] linkWalkInOrders: linked ${result.count} walk-in order(s) to user ${userId}`
      );
    }

    return result.count;
  } catch (error) {
    console.error("[AccountMerge] linkWalkInOrders error:", error);
    return 0;
  }
}

// ===========================================================================
// 4. mergeUsers(olderUser, newerUser)
// ===========================================================================

/**
 * Merge `newerUser` into `olderUser` (the one with the earlier createdAt).
 *
 * Data moved:
 *   - authAccounts   (reassign userId; skip on providerAccountId conflict)
 *   - orders          (reassign userId)
 *   - savedJobs       (reassign; skip on unique-constraint conflict)
 *   - savedArticles   (reassign; skip on unique-constraint conflict)
 *   - jobAlerts       (reassign)
 *   - notifications   (reassign)
 *   - reactions       (reassign userId; skip on unique-constraint conflict)
 *   - applications    (reassign; skip on unique-constraint conflict)
 *   - newsletterSubs  (reassign userId; skip on email conflict)
 *   - company         (transfer ownership if older has none)
 *
 * After all data is moved, the newer user is deleted (cascading relations
 * that were NOT moved will be cleaned up by the DB cascade).
 *
 * Must be called inside a Prisma transaction (or we create one internally).
 *
 * @returns {Object} { merged: true, olderUserId, newerUserId, movedCounts }
 */
export async function mergeUsers(olderUser, newerUser) {
  if (!olderUser || !newerUser) {
    throw new Error("[AccountMerge] mergeUsers requires both olderUser and newerUser");
  }

  if (olderUser.id === newerUser.id) {
    console.log("[AccountMerge] mergeUsers: same user ID — nothing to merge");
    return { merged: false, reason: "same_user" };
  }

  // Ensure older is actually older
  let older = olderUser;
  let newer = newerUser;
  if (newer.createdAt < older.createdAt) {
    [older, newer] = [newer, older];
  }

  const movedCounts = {
    authAccounts: 0,
    orders: 0,
    savedJobs: 0,
    savedArticles: 0,
    jobAlerts: 0,
    notifications: 0,
    reactions: 0,
    applications: 0,
    newsletterSubs: 0,
    company: false,
  };

  console.log(
    `[AccountMerge] mergeUsers: merging newer user (${newer.id}, created ${newer.createdAt.toISOString()}) into older user (${older.id}, created ${older.createdAt.toISOString()})`
  );

  await db.$transaction(async (tx) => {
    // ------------------------------------------------------------------
    // 4a. AuthAccounts — move to older, skip on providerAccountId clash
    // ------------------------------------------------------------------
    const newerAuthAccounts = await tx.authAccount.findMany({
      where: { userId: newer.id },
    });

    for (const acct of newerAuthAccounts) {
      // Check if older user already has an account with the same providerAccountId
      const existing = await tx.authAccount.findUnique({
        where: { providerAccountId: acct.providerAccountId },
      });

      if (existing && existing.userId === older.id) {
        console.log(
          `[AccountMerge]   skip authAccount "${acct.provider}" / "${acct.providerAccountId}" — already linked to older user`
        );
        continue;
      }

      if (existing && existing.userId !== older.id) {
        console.warn(
          `[AccountMerge]   skip authAccount "${acct.provider}" / "${acct.providerAccountId}" — providerAccountId belongs to a third user (${existing.userId})`
        );
        continue;
      }

      // Also check if the same provider type already exists on older user
      // (e.g. older already has a "google" auth, and newer also has "google")
      // We can still have multiple auth accounts for the same provider if providerAccountId differs
      // (e.g. different Google accounts), but for the same providerAccountId we skip.

      await tx.authAccount.update({
        where: { id: acct.id },
        data: { userId: older.id },
      });
      movedCounts.authAccounts += 1;
    }

    // ------------------------------------------------------------------
    // 4b. Orders — reassign (no unique constraint on userId, safe to bulk)
    // ------------------------------------------------------------------
    const orderResult = await tx.order.updateMany({
      where: { userId: newer.id },
      data: { userId: older.id },
    });
    movedCounts.orders = orderResult.count;

    // ------------------------------------------------------------------
    // 4c. SavedJobs — unique on [userId, jobId], handle conflicts
    // ------------------------------------------------------------------
    const newerSavedJobs = await tx.savedJob.findMany({
      where: { userId: newer.id },
    });

    for (const sj of newerSavedJobs) {
      const conflict = await tx.savedJob.findUnique({
        where: { userId_jobId: { userId: older.id, jobId: sj.jobId } },
      });

      if (conflict) {
        // Older user already saved this job — delete the duplicate
        await tx.savedJob.delete({ where: { id: sj.id } });
        continue;
      }

      await tx.savedJob.update({
        where: { id: sj.id },
        data: { userId: older.id },
      });
      movedCounts.savedJobs += 1;
    }

    // ------------------------------------------------------------------
    // 4d. SavedArticles — unique on [userId, articleId]
    // ------------------------------------------------------------------
    const newerSavedArticles = await tx.savedArticle.findMany({
      where: { userId: newer.id },
    });

    for (const sa of newerSavedArticles) {
      const conflict = await tx.savedArticle.findUnique({
        where: { userId_articleId: { userId: older.id, articleId: sa.articleId } },
      });

      if (conflict) {
        await tx.savedArticle.delete({ where: { id: sa.id } });
        continue;
      }

      await tx.savedArticle.update({
        where: { id: sa.id },
        data: { userId: older.id },
      });
      movedCounts.savedArticles += 1;
    }

    // ------------------------------------------------------------------
    // 4e. JobAlerts — no composite unique, safe to bulk
    // ------------------------------------------------------------------
    const alertResult = await tx.jobAlert.updateMany({
      where: { userId: newer.id },
      data: { userId: older.id },
    });
    movedCounts.jobAlerts = alertResult.count;

    // ------------------------------------------------------------------
    // 4f. Notifications — no composite unique, safe to bulk
    // ------------------------------------------------------------------
    const notifResult = await tx.notification.updateMany({
      where: { userId: newer.id },
      data: { userId: older.id },
    });
    movedCounts.notifications = notifResult.count;

    // ------------------------------------------------------------------
    // 4g. ArticleReactions — unique on [articleId, fingerprint, reactionType]
    //     Reassign userId but keep fingerprint intact; skip on conflict.
    // ------------------------------------------------------------------
    const newerReactions = await tx.articleReaction.findMany({
      where: { userId: newer.id },
    });

    for (const rx of newerReactions) {
      try {
        await tx.articleReaction.update({
          where: { id: rx.id },
          data: { userId: older.id },
        });
        movedCounts.reactions += 1;
      } catch (err) {
        // Unique constraint violation — the older user already has a reaction
        // with the same fingerprint on the same article. Just delete the newer one.
        if (err.code === "P2002") {
          console.log(
            `[AccountMerge]   skip reaction ${rx.id} — unique constraint (fingerprint conflict)`
          );
          await tx.articleReaction.delete({ where: { id: rx.id } });
        } else {
          throw err;
        }
      }
    }

    // ------------------------------------------------------------------
    // 4h. Applications — unique on [userId, jobId]
    // ------------------------------------------------------------------
    const newerApps = await tx.application.findMany({
      where: { userId: newer.id },
    });

    for (const app of newerApps) {
      const conflict = await tx.application.findUnique({
        where: { userId_jobId: { userId: older.id, jobId: app.jobId } },
      });

      if (conflict) {
        // Keep the older application (likely has more history)
        await tx.application.delete({ where: { id: app.id } });
        continue;
      }

      await tx.application.update({
        where: { id: app.id },
        data: { userId: older.id },
      });
      movedCounts.applications += 1;
    }

    // ------------------------------------------------------------------
    // 4i. NewsletterSubscriptions — email is unique, not userId
    //     Reassign userId (or skip if email conflict would arise)
    // ------------------------------------------------------------------
    const newerSubs = await tx.newsletterSubscription.findMany({
      where: { userId: newer.id },
    });

    for (const sub of newerSubs) {
      const conflict = await tx.newsletterSubscription.findUnique({
        where: { email: sub.email },
      });

      if (conflict && conflict.userId === older.id) {
        // Older user already has this subscription — delete duplicate
        await tx.newsletterSubscription.delete({ where: { id: sub.id } });
        continue;
      }

      if (conflict && conflict.userId !== older.id && conflict.userId !== null) {
        // Third user owns this subscription — just unlink from newer
        await tx.newsletterSubscription.update({
          where: { id: sub.id },
          data: { userId: null },
        });
        continue;
      }

      await tx.newsletterSubscription.update({
        where: { id: sub.id },
        data: { userId: older.id },
      });
      movedCounts.newsletterSubs += 1;
    }

    // ------------------------------------------------------------------
    // 4j. Company ownership — transfer if older has none
    // ------------------------------------------------------------------
    if (newer.company) {
      const olderCompany = await tx.company.findUnique({
        where: { userId: older.id },
      });

      if (!olderCompany) {
        await tx.company.update({
          where: { userId: newer.id },
          data: { userId: older.id },
        });
        movedCounts.company = true;
      } else {
        console.log(
          `[AccountMerge]   skip company transfer — older user already owns a company`
        );
      }
    }

    // ------------------------------------------------------------------
    // 4k. Enrich older user with any missing profile data from newer
    // ------------------------------------------------------------------
    const updates = {};
    if (!older.phone && newer.phone) updates.phone = newer.phone;
    if (!older.avatar && newer.avatar) updates.avatar = newer.avatar;
    if ((!older.name || older.name === "Phone User") && newer.name && newer.name !== "Phone User") {
      updates.name = newer.name;
    }
    if (newer.phoneVerified && !older.phoneVerified) updates.phoneVerified = true;
    if (newer.passwordHash && !older.passwordHash) updates.passwordHash = newer.passwordHash;

    // If older user still has a placeholder email but newer has a real one, replace it
    if (isPlaceholderEmail(older.email) && !isPlaceholderEmail(newer.email)) {
      updates.email = newer.email;
      if (newer.emailVerified) updates.emailVerified = true;
    }

    if (Object.keys(updates).length > 0) {
      await tx.user.update({
        where: { id: older.id },
        data: updates,
      });
      console.log(
        `[AccountMerge]   enriched older user fields: ${Object.keys(updates).join(", ")}`
      );
    }

    // ------------------------------------------------------------------
    // 4l. Delete the newer user (remaining cascade relations are cleaned up)
    // ------------------------------------------------------------------
    await tx.user.delete({
      where: { id: newer.id },
    });

    console.log(
      `[AccountMerge] mergeUsers: deleted newer user ${newer.id}`
    );
  });

  console.log(
    `[AccountMerge] mergeUsers: complete — movedCounts =`,
    movedCounts
  );

  return {
    merged: true,
    olderUserId: older.id,
    newerUserId: newer.id,
    movedCounts,
  };
}

// ===========================================================================
// 5. findOrCreateUser(params)
// ===========================================================================

/**
 * Master merge / link logic. Call on every auth attempt (phone OTP,
 * Google OAuth, email+password login).
 *
 * @param {Object} params
 * @param {string} [params.email]           — email address (lowercased inside)
 * @param {string} [params.phone]           — raw phone number (normalized inside)
 * @param {string} [params.name]            — display name
 * @param {string} [params.avatar]          — avatar URL
 * @param {string}  params.provider         — "google" | "email" | "phone"
 * @param {string}  params.providerAccountId — provider-specific unique ID
 * @param {string} [params.accessToken]     — OAuth access token
 * @param {string} [params.refreshToken]    — OAuth refresh token
 * @param {string} [params.idToken]         — OpenID Connect id_token
 * @param {string} [params.scope]           — OAuth scopes
 * @param {number} [params.expiresAt]       — token expiry (Unix seconds or Date)
 * @param {string} [params.passwordHash]    — bcrypt hash (for email registration)
 *
 * @returns {Promise<{ user: Object, created: boolean, merged: boolean, linkedProvider: boolean }>}
 */
export async function findOrCreateUser({
  email,
  phone,
  name,
  avatar,
  provider,
  providerAccountId,
  accessToken,
  refreshToken,
  idToken,
  scope,
  expiresAt,
  passwordHash,
}) {
  // ------------------------------------------------------------------
  // Normalise inputs
  // ------------------------------------------------------------------
  const normalizedPhone = normalizePhone(phone) || null;
  const normalizedEmail = email ? email.toLowerCase().trim() : null;

  console.log(
    `[AccountMerge] findOrCreateUser: provider=${provider}, email=${normalizedEmail}, phone=${normalizedPhone}`
  );

  // ------------------------------------------------------------------
  // Step 1 — Find candidates
  // ------------------------------------------------------------------
  let candidateByPhone = null;
  let candidateByEmail = null;

  if (normalizedPhone) {
    try {
      candidateByPhone = await db.user.findUnique({
        where: { phone: normalizedPhone },
        include: { authAccounts: true },
      });
    } catch (error) {
      console.error("[AccountMerge] error finding user by phone:", error);
    }
  }

  if (normalizedEmail && !isPlaceholderEmail(normalizedEmail)) {
    try {
      candidateByEmail = await db.user.findUnique({
        where: { email: normalizedEmail },
        include: { authAccounts: true },
      });
    } catch (error) {
      console.error("[AccountMerge] error finding user by email:", error);
    }
  }

  // ------------------------------------------------------------------
  // Step 2 — Both candidates exist and are different users → merge
  // ------------------------------------------------------------------
  if (
    candidateByPhone &&
    candidateByEmail &&
    candidateByPhone.id !== candidateByEmail.id
  ) {
    console.log(
      `[AccountMerge] duplicate accounts detected: phone user ${candidateByPhone.id} + email user ${candidateByEmail.id} — merging`
    );

    const mergeResult = await mergeUsers(candidateByPhone, candidateByEmail);

    // The surviving user is mergeResult.olderUserId
    const survivingUser = await db.user.findUnique({
      where: { id: mergeResult.olderUserId },
      include: { authAccounts: true },
    });

    // Link the current provider and update fields below
    const result = await _linkProviderAndUpdate(survivingUser, {
      provider,
      providerAccountId,
      accessToken,
      refreshToken,
      idToken,
      scope,
      expiresAt,
      name,
      avatar,
      normalizedPhone,
      normalizedEmail,
      passwordHash,
    });

    // Link walk-in orders
    await linkWalkInOrders(survivingUser.id, normalizedEmail, normalizedPhone);

    return {
      user: survivingUser,
      created: false,
      merged: true,
      linkedProvider: result.linkedProvider,
    };
  }

  // ------------------------------------------------------------------
  // Step 3 — Single match found
  // ------------------------------------------------------------------
  const matchedUser = candidateByPhone || candidateByEmail;

  if (matchedUser) {
    console.log(
      `[AccountMerge] existing user found: ${matchedUser.id} (email=${matchedUser.email}, phone=${matchedUser.phone})`
    );

    // Link provider & update fields
    const result = await _linkProviderAndUpdate(matchedUser, {
      provider,
      providerAccountId,
      accessToken,
      refreshToken,
      idToken,
      scope,
      expiresAt,
      name,
      avatar,
      normalizedPhone,
      normalizedEmail,
      passwordHash,
    });

    // If the user was phone-only and now we have a real email, replace the placeholder
    if (
      normalizedEmail &&
      !isPlaceholderEmail(normalizedEmail) &&
      isPlaceholderEmail(matchedUser.email) &&
      normalizedEmail !== matchedUser.email
    ) {
      try {
        await db.user.update({
          where: { id: matchedUser.id },
          data: { email: normalizedEmail },
        });
        console.log(
          `[AccountMerge] replaced placeholder email on user ${matchedUser.id}: ${matchedUser.email} → ${normalizedEmail}`
        );
      } catch (error) {
        // P2002 unique constraint — the real email is already taken by another user
        if (error.code === "P2002") {
          console.warn(
            `[AccountMerge] cannot replace placeholder email — ${normalizedEmail} is already taken`
          );
        } else {
          throw error;
        }
      }
    }

    // If we now have a phone and the user didn't have one, set it
    if (normalizedPhone && !matchedUser.phone) {
      try {
        await db.user.update({
          where: { id: matchedUser.id },
          data: { phone: normalizedPhone },
        });
        console.log(
          `[AccountMerge] added phone ${normalizedPhone} to user ${matchedUser.id}`
        );
      } catch (error) {
        if (error.code === "P2002") {
          console.warn(
            `[AccountMerge] cannot add phone ${normalizedPhone} — already taken by another user`
          );
        } else {
          throw error;
        }
      }
    }

    // Refresh user from DB after all updates
    const updatedUser = await db.user.findUnique({
      where: { id: matchedUser.id },
      include: { authAccounts: true },
    });

    // Link walk-in orders
    await linkWalkInOrders(updatedUser.id, normalizedEmail, normalizedPhone);

    return {
      user: updatedUser,
      created: false,
      merged: false,
      linkedProvider: result.linkedProvider,
    };
  }

  // ------------------------------------------------------------------
  // Step 4 — No match → create new account
  // ------------------------------------------------------------------
  const newEmail = normalizedEmail || (normalizedPhone ? placeholderEmail(normalizedPhone) : null);

  if (!newEmail) {
    throw new Error(
      "[AccountMerge] findOrCreateUser: cannot create user without email or phone"
    );
  }

  const newName =
    name && name.trim().length > 0 ? name.trim() : "Phone User";

  console.log(
    `[AccountMerge] creating new user: email=${newEmail}, phone=${normalizedPhone}, name=${newName}, provider=${provider}`
  );

  const newUser = await db.$transaction(async (tx) => {
    // Build user data
    const userData = {
      email: newEmail,
      phone: normalizedPhone,
      name: newName,
      avatar: avatar || null,
      passwordHash: passwordHash || null,
      emailVerified: provider === "google" ? true : false,
      phoneVerified: provider === "phone" ? true : false,
      lastLoginAt: new Date(),
    };

    const created = await tx.user.create({ data: userData });

    // Create the auth account record
    const authData = {
      userId: created.id,
      provider,
      providerAccountId,
    };

    // Only store token fields for OAuth providers
    if (provider === "google") {
      authData.accessToken = accessToken || null;
      authData.refreshToken = refreshToken || null;
      authData.idToken = idToken || null;
      authData.scope = scope || null;
      authData.expiresAt = expiresAt
        ? typeof expiresAt === "number"
          ? new Date(expiresAt * 1000)
          : expiresAt
        : null;
    }

    // For phone provider, the accessToken field is used for OTP storage
    // (handled by send-otp route), but we still create a record here
    await tx.authAccount.create({ data: authData });

    return created;
  });

  console.log(
    `[AccountMerge] new user created: ${newUser.id} (${newEmail})`
  );

  // ── Cross-account order merge ──
  // If a phone-only user was just created, check if any existing users
  // have orders with the same phone. If found, merge instead of creating
  // a duplicate account. This handles the case where:
  //   1. User placed an order while logged in with Google (userId=Google)
  //   2. User then signs up with phone (creates new phone-only user)
  //   3. We need to merge so the phone user gets the Google user's orders
  let finalUser = newUser;
  let wasMerged = false;

  if (normalizedPhone) {
    const phoneConditions = [{ phone: normalizedPhone }];
    if (normalizedPhone.startsWith("254") && normalizedPhone.length === 12) {
      phoneConditions.push({ phone: `0${normalizedPhone.substring(3)}` });
      phoneConditions.push({ phone: `+${normalizedPhone}` });
    }

    const otherUserOrders = await db.order.findMany({
      where: {
        userId: { not: null, not: newUser.id },
        OR: phoneConditions,
      },
      select: { userId: true },
      distinct: ["userId"],
    });

    if (otherUserOrders.length > 0) {
      for (const { userId: otherUserId } of otherUserOrders) {
        try {
          const otherUser = await db.user.findUnique({
            where: { id: otherUserId },
            include: { authAccounts: true },
          });

          if (!otherUser) continue;

          console.log(
            `[AccountMerge] cross-account: new user ${newUser.id} has phone ${normalizedPhone}, found existing user ${otherUser.id} with matching orders — merging`
          );

          const mergeResult = await mergeUsers(newUser, otherUser);
          const survivingId = mergeResult.olderUserId;

          finalUser = await db.user.findUnique({
            where: { id: survivingId },
            include: { authAccounts: true },
          });

          wasMerged = true;
          console.log(
            `[AccountMerge] cross-account merge: surviving user ${survivingId}`
          );

          // Link provider to the surviving user
          await _linkProviderAndUpdate(finalUser, {
            provider,
            providerAccountId,
            accessToken,
            refreshToken,
            idToken,
            scope,
            expiresAt,
            name,
            avatar,
            normalizedPhone,
            normalizedEmail,
            passwordHash,
          });

          break; // Only merge with one user
        } catch (mergeErr) {
          console.error(
            `[AccountMerge] cross-account merge failed with user ${otherUserId}:`,
            mergeErr
          );
        }
      }
    }
  }

  // Link walk-in orders (orders with userId=null)
  await linkWalkInOrders(finalUser.id, normalizedEmail, normalizedPhone);

  return {
    user: finalUser,
    created: !wasMerged,
    merged: wasMerged,
    linkedProvider: true,
  };
}

// ===========================================================================
// Internal helpers
// ===========================================================================

/**
 * Link an auth provider to an existing user and update profile fields.
 *
 * @param {Object} user        — Prisma user object (with authAccounts included)
 * @param {Object} params      — see _linkProviderAndUpdate params
 * @returns {{ linkedProvider: boolean }}
 */
async function _linkProviderAndUpdate(
  user,
  {
    provider,
    providerAccountId,
    accessToken,
    refreshToken,
    idToken,
    scope,
    expiresAt,
    name,
    avatar,
    normalizedPhone,
    normalizedEmail,
    passwordHash,
  }
) {
  let linkedProvider = false;

  // ------------------------------------------------------------------
  // Link / update auth account
  // ------------------------------------------------------------------
  const existingAuth = user.authAccounts.find(
    (a) => a.provider === provider && a.providerAccountId === providerAccountId
  );

  if (!existingAuth) {
    // Check if a record with this providerAccountId already exists (belongs to another user)
    const globalExisting = await db.authAccount.findUnique({
      where: { providerAccountId },
    });

    if (globalExisting) {
      if (!globalExisting.userId || globalExisting.userId !== user.id) {
        // Reassign to this user (e.g. providerAccountId was created during send-otp
        // without a userId, or belonged to a now-merged-away user)
        console.log(
          `[AccountMerge] reassigning authAccount ${providerAccountId} from user ${globalExisting.userId || 'null'} → ${user.id}`
        );
        await db.authAccount.update({
          where: { id: globalExisting.id },
          data: { userId: user.id },
        });
        linkedProvider = true;
      }
    } else {
      // Create new auth account
      const authData = {
        userId: user.id,
        provider,
        providerAccountId,
      };

      if (provider === "google") {
        authData.accessToken = accessToken || null;
        authData.refreshToken = refreshToken || null;
        authData.idToken = idToken || null;
        authData.scope = scope || null;
        authData.expiresAt = expiresAt
          ? typeof expiresAt === "number"
            ? new Date(expiresAt * 1000)
            : expiresAt
          : null;
      }

      await db.authAccount.create({ data: authData });
      linkedProvider = true;
      console.log(
        `[AccountMerge] linked ${provider} auth (${providerAccountId}) to user ${user.id}`
      );
    }
  } else {
    // Update tokens for an existing auth account
    if (provider === "google") {
      await db.authAccount.update({
        where: { id: existingAuth.id },
        data: {
          accessToken: accessToken || existingAuth.accessToken,
          refreshToken:
            refreshToken || existingAuth.refreshToken,
          idToken: idToken || existingAuth.idToken,
          expiresAt: expiresAt
            ? typeof expiresAt === "number"
              ? new Date(expiresAt * 1000)
              : expiresAt
            : existingAuth.expiresAt,
          scope: scope || existingAuth.scope,
        },
      });
    }
    console.log(
      `[AccountMerge] updated existing ${provider} auth for user ${user.id}`
    );
  }

  // ------------------------------------------------------------------
  // Update user profile fields (only fill gaps, never overwrite)
  // ------------------------------------------------------------------
  const profileUpdates = {};

  // Name — fill if missing or placeholder
  if (
    name &&
    name.trim().length > 0 &&
    name.trim() !== "Phone User" &&
    (!user.name || user.name === "Phone User")
  ) {
    profileUpdates.name = name.trim();
  }

  // Avatar — fill if missing
  if (avatar && !user.avatar) {
    profileUpdates.avatar = avatar;
  }

  // Email verified — Google users are pre-verified
  if (provider === "google" && !user.emailVerified) {
    profileUpdates.emailVerified = true;
  }

  // Phone verified — phone OTP users are pre-verified
  if (provider === "phone" && !user.phoneVerified) {
    profileUpdates.phoneVerified = true;
  }

  // Password hash — store if this is an email registration
  if (passwordHash && !user.passwordHash) {
    profileUpdates.passwordHash = passwordHash;
  }

  // Always update lastLoginAt
  profileUpdates.lastLoginAt = new Date();

  if (Object.keys(profileUpdates).length > 1) {
    // >1 because lastLoginAt is always there
    await db.user.update({
      where: { id: user.id },
      data: profileUpdates,
    });
    console.log(
      `[AccountMerge] updated profile fields on user ${user.id}: ${Object.keys(profileUpdates).join(", ")}`
    );
  } else {
    // Still update lastLoginAt
    await db.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });
  }

  return { linkedProvider };
}
