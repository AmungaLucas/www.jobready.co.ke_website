import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * DELETE /api/user/account
 *
 * Permanently deletes the current user's account and all associated data.
 * Cascade deletes handle: SavedJob, SavedArticle, Application, JobAlert,
 * ArticleReaction, Notification, AuthAccount.
 * Orders get userId set to null (SetNull), preserving billing records.
 *
 * Requires password confirmation (sent in body) for security.
 */
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { confirmPassword } = body;

    if (!confirmPassword || typeof confirmPassword !== "string") {
      return NextResponse.json(
        { error: "Password confirmation is required to delete your account" },
        { status: 400 }
      );
    }

    // Fetch user with password
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, passwordHash: true, email: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Verify password (even if account has no password, require the confirmation)
    if (user.passwordHash) {
      const bcrypt = require("bcryptjs");
      const isMatch = await bcrypt.compare(confirmPassword, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Incorrect password" },
          { status: 401 }
        );
      }
    }

    // Delete user (cascade handles related records)
    await db.user.delete({ where: { id: session.user.id } });

    console.log(`[Delete Account] User ${session.user.id} (${user.email}) deleted their account`);

    return NextResponse.json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("[Delete Account API] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
