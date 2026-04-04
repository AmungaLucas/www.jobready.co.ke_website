"use client";

import Link from "next/link";
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
} from "lucide-react";

// ── Mock Data ──────────────────────────────────────────
const MOCK_USER = {
  name: "John",
  role: "JOB_SEEKER",
};

const JOB_SEEKER_STATS = [
  {
    title: "Applications Sent",
    value: 12,
    change: "+3 this week",
    icon: FileText,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Saved Jobs",
    value: 28,
    change: "+5 new",
    icon: Bookmark,
    color: "bg-secondary/10 text-secondary",
  },
  {
    title: "Profile Views",
    value: 45,
    change: "+12 this month",
    icon: Eye,
    color: "bg-purple/10 text-purple",
  },
  {
    title: "Interviews",
    value: 3,
    change: "1 upcoming",
    icon: CalendarCheck,
    color: "bg-accent/10 text-accent",
  },
];

const EMPLOYER_STATS = [
  {
    title: "Active Jobs",
    value: 8,
    change: "+2 this week",
    icon: Briefcase,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Total Applications",
    value: 156,
    change: "+24 new",
    icon: Users,
    color: "bg-secondary/10 text-secondary",
  },
  {
    title: "Shortlisted",
    value: 23,
    change: "6 pending review",
    icon: CheckCircle2,
    color: "bg-purple/10 text-purple",
  },
  {
    title: "Interviews Scheduled",
    value: 7,
    change: "3 this week",
    icon: CalendarCheck,
    color: "bg-accent/10 text-accent",
  },
];

const RECENT_ACTIVITY = [
  {
    id: 1,
    type: "application",
    message: 'Application sent for "Senior Software Engineer" at Safaricom',
    time: "2 hours ago",
    icon: FileText,
    iconColor: "text-primary",
  },
  {
    id: 2,
    type: "interview",
    message: 'Interview scheduled with Equity Bank for "Data Analyst" role',
    time: "1 day ago",
    icon: CalendarCheck,
    iconColor: "text-secondary",
  },
  {
    id: 3,
    type: "saved",
    message: 'Saved "Product Manager" at KCB Group',
    time: "2 days ago",
    icon: Bookmark,
    iconColor: "text-purple",
  },
  {
    id: 4,
    type: "view",
    message: "Your profile was viewed by a recruiter from KPMG",
    time: "3 days ago",
    icon: Eye,
    iconColor: "text-accent",
  },
  {
    id: 5,
    type: "alert",
    message: 'New job matching your alert: "Frontend Developer" at Airtel',
    time: "4 days ago",
    icon: Bell,
    iconColor: "text-danger",
  },
];

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

// ── Component ──────────────────────────────────────────
export default function DashboardOverview({ user = MOCK_USER }) {
  const isEmployer = user.role === "EMPLOYER";
  const stats = isEmployer ? EMPLOYER_STATS : JOB_SEEKER_STATS;
  const quickActions = isEmployer ? QUICK_ACTIONS_EMPLOYER : QUICK_ACTIONS_JOB_SEEKER;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-xl bg-gradient-to-r from-primary to-primary-dark p-6 text-white">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {user.name}! 👋
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
        {stats.map((stat) => {
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
                {RECENT_ACTIVITY.length} new
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {RECENT_ACTIVITY.map((item) => {
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
                      <p className="text-sm leading-snug">{item.message}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="size-3" />
                        {item.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
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
