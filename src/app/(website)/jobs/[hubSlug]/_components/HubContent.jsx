"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FiChevronRight,
  FiFilter,
  FiX,
} from "react-icons/fi";

import JobCard from "../../../_components/JobCard";
import HubHero from "../../_components/HubHero";
import CVReviewCTA from "../../../_components/CVReviewCTA";
import NewsletterForm from "../../../_components/NewsletterForm";
import AdSlot from "../../../_components/AdSlot";
import SidebarCard from "../../../_components/SidebarCard";
import Pagination from "../../../_components/Pagination";
import HubSearchBar from "./HubSearchBar";
import { getRelatedJobHubs, hubSidebarFilters } from "./hub-data";
import { formatJobType, formatExperienceLevel } from "@/lib/format";

// ─── Helpers ──────────────────────────────────────────────
const PAGE_SIZE = 10;

/**
 * Maps sidebar filter values to additional API query params.
 * Returns an object with extra key/value pairs to merge into the query.
 */
function mapSidebarFilter(hubSlug, filterValue) {
  if (!filterValue) return {};

  const locationHubs = ["nairobi", "mombasa", "kisumu", "nakuru"];

  // Location hubs: filter values are category slugs → map to category enum
  if (locationHubs.includes(hubSlug)) {
    const categoryMap = {
      technology: "TECHNOLOGY",
      "finance-accounting": "FINANCE_ACCOUNTING",
      engineering: "ENGINEERING",
      healthcare: "HEALTHCARE",
      education: "EDUCATION",
      "sales-marketing": "MARKETING_COMMUNICATIONS",
    };
    if (categoryMap[filterValue]) return { category: categoryMap[filterValue] };
  }

  // Remote hub: filter values are job types → add jobType on top of isRemote=true
  if (hubSlug === "remote") {
    const jobTypeMap = {
      "full-time": "FULL_TIME",
      "part-time": "PART_TIME",
      contract: "CONTRACT",
    };
    if (jobTypeMap[filterValue]) return { jobType: jobTypeMap[filterValue] };
  }

  // Default (category hubs): filter values are job types
  const defaultJobTypeMap = {
    "full-time": "FULL_TIME",
    "part-time": "PART_TIME",
    contract: "CONTRACT",
    internship: "INTERNSHIP",
    remote: null, // handled by isRemote flag below
  };
  if (defaultJobTypeMap[filterValue] !== undefined) {
    if (filterValue === "remote") return { isRemote: "true" };
    return { jobType: defaultJobTypeMap[filterValue] };
  }

  // Internships, part-time, entry-level: pass as search term
  // Values like "paid", "weekend", "trainee" don't map to DB fields directly
  return { q: filterValue };
}

function buildHubQueryString(hubFilters, searchQuery, sortBy, page, activeFilter, hubSlug) {
  const params = new URLSearchParams();

  // Hub base filters (from hub-config.js — skip null/undefined)
  if (hubFilters) {
    for (const [key, value] of Object.entries(hubFilters)) {
      if (value != null && value !== "") {
        params.set(key, String(value));
      }
    }
  }

  // Sidebar sub-filter (mapped from label values to API params)
  if (activeFilter && hubSlug) {
    const extraParams = mapSidebarFilter(hubSlug, activeFilter);
    for (const [key, value] of Object.entries(extraParams)) {
      if (value && !params.has(key)) {
        params.set(key, String(value));
      }
    }
  }

  // Search query (debounced) — only set if not already set by sidebar filter
  if (searchQuery?.trim() && !params.has("q")) {
    params.set("q", searchQuery.trim());
  } else if (searchQuery?.trim() && params.has("q")) {
    // Append search query to existing q from sidebar filter
    params.set("q", params.get("q") + " " + searchQuery.trim());
  }

  // Sort
  if (sortBy) params.set("sort", sortBy);

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
  };
}

