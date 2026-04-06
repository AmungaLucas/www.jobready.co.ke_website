import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateSlug } from "@/lib/slug";

// ─── GET /api/jobs/[slug] ─────────────────────────────────────
// Get single job by slug + similar jobs
export async function GET(request, { params }) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: "Job slug is required" },
        { status: 400 }
      );
    }

    // Find job
    const job = await db.job.findUnique({
      where: { slug },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            logoColor: true,
            tagline: true,
            industry: true,
            city: true,
            country: true,
            website: true,
            isVerified: true,
            contactEmail: true,
            phoneNumber: true,
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Increment view count (fire and forget — no await for performance)
    db.job.update({
      where: { id: job.id },
      data: { viewsCount: { increment: 1 } },
    }).catch(() => {});

    // Fetch similar jobs (same category, different job, active, published)
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const similarJobs = await db.job.findMany({
      where: {
        id: { not: job.id },
        category: job.category,
        isActive: true,
        publishedAt: { not: null, lte: now },
        OR: [
          { deadline: null },
          { deadline: { gte: today } },
        ],
      },
      orderBy: { publishedAt: "desc" },
      take: 5,
      include: {
        company: {
          select: {
            name: true,
            slug: true,
            logo: true,
            logoColor: true,
            isVerified: true,
          },
        },
      },
    });

    return NextResponse.json({
      job,
      similarJobs,
    });
  } catch (error) {
    console.error("[GET /api/jobs/[slug]] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── PUT /api/jobs/[slug] ─────────────────────────────────────
// Update job (EMPLOYER owner or ADMIN)
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: "Job slug is required" },
        { status: 400 }
      );
    }

    // Find existing job
    const existingJob = await db.job.findUnique({
      where: { slug },
      include: {
        company: {
          select: { userId: true },
        },
      },
    });

    if (!existingJob) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Check permissions: must be the job owner (via company) or ADMIN
    const currentUser = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (
      !currentUser ||
      (currentUser.role !== "ADMIN" && existingJob.company.userId !== session.user.id)
    ) {
      return NextResponse.json(
        { error: "You do not have permission to update this job" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      category,
      jobType,
      experienceLevel,
      location,
      isRemote,
      salaryMin,
      salaryMax,
      salaryPeriod,
      isSalaryNegotiable,
      showSalary,
      deadline,
      howToApply,
      tags,
      applicationEmail,
      sourceUrl,
      country,
      city,
      town,
      status,
      isFeatured,
      isActive,
      positions,
    } = body;

    // Build update data — only include provided fields
    const updateData = {};

    if (title !== undefined) {
      if (typeof title !== "string" || title.trim().length < 3) {
        return NextResponse.json(
          { error: "Job title must be at least 3 characters" },
          { status: 400 }
        );
      }
      updateData.title = title.trim();

      // Re-generate slug if title changed
      if (title.trim() !== existingJob.title) {
        let newSlug = generateSlug(title.trim());
        const slugExists = await db.job.findUnique({ where: { slug: newSlug } });
        if (slugExists && slugExists.id !== existingJob.id) {
          newSlug = `${newSlug}-${Date.now().toString(36)}`;
        }
        updateData.slug = newSlug;
      }
    }

    if (description !== undefined) {
      if (typeof description !== "string" || description.trim().length < 20) {
        return NextResponse.json(
          { error: "Job description must be at least 20 characters" },
          { status: 400 }
        );
      }
      updateData.description = description.trim();
    }

    if (category !== undefined) {
      if (typeof category !== "string" || category.trim().length === 0) {
        return NextResponse.json(
          { error: "Category is required" },
          { status: 400 }
        );
      }
      updateData.category = category.trim();
    }

    if (jobType !== undefined) {
      if (typeof jobType !== "string" || jobType.trim().length === 0) {
        return NextResponse.json(
          { error: "Job type is required" },
          { status: 400 }
        );
      }
      updateData.jobType = jobType.trim();
    }

    if (experienceLevel !== undefined) {
      if (typeof experienceLevel !== "string" || experienceLevel.trim().length === 0) {
        return NextResponse.json(
          { error: "Experience level is required" },
          { status: 400 }
        );
      }
      updateData.experienceLevel = experienceLevel.trim();
    }

    if (location !== undefined) {
      if (typeof location !== "string" || location.trim().length === 0) {
        return NextResponse.json(
          { error: "Location is required" },
          { status: 400 }
        );
      }
      updateData.location = location.trim();
    }

    if (isRemote !== undefined) {
      updateData.isRemote = Boolean(isRemote);
    }

    if (salaryMin !== undefined) {
      updateData.salaryMin = salaryMin !== null ? parseInt(salaryMin, 10) : null;
    }

    if (salaryMax !== undefined) {
      updateData.salaryMax = salaryMax !== null ? parseInt(salaryMax, 10) : null;
    }

    if (salaryPeriod !== undefined) {
      updateData.salaryPeriod = salaryPeriod || null;
    }

    if (isSalaryNegotiable !== undefined) {
      updateData.isSalaryNegotiable = Boolean(isSalaryNegotiable);
    }

    if (showSalary !== undefined) {
      updateData.showSalary = Boolean(showSalary);
    }

    if (deadline !== undefined) {
      if (deadline === null) {
        updateData.deadline = null;
      } else {
        const parsed = new Date(deadline);
        if (isNaN(parsed.getTime())) {
          return NextResponse.json(
            { error: "Invalid deadline date format" },
            { status: 400 }
          );
        }
        updateData.deadline = parsed;
      }
    }

    if (status !== undefined) {
      updateData.status = status || null;
    }

    if (howToApply !== undefined) {
      updateData.howToApply = howToApply || null;
    }

    if (tags !== undefined) {
      updateData.tags = tags && Array.isArray(tags) ? tags : null;
    }

    if (applicationEmail !== undefined) {
      updateData.applicationEmail = applicationEmail || null;
    }

    if (sourceUrl !== undefined) {
      updateData.sourceUrl = sourceUrl || null;
    }

    if (country !== undefined) {
      updateData.country = country || null;
    }

    if (city !== undefined) {
      updateData.city = city || null;
    }

    if (town !== undefined) {
      updateData.town = town || null;
    }

    if (isFeatured !== undefined) {
      updateData.isFeatured = Boolean(isFeatured);
    }

    if (positions !== undefined) {
      updateData.positions = positions ? parseInt(positions, 10) : 1;
    }

    if (isActive !== undefined) {
      updateData.isActive = Boolean(isActive);
      // When activating, also set publishedAt if not already set
      if (isActive === true && !existingJob.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    // Ensure there's something to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    // Update job
    const updatedJob = await db.job.update({
      where: { id: existingJob.id },
      data: updateData,
      include: {
        company: {
          select: {
            name: true,
            slug: true,
            logo: true,
            logoColor: true,
            isVerified: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("[PUT /api/jobs/[slug]] Error:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A job with a similar title already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/jobs/[slug] ──────────────────────────────────
// Soft delete job (set isActive=false)
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: "Job slug is required" },
        { status: 400 }
      );
    }

    // Find existing job
    const existingJob = await db.job.findUnique({
      where: { slug },
      include: {
        company: {
          select: { userId: true },
        },
      },
    });

    if (!existingJob) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Check permissions: must be the job owner (via company) or ADMIN
    const currentUser = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (
      !currentUser ||
      (currentUser.role !== "ADMIN" && existingJob.company.userId !== session.user.id)
    ) {
      return NextResponse.json(
        { error: "You do not have permission to delete this job" },
        { status: 403 }
      );
    }

    // Soft delete: set isActive=false
    await db.job.update({
      where: { id: existingJob.id },
      data: { isActive: false },
    });

    return NextResponse.json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("[DELETE /api/jobs/[slug]] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
