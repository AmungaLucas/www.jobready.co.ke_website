"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Bookmark,
  Eye,
  CalendarCheck,
  Briefcase,
  Users,
  CheckCircle2,
  ArrowRight,
  Bell,
  PlusCircle,
  Building2,
  CreditCard,
  TrendingUp,
  Clock,
  UserCheck,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

// ── Helpers ──────────────────────────────────────────
function formatJobType(type) {
  if (!type) return type;
  return type.replace(/_/g, "-").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

const QUICK_ACTIONS_JOB_SEEKER = [
  { title: "Browse Jobs", href: "/jobs", icon: Briefcase, description: "Find your next opportunity" },
  { title: "Edit Profile", href: "/dashboard/profile", icon: UserCheck, description: "Complete your CV profile" },
  { title: "Create Alert", href: "/dashboard/alerts", icon: Bell, description: "Get notified of new jobs" },
  { title: "Saved Jobs", href: "/dashboard/saved-jobs", icon: Bookmark, description: "Review bookmarked jobs" },
];

const QUICK_ACTIONS_EMPLOYER = [
  { title: "Post a Job", href: "/dashboard/jobs/new", icon: PlusCircle, description: "Reach thousands of candidates" },
  { title: "Review Applications", href: "/dashboard/applications", icon: Users, description: "24 new applications" },
  { title: "Company Profile", href: "/dashboard/company", icon: Building2, description: "Update your brand page" },
  { title: "Billing", href: "/dashboard/billing", icon: CreditCard, description: "Manage subscriptions" },
];

// ── Loading Skeleton ──────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Welcome Banner Skeleton */}
      <div className="rounded-xl bg-muted p-6 h-[120px]" />

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="gap-4">
            <CardHeader className="flex flex-row items-center justify-between pb-0">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="size-8 bg-muted rounded-lg" />
            </CardHeader>
            <CardContent>
              <div className="h-7 w-12 bg-muted rounded mb-2" />
              <div className="h-3 w-20 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity + Quick Actions Skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="h-5 w-36 bg-muted rounded mb-2" />
            <div className="h-4 w-48 bg-muted rounded" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3">
                <div className="size-8 bg-muted rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-3 w-20 bg-muted rounded" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="h-5 w-28 bg-muted rounded mb-2" />
            <div className="h-4 w-40 bg-muted rounded" />
          </CardHeader>
          <CardContent className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="size-8 bg-muted rounded-lg shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-3 w-32 bg-muted rounded" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ── Component ──────────────────────────────────────────
export default function DashboardOverview() {
  const { data: session, status } = useSession();
  const [statsData, setStatsData] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/dashboard/stats");
        if (!res.ok) {
          if (res.status === 401) {
            setError("Please sign in to view your dashboard.");
            return;
          }
          throw new Error("Failed to load dashboard stats");
        }
        const data = await res.json();
        setStatsData(data);
        setRecentActivity(data.recent?.savedJobs || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchStats();
    } else if (status === "unauthenticated") {
      setLoading(false);
      setError("Please sign in to view your dashboard.");
    }
  }, [status]);

  // Session loading
  if (status === "loading") return <LoadingSkeleton />;

  // Unauthenticated
  if (status === "unauthenticated" || error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <AlertCircle className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">Sign In Required</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {error || "Please sign in to access your dashboard."}
          </p>
          <Button asChild className="mt-4">
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Data loading
  if (loading) return <LoadingSkeleton />;

  const user = session?.user;
  const firstName = user?.name?.split(" ")[0] || "there";
  const role = statsData?.role || "JOB_SEEKER";
  const isEmployer = role === "EMPLOYER";
  const stats = statsData?.stats || {};

  // Build stats cards from API data
  const statsCards = isEmployer
    ? [
        {
          title: "Active Jobs",
          value: stats.activeJobsCount ?? 0,
          change: "Manage postings",
          icon: Briefcase,
          color: "bg-primary/10 text-primary",
        },
        {
          title: "Total Applications",
          value: stats.totalApplicationsCount ?? 0,
          change: "Review submissions",
          icon: Users,
          color: "bg-secondary/10 text-secondary",
        },
        {
          title: "Shortlisted",
          value: stats.shortlistedCount ?? 0,
          change: "Pending review",
          icon: CheckCircle2,
          color: "bg-purple/10 text-purple",
        },
        {
          title: "Interviews Scheduled",
          value: stats.interviewsCount ?? 0,
          change: "Upcoming",
          icon: CalendarCheck,
          color: "bg-accent/10 text-accent",
        },
      ]
    : [
        {
          title: "Applications Sent",
          value: stats.applicationsCount ?? 0,
          change: "Track progress",
          icon: FileText,
          color: "bg-primary/10 text-primary",
        },
        {
          title: "Saved Jobs",
          value: stats.savedJobsCount ?? 0,
          change: "Bookmark for later",
          icon: Bookmark,
          color: "bg-secondary/10 text-secondary",
        },
        {
          title: "Notifications",
          value: stats.unreadNotifications ?? 0,
          change: "Unread messages",
          icon: Eye,
          color: "bg-purple/10 text-purple",
        },
        {
          title: "Job Alerts",
          value: stats.jobAlertsCount ?? 0,
          change: "Active alerts",
          icon: Bell,
          color: "bg-accent/10 text-accent",
        },
      ];

  const quickActions = isEmployer ? QUICK_ACTIONS_EMPLOYER : QUICK_ACTIONS_JOB_SEEKER;

  // Map recent saved jobs to activity items
  const activityItems = recentActivity.map((item, index) => ({
    id: item.id || index,
    type: "saved",
    message: `Saved "${item.job?.title || "Job"}" at ${item.job?.company?.name || "Company"}`,
    time: item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }) : "Recently",
    icon: Bookmark,
    iconColor: "text-primary",
    jobSlug: item.job?.slug,
  }));

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-xl bg-gradient-to-r from-primary to-primary-dark p-6 text-white">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-blue-100">
            {isEmployer
              ? "Here's what's happening with your job postings today."
              : "Here's an overview of your job search activity."}
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {isEmployer ? (
            <Button
              asChild
              className="bg-white text-primary hover:bg-blue-50"
            >
              <Link href="/dashboard/jobs/new">
                <PlusCircle className="mr-2 size-4" />
                Post New Job
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              className="bg-white text-primary hover:bg-blue-50"
            >
              <Link href="/jobs">
                <Briefcase className="mr-2 size-4" />
                Find Jobs
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="gap-4">
              <CardHeader className="flex flex-row items-center justify-between pb-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-lg p-2 ${stat.color}`}>
                  <Icon className="size-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content: Activity + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity — takes 2 cols */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>Your latest job search updates</CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs">
                {activityItems.length} new
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {activityItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Clock className="size-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No recent activity yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activityItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="mt-0.5 rounded-full bg-muted p-2">
                        <Icon className={`size-4 ${item.iconColor}`} />
                      </div>
                      <div className="flex-1 space-y-1">
                        {item.jobSlug ? (
                          <Link
                            href={`/job/${item.jobSlug}`}
                            className="text-sm leading-snug hover:underline"
                          >
                            {item.message}
                          </Link>
                        ) : (
                          <p className="text-sm leading-snug">{item.message}</p>
                        )}
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="size-3" />
                          {item.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Frequently used actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Icon className="size-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{action.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {action.description}
                      </p>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Completeness (Job Seeker only) */}
      {!isEmployer && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Profile Completeness</CardTitle>
                <CardDescription>
                  Complete your profile to get noticed by employers
                </CardDescription>
              </div>
              <span className="text-sm font-semibold text-primary">65%</span>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={65} className="h-2" />
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Personal Info", done: true },
                { label: "Education", done: true },
                { label: "Work Experience", done: false },
                { label: "Skills & Certifications", done: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 text-sm"
                >
                  {item.done ? (
                    <CheckCircle2 className="size-4 text-secondary shrink-0" />
                  ) : (
                    <div className="size-4 rounded-full border-2 border-muted shrink-0" />
                  )}
                  <span className={item.done ? "text-muted-foreground" : "text-foreground"}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
