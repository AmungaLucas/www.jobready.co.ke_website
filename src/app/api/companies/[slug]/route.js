import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ─── GET /api/companies/[slug] ───────────────────────────────
// Get company profile by slug + active jobs + similar companies
export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Company slug is required" },
        { status: 400 }
      );
    }

    // Find company by slug (active only)
    const company = await db.company.findUnique({
      where: { slug },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    if (!company.isActive) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    // Parse pagination params
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page"), 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit"), 10) || 10));
    const skip = (page - 1) * limit;

    // Date helpers for active job filtering
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Build where clause for active jobs
    const jobsWhere = {
      companyId: company.id,
      isActive: true,
      publishedAt: { not: null, lte: now },
      OR: [
        { applicationDeadline: null },
        { applicationDeadline: { gte: today } },
      ],
    };

    // Count total active jobs
    const total = await db.job.count({ where: jobsWhere });

    // Fetch paginated active jobs
    const jobs = await db.job.findMany({
      where: jobsWhere,
      orderBy: [
        { isFeatured: "desc" },
        { publishedAt: "desc" },
      ],
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

    // Fetch similar companies (same industry, different id, active)
    let similarCompanies = [];
    if (company.industry) {
      similarCompanies = await db.company.findMany({
        where: {
          id: { not: company.id },
          industry: company.industry,
          isActive: true,
        },
        orderBy: [
          { isFeatured: "desc" },
          { jobCount: "desc" },
        ],
        take: 5,
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          logoColor: true,
          industry: true,
          county: true,
          town: true,
          country: true,
          isVerified: true,
          jobCount: true,
        },
      });
    }

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      company,
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      similarCompanies,
    });
  } catch (error) {
    console.error("[GET /api/companies/[slug]] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
