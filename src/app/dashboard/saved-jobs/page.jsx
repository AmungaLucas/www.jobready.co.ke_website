"use client";

import { useState } from "react";
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
} from "lucide-react";
import { formatDate, formatRelativeDate } from "@/lib/format";

// ── Mock Data ──────────────────────────────────────────
const INITIAL_SAVED_JOBS = [
  {
    id: 1,
    jobTitle: "Senior Software Engineer",
    company: "Safaricom PLC",
    companyInitials: "SC",
    companyColor: "bg-green-600",
    location: "Nairobi, Kenya",
    type: "Full-Time",
    experienceLevel: "Senior",
    salary: "KSh 180K - 250K",
    dateSaved: "2026-03-30",
    postedDate: "2026-03-25",
    category: "Technology",
    isRemote: false,
  },
  {
    id: 2,
    jobTitle: "Product Manager - M-PESA",
    company: "Safaricom PLC",
    companyInitials: "SC",
    companyColor: "bg-green-600",
    location: "Nairobi, Kenya",
    type: "Full-Time",
    experienceLevel: "Mid-Senior",
    salary: "KSh 220K - 300K",
    dateSaved: "2026-03-28",
    postedDate: "2026-03-22",
    category: "Technology",
    isRemote: false,
  },
  {
    id: 3,
    jobTitle: "Data Analyst",
    company: "Equity Bank",
    companyInitials: "EB",
    companyColor: "bg-yellow-600",
    location: "Nairobi, Kenya",
    type: "Full-Time",
    experienceLevel: "Mid-Level",
    salary: "KSh 120K - 160K",
    dateSaved: "2026-03-27",
    postedDate: "2026-03-20",
    category: "Finance",
    isRemote: false,
  },
  {
    id: 4,
    jobTitle: "Marketing Communications Manager",
    company: "Airtel Kenya",
    companyInitials: "AK",
    companyColor: "bg-red-600",
    location: "Nairobi, Kenya",
    type: "Full-Time",
    experienceLevel: "Manager",
    salary: "KSh 150K - 200K",
    dateSaved: "2026-03-25",
    postedDate: "2026-03-18",
    category: "Marketing",
    isRemote: false,
  },
  {
    id: 5,
    jobTitle: "Frontend Developer",
    company: "KPMG East Africa",
    companyInitials: "KP",
    companyColor: "bg-indigo-600",
    location: "Nairobi, Kenya",
    type: "Contract",
    experienceLevel: "Mid-Level",
    salary: "KSh 140K - 180K",
    dateSaved: "2026-03-23",
    postedDate: "2026-03-15",
    category: "Technology",
    isRemote: true,
  },
  {
    id: 6,
    jobTitle: "Finance Graduate Trainee",
    company: "PwC Kenya",
    companyInitials: "PW",
    companyColor: "bg-amber-700",
    location: "Nairobi, Kenya",
    type: "Full-Time",
    experienceLevel: "Entry Level",
    salary: null,
    dateSaved: "2026-03-20",
    postedDate: "2026-03-10",
    category: "Finance",
    isRemote: false,
  },
];

// ── Component ──────────────────────────────────────────
export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState(INITIAL_SAVED_JOBS);

  const handleUnsave = (jobId) => {
    setSavedJobs((prev) => prev.filter((job) => job.id !== jobId));
  };

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
          {savedJobs.length} Saved
        </Badge>
      </div>

      {/* Saved Jobs Grid/List */}
      {savedJobs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {savedJobs.map((job) => (
            <SavedJobCard
              key={job.id}
              job={job}
              onUnsave={handleUnsave}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SavedJobCard({ job, onUnsave }) {
  return (
    <Card className="group relative overflow-hidden py-0 gap-0">
      {/* Category color strip */}
      <div className="h-1 bg-primary/70" />

      <CardContent className="p-4 md:p-5 space-y-3">
        {/* Top: Company + Unsave */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex size-9 shrink-0 items-center justify-center rounded-lg text-white text-xs font-bold ${job.companyColor}`}
            >
              {job.companyInitials}
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground font-medium truncate">
                {job.company}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-destructive shrink-0"
            onClick={() => onUnsave(job.id)}
            title="Remove from saved"
          >
            <BookmarkX className="size-4" />
          </Button>
        </div>

        {/* Job Title */}
        <div>
          <h3 className="font-semibold text-sm leading-snug line-clamp-2">
            {job.jobTitle}
          </h3>
          {job.isRemote && (
            <Badge variant="secondary" className="mt-1.5 text-xs">
              Remote
            </Badge>
          )}
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="size-3" />
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase className="size-3" />
            {job.type}
          </span>
        </div>

        {/* Bottom: Salary + Date + View */}
        <div className="flex items-center justify-between pt-1 border-t">
          <div className="text-xs">
            {job.salary && (
              <span className="font-medium text-foreground">{job.salary}</span>
            )}
            <span className="text-muted-foreground ml-2">
              Saved {formatRelativeDate(job.dateSaved)}
            </span>
          </div>
          <Button variant="outline" size="sm" className="text-xs h-7">
            <ExternalLink className="size-3 mr-1" />
            View
          </Button>
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
