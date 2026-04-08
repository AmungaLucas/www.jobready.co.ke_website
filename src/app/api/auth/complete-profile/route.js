import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import {
  linkWalkInOrders,
  getMissingProfileFields,
  normalizePhone,
  findUserByPhone,
  isPlaceholderEmail,
  linkPhoneToUser,
  linkEmailToUser,
  setUserPassword,
} from "@/lib/auth-identity";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * PATCH /api/auth/complete-profile
 *
 * Updates the current user's profile fields that are missing/incomplete.
 * Accepts any combination of: name, email, phone, password
 * Validates that only genuinely missing fields are being set.
 */
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    const { name, email, phone, otp, password } = body;

    // --- Fetch current user ---
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // --- Check what's missing ---
    const missing = getMissingProfileFields(user);
    const updateResults = [];
    let updatedUser = user;

    // Name — only allow if currently missing/placeholder
    if (name && missing.needsName) {
      const trimmedName = name.trim();
      if (trimmedName.length < 2) {
        return NextResponse.json(
          { error: "Name must be at least 2 characters" },
          { status: 400 }
        );
      }
      updatedUser = await db.user.update({
        where: { id: userId },
        data: { name: trimmedName },
      });
      updateResults.push("name");
    }

    // Email — only allow if currently placeholder
    if (email && missing.needsEmail) {
      const trimmedEmail = email.toLowerCase().trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        return NextResponse.json(
          { error: "Invalid email address" },
          { status: 400 }
        );
      }

      try {
        updatedUser = await linkEmailToUser(userId, trimmedEmail);
        updateResults.push("email");
      } catch (linkErr) {
        if (linkErr.message?.includes("already belongs to")) {
          // Email belongs to another (real) user — tell the frontend
          // to start the email verification + merge flow.
          return NextResponse.json(
            {
              error: "EMAIL_IN_USE",
              message: "An account with this email already exists. Verify your email to link accounts.",
              email: trimmedEmail,
              requiresVerification: true,
            },
            { status: 409 }
          );
        }
        throw linkErr;
      }
    }

    // Phone — only allow if currently missing
    if (phone && missing.needsPhone) {
      const normalizedPhone = normalizePhone(phone);
      if (!normalizedPhone) {
        return NextResponse.json(
          { error: "Invalid phone number format" },
          { status: 400 }
        );
      }

      // Verify OTP if provided (required for phone linking from onboarding)
      if (otp) {
        if (!/^\d{6}$/.test(otp)) {
          return NextResponse.json(
            { error: "A valid 6-digit OTP is required" },
            { status: 400 }
          );
        }

        const otpRecord = await db.otp.findFirst({
          where: {
            phone: normalizedPhone,
            code: otp,
            purpose: "auth",
            verified: false,
            expiresAt: { gte: new Date() },
          },
          orderBy: { createdAt: "desc" },
        });

        if (!otpRecord) {
          return NextResponse.json(
            { error: "Invalid or expired verification code. Please request a new one." },
            { status: 400 }
          );
        }

        // Mark OTP as consumed
        await db.otp.update({
          where: { id: otpRecord.id },
          data: { verified: true },
        });
      }

      // Try to link phone — may conflict with an existing ghost account
      try {
        updatedUser = await linkPhoneToUser(userId, normalizedPhone);
      } catch (linkErr) {
        if (linkErr.message?.includes("already belongs to")) {
          // Phone belongs to another user — check if it's a mergeable ghost
          // (e.g. a phone-only signup that was never completed)
          const phoneOwner = await findUserByPhone(normalizedPhone);

          if (!phoneOwner) {
            return NextResponse.json(
              { error: "This phone number is already linked to another account." },
              { status: 409 }
            );
          }

          const isGhost =
            isPlaceholderEmail(phoneOwner.email) &&
            !phoneOwner.googleId &&
            !phoneOwner.passwordHash;

          if (!isGhost) {
            // Real conflict — another verified user owns this phone
            return NextResponse.json(
              { error: "This phone number is already linked to another account. Please sign in with that account instead." },
              { status: 409 }
            );
          }

          // ── Merge ghost into current user, then delete ghost ──

          // 1. Transfer orders
          const transferredOrders = await db.order.updateMany({
            where: { userId: phoneOwner.id },
            data: { userId },
          });

          // 2. Transfer saved jobs (skip duplicates via unique constraint)
          const ghostSavedJobs = await db.savedJob.findMany({
            where: { userId: phoneOwner.id },
            select: { jobId: true },
          });
          for (const sj of ghostSavedJobs) {
            try {
              await db.savedJob.create({ data: { userId, jobId: sj.jobId } });
            } catch (e) {
              if (e.code !== "P2002") throw e;
            }
          }

          // 3. Transfer saved articles (skip duplicates)
          const ghostSavedArticles = await db.savedArticle.findMany({
            where: { userId: phoneOwner.id },
            select: { articleId: true },
          });
          for (const sa of ghostSavedArticles) {
            try {
              await db.savedArticle.create({ data: { userId, articleId: sa.articleId } });
            } catch (e) {
              if (e.code !== "P2002") throw e;
            }
          }

          // 4. Transfer job applications (skip duplicates)
          const ghostApplications = await db.application.findMany({
            where: { userId: phoneOwner.id },
            select: { jobId: true },
          });
          for (const app of ghostApplications) {
            try {
              await db.application.create({ data: { userId, jobId: app.jobId } });
            } catch (e) {
              if (e.code !== "P2002") throw e;
            }
          }

          // 5. Transfer job alerts
          await db.jobAlert.updateMany({
            where: { userId: phoneOwner.id },
            data: { userId },
          });

          // 6. Delete the ghost record (cascade handles remaining relations)
          await db.user.delete({ where: { id: phoneOwner.id } });

          // 7. Now link the phone to the current user
          updatedUser = await linkPhoneToUser(userId, normalizedPhone);

          console.log(
            `[Complete Profile] Merged + deleted ghost user ${phoneOwner.id} → ${userId} (phone: ${normalizedPhone}, orders: ${transferredOrders.count})`
          );
        } else {
          throw linkErr;
        }
      }
      updateResults.push("phone");
    }

    // Password — only allow if currently missing
    if (password && missing.needsPassword) {
      if (password.length < 8) {
        return NextResponse.json(
          { error: "Password must be at least 8 characters" },
          { status: 400 }
        );
      }
      const passwordHash = await bcrypt.hash(password, 12);
      updatedUser = await setUserPassword(userId, passwordHash);
      updateResults.push("password");
    }

    // --- Check if there's anything to update ---
    if (updateResults.length === 0) {
      return NextResponse.json(
        {
          message: "No fields to update",
          user: sanitizeUser(user),
          missingFields: missing,
        },
        { status: 200 }
      );
    }

    console.log(
      `[Complete Profile] Updated user ${userId}: ${updateResults.join(", ")}`
    );

    // --- Link walk-in orders ---
    const linkedOrders = await linkWalkInOrders(
      userId,
      updatedUser.email,
      updatedUser.phone
    );

    // --- Re-check missing fields ---
    const newMissing = getMissingProfileFields(updatedUser);

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: sanitizeUser(updatedUser),
        linkedOrders,
        missingFields: newMissing,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Complete Profile API] Error:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A conflict occurred. This identifier may already be in use." },
        { status: 409 }
      );
    }

    // Handle errors thrown by linkPhoneToUser/linkEmailToUser
    if (error.message && error.message.includes("[AuthIdentity]")) {
      const msg = error.message;
      if (msg.includes("already belongs to another")) {
        return NextResponse.json(
          { error: "This identifier is already linked to another account" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to update profile. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/complete-profile
 *
 * Returns the current user's missing profile fields.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const missingFields = getMissingProfileFields(user);

    return NextResponse.json({
      user: sanitizeUser(user),
      missingFields,
    });
  } catch (error) {
    console.error("[Complete Profile API] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile data" },
      { status: 500 }
    );
  }
}

// Remove passwordHash from user object
function sanitizeUser(user) {
  const { passwordHash: _, ...safeUser } = user;
  return safeUser;
}
