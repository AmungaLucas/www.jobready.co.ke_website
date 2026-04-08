import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ─── GET /api/career-advice ─────────────────────────────────
// List published career advice articles with pagination
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    let page = parseInt(searchParams.get("page") || "1", 10);
    let limit = parseInt(searchParams.get("limit") || "12", 10);

    // Clamp values
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 12;
    if (limit > 50) limit = 50;

    // Build where clause — published articles with a publish date
    const where = {
      isPublished: true,
      publishedAt: { not: null },
    };

    // Count total and fetch in parallel
    const [articles, total] = await Promise.all([
      db.blogArticle.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              slug: true,
              title: true,
              avatar: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              color: true,
            },
          },
        },
      }),
      db.blogArticle.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      articles,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("[GET /api/career-advice] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
