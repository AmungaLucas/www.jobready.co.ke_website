import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ─── GET /api/opportunities ──────────────────────────────────────
// List / search opportunities with filters and pagination
export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;

    // Parse query params
    const q = searchParams.get("q") || "";
    const opportunityType = searchParams.get("opportunityType") || "";
    const sort = searchParams.get("sort") || "newest";

    let page = parseInt(searchParams.get("page") || "1", 10);
    let limit = parseInt(searchParams.get("limit") || "10", 10);

    // Clamp values
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    if (limit > 50) limit = 50;

    // Build where clause using AND array for clean composition
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const conditions = [
      { isActive: true },
      { publishedAt: { not: null, lte: now } },
      {
        OR: [
          { deadline: null },
          { deadline: { gte: today } },
        ],
      },
    ];

    // Search query (title + description + company.name)
    if (q.trim()) {
      conditions.push({
        OR: [
          { title: { contains: q.trim() } },
          { description: { contains: q.trim() } },
          { company: { name: { contains: q.trim() } } },
        ],
      });
    }

    // Additional filters
    if (opportunityType) {
      conditions.push({ opportunityType });
    }

    const where = { AND: conditions };

    // Sort order
    let orderBy;
    switch (sort) {
      case "deadline":
        orderBy = [{ deadline: "asc" }, { publishedAt: "desc" }];
        break;
      case "featured":
        orderBy = [{ isFeatured: "desc" }, { publishedAt: "desc" }];
        break;
      case "newest":
      default:
        orderBy = { publishedAt: "desc" };
        break;
    }

    // Count total matching opportunities
    const total = await db.opportunity.count({ where });

    // Fetch paginated opportunities
    const skip = (page - 1) * limit;
    const opportunities = await db.opportunity.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        opportunityType: true,
        deadline: true,
        status: true,
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            logoColor: true,
            industry: true,
          },
        },
        isFeatured: true,
        viewCount: true,
        publishedAt: true,
      },
    });

    return NextResponse.json({
      opportunities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/opportunities] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
