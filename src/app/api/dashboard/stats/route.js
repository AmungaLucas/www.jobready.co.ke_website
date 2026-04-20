import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/dashboard/stats
 * Returns dashboard statistics for the authenticated user.
 *
 * For JOB_SEEKER:
 *   - applicationsCount, savedJobsCount, profileViewsCount, interviewsCount
 *   - recentSavedJobs (last 5)
 *
 * For EMPLOYER:
 *   - activeJobsCount, totalApplicationsCount, shortlistedCount, interviewsCount,
 *     hiredCount, newThisWeek, profileViews
 *   - recentApplications (last 5 — includes applicant name/email and job title)
 *   - jobsClosingSoon (application deadline within 7 days)
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const role = session.user.role || "JOB_SEEKER";

    if (role === "JOB_SEEKER") {
      // Fetch job seeker stats in parallel
      const [
        savedJobsCount,
        notificationsCount,
        jobAlertsCount,
        ordersCount,
        unreadNotifications,
      ] = await Promise.all([
        db.savedJob.count({ where: { userId } }),
        db.notification.count({ where: { userId } }),
        db.jobAlert.count({ where: { userId, isActive: true } }),
        db.order.count({ where: { userId } }),
        db.notification.count({ where: { userId, isRead: false } }),
      ]);

      // Get recent saved jobs (last 5)
      const recentSavedJobs = await db.savedJob.findMany({
        where: { userId },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              slug: true,
              county: true,
              town: true,
              employmentType: true,
              applicationDeadline: true,
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
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      });

      return NextResponse.json({
        role,
        stats: {
          applicationsCount: 0, // No Applications table in v1
          savedJobsCount,
          profileViewsCount: 0, // Not tracked separately
          interviewsCount: 0, // No Applications table
          unreadNotifications,
          jobAlertsCount,
          ordersCount,
        },
        recent: {
          savedJobs: recentSavedJobs.map((sj) => ({
            id: sj.id,
            createdAt: sj.createdAt,
            job: sj.job,
          })),
        },
      });
    }

    // ================================================================
    // EMPLOYER path — query real data from jobs created by this user
    // ================================================================

    // Find all company IDs linked to this employer user
    const companies = await db.company.findMany({
      where: { createdBy: userId },
      select: { id: true },
    });
    const companyIds = companies.map((c) => c.id);

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Run all independent queries in parallel
    const [
      activeJobsCount,
      totalApplicationsCount,
      shortlistedCount,
      interviewsCount,
      hiredCount,
      newThisWeek,
      profileViews,
      recentApplications,
      jobsClosingSoon,
    ] = await Promise.all([
      // 1. Active jobs count
      db.job.count({
        where: {
          createdBy: userId,
          status: "PUBLISHED",
          isActive: true,
        },
      }),

      // 2. Total applications for user's jobs
      db.application.count({
        where: { job: { createdBy: userId } },
      }),

      // 3. Shortlisted applications
      db.application.count({
        where: {
          job: { createdBy: userId },
          status: "SHORTLISTED",
        },
      }),

      // 4. Interview-stage applications
      db.application.count({
        where: {
          job: { createdBy: userId },
          status: "INTERVIEW",
        },
      }),

      // 5. Hired applications
      db.application.count({
        where: {
          job: { createdBy: userId },
          status: "HIRED",
        },
      }),

      // 6. New applications this week (last 7 days)
      db.application.count({
        where: {
          job: { createdBy: userId },
          createdAt: { gte: sevenDaysAgo },
        },
      }),

      // 7. Profile views — company pages for this employer's companies
      db.pageView.count({
        where: {
          pageType: "COMPANY",
          ...(companyIds.length > 0
            ? { pageId: { in: companyIds } }
            : { pageId: "__none__" }), // match nothing if no companies
        },
      }),

      // 8. Recent applications (last 5) with applicant info and job title
      db.application.findMany({
        where: { job: { createdBy: userId } },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          job: {
            select: { id: true, title: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),

      // 9. Jobs closing soon — deadline within 7 days
      db.job.findMany({
        where: {
          createdBy: userId,
          status: "PUBLISHED",
          isActive: true,
          applicationDeadline: {
            gte: now,
            lte: sevenDaysFromNow,
          },
        },
        select: {
          id: true,
          title: true,
          slug: true,
          applicationDeadline: true,
          company: {
            select: { name: true, slug: true, logo: true, logoColor: true },
          },
        },
        orderBy: { applicationDeadline: "asc" },
        take: 10,
      }),
    ]);

    return NextResponse.json({
      role: "EMPLOYER",
      stats: {
        activeJobsCount,
        totalApplicationsCount,
        shortlistedCount,
        interviewsCount,
        hiredCount,
        newThisWeek,
        profileViews,
      },
      recent: {
        applications: recentApplications.map((app) => ({
          id: app.id,
          status: app.status,
          createdAt: app.createdAt,
          user: app.user,
          job: app.job,
        })),
      },
      jobsClosingSoon,
    });
  } catch (error) {
    console.error("[GET /api/dashboard/stats] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
