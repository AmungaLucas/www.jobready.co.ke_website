"use client";

import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Building2,
  MapPin,
  Calendar,
  Clock,
  ExternalLink,
  Filter,
  Search,
  Briefcase,
  ArrowUpDown,
  AlertCircle,
} from "lucide-react";
import { formatDate } from "@/lib/format";
import { formatLocation } from "@/lib/normalize";
import { useSession } from "next-auth/react";

// ── Helpers ──────────────────────────────────────────
function formatJobType(type) {
  if (!type) return type;
  return type.replace(/_/g, "-").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

// Status badge config
const STATUS_CONFIG = {
  APPLIED: {
    label: "Applied",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  SHORTLISTED: {
    label: "Shortlisted",
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },
  INTERVIEW: {
    label: "Interview",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  OFFERED: {
    label: "Offered",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

// ── Component ──────────────────────────────────────────
export default function ApplicationsPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("all");
  const [applications, setApplications] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = async (currentTab) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (currentTab && currentTab !== "all") {
        params.set("status", currentTab);
      }
      const url = `/api/applications${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 401) {
          setError("Please sign in to view your applications.");
          return;
        }
        throw new Error("Failed to load applications");
      }
      const data = await res.json();
      setApplications(data.applications || []);
      setTotalCount(data.pagination?.total || 0);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchApplications(activeTab);
    } else if (status === "unauthenticated") {
      setLoading(false);
      setError("Please sign in to view your applications.");
    }
  }, [status, activeTab]);

  // Session loading
  if (status === "loading") {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="h-4 w-64 bg-muted rounded mt-2" />
          </div>
          <div className="h-6 w-36 bg-muted rounded" />
        </div>
        <div className="h-10 bg-muted rounded-lg p-1 flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-20 bg-muted rounded-md" />
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="py-0 gap-0">
              <CardContent className="p-4 md:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-3 min-w-0">
                    <div className="size-10 bg-muted rounded-lg shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-48 bg-muted rounded" />
                      <div className="h-4 w-32 bg-muted rounded" />
                      <div className="flex gap-3">
                        <div className="h-3 w-24 bg-muted rounded" />
                        <div className="h-3 w-20 bg-muted rounded" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-3 sm:flex-col sm:items-end">
                    <div className="h-6 w-20 bg-muted rounded-full" />
                    <div className="h-3 w-24 bg-muted rounded" />
                    <div className="h-7 w-20 bg-muted rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Unauthenticated
  if (status === "unauthenticated" || error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Applications</h1>
          <p className="text-muted-foreground">
            Track and manage your job applications
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <AlertCircle className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">Sign In Required</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              {error || "Please sign in to view your applications."}
            </p>
            <Button asChild className="mt-4">
              <Link href="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Compute status counts from the full dataset (when "all" tab is active)
  // When a specific tab is active, we show the tab's count from total
  const statusCounts = {};
  // We derive counts from what we have. When on "all", totalCount is the full count.
  // For individual statuses, we set counts based on the totalCount when that tab is active.
  // To properly show counts on all tabs, we'd need a separate endpoint or fetch all first.
  // For simplicity, we show the total count on "all" and loading dashes on individual tabs
  // unless we've fetched them.
  statusCounts["all"] = totalCount;
  statusCounts["APPLIED"] = applications.length && activeTab === "APPLIED" ? totalCount : "...";
  statusCounts["SHORTLISTED"] = applications.length && activeTab === "SHORTLISTED" ? totalCount : "...";
  statusCounts["INTERVIEW"] = applications.length && activeTab === "INTERVIEW" ? totalCount : "...";
  statusCounts["REJECTED"] = applications.length && activeTab === "REJECTED" ? totalCount : "...";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Applications</h1>
          <p className="text-muted-foreground">
            Track and manage your job applications
          </p>
        </div>
        <Badge variant="outline" className="w-fit text-sm">
          {activeTab === "all" ? `${totalCount} Total Applications` : `${totalCount} Applications`}
        </Badge>
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto gap-1 bg-muted/50 p-1">
          <TabsTrigger value="all" className="text-sm">
            All ({statusCounts["all"]})
          </TabsTrigger>
          <TabsTrigger value="APPLIED" className="text-sm">
            Applied ({statusCounts["APPLIED"]})
          </TabsTrigger>
          <TabsTrigger value="SHORTLISTED" className="text-sm">
            Shortlisted ({statusCounts["SHORTLISTED"]})
          </TabsTrigger>
          <TabsTrigger value="INTERVIEW" className="text-sm">
            Interview ({statusCounts["INTERVIEW"]})
          </TabsTrigger>
          <TabsTrigger value="REJECTED" className="text-sm">
            Rejected ({statusCounts["REJECTED"]})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="py-0 gap-0">
                  <CardContent className="p-4 md:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex gap-3 min-w-0">
                        <div className="size-10 bg-muted rounded-lg shrink-0 animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-48 bg-muted rounded animate-pulse" />
                          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                        </div>
                      </div>
                      <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : applications.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {applications.map((app) => {
                const job = app.job;
                if (!job) return null;
                const companyName = job.company?.name || "Unknown";
                const initials = getInitials(companyName);
                const logoColor = job.company?.logoColor || "#6366f1";
                const jobType = formatJobType(job.employmentType);
                const jobSlug = job.slug;

                return (
                  <ApplicationCard
                    key={app.id}
                    id={app.id}
                    jobTitle={job.title}
                    company={companyName}
                    companyInitials={initials}
                    companyColor={logoColor}
                    location={formatLocation(job)}
                    type={jobType}
                    appliedDate={app.createdAt}
                    status={app.status}
                    jobSlug={jobSlug}
                  />
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ApplicationCard({
  id,
  jobTitle,
  company,
  companyInitials,
  companyColor,
  location,
  type,
  appliedDate,
  status,
  jobSlug,
}) {
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.APPLIED;

  return (
    <Card className="py-0 gap-0">
      <CardContent className="p-4 md:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* Left: Company logo + details */}
          <div className="flex gap-3 min-w-0">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-lg text-white text-xs font-bold"
              style={{ backgroundColor: companyColor }}
            >
              {companyInitials}
            </div>
            <div className="min-w-0 flex-1">
              {jobSlug ? (
                <Link href={`/jobs/${jobSlug}`} className="block">
                  <h3 className="font-semibold text-sm truncate hover:text-primary transition-colors">
                    {jobTitle}
                  </h3>
                </Link>
              ) : (
                <h3 className="font-semibold text-sm truncate">{jobTitle}</h3>
              )}
              <p className="text-sm text-muted-foreground">{company}</p>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3" />
                  {location}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="size-3" />
                  {type}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Status + date + action */}
          <div className="flex flex-row items-center gap-3 sm:flex-col sm:items-end shrink-0">
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusConfig.className}`}
            >
              {statusConfig.label}
            </span>
            <p className="text-xs text-muted-foreground">
              Applied {formatDate(appliedDate)}
            </p>
            {jobSlug ? (
              <Button variant="ghost" size="sm" className="text-xs h-7" asChild>
                <Link href={`/jobs/${jobSlug}`}>
                  <ExternalLink className="size-3 mr-1" />
                  View Job
                </Link>
              </Button>
            ) : (
              <Button variant="ghost" size="sm" className="text-xs h-7" disabled>
                <ExternalLink className="size-3 mr-1" />
                View Job
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <FileText className="size-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No applications found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          {`You haven't applied to any jobs in this category yet. Start exploring opportunities on our job board.`}
        </p>
        <Button asChild className="mt-4">
          <Link href="/jobs">Browse Jobs</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
