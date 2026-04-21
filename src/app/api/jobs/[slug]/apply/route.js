import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { presets, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { sendEmail, applicationReceiptTemplate } from "@/lib/email";

// ─── GET /api/jobs/[slug]/apply ───────────────────────────────
// Check if the current user has applied to this job
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Job slug is required" },
        { status: 400 }
      );
    }

    // Find job
    const job = await db.job.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Check if user has already applied
    const application = await db.application.findUnique({
      where: {
        userId_jobId: {
          userId: session.user.id,
          jobId: job.id,
        },
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
    });

    if (application) {
      return NextResponse.json({
        applied: true,
        appliedAt: application.createdAt,
        status: application.status,
      });
    }

    return NextResponse.json({
      applied: false,
    });
  } catch (error) {
    console.error("[GET /api/jobs/[slug]/apply] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── POST /api/jobs/[slug]/apply ──────────────────────────────
// Apply to a job (JOB_SEEKER only)
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check user role — only JOB_SEEKER can apply
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true },
    });

    if (!user || user.role !== "JOB_SEEKER") {
      return NextResponse.json(
        { error: "Only job seekers can apply to jobs" },
        { status: 403 }
      );
    }

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Job slug is required" },
        { status: 400 }
      );
    }

    // --- Rate limiting (per authenticated user + IP) ---
    const ip = getClientIp(request);
    const { success: rateOk, resetAt } = await presets.applyJob(`${session.user.id}:${ip}`);
    if (!rateOk) {
      const resp = rateLimitResponse(10, resetAt);
      return NextResponse.json(resp.body, { status: resp.status, headers: resp.headers });
    }

    // Find job
    const job = await db.job.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        isActive: true,
        status: true,
        applicationDeadline: true,
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Check: job is active and published
    if (!job.isActive || job.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "This job is no longer available" },
        { status: 400 }
      );
    }

    // Check: deadline not passed
    if (job.applicationDeadline) {
      const now = new Date();
      if (new Date(job.applicationDeadline) < now) {
        return NextResponse.json(
          { error: "The application deadline for this job has passed" },
          { status: 400 }
        );
      }
    }

    // Check: user hasn't already applied
    const existingApplication = await db.application.findUnique({
      where: {
        userId_jobId: {
          userId: session.user.id,
          jobId: job.id,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied to this job" },
        { status: 409 }
      );
    }

    // Parse body
    const body = await request.json();
    const { coverLetter } = body;

    // Validate cover letter if provided
    let coverLetterValue = null;
    if (coverLetter !== undefined && coverLetter !== null) {
      if (typeof coverLetter !== "string") {
        return NextResponse.json(
          { error: "Cover letter must be text" },
          { status: 400 }
        );
      }
      if (coverLetter.length > 10000) {
        return NextResponse.json(
          { error: "Cover letter must be under 10000 characters" },
          { status: 400 }
        );
      }
      coverLetterValue = coverLetter.trim() || null;
    }

    // Create application in a transaction (also increments job applicantCount)
    const application = await db.$transaction(async (tx) => {
      // Create the application record
      const app = await tx.application.create({
        data: {
          jobId: job.id,
          userId: session.user.id,
          coverLetter: coverLetterValue,
          status: "PENDING",
        },
        include: {
          job: {
            select: {
              title: true,
              slug: true,
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
            },
          },
        },
      });

      // Increment the job's applicantCount denormalized counter
      await tx.job.update({
        where: { id: job.id },
        data: {
          applicantCount: {
            increment: 1,
          },
        },
      });

      return app;
    });

    // --- Send application receipt email (non-blocking) ---
    if (application.user?.email) {
      sendEmail({
        to: application.user.email,
        subject: `Application Submitted: ${application.job?.title || "Job"}`,
        ...applicationReceiptTemplate({
          userName: application.user.name,
          jobTitle: application.job?.title || "a position",
          companyName: application.job?.company?.name || "the company",
          slug: application.job?.slug || "",
        }),
      }).catch((err) =>
        console.error("[Apply] Receipt email failed:", err.message)
      );
    }

    return NextResponse.json({
      message: "Application submitted successfully",
      application,
    }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/jobs/[slug]/apply] Error:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "You have already applied to this job" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
