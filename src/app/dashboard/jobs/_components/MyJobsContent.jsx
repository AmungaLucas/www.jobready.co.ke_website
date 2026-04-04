"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Briefcase,
  PlusCircle,
  Search,
  MoreHorizontal,
  Pencil,
  Pause,
  Play,
  Eye,
  Trash2,
  Users,
  MapPin,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { formatDate } from "@/lib/format";

// ── Config ───────────────────────────────────────────
const STATUS_CONFIG = {
  ACTIVE: { label: "Active", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  PAUSED: { label: "Paused", className: "bg-amber-50 text-amber-700 border-amber-200" },
  DRAFT: { label: "Draft", className: "bg-gray-50 text-gray-600 border-gray-200" },
  CLOSED: { label: "Closed", className: "bg-red-50 text-red-700 border-red-200" },
};

const DEFAULT_STATUS_COUNTS = {
  total: 0,
  ACTIVE: 0,
  PAUSED: 0,
  DRAFT: 0,
  CLOSED: 0,
};

// ── Component ────────────────────────────────────────
export default function MyJobsContent() {
  const { data: session, status: sessionStatus } = useSession();

  const [jobs, setJobs] = useState([]);
  const [statusCounts, setStatusCounts] = useState(DEFAULT_STATUS_COUNTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  // ── Fetch jobs ──
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (activeFilter !== "all") {
        params.set("status", activeFilter);
      }

      const res = await fetch(`/api/employer/jobs?${params.toString()}`);
      if (!res.ok) {
        if (res.status === 401) {
          setError("Please sign in to view your jobs.");
          return;
        }
        if (res.status === 403) {
          setError("Only employers can manage jobs.");
          return;
        }
        throw new Error("Failed to load jobs");
      }

      const data = await res.json();
      setJobs(data.jobs || []);
      setStatusCounts(data.statusCounts || DEFAULT_STATUS_COUNTS);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      fetchJobs();
    } else if (sessionStatus === "unauthenticated") {
      setLoading(false);
      setError("Please sign in to view your jobs.");
    }
  }, [sessionStatus, fetchJobs]);

  // Client-side search filtering (API handles status filter)
  const filteredJobs = jobs.filter((job) => {
    if (searchQuery === "") return true;
    return job.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // ── Delete ──
  const handleDelete = (job) => {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!jobToDelete) return;

    try {
      setDeleting(true);
      // Show "coming soon" toast — the delete endpoint doesn't exist yet
      toast.info("Coming soon", {
        description: `Delete for "${jobToDelete.title}" will be available in a future update.`,
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setJobToDelete(null);
    }
  };

  // ── Session loading ──
  if (sessionStatus === "loading" || loading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>

        {/* Filter tabs skeleton */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-10 w-64" />
        </div>

        {/* Table skeleton */}
        <Card>
          <CardContent className="p-0">
            <div className="space-y-0">
              {/* Table header row */}
              <div className="flex items-center gap-4 border-b px-4 py-3">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[140px]" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[80px] mx-auto" />
                <Skeleton className="h-4 w-[110px]" />
                <Skeleton className="h-4 w-[60px] ml-auto" />
              </div>
              {/* Table body rows */}
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 border-b px-4 py-4">
                  <div className="space-y-1.5 min-w-[200px]">
                    <Skeleton className="h-4 w-44" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                  <div className="flex items-center gap-1.5 min-w-[140px]">
                    <Skeleton className="size-3.5" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-4 w-6 mx-auto" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="size-8 ml-auto" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Jobs</h1>
          <p className="text-muted-foreground">
            Manage your posted job listings
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-destructive/10 p-4 mb-4">
              <AlertCircle className="size-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold">Something went wrong</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              {error}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={fetchJobs}
              disabled={loading}
            >
              <RefreshCw className={`mr-2 size-4 ${loading ? "animate-spin" : ""}`} />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Jobs</h1>
          <p className="text-muted-foreground">
            Manage your posted job listings
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/jobs/new">
            <PlusCircle className="mr-2 size-4" />
            Post New Job
          </Link>
        </Button>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-1">
          {[
            { key: "all", label: "All", count: statusCounts.total || 0 },
            { key: "ACTIVE", label: "Active", count: statusCounts["ACTIVE"] || 0 },
            { key: "PAUSED", label: "Paused", count: statusCounts["PAUSED"] || 0 },
            { key: "DRAFT", label: "Draft", count: statusCounts["DRAFT"] || 0 },
            { key: "CLOSED", label: "Closed", count: statusCounts["CLOSED"] || 0 },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveFilter(tab.key);
              }}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                activeFilter === tab.key
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
              <span
                className={`inline-flex size-5 items-center justify-center rounded-full text-xs ${
                  activeFilter === tab.key
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Jobs Table */}
      <Card>
        <CardContent className="p-0">
          {filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Briefcase className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No jobs found</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                {searchQuery
                  ? `No jobs matching "${searchQuery}". Try a different search term.`
                  : `You don't have any ${activeFilter === "all" ? "" : activeFilter.toLowerCase() + " "}jobs yet. Create your first job posting to start receiving applications.`}
              </p>
              {activeFilter !== "all" || searchQuery ? null : (
                <Button asChild className="mt-4">
                  <Link href="/dashboard/jobs/new">
                    <PlusCircle className="mr-2 size-4" />
                    Post New Job
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Job Title</TableHead>
                    <TableHead className="min-w-[140px]">Location</TableHead>
                    <TableHead className="min-w-[100px]">Type</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[100px] text-center">Applicants</TableHead>
                    <TableHead className="min-w-[110px]">Posted</TableHead>
                    <TableHead className="min-w-[60px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((job) => {
                    const statusCfg = STATUS_CONFIG[job.status] || STATUS_CONFIG.DRAFT;
                    return (
                      <TableRow key={job.id} className="group">
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{job.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{job.category}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MapPin className="size-3.5" />
                            {job.location}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{job.type}</span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusCfg.className}`}
                          >
                            {statusCfg.label}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-sm font-medium">{job.applicants}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(job.postedDate)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-8">
                                <MoreHorizontal className="size-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem asChild>
                                <Link href={`/job/${job.slug}`}>
                                  <Eye className="mr-2 size-4" />
                                  View Job
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/jobs/${job.id}/edit`}>
                                  <Pencil className="mr-2 size-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              {job.status === "ACTIVE" ? (
                                <DropdownMenuItem>
                                  <Pause className="mr-2 size-4" />
                                  Pause Job
                                </DropdownMenuItem>
                              ) : job.status === "PAUSED" ? (
                                <DropdownMenuItem>
                                  <Play className="mr-2 size-4" />
                                  Resume Job
                                </DropdownMenuItem>
                              ) : null}
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/applications?job=${job.id}`}>
                                  <Users className="mr-2 size-4" />
                                  View Applicants
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDelete(job)}
                              >
                                <Trash2 className="mr-2 size-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job Posting</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                &quot;{jobToDelete?.title}&quot;
              </span>
              ? This action cannot be undone. All applicant data associated with
              this job will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <RefreshCw className="mr-2 size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Job"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
