import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { normalizePhone, findUserByPhone, isPlaceholderEmail } from "@/lib/auth-identity";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * POST /api/user/verify-phone
 *
 * Verifies a 6-digit OTP sent to the user's phone and links/adds it.
 *
 * Body: { phone: "07XXXXXXXX", otp: "123456" }
 *
 * Handles:
 *   1. Adding a new phone (no phone currently)
 *   2. Verifying existing unverified phone
 *   3. Replacing unverified phone with a different one
 *   4. Ghost merge if phone belongs to a ghost account
 */
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { phone, otp } = body;

    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    if (!otp || typeof otp !== "string" || !/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: "A valid 6-digit OTP is required" },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    // Find the OTP record
    const otpRecord = await db.otp.findFirst({
      where: {
        phone: normalizedPhone,
        code: otp,
        purpose: "phone_verify",
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

    // Fetch current user
    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userId = session.user.id;

    // Check if phone belongs to another user
    const phoneOwner = await findUserByPhone(normalizedPhone);

    if (phoneOwner && phoneOwner.id !== userId) {
      // ── Merge other account into current user, then set phone ──
      console.log(
        `[Verify Phone] Merging user ${phoneOwner.id} → ${userId} (phone: ${normalizedPhone})`
      );

      // Transfer orders
      const transferredOrders = await db.order.updateMany({
        where: { userId: phoneOwner.id },
        data: { userId },
      });

      // Transfer saved jobs (skip duplicates)
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

      // Transfer saved articles (skip duplicates)
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

      // Transfer job applications (skip duplicates)
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

      // Transfer job alerts
      await db.jobAlert.updateMany({
        where: { userId: phoneOwner.id },
        data: { userId },
      });

      // Transfer article reactions (skip duplicates)
      const ownerReactions = await db.articleReaction.findMany({
        where: { userId: phoneOwner.id },
        select: { articleId: true },
      });
      for (const r of ownerReactions) {
        try {
          await db.articleReaction.create({ data: { userId, articleId: r.articleId } });
        } catch (e) {
          if (e.code !== "P2002") throw e;
        }
      }

      // Transfer notifications
      await db.notification.updateMany({
        where: { userId: phoneOwner.id },
        data: { userId },
      });

      // Inherit googleId if the other user had one and we don't
      const inheritGoogleId = phoneOwner.googleId && !user.googleId ? phoneOwner.googleId : undefined;
      // Inherit passwordHash if the other user had one and we don't
      const inheritPassword = phoneOwner.passwordHash && !user.passwordHash ? phoneOwner.passwordHash : undefined;
      // Inherit email if the other user has a real one and we have a placeholder
      const inheritEmail = phoneOwner.email && isPlaceholderEmail(user.email) && !isPlaceholderEmail(phoneOwner.email)
        ? phoneOwner.email : undefined;
      const inheritEmailVerified = inheritEmail ? phoneOwner.emailVerified : undefined;

      // Delete the other account FIRST to release unique constraints (phone, email, googleId)
      await db.user.delete({ where: { id: phoneOwner.id } });

      // Now update current user with phone + inherited fields
      await db.user.update({
        where: { id: userId },
        data: {
          phone: normalizedPhone,
          phoneVerified: true,
          ...(inheritGoogleId && { googleId: inheritGoogleId }),
          ...(inheritPassword && { passwordHash: inheritPassword }),
          ...(inheritEmail && { email: inheritEmail, emailVerified: inheritEmailVerified }),
        },
      });

      console.log(
        `[Verify Phone] Merge complete: ${phoneOwner.id} → ${userId}, ` +
        `orders: ${transferredOrders.count}` +
        (inheritGoogleId ? `, inherited googleId` : "") +
        (inheritPassword ? `, inherited password` : "") +
        (inheritEmail ? `, inherited email: ${inheritEmail}` : "")
      );

      return NextResponse.json({
        message: "Phone number verified and accounts merged successfully",
        phone: normalizedPhone,
      });
    }

    // Set phone + phoneVerified on the current user (no merge)
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        phone: normalizedPhone,
        phoneVerified: true,
      },
    });

    console.log(
      `[Verify Phone] Phone ${normalizedPhone} verified for user ${userId}`
    );

    return NextResponse.json({
      message: "Phone number verified successfully",
      phone: normalizedPhone,
    });
  } catch (error) {
    console.error("[Verify Phone API] Error:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "This phone number is already linked to another account" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to verify phone number. Please try again." },
      { status: 500 }
    );
  }
}
