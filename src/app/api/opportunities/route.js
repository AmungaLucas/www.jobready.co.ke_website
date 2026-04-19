import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ─── GET /api/opportunities ─────────────────────────────────
// List / search opportunities with filters and pagination
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query params
    const q = searchParams.get("q") || "";
    const type = searchParams.get("type") || "";
    const sort = searchParams.get("sort") || "newest";

    let page = parseInt(searchParams.get("page") || "1", 10);
    let limit = parseInt(searchParams.get("limit") || "20", 10);

    // Clamp values
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 20;
    if (limit > 50) limit = 50;

    // Build where clause
    const conditions = [
      { status: "PUBLISHED" },
      { isActive: true },
    ];

    // Text search (title + description + company name)
    if (q.trim()) {
      conditions.push({
        OR: [
          { title: { contains: q.trim() } },
          { description: { contains: q.trim() } },
          { company: { name: { contains: q.trim() } } },
        ],
      });
    }

    // Type filter (opportunityType)
    if (type) {
      conditions.push({ opportunityType: type });
    }

    const where = { AND: conditions };

    // Sort order
    let orderBy;
    switch (sort) {
      case "deadline":
        orderBy = [{ deadline: "asc" }, { publishedAt: "desc" }];
        break;
      case "trending":
        orderBy = [{ viewCount: "desc" }, { publishedAt: "desc" }];
        break;
      case "newest":
      default:
        orderBy = { publishedAt: "desc" };
        break;
    }

    // Count total and fetch in parallel
    const [opportunities, total] = await Promise.all([
      db.opportunity.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
              logoColor: true,
              industry: true,
            },
          },
        },
      }),
      db.opportunity.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        opportunities,
        total,
        page,
        totalPages,
      },
      {
        headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
      }
    );
  } catch (error) {
    console.error("[GET /api/opportunities] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
