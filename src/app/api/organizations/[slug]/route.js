import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ─── GET /api/organizations/[slug] ──────────────────────────
// Get organization profile by slug + active jobs
export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Organization slug is required" },
        { status: 400 }
      );
    }

    // Find company by slug with _count for jobs
    const company = await db.company.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { jobs: true },
        },
      },
    });

    if (!company || !company.isActive) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    // Fetch published active jobs for this company (limit 20)
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const jobs = await db.job.findMany({
      where: {
        companyId: company.id,
        status: "PUBLISHED",
        isActive: true,
        OR: [
          { applicationDeadline: null },
          { applicationDeadline: { gte: today } },
        ],
      },
      orderBy: [
        { isFeatured: "desc" },
        { publishedAt: "desc" },
      ],
      take: 20,
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
      company,
      jobs,
    });
  } catch (error) {
    console.error("[GET /api/organizations/[slug]] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
