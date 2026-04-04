// ============================================================
// account-merge.js — Unified Account Merge Utility
// ============================================================
// Called on every auth attempt (phone OTP, Google OAuth, credentials)
// Handles: finding users by phone/email, merging duplicate accounts,
// linking walk-in orders, and computing profile completeness.
// ============================================================

import { db } from "@/lib/db";

// Check if an email is a placeholder (from phone-only signup)
export function isPlaceholderEmail(email) {
  if (!email) return true;
  return (
    email.startsWith("phone_") ||
    email.includes("@phone.jobready.co.ke")
  );
}

// Check if profile is complete (real name, real email, phone)
export function isProfileComplete(user) {
  const hasRealName =
    user.name &&
    user.name !== "Phone User" &&
    user.name.trim().length >= 2;
  const hasRealEmail = !isPlaceholderEmail(user.email);
  const hasPhone = Boolean(user.phone);
  return hasRealName && hasRealEmail && hasPhone;
}

// Compute which fields are missing from the user's profile
export function getMissingProfileFields(user) {
  const missing = {};
  if (
    !user.name ||
    user.name === "Phone User" ||
    user.name.trim().length < 2
  ) {
    missing.name = true;
  }
  if (isPlaceholderEmail(user.email)) {
    missing.email = true;
  }
  if (!user.phone) {
    missing.phone = true;
  }
  return missing;
}

// Link walk-in orders to a user by email and/or phone
export async function linkWalkInOrders(userId, email, phone) {
  const conditions = [];
  if (email) conditions.push({ email, userId: null });
  if (phone) conditions.push({ phone, userId: null });

  let totalLinked = 0;
  for (const condition of conditions) {
    try {
      const result = await db.order.updateMany({
        where: condition,
        data: { userId },
      });
      totalLinked += result.count;
    } catch (err) {
      console.error("[account-merge] Order linking error:", err.message);
    }
  }
  return totalLinked;
}

// Master merge function — call this on EVERY auth attempt
// Returns: { user, merged, isNewUser }
export async function findOrCreateUser({ email, phone, name, provider }) {
  let userByPhone = null;
  let userByEmail = null;

  // Search by phone
  if (phone) {
    userByPhone = await db.user.findUnique({
      where: { phone },
      include: { authAccounts: true },
    });
  }

  // Search by email (only if it's a real email, not placeholder)
  if (email && !isPlaceholderEmail(email)) {
    userByEmail = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { authAccounts: true },
    });
  }

  // Both found but different accounts — MERGE
  if (userByPhone && userByEmail && userByPhone.id !== userByEmail.id) {
    console.log(
      `[account-merge] Merging accounts: phone=${userByPhone.id} + email=${userByEmail.id}`
    );

    // Keep the older account (lower createdAt)
    const [keeper, absorbed] =
      userByPhone.createdAt <= userByEmail.createdAt
        ? [userByPhone, userByEmail]
        : [userByEmail, userByPhone];

    // Transfer: email (if keeper missing), phone (if keeper missing), name (if keeper missing)
    const updateData = {};
    if (!keeper.email || isPlaceholderEmail(keeper.email)) {
      updateData.email = absorbed.email;
    }
    if (!keeper.phone) {
      updateData.phone = absorbed.phone;
    }
    if (!keeper.name || keeper.name === "Phone User") {
      updateData.name = absorbed.name;
    }
    if (!keeper.passwordHash && absorbed.passwordHash) {
      updateData.passwordHash = absorbed.passwordHash;
    }
    if (!keeper.avatar && absorbed.avatar) {
      updateData.avatar = absorbed.avatar;
    }
    if (absorbed.emailVerified && !keeper.emailVerified) {
      updateData.emailVerified = true;
    }
    if (absorbed.phoneVerified && !keeper.phoneVerified) {
      updateData.phoneVerified = true;
    }

    // Transfer orders from absorbed to keeper
    await db.order.updateMany({
      where: { userId: absorbed.id },
      data: { userId: keeper.id },
    });

    // Transfer other relations from absorbed to keeper
    const relationFields = [
      { model: "savedJob", fk: "userId" },
      { model: "savedArticle", fk: "userId" },
      { model: "jobAlert", fk: "userId" },
      { model: "notification", fk: "userId" },
      { model: "application", fk: "userId" },
    ];

    for (const { model, fk } of relationFields) {
      try {
        await db[model].updateMany({
          where: { [fk]: absorbed.id },
          data: { [fk]: keeper.id },
        });
      } catch (err) {
        console.error(
          `[account-merge] Failed to transfer ${model}:`,
          err.message
        );
      }
    }

    // Transfer auth accounts from absorbed to keeper
    await db.authAccount.updateMany({
      where: { userId: absorbed.id },
      data: { userId: keeper.id },
    });

    // Update keeper with transferred data
    const updatedKeeper = await db.user.update({
      where: { id: keeper.id },
      data: updateData,
      include: { authAccounts: true },
    });

    // Delete absorbed user
    try {
      await db.user.delete({ where: { id: absorbed.id } });
    } catch (err) {
      console.error(
        `[account-merge] Could not delete absorbed user ${absorbed.id}:`,
        err.message
      );
    }

    // Recompute profileComplete
    const complete = isProfileComplete(updatedKeeper);
    if (complete !== updatedKeeper.profileComplete) {
      await db.user.update({
        where: { id: updatedKeeper.id },
        data: { profileComplete: complete },
      });
      updatedKeeper.profileComplete = complete;
    }

    return { user: updatedKeeper, merged: true, isNewUser: false };
  }

  // One match found — return it
  if (userByPhone) {
    return { user: userByPhone, merged: false, isNewUser: false };
  }
  if (userByEmail) {
    return { user: userByEmail, merged: false, isNewUser: false };
  }

  // No match — create new user
  // NOTE: User.email is required (not nullable), so we must use a
  // placeholder email when signing up via phone without an email address.
  const finalEmail =
    email && !isPlaceholderEmail(email)
      ? email.toLowerCase().trim()
      : `phone_${phone}@jobready.co.ke`;

  const newUser = await db.user.create({
    data: {
      email: finalEmail,
      phone: phone || null,
      name: name || "Phone User",
      emailVerified: provider === "google", // Google emails are pre-verified
      phoneVerified: provider === "phone", // Phone OTP means verified
      profileComplete: false,
    },
    include: { authAccounts: true },
  });

  return { user: newUser, merged: false, isNewUser: true };
}
