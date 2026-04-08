import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ─── Value mapping: Title Case display → UPPER_SNAKE_CASE (DB canonical) ─────────
// The DB now stores UPPER_SNAKE_CASE values. This helper normalises incoming
// legacy Title Case values from the frontend so queries match correctly.
function mapEmploymentType(val) {
  if (!val) return undefined;
  // Already UPPER_SNAKE — return as-is
  if (/^[A-Z][A-Z0-9_]*$/.test(val)) return val;
  // Common legacy mappings
  const legacy = {
    "Full-time": "FULL_TIME",
    "Part-time": "PART_TIME",
    Contract: "CONTRACT",
    Internship: "INTERNSHIP",
    Freelance: "FREELANCE",
    Volunteer: "VOLUNTEER",
  };
  return legacy[val] || val;
}

/**
 * GET /api/search
 * Global search across jobs, opportunities, companies, and articles.
 * Public route — no auth required.
 *
 * Query params:
 *   q         — search query (required)
 *   type      — "all" (default), "jobs", "opportunities", "companies", "articles"
 *   category  — filter by category
 *   location  — filter by location
 *   jobType   — filter by job type
 *   page      — page number (default 1)
 *   limit     — results per type per page (default 10)
 */
export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;
    const q = (searchParams.get("q") || "").trim();

    if (!q) {
      return NextResponse.json(
        { error: "Search query (q) is required" },
        { status: 400 }
      );
    }

    const type = searchParams.get("type") || "all";
    const category = searchParams.get("category") || null;
    const location = searchParams.get("location") || null;
    const jobType = searchParams.get("jobType") || null;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
    const skip = (page - 1) * limit;

    const validTypes = ["all", "jobs", "opportunities", "companies", "articles"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    // Build the where clause for each model
    // MySQL's default collation (utf8mb4_general_ci) is case-insensitive,
    // so `contains` already performs case-insensitive search.
    const searchKeyword = { contains: q };

    const results = {};

    // --- Search Jobs ---
    if (type === "all" || type === "jobs") {
      const jobWhere = {
        AND: [
          { OR: [
            { title: searchKeyword },
            { description: searchKeyword },
            { company: { name: searchKeyword } },
          ]},
          { isActive: true },
          { status: "PUBLISHED" },
          ...(category ? [{ categories: { string_contains: `"${category}"` } }] : []),
          ...(location ? [{ OR: [{ county: { contains: location } }, { town: { contains: location } }] }] : []),
          ...(jobType ? [{ employmentType: mapEmploymentType(jobType) }] : []),
        ],
      };

      const [jobs, jobTotal] = await Promise.all([
        db.job.findMany({
          where: jobWhere,
          select: {
            id: true,
            title: true,
            slug: true,
            county: true,
            town: true,
            isRemote: true,
            employmentType: true,
            experienceLevel: true,
            categories: true,
            salaryMin: true,
            salaryMax: true,
            isFeatured: true,
            applicationDeadline: true,
            createdAt: true,
            company: {
              select: {
                id: true,
                name: true,
                slug: true,
                logo: true,
                logoColor: true,
                isVerified: true,
              },
            },
          },
          orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
          skip,
          take: limit,
        }),
        db.job.count({ where: jobWhere }),
      ]);

      results.jobs = { items: jobs, total: jobTotal };
    } else {
      results.jobs = { items: [], total: 0 };
    }

    // --- Search Opportunities ---
    if (type === "all" || type === "opportunities") {
      const oppWhere = {
        AND: [
          { OR: [
            { title: searchKeyword },
            { description: searchKeyword },
            { company: { name: searchKeyword } },
          ]},
          { isActive: true },
          ...(category ? [{ opportunityType: category }] : []),
        ],
      };

      const [opportunities, oppTotal] = await Promise.all([
        db.opportunity.findMany({
          where: oppWhere,
          select: {
            id: true,
            title: true,
            slug: true,
            opportunityType: true,
            isFeatured: true,
            deadline: true,
            publishedAt: true,
            company: {
              select: {
                id: true,
                name: true,
                slug: true,
                logo: true,
                logoColor: true,
                isVerified: true,
              },
            },
          },
          orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
          skip,
          take: limit,
        }),
        db.opportunity.count({ where: oppWhere }),
      ]);

      results.opportunities = { items: opportunities, total: oppTotal };
    } else {
      results.opportunities = { items: [], total: 0 };
    }

    // --- Search Companies ---
    if (type === "all" || type === "companies") {
      const companyWhere = {
        AND: [
          { OR: [
            { name: searchKeyword },
            { description: searchKeyword },
            { industry: searchKeyword },
          ]},
          { isActive: true },
        ],
      };

      const [companies, companyTotal] = await Promise.all([
        db.company.findMany({
          where: companyWhere,
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            logoColor: true,
            industry: true,
            county: true,
            isVerified: true,
            isFeatured: true,
            jobCount: true,
          },
          orderBy: [{ isFeatured: "desc" }, { jobCount: "desc" }],
          skip,
          take: limit,
        }),
        db.company.count({ where: companyWhere }),
      ]);

      results.companies = { items: companies, total: companyTotal };
    } else {
      results.companies = { items: [], total: 0 };
    }

    // --- Search Articles ---
    if (type === "all" || type === "articles") {
      const articleWhere = {
        AND: [
          { OR: [
            { title: searchKeyword },
            { excerpt: searchKeyword },
            { content: searchKeyword },
          ]},
          { isPublished: true },
          ...(category ? [{ category: { slug: category } }] : []),
        ],
      };

      const [articles, articleTotal] = await Promise.all([
        db.blogArticle.findMany({
          where: articleWhere,
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            featuredImage: true,
            readingTime: true,
            viewsCount: true,
            isFeatured: true,
            publishedAt: true,
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
                avatar: true,
                title: true,
              },
            },
          },
          orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
          skip,
          take: limit,
        }),
        db.blogArticle.count({ where: articleWhere }),
      ]);

      results.articles = { items: articles, total: articleTotal };
    } else {
      results.articles = { items: [], total: 0 };
    }

    // Compute overall totals
    const overallTotal =
      results.jobs.total +
      results.opportunities.total +
      results.companies.total +
      results.articles.total;

    return NextResponse.json({
      query: q,
      type,
      page,
      limit,
      overallTotal,
      results,
    });
  } catch (error) {
    console.error("[GET /api/search] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
