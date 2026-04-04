import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/alerts
 * Returns the authenticated user's job alerts.
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

    const alerts = await db.jobAlert.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        query: true,
        location: true,
        jobType: true,
        category: true,
        isActive: true,
        lastSentAt: true,
        emailOpenCount: true,
        emailClickCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error("[GET /api/alerts] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/alerts
 * Create a new job alert for the authenticated user.
 * Body: { keyword?, location?, categoryId?, frequency? }
 *
 * Note: Schema field is `query` (maps from `keyword`), `jobType` (maps from `categoryId`),
 * and `category` (maps from `categoryId`). The `frequency` field doesn't exist in the
 * schema so it is accepted but not persisted.
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
    const { keyword, location, categoryId, frequency } = body;

    // Require at least one search criteria
    if (!keyword && !location && !categoryId) {
      return NextResponse.json(
        { error: "At least one of keyword, location, or categoryId is required" },
        { status: 400 }
      );
    }

    // Validate frequency if provided (accepted but not persisted to DB)
    const VALID_FREQUENCIES = ["DAILY", "WEEKLY"];
    if (frequency && !VALID_FREQUENCIES.includes(frequency)) {
      return NextResponse.json(
        { error: "frequency must be DAILY or WEEKLY" },
        { status: 400 }
      );
    }

    const alert = await db.jobAlert.create({
      data: {
        userId: session.user.id,
        query: typeof keyword === "string" ? keyword.trim() : null,
        location: typeof location === "string" ? location.trim() : null,
        category: typeof categoryId === "string" ? categoryId.trim() : null,
      },
    });

    return NextResponse.json(
      {
        message: "Job alert created successfully",
        alert: {
          ...alert,
          frequency: frequency || "DAILY",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/alerts] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/alerts
 * Update an existing job alert.
 * Body: { id, isActive?, frequency?, keyword?, location?, categoryId? }
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
    const { id, isActive, frequency, keyword, location, categoryId } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Alert id is required and must be a string" },
        { status: 400 }
      );
    }

    // Verify the alert belongs to this user
    const existing = await db.jobAlert.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Alert not found" },
        { status: 404 }
      );
    }

    // Build update data
    const updateData = {};

    if (isActive !== undefined) {
      if (typeof isActive !== "boolean") {
        return NextResponse.json(
          { error: "isActive must be a boolean" },
          { status: 400 }
        );
      }
      updateData.isActive = isActive;
    }

    if (keyword !== undefined) {
      if (typeof keyword !== "string") {
        return NextResponse.json(
          { error: "keyword must be a string" },
          { status: 400 }
        );
      }
      updateData.query = keyword.trim() || null;
    }

    if (location !== undefined) {
      if (typeof location !== "string") {
        return NextResponse.json(
          { error: "location must be a string" },
          { status: 400 }
        );
      }
      updateData.location = location.trim() || null;
    }

    if (categoryId !== undefined) {
      if (typeof categoryId !== "string") {
        return NextResponse.json(
          { error: "categoryId must be a string" },
          { status: 400 }
        );
      }
      updateData.category = categoryId.trim() || null;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updated = await db.jobAlert.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      message: "Alert updated successfully",
      alert: {
        ...updated,
        frequency: frequency || "DAILY",
      },
    });
  } catch (error) {
    console.error("[PUT /api/alerts] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/alerts
 * Delete a job alert.
 * Body: { id: string }
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
    const { id } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Alert id is required and must be a string" },
        { status: 400 }
      );
    }

    // Verify the alert belongs to this user
    const existing = await db.jobAlert.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Alert not found" },
        { status: 404 }
      );
    }

    await db.jobAlert.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Alert deleted successfully",
    });
  } catch (error) {
    console.error("[DELETE /api/alerts] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
