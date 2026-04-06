import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ─── GET /api/articles/[slug] ─────────────────────────────────
// Get a single published article by slug with related articles
export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Article slug is required" },
        { status: 400 }
      );
    }

    // Find the article — must be published
    const article = await db.blogArticle.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            slug: true,
            title: true,
            bio: true,
            avatar: true,
            linkedinUrl: true,
            articleCount: true,
            totalViews: true,
            peopleCoached: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            gradient: true,
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

    // Article not found or not published
    if (!article || !article.isPublished) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    // Normalize tags to flat array
    const normalizedArticle = {
      ...article,
      tags: article.tags.map((at) => at.tag),
    };

    // Increment viewsCount (fire and forget)
    db.blogArticle
      .update({
        where: { id: article.id },
        data: { viewsCount: { increment: 1 } },
      })
      .catch(() => {});

    // Increment author's totalViews (fire and forget)
    db.author
      .update({
        where: { id: article.authorId },
        data: { totalViews: { increment: 1 } },
      })
      .catch(() => {});

    // Find related articles — same category, different id, published, take 3
    const relatedArticles = await db.blogArticle.findMany({
      where: {
        categoryId: article.categoryId,
        id: { not: article.id },
        isPublished: true,
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
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
      },
    });

    return NextResponse.json({
      article: normalizedArticle,
      relatedArticles,
    });
  } catch (error) {
    console.error("[GET /api/articles/[slug]] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
