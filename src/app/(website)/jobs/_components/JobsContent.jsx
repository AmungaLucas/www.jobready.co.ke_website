"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import JobSearchHero from "./JobSearchHero";
import JobFilters from "./JobFilters";
import JobSortBar from "./JobSortBar";
import JobCard from "../../_components/JobCard";
import Pagination from "../../_components/Pagination";
import CVReviewCTA from "../../_components/CVReviewCTA";
import AdSlot from "../../_components/AdSlot";
import NewsletterForm from "../../_components/NewsletterForm";
import SidebarCard from "../../_components/SidebarCard";
import { formatJobType, formatExperienceLevel } from "@/lib/format";

// Static search terms — not DB data
const popularTags = [
  "CPA-K",
  "IFRS",
  "Excel",
  "QuickBooks",
  "Banking",
  "Audit",
  "Payroll",
  "Sage",
  "Python",
  "Java",
  "AWS",
  "Agile",
];

// ─── Helpers ──────────────────────────────────────────────
const PAGE_SIZE = 10;

function buildQueryString(filters, sort, page, urlParams) {
  const params = new URLSearchParams();

  // Search from URL (set by search hero)
  const q = urlParams?.get("q") || "";
  if (q) params.set("q", q);

  // Category
  if (filters.category) params.set("category", filters.category);

  // Job type
  if (filters.jobType) params.set("jobType", filters.jobType);

  // Experience level
  if (filters.experienceLevel) params.set("experienceLevel", filters.experienceLevel);

  // Location: sidebar filter overrides URL param
  const location = filters.location || urlParams?.get("location") || "";
  if (location) params.set("location", location);

  // Remote
  if (filters.isRemote) params.set("isRemote", "true");

  // Sort
  if (sort) params.set("sort", sort);

  // Pagination
  if (page > 1) params.set("page", String(page));
  params.set("limit", String(PAGE_SIZE));

  return params.toString();
}

/** Enrich API job objects with computed display fields */
function enrichJob(job) {
  const now = Date.now();
  const published = job.publishedAt ? new Date(job.publishedAt).getTime() : 0;
  const deadline = job.deadline ? new Date(job.deadline).getTime() : 0;

  return {
    ...job,
    jobType: formatJobType(job.jobType),
    experienceLevel: formatExperienceLevel(job.experienceLevel),
    isNew: published > 0 && (now - published) < 24 * 60 * 60 * 1000,
    isUrgent: deadline > now && (deadline - now) < 20 * 24 * 60 * 60 * 1000,
  };
}

// ─── Component ────────────────────────────────────────────
const defaultFilters = {
  category: "",
  jobType: "",
  experienceLevel: "",
  location: "",
  isRemote: false,
};

export default function JobsContent() {
  const searchParams = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("newest");
  const [filters, setFilters] = useState({ ...defaultFilters });
  const [trendingJobs, setTrendingJobs] = useState([]);

  // Fetch trending jobs for sidebar
  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await fetch("/api/jobs?sort=featured&limit=5");
        if (res.ok) {
          const data = await res.json();
          setTrendingJobs(data.jobs || []);
        }
      } catch (err) {
        console.error("Error fetching trending jobs:", err);
      }
    }
    fetchTrending();
  }, []);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const qs = buildQueryString(filters, sort, currentPage, searchParams);
      const res = await fetch(`/api/jobs?${qs}`);
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();

      setJobs((data.jobs || []).map(enrichJob));
      if (data.pagination) {
        setTotalJobs(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [filters, sort, currentPage, searchParams]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearAll = () => {
    setFilters({ ...defaultFilters });
    setSort("newest");
    setCurrentPage(1);
  };

  return (
    <>
      {/* Hero with search */}
      <JobSearchHero />

      {/* Main layout */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_280px] gap-8 py-10 md:py-14 pb-16">
          {/* LEFT: Filter sidebar (desktop) */}
          <JobFilters filters={filters} onFiltersChange={handleFilterChange} />

          {/* CENTER: Job listings */}
          <div>
            {/* Sort bar */}
            <JobSortBar
              totalJobs={totalJobs}
              currentPage={currentPage}
              pageSize={PAGE_SIZE}
              sort={sort}
              onSortChange={handleSortChange}
            />

            {/* Job list */}
            {loading ? (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 py-16 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full mx-auto mb-3" />
                <p className="text-sm text-gray-500">Loading jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 py-16 text-center">
                <p className="text-gray-500 text-sm mb-4">
                  No jobs found matching your criteria.
                </p>
                <button
                  onClick={handleClearAll}
                  className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}

            {/* CV Service Nudge */}
            {!loading && jobs.length > 0 && (
              <div className="bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-400 rounded-xl p-5 md:p-6 mb-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-[22px] h-[22px] text-amber-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-[0.92rem] font-bold text-amber-900 mb-1">
                    Struggling to get shortlisted?
                  </h4>
                  <p className="text-[0.8rem] text-amber-900/80 leading-relaxed">
                    Get a professional CV tailored to the Kenyan job market. Our experts write CVs that get you interviews.
                  </p>
                </div>
                <Link
                  href="/cv-services"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-amber-900 text-white text-[0.82rem] font-bold hover:bg-amber-800 transition-colors no-underline shrink-0"
                >
                  Get CV — KSh 500
                </Link>
              </div>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>

          {/* RIGHT: Sidebar */}
          <aside className="hidden lg:block">
            {/* CV Review CTA */}
            <CVReviewCTA />

            {/* Ad Slot */}
            <AdSlot position="sidebar" />

            {/* Trending Jobs */}
            <SidebarCard title="Trending Jobs" icon={(
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            )}>
              <div>
                {trendingJobs.length > 0
                  ? trendingJobs.map((job) => (
                      <Link
                        key={job.slug}
                        href={`/job/${job.slug}`}
                        className="flex gap-2.5 py-2.5 border-b border-gray-100 last:border-b-0 group"
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-[0.65rem] font-bold text-white"
                          style={{
                            background: `linear-gradient(135deg, ${job.company?.logoColor || "#1a56db"}, ${job.company?.logoColor || "#1a56db"}dd)`,
                          }}
                        >
                          {(job.company?.name || "").split(" ").map((w) => w[0]).slice(0, 2).join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[0.85rem] font-semibold text-gray-800 truncate group-hover:text-[#1a56db] transition-colors leading-tight">
                            {job.title}
                          </h4>
                          <p className="text-[0.72rem] text-gray-500 truncate mt-0.5">
                            {job.company?.name || ""} &middot; {job.location}
                          </p>
                        </div>
                      </Link>
                    ))
                  : <p className="text-[0.82rem] text-gray-400 py-4 text-center">No trending jobs yet</p>}
              </div>
            </SidebarCard>

            {/* Newsletter */}
            <SidebarCard title="Job Alerts" icon={(
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            )}>
              <p className="text-[0.82rem] text-gray-600 mb-3 leading-relaxed">
                Get new jobs delivered to your inbox daily. No spam.
              </p>
              <NewsletterForm type="job_alerts" />
            </SidebarCard>

            {/* Popular Tags */}
            <SidebarCard title="Popular Tags">
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/jobs?q=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-[0.78rem] font-medium text-gray-600 bg-gray-100 hover:bg-[#dbeafe] hover:text-[#1a56db] transition-all no-underline"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </SidebarCard>

            {/* Paid Ad */}
            <AdSlot position="sidebar" />
          </aside>
        </div>
      </div>
    </>
  );
}
