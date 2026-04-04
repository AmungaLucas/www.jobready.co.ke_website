import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

/**
 * POST /api/user/avatar
 * Uploads and updates the authenticated user's avatar image.
 * Accepts multipart/form-data with a file field named "avatar".
 * Saves to public/uploads/avatars/ and updates user.avatar in DB.
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

    const formData = await request.formData();
    const file = formData.get("avatar");

    if (!file) {
      return NextResponse.json(
        { error: "No file provided. Use field name 'avatar'" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 2MB." },
        { status: 400 }
      );
    }

    // Read file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const ext = path.extname(file.name) || ".jpg";
    const uniqueName = `${session.user.id}-${Date.now()}${ext}`;

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
    await mkdir(uploadDir, { recursive: true });

    // Write file to disk
    const filePath = path.join(uploadDir, uniqueName);
    await writeFile(filePath, buffer);

    // Update user avatar URL in database
    const avatarUrl = `/uploads/avatars/${uniqueName}`;

    await db.user.update({
      where: { id: session.user.id },
      data: { avatar: avatarUrl },
    });

    return NextResponse.json({
      message: "Avatar uploaded successfully",
      avatar: avatarUrl,
    });
  } catch (error) {
    console.error("[POST /api/user/avatar] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
