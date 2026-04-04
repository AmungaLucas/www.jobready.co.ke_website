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
import {
  Bookmark,
  BookmarkX,
  MapPin,
  Briefcase,
  Clock,
  ExternalLink,
  Search,
  Filter,
  Building2,
  Heart,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { formatRelativeDate } from "@/lib/format";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// ── Helpers ──────────────────────────────────────────
function formatJobType(type) {
  if (!type) return type;
  return type.replace(/_/g, "-").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatSalary(min, max) {
  if (!min && !max) return null;
  const fmt = (n) => {
    if (n >= 1000000) return `KSh ${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `KSh ${(n / 1000).toFixed(0)}K`;
    return `KSh ${n}`;
  };
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  return fmt(min || max);
}

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

// ── Component ──────────────────────────────────────────
export default function SavedJobsPage() {
  const { data: session, status } = useSession();
  const [savedJobs, setSavedJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unsavingId, setUnsavingId] = useState(null);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/saved-jobs");
      if (!res.ok) {
        if (res.status === 401) {
          setError("Please sign in to view your saved jobs.");
          return;
        }
        throw new Error("Failed to load saved jobs");
      }
      const data = await res.json();
      setSavedJobs(data.savedJobs || []);
      setTotal(data.pagination?.total || 0);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchSavedJobs();
    } else if (status === "unauthenticated") {
      setLoading(false);
      setError("Please sign in to view your saved jobs.");
    }
  }, [status]);

  const handleUnsave = async (savedJobId, jobId) => {
    try {
      setUnsavingId(savedJobId);
      const res = await fetch("/api/saved-jobs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      if (!res.ok) throw new Error("Failed to remove saved job");
      // Refresh the list
      await fetchSavedJobs();
    } catch (err) {
      console.error("Unsave error:", err);
    } finally {
      setUnsavingId(null);
    }
  };

  // Session loading
  if (status === "loading" || loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="h-8 w-40 bg-muted rounded" />
            <div className="h-4 w-64 bg-muted rounded mt-2" />
          </div>
          <div className="h-6 w-20 bg-muted rounded" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="py-0 gap-0">
              <div className="h-1 bg-muted" />
              <CardContent className="p-4 md:p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="size-9 bg-muted rounded-lg shrink-0" />
                    <div className="h-4 w-28 bg-muted rounded" />
                  </div>
                  <div className="size-8 bg-muted rounded" />
                </div>
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-3/4 bg-muted rounded" />
                <div className="flex gap-3">
                  <div className="h-3 w-24 bg-muted rounded" />
                  <div className="h-3 w-20 bg-muted rounded" />
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between">
                  <div className="h-3 w-32 bg-muted rounded" />
                  <div className="h-7 w-16 bg-muted rounded" />
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
          <h1 className="text-2xl font-bold tracking-tight">Saved Jobs</h1>
          <p className="text-muted-foreground">
            Jobs you&apos;ve bookmarked for later review
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <AlertCircle className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">Sign In Required</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              {error || "Please sign in to view your saved jobs."}
            </p>
            <Button asChild className="mt-4">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Saved Jobs</h1>
          <p className="text-muted-foreground">
            Jobs you&apos;ve bookmarked for later review
          </p>
        </div>
        <Badge variant="outline" className="w-fit text-sm">
          {total} Saved
        </Badge>
      </div>

      {/* Saved Jobs Grid/List */}
      {savedJobs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {savedJobs.map((savedJob) => {
            const job = savedJob.job;
            if (!job) return null;
            const companyName = job.company?.name || "Unknown";
            const initials = getInitials(companyName);
            const logoColor = job.company?.logoColor || "#6366f1";
            const salary = formatSalary(job.salaryMin, job.salaryMax);
            const jobType = formatJobType(job.jobType);
            const jobSlug = job.slug;

            return (
              <SavedJobCard
                key={savedJob.id}
                id={savedJob.id}
                jobId={savedJob.jobId}
                jobTitle={job.title}
                company={companyName}
                companyInitials={initials}
                companyColor={logoColor}
                location={job.location}
                type={jobType}
                salary={salary}
                dateSaved={savedJob.createdAt}
                isRemote={job.isRemote}
                jobSlug={jobSlug}
                onUnsave={handleUnsave}
                unsaving={unsavingId === savedJob.id}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function SavedJobCard({
  id,
  jobId,
  jobTitle,
  company,
  companyInitials,
  companyColor,
  location,
  type,
  salary,
  dateSaved,
  isRemote,
  jobSlug,
  onUnsave,
  unsaving,
}) {
  return (
    <Card className="group relative overflow-hidden py-0 gap-0">
      {/* Category color strip */}
      <div className="h-1 bg-primary/70" />

      <CardContent className="p-4 md:p-5 space-y-3">
        {/* Top: Company + Unsave */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-lg text-white text-xs font-bold"
              style={{ backgroundColor: companyColor }}
            >
              {companyInitials}
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground font-medium truncate">
                {company}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-destructive shrink-0"
            onClick={() => onUnsave(id, jobId)}
            disabled={unsaving}
            title="Remove from saved"
          >
            {unsaving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <BookmarkX className="size-4" />
            )}
          </Button>
        </div>

        {/* Job Title */}
        <div>
          {jobSlug ? (
            <Link href={`/jobs/${jobSlug}`} className="block">
              <h3 className="font-semibold text-sm leading-snug line-clamp-2 hover:text-primary transition-colors">
                {jobTitle}
              </h3>
            </Link>
          ) : (
            <h3 className="font-semibold text-sm leading-snug line-clamp-2">
              {jobTitle}
            </h3>
          )}
          {isRemote && (
            <Badge variant="secondary" className="mt-1.5 text-xs">
              Remote
            </Badge>
          )}
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="size-3" />
            {location}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase className="size-3" />
            {type}
          </span>
        </div>

        {/* Bottom: Salary + Date + View */}
        <div className="flex items-center justify-between pt-1 border-t">
          <div className="text-xs">
            {salary && (
              <span className="font-medium text-foreground">{salary}</span>
            )}
            <span className="text-muted-foreground ml-2">
              Saved {formatRelativeDate(dateSaved)}
            </span>
          </div>
          {jobSlug ? (
            <Button variant="outline" size="sm" className="text-xs h-7" asChild>
              <Link href={`/jobs/${jobSlug}`}>
                <ExternalLink className="size-3 mr-1" />
                View
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="text-xs h-7" disabled>
              <ExternalLink className="size-3 mr-1" />
              View
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Heart className="size-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No saved jobs yet</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          When you find jobs that interest you, click the bookmark icon to save them here for easy access.
        </p>
        <Button asChild className="mt-4">
          <Link href="/jobs">Browse Jobs</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
