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
import { Input } from "@/components/ui/input";
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
  Eye,
  Trash2,
  Users,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatDate } from "@/lib/format";

// ── Mock Data ──────────────────────────────────────────
const MOCK_JOBS = [
  {
    id: 1,
    title: "Senior Software Engineer",
    location: "Nairobi, Kenya",
    employmentType: "Full-time",
    status: "Published",
    createdAt: "2026-03-15",
    categories: ["Technology"],
  },
  {
    id: 2,
    title: "Financial Analyst",
    location: "Nairobi, Kenya",
    employmentType: "Full-time",
    status: "Published",
    createdAt: "2026-03-12",
    categories: ["Finance & Accounting"],
  },
  {
    id: 3,
    title: "Marketing Manager",
    location: "Nairobi, Kenya",
    employmentType: "Full-time",
    status: "Draft",
    createdAt: "2026-03-08",
    categories: ["Marketing"],
  },
  {
    id: 4,
    title: "Network Engineer",
    location: "Mombasa, Kenya",
    employmentType: "Full-time",
    status: "Published",
    createdAt: "2026-03-05",
    categories: ["Technology"],
  },
  {
    id: 5,
    title: "Human Resources Intern",
    location: "Nairobi, Kenya",
    employmentType: "Internship",
    status: "Closed",
    createdAt: "2026-02-20",
    categories: ["HR"],
  },
  {
    id: 6,
    title: "Product Manager — M-PESA",
    location: "Nairobi, Kenya",
    employmentType: "Full-time",
    status: "Published",
    createdAt: "2026-03-01",
    categories: ["Technology"],
  },
  {
    id: 7,
    title: "Data Analyst",
    location: "Nakuru, Kenya",
    employmentType: "Contract",
    status: "Draft",
    createdAt: "2026-03-28",
    categories: ["Finance & Accounting"],
  },
  {
    id: 8,
    title: "Customer Service Representative",
    location: "Kisumu, Kenya",
    employmentType: "Full-time",
    status: "Draft",
    createdAt: "2026-03-28",
    categories: ["Customer Service"],
  },
];

const STATUS_CONFIG = {
  Published: { label: "Active", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  Draft: { label: "Draft", className: "bg-gray-50 text-gray-600 border-gray-200" },
  Closed: { label: "Closed", className: "bg-red-50 text-red-700 border-red-200" },
  Archived: { label: "Archived", className: "bg-gray-50 text-gray-600 border-gray-200" },
};

const ITEMS_PER_PAGE = 5;

// ── Component ──────────────────────────────────────────
export default function MyJobsContent() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter jobs
  const filteredJobs = MOCK_JOBS.filter((job) => {
    const matchesFilter = activeFilter === "all" || job.status === activeFilter;
    const matchesSearch =
      searchQuery === "" ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Status counts for filter tabs
  const statusCounts = MOCK_JOBS.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {});

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / ITEMS_PER_PAGE));
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDelete = (job) => {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setDeleteDialogOpen(false);
    setJobToDelete(null);
  };

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
            { key: "all", label: "All", count: MOCK_JOBS.length },
            { key: "Published", label: "Active", count: statusCounts["Published"] || 0 },
            { key: "Draft", label: "Draft", count: statusCounts["Draft"] || 0 },
            { key: "Closed", label: "Closed", count: statusCounts["Closed"] || 0 },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveFilter(tab.key);
                setCurrentPage(1);
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
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>
      </div>

      {/* Jobs Table */}
      <Card>
        <CardContent className="p-0">
          {paginatedJobs.length === 0 ? (
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
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Job Title</TableHead>
                      <TableHead className="min-w-[140px]">Location</TableHead>
                      <TableHead className="min-w-[100px]">Type</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="min-w-[110px]">Posted</TableHead>
                      <TableHead className="min-w-[60px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedJobs.map((job) => {
                      const statusCfg = STATUS_CONFIG[job.status] || STATUS_CONFIG.Draft;
                      return (
                        <TableRow key={job.id} className="group">
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{job.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{job.categories?.[0] || ""}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <MapPin className="size-3.5" />
                              {job.location}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{job.employmentType}</span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusCfg.className}`}
                            >
                              {statusCfg.label}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(job.createdAt)}
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
                                {job.status === "Published" ? (
                                  <DropdownMenuItem>
                                    <Pause className="mr-2 size-4" />
                                    Close Job
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t px-4 py-3">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredJobs.length)} of{" "}
                    {filteredJobs.length} jobs
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="icon"
                          className="size-8"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      )
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Delete Job
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
