import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// ─── GET /api/applications ────────────────────────────────────
// List applications
// - JOB_SEEKER: returns user's own applications
// - EMPLOYER: returns applications to their company's jobs
// - ADMIN: returns all applications
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

    // Parse query params
    const status = searchParams.get("status") || "";
    const jobId = searchParams.get("jobId") || "";
    let page = parseInt(searchParams.get("page") || "1", 10);
    let limit = parseInt(searchParams.get("limit") || "10", 10);

    // Clamp values
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    if (limit > 50) limit = 50;

    // Get current user with role
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Build where clause based on role
    const conditions = [];

    if (user.role === "JOB_SEEKER") {
      // Job seekers see only their own applications
      conditions.push({ userId: session.user.id });
    } else if (user.role === "EMPLOYER") {
      // Employers see applications to their company's jobs
      const company = await db.company.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      });

      if (!company) {
        return NextResponse.json({
          applications: [],
          pagination: { page, limit, total: 0, totalPages: 0 },
        });
      }

      conditions.push({ job: { companyId: company.id } });

      // Employers can filter by specific job
      if (jobId) {
        conditions.push({ jobId });
      }
    } else if (user.role === "ADMIN") {
      // Admins see all applications
      if (jobId) {
        conditions.push({ jobId });
      }
    } else {
      return NextResponse.json(
        { error: "Unauthorized role" },
        { status: 403 }
      );
    }

    // Filter by status
    if (status) {
      conditions.push({ status });
    }

    const where = { AND: conditions };

    // Count total
    const total = await db.application.count({ where });

    // Fetch paginated applications
    const skip = (page - 1) * limit;
    const applications = await db.application.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            slug: true,
            employmentType: true,
            location: true,
            isRemote: true,
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
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            location: true,
            skills: true,
          },
        },
      },
    });

    return NextResponse.json({
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/applications] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
