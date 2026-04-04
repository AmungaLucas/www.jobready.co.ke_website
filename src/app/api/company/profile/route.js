import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/company/profile
 * Returns the current employer's company profile.
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

    const company = await db.company.findUnique({
      where: { userId: session.user.id },
    });

    if (!company) {
      return NextResponse.json(
        { company: null, message: "No company profile found. Create one to get started." }
      );
    }

    return NextResponse.json({ company });
  } catch (error) {
    console.error("[GET /api/company/profile] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/company/profile
 * Creates or updates the current employer's company profile.
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
    const {
      name,
      industry,
      website,
      foundedYear,
      companySize,
      location,
      address,
      description,
      linkedinUrl,
      twitterUrl,
      facebookUrl,
    } = body;

    // Check if company exists
    const existing = await db.company.findUnique({
      where: { userId: session.user.id },
    });

    if (existing) {
      // Update existing company
      const updateData = {};
      if (name !== undefined) updateData.name = typeof name === "string" ? name.trim() : name;
      if (industry !== undefined) updateData.industry = industry;
      if (website !== undefined) updateData.website = website || null;
      if (foundedYear !== undefined) updateData.foundedYear = foundedYear ? parseInt(foundedYear, 10) : null;
      if (companySize !== undefined) updateData.employeeSize = companySize;
      if (location !== undefined) updateData.city = location;
      if (address !== undefined) updateData.address = address || null;
      if (description !== undefined) updateData.description = description || "";
      if (linkedinUrl !== undefined) updateData.linkedinUrl = linkedinUrl || null;
      if (twitterUrl !== undefined) updateData.twitterUrl = twitterUrl || null;
      if (facebookUrl !== undefined) updateData.facebookUrl = facebookUrl || null;

      if (name) {
        updateData.slug = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
      }

      const updated = await db.company.update({
        where: { userId: session.user.id },
        data: updateData,
      });

      return NextResponse.json({
        message: "Company profile updated successfully",
        company: updated,
      });
    } else {
      // Create new company
      if (!name || typeof name !== "string" || name.trim().length === 0) {
        return NextResponse.json(
          { error: "Company name is required" },
          { status: 400 }
        );
      }

      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const existingSlug = await db.company.findUnique({ where: { slug } });
      const uniqueSlug = existingSlug ? `${slug}-${Date.now().toString(36)}` : slug;

      const company = await db.company.create({
        data: {
          name: name.trim(),
          slug: uniqueSlug,
          userId: session.user.id,
          industry: industry || "Technology",
          website: website || null,
          foundedYear: foundedYear ? parseInt(foundedYear, 10) : null,
          employeeSize: companySize || null,
          city: location || null,
          address: address || null,
          description: description || "",
          linkedinUrl: linkedinUrl || null,
          twitterUrl: twitterUrl || null,
          facebookUrl: facebookUrl || null,
        },
      });

      return NextResponse.json({
        message: "Company profile created successfully",
        company,
      });
    }
  } catch (error) {
    console.error("[PUT /api/company/profile] Error:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A company with this name already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
