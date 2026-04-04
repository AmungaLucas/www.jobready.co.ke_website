import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/user/profile
 * Returns the current authenticated user's profile.
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
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        bio: true,
        location: true,
        linkedinUrl: true,
        education: true,
        skills: true,
        cvUrl: true,
        emailVerified: true,
        phoneVerified: true,
        createdAt: true,
        lastLoginAt: true,
        // Count relations
        _count: {
          select: {
            savedJobs: true,
            savedArticles: true,
            jobAlerts: true,
            orders: true,
            notifications: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("[GET /api/user/profile] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/user/profile
 * Updates the current authenticated user's profile.
 * Accepts: name, bio, location, linkedinUrl, education, skills
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
    const { name, bio, location, linkedinUrl, education, skills, phone } = body;

    // Build update data — only include fields that are provided
    const updateData = {};
    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
        return NextResponse.json(
          { error: "Name must be a non-empty string" },
          { status: 400 }
        );
      }
      updateData.name = name.trim();
    }

    if (phone !== undefined) {
      if (typeof phone !== "string") {
        return NextResponse.json(
          { error: "Phone number must be a string" },
          { status: 400 }
        );
      }
      const normalizedPhone = phone.replace(/[\s\-\+]/g, "");
      if (normalizedPhone && !/^(254|0)\d{9}$/.test(normalizedPhone)) {
        return NextResponse.json(
          { error: "Phone must be a valid Kenyan number (e.g. 2547XXXXXXXX)" },
          { status: 400 }
        );
      }
      const finalPhone = normalizedPhone.startsWith("0")
        ? "254" + normalizedPhone.substring(1)
        : normalizedPhone;
      updateData.phone = finalPhone || null;
      // Reset verification if phone changed
      updateData.phoneVerified = false;
    }

    if (bio !== undefined) {
      if (typeof bio !== "string") {
        return NextResponse.json(
          { error: "Bio must be a string" },
          { status: 400 }
        );
      }
      updateData.bio = bio.trim() || null;
    }

    if (location !== undefined) {
      if (typeof location !== "string") {
        return NextResponse.json(
          { error: "Location must be a string" },
          { status: 400 }
        );
      }
      updateData.location = location.trim() || null;
    }

    if (linkedinUrl !== undefined) {
      if (linkedinUrl !== null && typeof linkedinUrl !== "string") {
        return NextResponse.json(
          { error: "LinkedIn URL must be a string or null" },
          { status: 400 }
        );
      }
      if (linkedinUrl && !/^https?:\/\//.test(linkedinUrl)) {
        return NextResponse.json(
          { error: "LinkedIn URL must start with http:// or https://" },
          { status: 400 }
        );
      }
      updateData.linkedinUrl = linkedinUrl || null;
    }

    if (education !== undefined) {
      if (typeof education !== "string") {
        return NextResponse.json(
          { error: "Education must be a string" },
          { status: 400 }
        );
      }
      updateData.education = education.trim() || null;
    }

    if (skills !== undefined) {
      if (!Array.isArray(skills)) {
        return NextResponse.json(
          { error: "Skills must be an array" },
          { status: 400 }
        );
      }
      // Limit skills array
      updateData.skills = skills.slice(0, 20);
    }

    // Ensure there's something to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        bio: true,
        location: true,
        linkedinUrl: true,
        education: true,
        skills: true,
        cvUrl: true,
        emailVerified: true,
        phoneVerified: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("[PUT /api/user/profile] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
