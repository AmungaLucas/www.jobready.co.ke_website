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
 *   - recentApplications (last 5)
 *
 * For EMPLOYER:
 *   - activeJobsCount, totalApplicationsCount, shortlistedCount, totalViewsCount
 *   - recentApplications (last 5)
 *   - jobsClosingSoon (next 7 days)
 *
 * Note: The current schema has no Applications table (v1 uses externalApplyUrl only)
 * and no role field on User. All users are treated as job seekers. Application-related
 * counts return 0.
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

    // Default to JOB_SEEKER since the User model has no role field
    const role = "JOB_SEEKER";

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

    // EMPLOYER path (for future use when employer accounts are added)
    // All queries will fail gracefully with 0 counts since there's no
    // employer-specific data in the current schema.

    const activeJobsCount = 0;
    const totalApplicationsCount = 0;
    const shortlistedCount = 0;
    const totalViewsCount = 0;

    return NextResponse.json({
      role: "EMPLOYER",
      stats: {
        activeJobsCount,
        totalApplicationsCount,
        shortlistedCount,
        totalViewsCount,
      },
      recent: {
        applications: [],
      },
      jobsClosingSoon: [],
    });
  } catch (error) {
    console.error("[GET /api/dashboard/stats] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
