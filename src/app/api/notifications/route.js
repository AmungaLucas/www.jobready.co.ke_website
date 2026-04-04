import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/notifications
 * Returns paginated notifications for the authenticated user.
 *
 * Query params:
 *   unreadOnly  — boolean (default false), filter to unread only
 *   page        — page number (default 1)
 *   limit       — per page (default 20)
 *   markReadId  — if provided, marks this specific notification as read before returning
 */
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = request.nextUrl;
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;
    const markReadId = searchParams.get("markReadId") || null;

    // Optionally mark a single notification as read
    if (markReadId) {
      await db.notification.updateMany({
        where: {
          id: markReadId,
          userId: session.user.id,
          isRead: false,
        },
        data: { isRead: true },
      });
    }

    const where = {
      userId: session.user.id,
      ...(unreadOnly ? { isRead: false } : {}),
    };

    const [notifications, total, unreadCount] = await Promise.all([
      db.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.notification.count({ where }),
      db.notification.count({
        where: { userId: session.user.id, isRead: false },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("[GET /api/notifications] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/notifications
 * Mark one or all notifications as read.
 *
 * Body (mark single):
 *   { id: string, isRead: true }
 *
 * Body (mark all):
 *   { markAllRead: true }
 */
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, isRead, markAllRead } = body;

    // Mark all as read
    if (markAllRead === true) {
      const result = await db.notification.updateMany({
        where: {
          userId: session.user.id,
          isRead: false,
        },
        data: { isRead: true },
      });

      return NextResponse.json({
        message: `Marked ${result.count} notifications as read`,
        markedCount: result.count,
      });
    }

    // Mark single notification
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Notification id is required" },
        { status: 400 }
      );
    }

    // Verify the notification belongs to this user
    const existing = await db.notification.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    const updated = await db.notification.update({
      where: { id },
      data: {
        ...(isRead !== undefined ? { isRead } : {}),
      },
    });

    return NextResponse.json({
      message: "Notification updated successfully",
      notification: updated,
    });
  } catch (error) {
    console.error("[PUT /api/notifications] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
