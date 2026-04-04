import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/dashboard/stats
 * Returns dashboard statistics for the authenticated user.
 *
 * Dynamically checks User.role from the database and returns:
 * - Role-specific stats
 * - Badge counts for sidebar navigation
 * - Recent activity data
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

    // Fetch real user role from database
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatar: true,
        bio: true,
        location: true,
        education: true,
        skills: true,
        cvUrl: true,
        emailVerified: true,
        phoneVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const role = user.role || "JOB_SEEKER";

    if (role === "EMPLOYER" || role === "ADMIN") {
      // ── EMPLOYER STATS ──
      const company = await db.company.findUnique({
        where: { userId },
        select: { id: true },
      });

      const companyId = company?.id || null;

      const [
        activeJobsCount,
        totalJobsCount,
        totalApplicationsCount,
        shortlistedCount,
        interviewCount,
      ] = await Promise.all([
        db.job.count({
          where: companyId
            ? { companyId, isActive: true, publishedAt: { not: null } }
            : { id: "none" },
        }),
        db.job.count({
          where: companyId ? { companyId } : { id: "none" },
        }),
        db.application.count({
          where: companyId
            ? { job: { companyId } }
            : { id: "none" },
        }),
        db.application.count({
          where: companyId
            ? { job: { companyId }, status: "SHORTLISTED" }
            : { id: "none" },
        }),
        db.application.count({
          where: companyId
            ? { job: { companyId }, status: "INTERVIEW" }
            : { id: "none" },
        }),
      ]);

      // Recent applications for employer
      const recentApplications = companyId
        ? await db.application.findMany({
            where: { job: { companyId } },
            include: {
              user: {
                select: { id: true, name: true, avatar: true },
              },
              job: {
                select: { id: true, title: true, slug: true },
              },
            },
            orderBy: { createdAt: "desc" },
            take: 5,
          })
        : [];

      // Jobs closing soon (next 7 days)
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      const jobsClosingSoon = companyId
        ? await db.job.findMany({
            where: {
              companyId,
              isActive: true,
              deadline: { lte: sevenDaysFromNow, gte: new Date() },
            },
            select: { id: true, title: true, slug: true, deadline: true },
            orderBy: { deadline: "asc" },
            take: 3,
          })
        : [];

      return NextResponse.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role,
          avatar: user.avatar,
        },
        role,
        stats: {
          activeJobsCount,
          totalJobsCount,
          totalApplicationsCount,
          shortlistedCount,
          interviewCount,
        },
        badges: {
          myJobs: totalJobsCount,
          applications: totalApplicationsCount,
        },
        recent: {
          applications: recentApplications,
        },
        jobsClosingSoon,
      });
    }

    // ── JOB SEEKER STATS ──
    const [
      applicationsCount,
      savedJobsCount,
      jobAlertsCount,
      unreadNotifications,
    ] = await Promise.all([
      db.application.count({ where: { userId } }),
      db.savedJob.count({ where: { userId } }),
      db.jobAlert.count({ where: { userId, isActive: true } }),
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
            location: true,
            jobType: true,
            deadline: true,
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

    // Recent applications
    const recentApplications = await db.application.findMany({
      where: { userId },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            slug: true,
            company: {
              select: { name: true, logo: true, logoColor: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role,
        avatar: user.avatar,
      },
      role,
      stats: {
        applicationsCount,
        savedJobsCount,
        unreadNotifications,
        jobAlertsCount,
      },
      badges: {
        applications: applicationsCount,
        savedJobs: savedJobsCount,
        alerts: jobAlertsCount,
      },
      recent: {
        savedJobs: recentSavedJobs.map((sj) => ({
          id: sj.id,
          createdAt: sj.createdAt,
          job: sj.job,
        })),
        applications: recentApplications,
      },
    });
  } catch (error) {
    console.error("[GET /api/dashboard/stats] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
