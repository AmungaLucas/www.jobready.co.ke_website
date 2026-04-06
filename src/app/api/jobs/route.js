import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateSlug } from "@/lib/slug";

// ─── Value mapping: old uppercase → new Title Case ─────────
const EMPLOYMENT_TYPE_MAP = {
  FULL_TIME: "Full-time",
  "FULL-TIME": "Full-time",
  PART_TIME: "Part-time",
  "PART-TIME": "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  FREELANCE: "Freelance",
  VOLUNTEER: "Volunteer",
};

function mapEmploymentType(val) {
  if (!val) return undefined;
  return EMPLOYMENT_TYPE_MAP[val] || EMPLOYMENT_TYPE_MAP[val.toUpperCase()] || val;
}

// ─── GET /api/jobs ────────────────────────────────────────────
// List / search jobs with filters and pagination
export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;

    // Parse query params
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const jobType = searchParams.get("jobType") || "";
    const experienceLevel = searchParams.get("experienceLevel") || "";
    const location = searchParams.get("location") || "";
    const isRemote = searchParams.get("isRemote");
    const companyId = searchParams.get("companyId") || "";
    const sort = searchParams.get("sort") || "newest";

    let page = parseInt(searchParams.get("page") || "1", 10);
    let limit = parseInt(searchParams.get("limit") || "10", 10);

    // Clamp values
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    if (limit > 50) limit = 50;

    // Build where clause using AND array for clean composition
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const conditions = [
      { isActive: true },
      { status: "Published" },
      {
        OR: [
          { applicationDeadline: null },
          { applicationDeadline: { gte: today } },
        ],
      },
    ];

    // Search query (title + description)
    if (q.trim()) {
      conditions.push({
        OR: [
          { title: { contains: q.trim() } },
          { description: { contains: q.trim() } },
        ],
      });
    }

    // Additional filters
    if (category) {
      // categories is a JSON array — search with quoted value for exact match
      conditions.push({ categories: { string_contains: `"${category}"` } });
    }
    if (jobType) {
      const mappedType = mapEmploymentType(jobType);
      conditions.push({ employmentType: mappedType });
    }
    if (experienceLevel) {
      conditions.push({ experienceLevel });
    }
    if (location) {
      conditions.push({ location: { contains: location } });
    }
    if (isRemote === "true") {
      conditions.push({ isRemote: true });
    }
    if (companyId) {
      conditions.push({ companyId });
    }

    const where = { AND: conditions };

    // Sort order
    let orderBy;
    switch (sort) {
      case "deadline":
        orderBy = [{ applicationDeadline: "asc" }, { createdAt: "desc" }];
        break;
      case "featured":
        orderBy = [{ isFeatured: "desc" }, { createdAt: "desc" }];
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    // Count total matching jobs
    const total = await db.job.count({ where });

    // Fetch paginated jobs
    const skip = (page - 1) * limit;
    const jobs = await db.job.findMany({
      where,
      orderBy,
      skip,
      take: limit,
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
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/jobs] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── POST /api/jobs ───────────────────────────────────────────
// Create a new job (EMPLOYER only)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check user role
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true },
    });

    if (!user || (user.role !== "EMPLOYER" && user.role !== "ADMIN")) {
      return NextResponse.json(
        { error: "Only employers can create job listings" },
        { status: 403 }
      );
    }

    // Find user's company
    const company = await db.company.findUnique({
      where: { userId: session.user.id },
      select: { id: true, isActive: true },
    });

    if (!company) {
      return NextResponse.json(
        { error: "You must create a company profile before posting jobs" },
        { status: 400 }
      );
    }

    if (!company.isActive) {
      return NextResponse.json(
        { error: "Your company profile is not active" },
        { status: 400 }
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
      deadline,
      howToApply,
      tags,
      applicationEmail,
      externalApplyUrl,
      country,
      city,
      town,
      status,
      isFeatured,
      positions,
      draft,
    } = body;

    // Validate required fields
    if (!title || typeof title !== "string" || title.trim().length < 3) {
      return NextResponse.json(
        { error: "Job title is required (minimum 3 characters)" },
        { status: 400 }
      );
    }

    if (!description || typeof description !== "string" || description.trim().length < 20) {
      return NextResponse.json(
        { error: "Job description is required (minimum 20 characters)" },
        { status: 400 }
      );
    }

    if (!category || typeof category !== "string") {
      return NextResponse.json(
        { error: "Job category is required" },
        { status: 400 }
      );
    }

    if (!jobType || typeof jobType !== "string") {
      return NextResponse.json(
        { error: "Job type is required" },
        { status: 400 }
      );
    }

    if (!experienceLevel || typeof experienceLevel !== "string") {
      return NextResponse.json(
        { error: "Experience level is required" },
        { status: 400 }
      );
    }

    if (!location || typeof location !== "string" || location.trim().length === 0) {
      return NextResponse.json(
        { error: "Job location is required" },
        { status: 400 }
      );
    }

    // Generate slug from title
    let slug = generateSlug(title.trim());

    // Ensure slug uniqueness
    const existingSlug = await db.job.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    // Parse deadline
    let parsedDeadline = null;
    if (deadline) {
      parsedDeadline = new Date(deadline);
      if (isNaN(parsedDeadline.getTime())) {
        return NextResponse.json(
          { error: "Invalid deadline date format" },
          { status: 400 }
        );
      }
    }

    // Map employment type to Title Case
    const mappedJobType = mapEmploymentType(jobType);

    // Build categories JSON array from category string
    const categories = Array.isArray(category) ? category : [category];

    // Build job data
    const jobData = {
      title: title.trim(),
      slug,
      description: description.trim(),
      categories,
      employmentType: mappedJobType,
      experienceLevel,
      location: location.trim(),
      isRemote: Boolean(isRemote),
      salaryMin: salaryMin ? parseInt(salaryMin, 10) : null,
      salaryMax: salaryMax ? parseInt(salaryMax, 10) : null,
      salaryPeriod: salaryPeriod || "Monthly",
      isSalaryNegotiable: Boolean(isSalaryNegotiable),
      applicationDeadline: parsedDeadline,
      howToApply: howToApply || null,
      tags: tags && Array.isArray(tags) ? tags : null,
      applicationEmail: applicationEmail || null,
      applicationUrl: externalApplyUrl || null,
      country: country || null,
      city: city || null,
      town: town || null,
      status: status || "Draft",
      isFeatured: Boolean(isFeatured) && user.role === "ADMIN",
      positions: positions ? parseInt(positions, 10) : 1,
      companyId: company.id,
    };

    // If not draft, publish immediately
    if (draft !== true) {
      jobData.isActive = true;
      jobData.status = "Published";
    } else {
      jobData.isActive = false;
      jobData.status = "Draft";
    }

    // Create job
    const job = await db.job.create({
      data: jobData,
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

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/jobs] Error:", error);

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
