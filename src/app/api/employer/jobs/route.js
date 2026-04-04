import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/employer/jobs
 * Returns all jobs posted by the current employer (all statuses including drafts).
 * Supports filtering by status, search, and pagination.
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

    // Check user is employer
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true },
    });

    if (!user || (user.role !== "EMPLOYER" && user.role !== "ADMIN")) {
      return NextResponse.json(
        { error: "Only employers can access this resource" },
        { status: 403 }
      );
    }

    // Find employer's company
    const company = await db.company.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!company) {
      // No company yet — return empty list
      return NextResponse.json({
        jobs: [],
        statusCounts: {},
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      });
    }

    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status") || "";
    const q = searchParams.get("q") || "";
    let page = parseInt(searchParams.get("page") || "1", 10);
    let limit = parseInt(searchParams.get("limit") || "50", 10);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 50;
    if (limit > 100) limit = 100;

    // Build where clause
    const conditions = [{ companyId: company.id }];

    if (status) {
      if (status === "ACTIVE") {
        conditions.push({ isActive: true, publishedAt: { not: null } });
      } else if (status === "DRAFT") {
        conditions.push({ isActive: false, publishedAt: null });
      } else if (status === "PAUSED") {
        conditions.push({ isActive: false, publishedAt: { not: null } });
      } else if (status === "CLOSED") {
        conditions.push({ deadline: { lt: new Date() }, isActive: false });
      }
    }

    if (q.trim()) {
      conditions.push({
        OR: [
          { title: { contains: q.trim() } },
          { location: { contains: q.trim() } },
        ],
      });
    }

    const where = { AND: conditions };

    // Get status counts for tabs (unfiltered)
    const [
      totalCount,
      activeCount,
      pausedCount,
      draftCount,
      closedCount,
    ] = await Promise.all([
      db.job.count({ where: { companyId: company.id } }),
      db.job.count({ where: { companyId: company.id, isActive: true, publishedAt: { not: null } } }),
      db.job.count({ where: { companyId: company.id, isActive: false, publishedAt: { not: null } } }),
      db.job.count({ where: { companyId: company.id, isActive: false, publishedAt: null } }),
      db.job.count({ where: { companyId: company.id, deadline: { lt: new Date() } } }),
    ]);

    // Count filtered results
    const filteredTotal = await db.job.count({ where });

    // Fetch jobs with application counts
    const skip = (page - 1) * limit;
    const jobs = await db.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });

    // Map jobs to frontend format
    const mappedJobs = jobs.map((job) => {
      // Determine display status
      let displayStatus = "DRAFT";
      if (job.isActive && job.publishedAt) {
        displayStatus = job.deadline && new Date(job.deadline) < new Date() ? "CLOSED" : "ACTIVE";
      } else if (!job.isActive && job.publishedAt) {
        displayStatus = "PAUSED";
      }

      return {
        id: job.id,
        title: job.title,
        slug: job.slug,
        location: job.location,
        type: job.jobType?.replace(/_/g, "-").replace(/\b\w/g, (c) => c.toUpperCase()) || job.jobType,
        status: displayStatus,
        applicants: job._count.applications,
        postedDate: job.createdAt,
        category: job.category?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || job.category,
        publishedAt: job.publishedAt,
        deadline: job.deadline,
        isActive: job.isActive,
      };
    });

    return NextResponse.json({
      jobs: mappedJobs,
      statusCounts: {
        total: totalCount,
        ACTIVE: activeCount,
        PAUSED: pausedCount,
        DRAFT: draftCount,
        CLOSED: closedCount,
      },
      pagination: {
        page,
        limit,
        total: filteredTotal,
        totalPages: Math.ceil(filteredTotal / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/employer/jobs] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