// ─── Component ────────────────────────────────────────────
export default function HubContent({ hub }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [activeFilter, setActiveFilter] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch jobs from API
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const qs = buildHubQueryString(hub.filters, debouncedSearch, sortBy, currentPage, activeFilter, hub.slug);
      const res = await fetch(`/api/jobs?${qs}`);
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();

      setJobs((data.jobs || []).map(enrichJob));
      if (data.pagination) {
        setTotalJobs(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Error fetching hub jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [hub.filters, hub.slug, debouncedSearch, sortBy, currentPage, activeFilter]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const relatedHubs = getRelatedJobHubs(hub.slug);
  const sidebarFilters = hubSidebarFilters(hub.slug);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearAll = () => {
    setSearchQuery("");
    setActiveFilter(null);
    setCurrentPage(1);
    setSortBy("newest");
  };

  return (
    <>
      {/* Hero */}
      <HubHero hub={{ ...hub, jobCount: totalJobs }} />

      {/* Search + Sort */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4">
          <HubSearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={(s) => { setSortBy(s); setCurrentPage(1); }}
            resultCount={totalJobs}
          />
        </div>
      </div>

      {/* Main Layout */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          {/* LEFT COLUMN */}
          <div>
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 mb-4 hover:bg-gray-50 transition-colors"
            >
              <FiFilter className="w-4 h-4" />
              Filter Jobs
            </button>

            {/* Mobile filter drawer */}
            {showMobileFilters && (
              <div className="lg:hidden fixed inset-0 z-50">
                <div
                  className="absolute inset-0 bg-black/40"
                  onClick={() => setShowMobileFilters(false)}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-gray-900">Filters</h3>
                    <button onClick={() => setShowMobileFilters(false)}>
                      <FiX className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <FilterList
                    filters={sidebarFilters}
                    active={activeFilter}
                    onSelect={(f) => {
                      setActiveFilter(f);
                      setCurrentPage(1);
                      setShowMobileFilters(false);
                    }}
                  />
                </div>
              </div>
            )}

            {/* Job listings */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {loading ? (
                <div className="py-16 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Loading jobs...</p>
                </div>
              ) : jobs.length > 0 ? (
                jobs.map((job) => <JobCard key={job.id} job={job} />)
              ) : (
                <div className="py-16 text-center">
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
              )}
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}

            {/* Service Nudge */}
            {!loading && jobs.length > 0 && (
              <div className="mt-6 bg-white border border-gray-200 border-l-4 border-l-primary rounded-lg p-4 px-5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-[18px] h-[18px] text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-[0.85rem] text-gray-600 leading-relaxed">
                    Stand out from {totalJobs}+ applicants. A professional CV increases your chances by 3x.{" "}
                    <Link href="/cv-services" className="font-semibold text-primary hover:text-primary-dark no-underline">
                      Get Your CV Done from KSh 500 &rarr;
                    </Link>
                  </p>
                </div>
              </div>
            )}

            <AdSlot position="inline" />
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="hidden lg:block space-y-0">
            <SidebarCard title="Filters" icon={FiFilter}>
              <FilterList
                filters={sidebarFilters}
                active={activeFilter}
                onSelect={(f) => { setActiveFilter(f); setCurrentPage(1); }}
              />
            </SidebarCard>

            <CVReviewCTA />

            {relatedHubs.length > 0 && (
              <SidebarCard title="Related Categories">
                <div className="space-y-0">
                  {relatedHubs.map((rh) => (
                    <Link
                      key={rh.slug}
                      href={`/jobs/${rh.slug}`}
                      className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-b-0 hover:text-primary transition-colors group no-underline"
                    >
                      <span className="text-[0.85rem] font-medium text-gray-700 group-hover:text-primary">
                        {rh.name}
                      </span>
                      <span className="flex items-center gap-1.5 text-[0.72rem] text-gray-400">
                        {rh.count} jobs
                        <FiChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </Link>
                  ))}
                </div>
              </SidebarCard>
            )}

            <AdSlot position="sidebar" />

            <SidebarCard title="Job Alerts">
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                Get new {hub.name.toLowerCase()} delivered to your inbox daily.
              </p>
              <NewsletterForm type="job_alerts" />
            </SidebarCard>
          </aside>
        </div>
      </main>
    </>
  );
}

function FilterList({ filters, active, onSelect }) {
  return (
    <div className="space-y-0">
      <button
        onClick={() => onSelect(null)}
        className={`w-full text-left py-2.5 border-b border-gray-100 last:border-b-0 text-[0.85rem] font-medium transition-colors ${
          active === null ? "text-primary font-bold" : "text-gray-600 hover:text-primary"
        }`}
      >
        All Jobs
      </button>
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onSelect(filter.value)}
          className={`w-full text-left py-2.5 border-b border-gray-100 last:border-b-0 text-[0.85rem] font-medium transition-colors ${
            active === filter.value ? "text-primary font-bold" : "text-gray-600 hover:text-primary"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
