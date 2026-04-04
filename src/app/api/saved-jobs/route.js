import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/saved-jobs
 * Returns the authenticated user's saved jobs with pagination.
 * Includes job details: title, slug, company, location, jobType, salaryMin, salaryMax, deadline
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
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
    const skip = (page - 1) * limit;

    const [savedJobs, total] = await Promise.all([
      db.savedJob.findMany({
        where: { userId: session.user.id },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              slug: true,
              location: true,
              jobType: true,
              salaryMin: true,
              salaryMax: true,
              deadline: true,
              isRemote: true,
              isFeatured: true,
              isNew: true,
              isUrgent: true,
              isActive: true,
              company: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  logo: true,
                  logoColor: true,
                  isVerified: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.savedJob.count({
        where: { userId: session.user.id },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      savedJobs,
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
    console.error("[GET /api/saved-jobs] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/saved-jobs
 * Save a job for the authenticated user.
 * Body: { jobId: string }
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
    const { jobId } = body;

    if (!jobId || typeof jobId !== "string") {
      return NextResponse.json(
        { error: "jobId is required and must be a string" },
        { status: 400 }
      );
    }

    // Check if the job exists
    const job = await db.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Check if already saved
    const existing = await db.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId: session.user.id,
          jobId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Job is already saved" },
        { status: 409 }
      );
    }

    // Create saved job
    const savedJob = await db.savedJob.create({
      data: {
        userId: session.user.id,
        jobId,
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Job saved successfully",
        savedJob,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/saved-jobs] Error:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Job is already saved" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/saved-jobs
 * Remove a saved job for the authenticated user.
 * Body: { jobId: string }
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
    const { jobId } = body;

    if (!jobId || typeof jobId !== "string") {
      return NextResponse.json(
        { error: "jobId is required and must be a string" },
        { status: 400 }
      );
    }

    // Check if saved job exists
    const existing = await db.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId: session.user.id,
          jobId,
        },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Saved job not found" },
        { status: 404 }
      );
    }

    // Delete saved job
    await db.savedJob.delete({
      where: {
        userId_jobId: {
          userId: session.user.id,
          jobId,
        },
      },
    });

    return NextResponse.json({
      message: "Job removed from saved list",
    });
  } catch (error) {
    console.error("[DELETE /api/saved-jobs] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
