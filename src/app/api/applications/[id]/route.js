import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// ─── PUT /api/applications/[id] ───────────────────────────────
// Update application status (EMPLOYER owner of the job, or ADMIN)
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      );
    }

    // Find the application with job + company info
    const application = await db.application.findUnique({
      where: { id },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            companyId: true,
            company: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Check permissions: must be the employer who owns the job's company, or ADMIN
    const currentUser = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (
      !currentUser ||
      (currentUser.role !== "ADMIN" && application.job.company.id !== session.user.id)
    ) {
      return NextResponse.json(
        { error: "You do not have permission to update this application" },
        { status: 403 }
      );
    }

    // Parse body
    const body = await request.json();
    const { status, employerNotes } = body;

    // Validate status
    const validStatuses = ["PENDING", "SHORTLISTED", "INTERVIEW", "REJECTED", "HIRED"];

    if (status === undefined && employerNotes === undefined) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updateData = {};

    if (status !== undefined) {
      if (typeof status !== "string" || !validStatuses.includes(status)) {
        return NextResponse.json(
          {
            error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
          },
          { status: 400 }
        );
      }
      updateData.status = status;
    }

    if (employerNotes !== undefined) {
      if (typeof employerNotes !== "string") {
        return NextResponse.json(
          { error: "Employer notes must be text" },
          { status: 400 }
        );
      }
      updateData.employerNotes = employerNotes.trim() || null;
    }

    // Update application
    const updatedApplication = await db.application.update({
      where: { id },
      data: updateData,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            slug: true,
            employmentType: true,
            county: true,
            town: true,
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
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            location: true,
            skills: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Application updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("[PUT /api/applications/[id]] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
