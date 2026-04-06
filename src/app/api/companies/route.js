import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/companies
 * Lists companies with filtering and pagination.
 * Query params: industry, location, search, sort, page, limit
 */
export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));
    const skip = (page - 1) * limit;

    // Filters
    const industry = searchParams.get("industry") || "";
    const location = searchParams.get("location") || "";
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "featured"; // featured, newest, name, jobs

    // Build where clause
    const conditions = { isActive: true };
    const andConditions = [];

    if (industry && industry !== "All Industries") {
      conditions.industry = { contains: industry };
    }
    if (location && location !== "All Locations") {
      andConditions.push({
        OR: [
          { city: { contains: location } },
          { town: { contains: location } },
        ],
      });
    }
    if (search) {
      andConditions.push({
        OR: [
          { name: { contains: search } },
          { tagline: { contains: search } },
          { industry: { contains: search } },
        ],
      });
    }
    if (andConditions.length > 0) {
      conditions.AND = andConditions;
    }

    // Build orderBy
    let orderBy = [];
    if (sort === "featured") orderBy = [{ isFeatured: "desc" }, { jobCount: "desc" }];
    else if (sort === "newest") orderBy = [{ createdAt: "desc" }];
    else if (sort === "name") orderBy = [{ name: "asc" }];
    else if (sort === "jobs") orderBy = [{ jobCount: "desc" }];
    else orderBy = [{ isFeatured: "desc" }, { jobCount: "desc" }];

    const [companies, total] = await Promise.all([
      db.company.findMany({
        where: conditions,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          logoColor: true,
          tagline: true,
          industry: true,
          city: true,
          town: true,
          country: true,
          socialLinks: true,
          contactEmail: true,
          phoneNumber: true,
          isFeatured: true,
          isVerified: true,
          jobCount: true,
          website: true,
        },
      }),
      db.company.count({ where: conditions }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      companies,
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
    console.error("[GET /api/companies] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
