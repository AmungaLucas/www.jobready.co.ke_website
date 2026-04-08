import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getMissingProfileFields, linkWalkInOrders } from "@/lib/auth-identity";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { encode } from "next-auth/jwt";

/**
 * POST /api/auth/verify-email-link
 *
 * Verifies a 6-digit email code and merges the current (phone) user
 * into the email owner's account.
 *
 * Flow:
 *   1. Validate OTP (purpose: "email_link", stored in Otp.phone field)
 *   2. Find the email owner (the surviving account)
 *   3. Transfer all data from current user → email owner
 *   4. Set phone number on email owner (if current user has one)
 *   5. Set name on email owner (if email owner is missing one and current has one)
 *   6. Delete current user record (cascade cleanup)
 *   7. Create new session for the surviving user
 *   8. Return response with session cookie
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

    const currentUserId = session.user.id;
    const body = await request.json();
    const { email, code } = body;

    // --- Validate inputs ---
    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and verification code are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: "A valid 6-digit code is required" },
        { status: 400 }
      );
    }

    // --- Find the OTP record ---
    const otpRecord = await db.otp.findFirst({
      where: {
        phone: normalizedEmail,
        code,
        purpose: "email_link",
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

    // --- Find both users ---
    const currentUser = await db.user.findUnique({
      where: { id: currentUserId },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "Current user not found" },
        { status: 404 }
      );
    }

    const emailOwner = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!emailOwner) {
      return NextResponse.json(
        { error: "Email owner account not found" },
        { status: 404 }
      );
    }

    // Safety: don't merge into yourself
    if (emailOwner.id === currentUserId) {
      return NextResponse.json(
        { error: "Cannot link an account to itself" },
        { status: 400 }
      );
    }

    // --- Merge: transfer data from current user → email owner ---

    // 1. Transfer orders
    const transferredOrders = await db.order.updateMany({
      where: { userId: currentUserId },
      data: { userId: emailOwner.id },
    });

    // 2. Transfer saved jobs (skip duplicates)
    const currentSavedJobs = await db.savedJob.findMany({
      where: { userId: currentUserId },
      select: { jobId: true },
    });
    for (const sj of currentSavedJobs) {
      try {
        await db.savedJob.create({ data: { userId: emailOwner.id, jobId: sj.jobId } });
      } catch (e) {
        if (e.code !== "P2002") throw e;
      }
    }

    // 3. Transfer saved articles (skip duplicates)
    const currentSavedArticles = await db.savedArticle.findMany({
      where: { userId: currentUserId },
      select: { articleId: true },
    });
    for (const sa of currentSavedArticles) {
      try {
        await db.savedArticle.create({ data: { userId: emailOwner.id, articleId: sa.articleId } });
      } catch (e) {
        if (e.code !== "P2002") throw e;
      }
    }

    // 4. Transfer job applications (skip duplicates)
    const currentApplications = await db.application.findMany({
      where: { userId: currentUserId },
      select: { jobId: true },
    });
    for (const app of currentApplications) {
      try {
        await db.application.create({ data: { userId: emailOwner.id, jobId: app.jobId } });
      } catch (e) {
        if (e.code !== "P2002") throw e;
      }
    }

    // 5. Transfer job alerts
    const transferredAlerts = await db.jobAlert.updateMany({
      where: { userId: currentUserId },
      data: { userId: emailOwner.id },
    });

    // 6. Transfer article reactions
    await db.articleReaction.updateMany({
      where: { userId: currentUserId },
      data: { userId: emailOwner.id },
    });

    // 7. Transfer notifications
    await db.notification.updateMany({
      where: { userId: currentUserId },
      data: { userId: emailOwner.id },
    });

    // --- Enrich email owner with data from current user ---

    const ownerUpdates = {};

    // Transfer phone if email owner doesn't have one
    if (currentUser.phone && !emailOwner.phone) {
      ownerUpdates.phone = currentUser.phone;
      ownerUpdates.phoneVerified = true;
    }

    // Transfer name if email owner is missing one (or has placeholder)
    const ownerMissing = getMissingProfileFields(emailOwner);
    if (ownerMissing.needsName && currentUser.name && currentUser.name !== "Phone User") {
      ownerUpdates.name = currentUser.name;
    }

    // Apply updates
    if (Object.keys(ownerUpdates).length > 0) {
      await db.user.update({
        where: { id: emailOwner.id },
        data: ownerUpdates,
      });
    }

    // --- Delete the current user (cascade handles remaining relations) ---
    await db.user.delete({ where: { id: currentUserId } });

    // --- Link walk-in orders for the surviving user ---
    const survivingUser = await db.user.findUnique({
      where: { id: emailOwner.id },
    });

    let linkedWalkinOrders = 0;
    if (survivingUser) {
      linkedWalkinOrders = await linkWalkInOrders(
        survivingUser.id,
        survivingUser.email,
        survivingUser.phone
      );
    }

    // --- Create new session for the surviving user ---
    const useSecureCookies =
      process.env.NODE_ENV === "production" ||
      (process.env.NEXTAUTH_URL || "").startsWith("https://");

    const sessionCookieName = useSecureCookies
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token";

    const missingFields = survivingUser
      ? getMissingProfileFields(survivingUser)
      : { needsName: false, needsEmail: false, needsPhone: false, needsPassword: false, isComplete: true };

    const token = await encode({
      token: {
        id: survivingUser.id,
        name: survivingUser.name,
        email: survivingUser.email,
        phone: survivingUser.phone,
        avatar: survivingUser.avatar,
        role: survivingUser.role,
        googleId: survivingUser.googleId || null,
        emailVerified: survivingUser.emailVerified,
        phoneVerified: survivingUser.phoneVerified,
        hasPassword: !!survivingUser.passwordHash,
        missingFields,
        issuedAt: Date.now(),
      },
      secret: process.env.NEXTAUTH_SECRET,
      maxAge: 30 * 24 * 60 * 60,
    });

    console.log(
      `[Verify Email Link] Merged user ${currentUserId} → ${emailOwner.id} (${normalizedEmail}). ` +
      `Orders: ${transferredOrders.count}, Alerts: ${transferredAlerts.count}, WalkIn: ${linkedWalkinOrders}`
    );

    // --- Build response with new session cookie ---
    const { passwordHash: _, ...safeUser } = survivingUser;

    const response = NextResponse.json({
      message: "Accounts linked successfully",
      user: safeUser,
      missingFields,
      linkedOrders: transferredOrders.count + linkedWalkinOrders,
    });

    response.cookies.set(sessionCookieName, token, {
      httpOnly: true,
      secure: useSecureCookies,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[Verify Email Link API] Error:", error);
    return NextResponse.json(
      { error: "Failed to link accounts. Please try again.", debug: error.message, code: error.code },
      { status: 500 }
    );
  }
}
