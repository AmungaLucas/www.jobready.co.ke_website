import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ─── GET /api/articles ────────────────────────────────────────
// List / search published articles with filters and pagination
export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;

    // Parse query params
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const tag = searchParams.get("tag") || "";
    const author = searchParams.get("author") || "";
    const sort = searchParams.get("sort") || "newest";

    let page = parseInt(searchParams.get("page") || "1", 10);
    let limit = parseInt(searchParams.get("limit") || "10", 10);

    // Clamp values
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    if (limit > 50) limit = 50;

    // Build where clause using AND array for clean composition
    const conditions = [{ isPublished: true }];

    // Search query (title + excerpt + content)
    if (q.trim()) {
      conditions.push({
        OR: [
          { title: { contains: q.trim() } },
          { excerpt: { contains: q.trim() } },
          { content: { contains: q.trim() } },
        ],
      });
    }

    // Filter by category slug
    if (category) {
      conditions.push({
        category: { slug: category },
      });
    }

    // Filter by tag slug (via articleTags junction)
    if (tag) {
      conditions.push({
        tags: {
          some: {
            tag: { slug: tag },
          },
        },
      });
    }

    // Filter by author slug
    if (author) {
      conditions.push({
        author: { slug: author },
      });
    }

    const where = { AND: conditions };

    // Sort order
    let orderBy;
    switch (sort) {
      case "featured":
        orderBy = [{ isFeatured: "desc" }, { publishedAt: "desc" }];
        break;
      case "popular":
        orderBy = [{ viewsCount: "desc" }, { publishedAt: "desc" }];
        break;
      case "newest":
      default:
        orderBy = { publishedAt: "desc" };
        break;
    }

    // Count total matching articles
    const total = await db.blogArticle.count({ where });

    // Fetch paginated articles
    const skip = (page - 1) * limit;
    const articles = await db.blogArticle.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            slug: true,
            title: true,
            avatar: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    // Normalize tags to flat array (extract tag from articleTag junction)
    const normalizedArticles = articles.map((article) => ({
      ...article,
      tags: article.tags.map((at) => at.tag),
    }));

    return NextResponse.json({
      articles: normalizedArticles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/articles] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
