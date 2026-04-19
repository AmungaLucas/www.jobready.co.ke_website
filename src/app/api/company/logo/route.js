import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { userIdRateLimit } from "@/lib/rate-limit";

/**
 * POST /api/company/logo
 * Uploads company logo. Accepts multipart/form-data with field "logo".
 * Saves to public/uploads/logos/ and updates Company.logo in DB.
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

    // Rate limit: 10 uploads per hour
    const { allowed } = await userIdRateLimit(session.user.id, "upload", 10, 60 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many upload attempts. Please try again later." },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("logo");

    if (!file) {
      return NextResponse.json(
        { error: "No file provided. Use field name 'logo'" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only JPEG, PNG, GIF, WebP, and SVG are allowed.",
        },
        { status: 400 }
      );
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 2MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || ".png";
    const uniqueName = `${session.user.id}-logo-${Date.now()}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads", "logos");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, uniqueName);
    await writeFile(filePath, buffer);

    const logoUrl = `/uploads/logos/${uniqueName}`;

    // Find the company linked to this user
    const company = await db.company.findFirst({
      where: { userId: session.user.id },
    });

    if (company) {
      await db.company.update({
        where: { id: company.id },
        data: { logo: logoUrl },
      });
    }

    return NextResponse.json({
      message: "Logo uploaded successfully",
      logo: logoUrl,
    });
  } catch (error) {
    console.error("[POST /api/company/logo] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
