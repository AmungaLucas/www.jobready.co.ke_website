import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site-config";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isPlaceholderEmail, findUserByEmail, linkWalkInOrders } from "@/lib/auth-identity";
import {
  sendEmail,
  emailVerifiedConfirmation,
  accountCompleteEmail,
  accountsMergedEmail,
} from "@/lib/email";

/**
 * POST /api/user/verify-email
 *
 * Verifies a 6-digit code sent to the user's email.
 *
 * Two purposes:
 *   - "EMAIL_VERIFY": marks emailVerified = true on the current email
 *   - "EMAIL_UPDATE": replaces placeholder email with the verified new email
 *     If the new email belongs to another user, merges that user into the
 *     current one (transfers data + deletes the other account).
 *
 * Body: { code: "123456", newEmail?: "user@example.com" }
 *   newEmail is required when purpose was "EMAIL_UPDATE"
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
    const { code, newEmail } = body;

    if (!code || typeof code !== "string" || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: "A valid 6-digit code is required" },
        { status: 400 }
      );
    }

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

    // Determine purpose: if newEmail is provided, this is an email update (placeholder → real)
    const purpose = newEmail ? "EMAIL_UPDATE" : "EMAIL_VERIFY";

    // ── email_update: replacing placeholder (with optional merge) ──
    if (purpose === "EMAIL_UPDATE") {
      const targetEmail = newEmail.toLowerCase().trim();

      if (!isPlaceholderEmail(user.email)) {
        return NextResponse.json(
          { error: "Your email is already set. Use the regular verification flow." },
          { status: 400 }
        );
      }

      // Find the OTP record for the NEW email
      const otpRecord = await db.otp.findFirst({
        where: {
          phone: targetEmail,
          code,
          purpose: "EMAIL_UPDATE",
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

      const userId = session.user.id;

      // Check if email belongs to another user → merge
      const emailOwner = await findUserByEmail(targetEmail);

      if (emailOwner && emailOwner.id !== userId) {
        console.log(
          `[Verify Email] Email ${targetEmail} owned by user ${emailOwner.id} — merging into ${userId}`
        );

        // ── Merge: transfer data from emailOwner → current user ──

        // Transfer orders
        const transferredOrders = await db.order.updateMany({
          where: { userId: emailOwner.id },
          data: { userId },
        });

        // Transfer saved jobs (skip duplicates)
        const ownerSavedJobs = await db.savedJob.findMany({
          where: { userId: emailOwner.id },
          select: { jobId: true },
        });
        for (const sj of ownerSavedJobs) {
          try {
            await db.savedJob.create({ data: { userId, jobId: sj.jobId } });
          } catch (e) {
            if (e.code !== "P2002") throw e;
          }
        }

        // Transfer saved articles (skip duplicates)
        const ownerSavedArticles = await db.savedArticle.findMany({
          where: { userId: emailOwner.id },
          select: { articleId: true },
        });
        for (const sa of ownerSavedArticles) {
          try {
            await db.savedArticle.create({ data: { userId, articleId: sa.articleId } });
          } catch (e) {
            if (e.code !== "P2002") throw e;
          }
        }

        // Transfer job applications (skip duplicates)
        const ownerApplications = await db.application.findMany({
          where: { userId: emailOwner.id },
          select: { jobId: true },
        });
        for (const app of ownerApplications) {
          try {
            await db.application.create({ data: { userId, jobId: app.jobId } });
          } catch (e) {
            if (e.code !== "P2002") throw e;
          }
        }

        // Transfer job alerts
        const transferredAlerts = await db.jobAlert.updateMany({
          where: { userId: emailOwner.id },
          data: { userId },
        });

        // Transfer article reactions — use updateMany since reactions have
        // required fields (reactionType, fingerprint) that can't be re-created.
        const transferredReactions = await db.articleReaction.updateMany({
          where: { userId: emailOwner.id },
          data: { userId },
        });

        // Transfer notifications
        await db.notification.updateMany({
          where: { userId: emailOwner.id },
          data: { userId },
        });

        // Inherit googleId if the other user had one and we don't
        const inheritGoogleId = emailOwner.googleId && !user.googleId ? emailOwner.googleId : undefined;
        // Inherit passwordHash if the other user had one and we don't
        const inheritPassword = emailOwner.passwordHash && !user.passwordHash ? emailOwner.passwordHash : undefined;
        // Inherit phone if the other user had one and we don't
        const inheritPhone = emailOwner.phone && !user.phone ? emailOwner.phone : undefined;
        const inheritPhoneVerified = emailOwner.phone && !user.phone ? emailOwner.phoneVerified : undefined;
        // Inherit name if current user has a placeholder name
        const inheritName = (!user.name || user.name.trim() === "Phone User" || user.name.trim() === "")
          && emailOwner.name && emailOwner.name.trim() !== "Phone User"
          ? emailOwner.name : undefined;
        // Inherit avatar if current user doesn't have one
        const inheritAvatar = !user.avatar && emailOwner.avatar ? emailOwner.avatar : undefined;

        // Delete the other account FIRST to release the email unique constraint
        await db.user.delete({ where: { id: emailOwner.id } });

        // Now update current user with new email + inherited fields
        await db.user.update({
          where: { id: userId },
          data: {
            email: targetEmail,
            emailVerified: true,
            ...(inheritName && { name: inheritName }),
            ...(inheritAvatar && { avatar: inheritAvatar }),
            ...(inheritGoogleId && { googleId: inheritGoogleId }),
            ...(inheritPassword && { passwordHash: inheritPassword }),
            ...(inheritPhone && { phone: inheritPhone, phoneVerified: inheritPhoneVerified }),
          },
        });

        console.log(
          `[Verify Email] Merge complete: ${emailOwner.id} → ${userId}, ` +
          `orders: ${transferredOrders.count}, alerts: ${transferredAlerts.count}` +
          (inheritGoogleId ? `, inherited googleId` : "") +
          (inheritPassword ? `, inherited password` : "") +
          (inheritPhone ? `, inherited phone: ${inheritPhone}` : "") +
          (inheritName ? `, inherited name: ${inheritName}` : "")
        );

        // Send merge notification email (non-blocking)
        const mergedName = inheritName || user.name;
        const mergedPhone = inheritPhone || user.phone;
        sendEmail({
          to: targetEmail,
          subject: `Accounts Merged — Your ${siteConfig.shortName} data is combined`,
          ...accountsMergedEmail({ name: mergedName, email: targetEmail, mergedInto: { phone: mergedPhone } }),
        }).catch((err) => console.error("[Verify Email] Merge email failed:", err.message));
      } else {
        // No merge needed — just update email
        await db.user.update({
          where: { id: userId },
          data: { email: targetEmail, emailVerified: true },
        });

        // Link any walk-in orders matching the new email
        await linkWalkInOrders(userId, targetEmail, user.phone);

        // Send "account complete" email (placeholder → real email = first real email)
        sendEmail({
          to: targetEmail,
          subject: "Your Account is Ready!",
          ...accountCompleteEmail({
            name: user.name,
            email: targetEmail,
            phone: user.phone,
            hasPassword: !!user.passwordHash,
          }),
        }).catch((err) => console.error("[Verify Email] Account complete email failed:", err.message));
      }

      return NextResponse.json({
        message: "Email updated and verified successfully",
        merged: !!emailOwner && emailOwner.id !== userId,
      });
    }

    // ── email_verify: just marking existing email as verified ──
    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 }
      );
    }

    const otpRecord = await db.otp.findFirst({
      where: {
        phone: user.email,
        code,
        purpose: "EMAIL_VERIFY",
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

    // Mark email as verified
    await db.user.update({
      where: { id: session.user.id },
      data: { emailVerified: true },
    });

    console.log(
      `[Verify Email] Email verified for user ${session.user.id} (${user.email})`
    );

    // Send email verified confirmation (non-blocking)
    sendEmail({
      to: user.email,
      subject: "Email Verified ✅",
      ...emailVerifiedConfirmation({ name: user.name, email: user.email, phoneVerified: !!user.phoneVerified }),
    }).catch((err) => console.error("[Verify Email] Confirmation email failed:", err.message));

    return NextResponse.json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("[Verify Email API] Error:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "This email is already linked to another account" },
        { status: 409 }
      );
    }

    // Include error details only in development
    const errMsg = error.message || error.code || JSON.stringify(error) || "unknown";
    const response = { error: "Failed to verify email. Please try again." };
    if (process.env.NODE_ENV === "development") {
      response.debug = errMsg;
    }
    return NextResponse.json(response, { status: 500 });
  }
}
