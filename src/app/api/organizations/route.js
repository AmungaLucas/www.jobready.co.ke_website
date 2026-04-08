import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ─── GET /api/organizations ─────────────────────────────────
// List / search organizations with filters and pagination
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query params
    const q = searchParams.get("q") || "";
    const industry = searchParams.get("industry") || "";
    const county = searchParams.get("county") || "";

    let page = parseInt(searchParams.get("page") || "1", 10);
    let limit = parseInt(searchParams.get("limit") || "20", 10);

    // Clamp values
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 20;
    if (limit > 50) limit = 50;

    // Build where clause
    const conditions = [{ isActive: true }];

    // Text search on name, industry, county
    if (q.trim()) {
      conditions.push({
        OR: [
          { name: { contains: q.trim() } },
          { industry: { contains: q.trim() } },
          { county: { contains: q.trim() } },
        ],
      });
    }

    // Industry filter
    if (industry) {
      conditions.push({ industry: { contains: industry } });
    }

    // County filter
    if (county) {
      conditions.push({ county: { contains: county } });
    }

    const where = { AND: conditions };

    // Count total and fetch in parallel
    const [companies, total] = await Promise.all([
      db.company.findMany({
        where,
        orderBy: [{ isFeatured: "desc" }, { jobCount: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          logoColor: true,
          industry: true,
          organizationType: true,
          size: true,
          county: true,
          town: true,
          country: true,
          website: true,
          isFeatured: true,
          isVerified: true,
          _count: {
            select: { jobs: true },
          },
        },
      }),
      db.company.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      companies,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("[GET /api/organizations] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
