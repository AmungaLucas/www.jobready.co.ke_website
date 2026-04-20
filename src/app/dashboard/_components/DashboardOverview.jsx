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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Crown,
  Sparkles,
  ArrowUpRight,
  AlertTriangle,
  Inbox,
} from "lucide-react";
import { formatRelativeDate, formatCurrency } from "@/lib/format";

// ── Helpers ──────────────────────────────────────────
function formatJobType(type) {
  if (!type) return type;
  return type.replace(/_/g, "-").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getApplicationStatusBadge(status) {
  if (!status) return { label: "Unknown", className: "bg-muted text-muted-foreground" };

  const statusMap = {
    PENDING: { label: "Pending", className: "bg-amber-100 text-amber-800 border-amber-200" },
    SHORTLISTED: { label: "Shortlisted", className: "bg-blue-100 text-blue-800 border-blue-200" },
    INTERVIEW: { label: "Interview", className: "bg-purple-100 text-purple-800 border-purple-200" },
    HIRED: { label: "Hired", className: "bg-green-100 text-green-800 border-green-200" },
    REJECTED: { label: "Rejected", className: "bg-red-100 text-red-800 border-red-200" },
  };

  const normalized = status.toUpperCase();
  return (
    statusMap[normalized] || { label: status, className: "bg-muted text-muted-foreground" }
  );
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

// ── Subscription Status Card (Employer Only) ──────────
function SubscriptionStatusCard({ subscription }) {
  const plan = subscription?.plan || "FREE";
  const credits = subscription?.credits ?? 0;
  const maxJobs = subscription?.maxJobs ?? 3;
  const activeJobs = subscription?.activeJobs ?? 0;
  const maxTeamMembers = subscription?.maxTeamMembers ?? 1;
  const currentTeamMembers = subscription?.currentTeamMembers ?? 1;

  const jobUsagePercent = maxJobs > 0 ? Math.min((activeJobs / maxJobs) * 100, 100) : 0;
  const teamUsagePercent =
    maxTeamMembers > 0 ? Math.min((currentTeamMembers / maxTeamMembers) * 100, 100) : 0;

  const isFree = plan === "FREE";

  return (
    <Card className="border-0 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Left: Plan badge + CTA */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="rounded-xl bg-white/20 backdrop-blur-sm p-3">
              <Crown className="size-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">Subscription Status</h3>
                <Badge
                  className={`text-xs font-bold ${
                    isFree
                      ? "bg-white/20 text-white border-white/30"
                      : "bg-amber-400 text-amber-900 border-amber-300"
                  }`}
                >
                  {isFree ? (
                    <Crown className="size-3 mr-1" />
                  ) : (
                    <Sparkles className="size-3 mr-1" />
                  )}
                  {plan}
                </Badge>
              </div>
              <p className="text-emerald-100 text-sm mt-0.5">
                {isFree
                  ? "Upgrade to unlock more features and job postings"
                  : "You have access to premium features"}
              </p>
            </div>
          </div>

          {/* Center: Usage metrics */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Credits */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs text-emerald-100 font-medium">Credits Balance</p>
              <p className="text-2xl font-bold text-white mt-1">{credits}</p>
            </div>

            {/* Active Jobs */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs text-emerald-100 font-medium">Active Jobs</p>
              <p className="text-2xl font-bold text-white mt-1">
                {activeJobs} <span className="text-sm font-normal text-emerald-200">/ {maxJobs}</span>
              </p>
              <Progress
                value={jobUsagePercent}
                className="h-1.5 mt-2 bg-white/20 [&>div]:bg-white"
              />
            </div>

            {/* Team Members */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs text-emerald-100 font-medium">Team Members</p>
              <p className="text-2xl font-bold text-white mt-1">
                {currentTeamMembers}{" "}
                <span className="text-sm font-normal text-emerald-200">/ {maxTeamMembers}</span>
              </p>
              <Progress
                value={teamUsagePercent}
                className="h-1.5 mt-2 bg-white/20 [&>div]:bg-white"
              />
            </div>

            {/* Plan Limits info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs text-emerald-100 font-medium">Plan Limits</p>
              <p className="text-sm font-medium text-white mt-1">
                {maxJobs} job{maxJobs !== 1 ? "s" : ""}
              </p>
              <p className="text-xs text-emerald-200">{maxTeamMembers} team member{maxTeamMembers !== 1 ? "s" : ""}</p>
            </div>
          </div>

          {/* Right: Upgrade button */}
          <div className="shrink-0">
            <Button
              asChild
              className={
                isFree
                  ? "bg-white text-emerald-700 hover:bg-emerald-50 font-semibold shadow-lg"
                  : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
              }
            >
              <Link href="/dashboard/billing">
                {isFree ? (
                  <>
                    <Crown className="mr-2 size-4" />
                    Upgrade Plan
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 size-4" />
                    Manage Plan
                  </>
                )}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Jobs Closing Soon (Employer Only) ─────────────────
function JobsClosingSoon({ jobs }) {
  if (!jobs || jobs.length === 0) return null;

  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-100 p-2">
              <AlertTriangle className="size-5 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-base text-amber-900">
                Jobs Closing Soon
              </CardTitle>
              <CardDescription className="text-amber-700/80">
                {jobs.length} job{jobs.length !== 1 ? "s" : ""} with deadlines within 7 days
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex items-center justify-between gap-4 rounded-lg bg-white border border-amber-200 p-3"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="size-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <Briefcase className="size-4 text-amber-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/dashboard/jobs/${job.id}`}
                    className="text-sm font-medium text-foreground hover:underline truncate block"
                  >
                    {job.title}
                  </Link>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-amber-700 flex items-center gap-1">
                      <Clock className="size-3" />
                      Closes {job.applicationDeadline ? formatRelativeDate(job.applicationDeadline) : "Soon"}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="size-3" />
                      {job.applicantCount ?? 0} applicant{(job.applicantCount ?? 0) !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild className="shrink-0 text-xs border-amber-300 hover:bg-amber-100">
                <Link href={`/dashboard/jobs/${job.id}`}>
                  Manage
                  <ChevronRight className="ml-1 size-3" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
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
            <Link href="/login">Sign In</Link>
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
  const subscription = statsData?.subscription || null;
  const recentApplications = statsData?.recent?.applications || [];
  const jobsClosingSoon = statsData?.jobsClosingSoon || [];

  // Build stats cards from API data
  const statsCards = isEmployer
    ? [
        {
          title: "Active Jobs",
          value: stats.activeJobsCount ?? 0,
          change: "Manage postings",
          icon: Briefcase,
          color: "bg-primary/10 text-primary",
          trend: stats.activeJobsTrend ?? null,
        },
        {
          title: "Total Applications",
          value: stats.totalApplicationsCount ?? 0,
          change:
            stats.newThisWeek > 0
              ? `+${stats.newThisWeek} this week`
              : "Review submissions",
          icon: Users,
          color: "bg-secondary/10 text-secondary",
          trend: stats.applicationsTrend ?? null,
        },
        {
          title: "Shortlisted",
          value: stats.shortlistedCount ?? 0,
          change:
            stats.interviewsCount > 0
              ? `${stats.interviewsCount} interview${stats.interviewsCount !== 1 ? "s" : ""} scheduled`
              : "Pending review",
          icon: CheckCircle2,
          color: "bg-purple-100 text-purple-700",
          trend: stats.shortlistedTrend ?? null,
        },
        {
          title: "Profile Views",
          value: stats.profileViews ?? 0,
          change: "Company page visits",
          icon: Eye,
          color: "bg-accent/10 text-accent",
          trend: stats.profileViewsTrend ?? null,
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

  // Map recent saved jobs to activity items (job seeker)
  const activityItems = recentActivity.map((item, index) => ({
    id: item.id || index,
    type: "saved",
    message: `Saved "${item.job?.title || "Job"}" at ${item.job?.company?.name || "Company"}`,
    time: item.createdAt
      ? new Date(item.createdAt).toLocaleDateString("en-KE", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Recently",
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

      {/* ─── EMPLOYER ONLY: Subscription Status Card ─── */}
      {isEmployer && <SubscriptionStatusCard subscription={subscription} />}

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
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold">{stat.value}</span>
                  {stat.trend != null && stat.trend > 0 && (
                    <span className="flex items-center text-xs font-medium text-green-600 mb-1">
                      <ArrowUpRight className="size-3 mr-0.5" />
                      {stat.trend}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content: Activity + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {isEmployer ? (
          /* ─── EMPLOYER: Recent Applications Table ─── */
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Recent Applications</CardTitle>
                  <CardDescription>Latest candidates who applied to your jobs</CardDescription>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {recentApplications.length} new
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {recentApplications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="rounded-full bg-muted p-4 mb-3">
                    <Inbox className="size-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">No applications yet</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                    When candidates apply to your jobs, their applications will appear here.
                  </p>
                  <Button asChild variant="outline" size="sm" className="mt-4">
                    <Link href="/dashboard/jobs/new">
                      <PlusCircle className="mr-2 size-4" />
                      Post a Job
                    </Link>
                  </Button>
                </div>
              ) : (
                <>
                  <div className="max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Candidate</TableHead>
                          <TableHead className="hidden sm:table-cell">Job Title</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right hidden md:table-cell">
                            Applied Date
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentApplications.slice(0, 5).map((app) => {
                          const badge = getApplicationStatusBadge(app.status);
                          return (
                            <TableRow key={app.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <span className="text-xs font-medium text-primary">
                                      {getInitials(app.user?.name)}
                                    </span>
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      {app.user?.name || "Unknown"}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {app.user?.email || ""}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <Link
                                  href={`/dashboard/jobs/${app.job?.id}`}
                                  className="text-sm text-muted-foreground hover:text-foreground hover:underline truncate block max-w-[200px]"
                                >
                                  {app.job?.title || "Unknown Job"}
                                </Link>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${badge.className}`}
                                >
                                  {badge.label}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right text-xs text-muted-foreground hidden md:table-cell">
                                {app.createdAt
                                  ? formatRelativeDate(app.createdAt)
                                  : "—"}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="ghost" size="sm" asChild className="w-full text-muted-foreground">
                      <Link href="/dashboard/applications">
                        View All Applications
                        <ArrowRight className="ml-2 size-4" />
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          /* ─── JOB SEEKER: Recent Activity ─── */
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
                              href={`/jobs/${item.jobSlug}`}
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
        )}

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

      {/* ─── EMPLOYER: Jobs Closing Soon ─── */}
      {isEmployer && <JobsClosingSoon jobs={jobsClosingSoon} />}

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
