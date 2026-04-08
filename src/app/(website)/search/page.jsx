"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiSearch,
  FiBriefcase,
  FiAward,
  FiLayers,
  FiBookOpen,
  FiMapPin,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiX,
  FiUsers,
} from "react-icons/fi";
import { formatDate, formatCurrency, formatJobType, formatExperienceLevel } from "@/lib/format";
import { formatLocation, getInitials } from "@/lib/normalize";

// ─── Constants ──────────────────────────────────────────
const TABS = [
  { key: "all", label: "All", icon: FiSearch },
  { key: "jobs", label: "Jobs", icon: FiBriefcase },
  { key: "opportunities", label: "Opportunities", icon: FiAward },
  { key: "companies", label: "Companies", icon: FiLayers },
  { key: "articles", label: "Career Advice", icon: FiBookOpen },
];

const OPP_TYPE_DISPLAY = {
  INTERNSHIP: "Internship",
  SPONSORSHIP: "Sponsorship",
  BURSARY: "Bursary",
  UNIVERSITY_ADMISSION: "University Admission",
  BOOTCAMP: "Bootcamp",
  MENTORSHIP: "Mentorship",
  SCHOLARSHIP: "Scholarship",
  CERTIFICATION: "Certification",
  FUNDING: "Funding",
  GRANT: "Grant",
  FELLOWSHIP: "Fellowship",
  COMPETITION: "Competition",
  CONFERENCE: "Conference",
  VOLUNTEER: "Volunteer",
  APPRENTICESHIP: "Apprenticeship",
};

const OPP_TYPE_COLORS = {
  INTERNSHIP: "bg-blue-100 text-blue-700",
  SPONSORSHIP: "bg-green-100 text-green-700",
  BURSARY: "bg-emerald-100 text-emerald-700",
  UNIVERSITY_ADMISSION: "bg-purple-100 text-purple-700",
  BOOTCAMP: "bg-orange-100 text-orange-700",
  MENTORSHIP: "bg-pink-100 text-pink-700",
  SCHOLARSHIP: "bg-indigo-100 text-indigo-700",
  CERTIFICATION: "bg-cyan-100 text-cyan-700",
  FUNDING: "bg-amber-100 text-amber-700",
  GRANT: "bg-teal-100 text-teal-700",
  FELLOWSHIP: "bg-violet-100 text-violet-700",
  COMPETITION: "bg-red-100 text-red-700",
  CONFERENCE: "bg-sky-100 text-sky-700",
  VOLUNTEER: "bg-lime-100 text-lime-700",
  APPRENTICESHIP: "bg-fuchsia-100 text-fuchsia-700",
};

// ─── Inner Search Page (uses useSearchParams) ───────────
function SearchPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get("q") || "";
  const initialType = searchParams.get("type") || "all";
  const initialLocation = searchParams.get("location") || "";
  const initialJobType = searchParams.get("jobType") || "";

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState(initialType);
  const [locationFilter, setLocationFilter] = useState(initialLocation);
  const [jobTypeFilter, setJobTypeFilter] = useState(initialJobType);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const initializedRef = useState(false);

  // Build API params
  const buildApiParams = useCallback(
    (overrides = {}) => {
      const params = new URLSearchParams();
      const q = overrides.query ?? query;
      const t = overrides.type ?? activeTab;
      const p = overrides.page ?? page;

      if (q) params.set("q", q);
      if (t && t !== "all") params.set("type", t);
      if (locationFilter) params.set("location", locationFilter);
      if (jobTypeFilter) params.set("jobType", jobTypeFilter);
      params.set("page", p.toString());
      params.set("limit", "10");

      return params.toString();
    },
    [query, activeTab, page, locationFilter, jobTypeFilter]
  );

  // Update URL without re-fetching
  const updateUrl = useCallback(
    (overrides = {}) => {
      const q = overrides.query ?? query;
      const t = overrides.type ?? activeTab;
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (t && t !== "all") params.set("type", t);
      if (locationFilter) params.set("location", locationFilter);
      if (jobTypeFilter) params.set("jobType", jobTypeFilter);
      router.push(`/search?${params.toString()}`, { scroll: false });
    },
    [query, activeTab, locationFilter, jobTypeFilter, router]
  );

  // Fetch results
  const fetchResults = useCallback(
    async (overrides = {}) => {
      const q = overrides.query ?? query;
      if (!q.trim()) {
        setResults(null);
        return;
      }

      setLoading(true);
      try {
        const params = buildApiParams(overrides);
        const res = await fetch(`/api/search?${params}`);
        const data = await res.json();
        setResults(data);
      } catch {
        setResults(null);
      } finally {
        setLoading(false);
      }
    },
    [query, buildApiParams]
  );

  // Initial load from URL params
  useEffect(() => {
    if (initialQuery) {
      fetchResults({ query: initialQuery, type: initialType || "all" });
    }
    initializedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch when tab or filters change
  useEffect(() => {
    if (!initializedRef.current) return;
    setPage(1);
    fetchResults({ page: 1 });
    updateUrl({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, locationFilter, jobTypeFilter]);

  // Re-fetch on page change
  useEffect(() => {
    if (!initializedRef.current) return;
    fetchResults();
    updateUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Search form submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setPage(1);
      fetchResults({ query: query.trim(), page: 1 });
      updateUrl({ query: query.trim(), page: 1 });
    }
  };

  // Tab change
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
  };

  // Clear all filters
  const clearFilters = () => {
    setLocationFilter("");
    setJobTypeFilter("");
  };

  const hasActiveFilters = !!locationFilter || !!jobTypeFilter;

  // Current tab results
  const currentResults = results?.results?.[activeTab] || { items: [], total: 0 };
  const totalPages = Math.ceil(currentResults.total / 10);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* ═══ Search Header ═══ */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-6">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Job title, keyword, or company..."
                  className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-gray-800 shadow-sm"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-full font-semibold text-white transition-colors cursor-pointer whitespace-nowrap"
                style={{ backgroundColor: "#F97316" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ea580c")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#F97316")}
              >
                Search
              </button>
            </div>
          </form>

          {/* Filters row */}
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                hasActiveFilters
                  ? "border-teal-400 bg-teal-50 text-teal-700"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FiFilter className="w-3.5 h-3.5" />
              Filters
              {hasActiveFilters && (
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              )}
            </button>

            {results && (
              <p className="text-sm text-gray-500">
                {results.overallTotal.toLocaleString()} result{results.overallTotal !== 1 ? "s" : ""} for{" "}
                <span className="font-medium text-gray-700">&ldquo;{results.query}&rdquo;</span>
              </p>
            )}
          </div>

          {/* Filters panel */}
          {showFilters && (
            <div className="max-w-3xl mx-auto mt-3 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                    <input
                      type="text"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      placeholder="County or town..."
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Job Type</label>
                  <select
                    value={jobTypeFilter}
                    onChange={(e) => setJobTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                  >
                    <option value="">All Types</option>
                    <option value="FULL_TIME">Full-time</option>
                    <option value="PART_TIME">Part-time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="FREELANCE">Freelance</option>
                    <option value="VOLUNTEER">Volunteer</option>
                  </select>
                </div>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-3 flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                >
                  <FiX className="w-3 h-3" />
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* ═══ Empty state (no query yet) ═══ */}
        {!results && !loading && !initialQuery && (
          <div className="text-center py-16">
            <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">Search Jobs & Opportunities</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Type a keyword, job title, company name, or location to find what you&apos;re looking for.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Software Engineer", "Internship", "Safaricom", "Nairobi", "Scholarship"].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setQuery(s);
                    fetchResults({ query: s, page: 1 });
                    updateUrl({ query: s, page: 1 });
                  }}
                  className="px-4 py-1.5 rounded-full border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 hover:text-teal-600 transition-colors cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══ Loading ═══ */}
        {loading && (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Searching...</p>
          </div>
        )}

        {/* ═══ Results ═══ */}
        {results && !loading && (
          <>
            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-gray-200 mb-6 overflow-x-auto scrollbar-hide">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const count =
                  tab.key === "all"
                    ? results.overallTotal
                    : results.results[tab.key]?.total || 0;

                return (
                  <button
                    key={tab.key}
                    onClick={() => handleTabChange(tab.key)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                      activeTab === tab.key
                        ? "border-teal-500 text-teal-700"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full ${
                        activeTab === tab.key
                          ? "bg-teal-100 text-teal-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {count.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Count for active tab */}
            <p className="text-sm text-gray-500 mb-4">
              Showing {currentResults.total.toLocaleString()}{" "}
              {activeTab === "all"
                ? "total results"
                : `${TABS.find((t) => t.key === activeTab)?.label.toLowerCase()} results`}
            </p>

            {/* ─── "All" tab: grouped sections ─── */}
            {activeTab === "all" && (
              <div className="space-y-8">
                {results.results.jobs?.total > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <FiBriefcase className="text-teal-600" />
                        Jobs ({results.results.jobs.total.toLocaleString()})
                      </h3>
                      <button
                        onClick={() => handleTabChange("jobs")}
                        className="text-sm text-teal-600 hover:underline cursor-pointer"
                      >
                        View all →
                      </button>
                    </div>
                    <div className="space-y-3">
                      {results.results.jobs.items.slice(0, 5).map((job) => (
                        <JobCard key={job.id} job={job} />
                      ))}
                    </div>
                  </section>
                )}

                {results.results.opportunities?.total > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <FiAward className="text-purple-600" />
                        Opportunities ({results.results.opportunities.total.toLocaleString()})
                      </h3>
                      <button
                        onClick={() => handleTabChange("opportunities")}
                        className="text-sm text-purple-600 hover:underline cursor-pointer"
                      >
                        View all →
                      </button>
                    </div>
                    <div className="space-y-3">
                      {results.results.opportunities.items.slice(0, 5).map((opp) => (
                        <OppCard key={opp.id} opp={opp} />
                      ))}
                    </div>
                  </section>
                )}

                {results.results.companies?.total > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <FiLayers className="text-blue-600" />
                        Companies ({results.results.companies.total.toLocaleString()})
                      </h3>
                      <button
                        onClick={() => handleTabChange("companies")}
                        className="text-sm text-blue-600 hover:underline cursor-pointer"
                      >
                        View all →
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {results.results.companies.items.slice(0, 6).map((c) => (
                        <CompanyCard key={c.id} company={c} />
                      ))}
                    </div>
                  </section>
                )}

                {results.results.articles?.total > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <FiBookOpen className="text-amber-600" />
                        Career Advice ({results.results.articles.total.toLocaleString()})
                      </h3>
                      <button
                        onClick={() => handleTabChange("articles")}
                        className="text-sm text-amber-600 hover:underline cursor-pointer"
                      >
                        View all →
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {results.results.articles.items.slice(0, 4).map((a) => (
                        <ArticleCard key={a.id} article={a} />
                      ))}
                    </div>
                  </section>
                )}

                {results.overallTotal === 0 && <NoResults query={results.query} />}
              </div>
            )}

            {/* ─── Single category tabs ─── */}
            {activeTab === "jobs" && (
              <div className="space-y-3">
                {currentResults.items.length > 0
                  ? currentResults.items.map((job) => <JobCard key={job.id} job={job} />)
                  : <NoResults query={results.query} type="jobs" />}
              </div>
            )}

            {activeTab === "opportunities" && (
              <div className="space-y-3">
                {currentResults.items.length > 0
                  ? currentResults.items.map((opp) => <OppCard key={opp.id} opp={opp} />)
                  : <NoResults query={results.query} type="opportunities" />}
              </div>
            )}

            {activeTab === "companies" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentResults.items.length > 0
                  ? currentResults.items.map((c) => <CompanyCard key={c.id} company={c} />)
                  : <NoResults query={results.query} type="companies" />}
              </div>
            )}

            {activeTab === "articles" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentResults.items.length > 0
                  ? currentResults.items.map((a) => <ArticleCard key={a.id} article={a} />)
                  : <NoResults query={results.query} type="articles" />}
              </div>
            )}

            {/* ─── Pagination (single tab) ─── */}
            {activeTab !== "all" && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <FiChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <span className="text-sm text-gray-600 px-3">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Next
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

// ═══════════════════════════════════════════════════════════
// Result Card Components
// ═══════════════════════════════════════════════════════════

function JobCard({ job }) {
  const location = formatLocation(job);
  const salary = job.salaryMin
    ? `${formatCurrency(job.salaryMin)}${job.salaryMax ? ` – ${formatCurrency(job.salaryMax)}` : ""}`
    : null;

  return (
    <Link href={`/jobs/${job.slug}`} className="block bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-teal-200 transition-all">
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden"
          style={{ backgroundColor: job.company?.logoColor || "#1a56db" }}
        >
          {job.company?.logo ? (
            <img src={job.company.logo} alt="" className="w-full h-full object-cover" />
          ) : (
            getInitials(job.company?.name)
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm truncate">{job.title}</h4>
          <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
            <span className="font-medium text-gray-700">{job.company?.name}</span>
            {location && (
              <>
                <span className="text-gray-300">·</span>
                <span className="flex items-center gap-0.5"><FiMapPin className="w-3 h-3" />{location}</span>
              </>
            )}
            {job.employmentType && (
              <>
                <span className="text-gray-300">·</span>
                <span>{formatJobType(job.employmentType)}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {salary && (
              <span className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">💰 {salary}</span>
            )}
            {job.isRemote && (
              <span className="text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">💻 Remote</span>
            )}
            {job.isFeatured && (
              <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">⭐ Featured</span>
            )}
            {job.applicationDeadline && (
              <span className="text-xs text-gray-400 flex items-center gap-0.5 ml-auto">
                <FiClock className="w-3 h-3" />
                {formatDate(job.applicationDeadline)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function OppCard({ opp }) {
  const typeDisplay = OPP_TYPE_DISPLAY[opp.opportunityType] || opp.opportunityType?.replace(/_/g, " ");
  const typeColor = OPP_TYPE_COLORS[opp.opportunityType] || "bg-gray-100 text-gray-700";

  return (
    <Link href={`/opportunities/${opp.slug}`} className="block bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-purple-200 transition-all">
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden"
          style={{ backgroundColor: opp.company?.logoColor || "#7c3aed" }}
        >
          {opp.company?.logo ? (
            <img src={opp.company.logo} alt="" className="w-full h-full object-cover" />
          ) : (
            getInitials(opp.company?.name)
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm truncate">{opp.title}</h4>
          <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
            {opp.company?.name && <span className="font-medium text-gray-700">{opp.company.name}</span>}
            <span className={`text-xs px-2 py-0.5 rounded-full ${typeColor}`}>{typeDisplay}</span>
          </div>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {opp.deadline && (
              <span className="text-xs text-gray-400 flex items-center gap-0.5">
                <FiClock className="w-3 h-3" />
                Deadline: {formatDate(opp.deadline)}
              </span>
            )}
            {opp.isFeatured && (
              <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">⭐ Featured</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function CompanyCard({ company }) {
  return (
    <Link href={`/organizations/${company.slug}`} className="block bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-blue-200 transition-all">
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 overflow-hidden"
          style={{ backgroundColor: company.logoColor || "#1a56db" }}
        >
          {company.logo ? (
            <img src={company.logo} alt="" className="w-full h-full object-cover" />
          ) : (
            getInitials(company.name)
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="font-semibold text-gray-900 text-sm truncate">{company.name}</h4>
            {company.isVerified && <span className="text-teal-500 text-xs">✓</span>}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {[company.industry, company.city].filter(Boolean).join(" · ")}
          </p>
          {company.jobCount > 0 && (
            <p className="text-xs text-teal-600 mt-0.5">{company.jobCount} open job{company.jobCount !== 1 ? "s" : ""}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

function ArticleCard({ article }) {
  return (
    <Link href={`/career-advice/${article.slug}`} className="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-amber-200 transition-all">
      {article.featuredImage && (
        <div className="aspect-video bg-gray-200 overflow-hidden">
          <img src={article.featuredImage} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1.5">
          {article.category?.name && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: article.category.color ? `${article.category.color}20` : "#f3f4f6",
                color: article.category.color || "#6b7280",
              }}
            >
              {article.category.name}
            </span>
          )}
          {article.readingTime && <span className="text-xs text-gray-400">{article.readingTime}</span>}
        </div>
        <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">{article.title}</h4>
        {article.excerpt && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{article.excerpt}</p>}
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
          {article.author?.name && <span className="font-medium text-gray-500">{article.author.name}</span>}
          {article.publishedAt && <span>{formatDate(article.publishedAt)}</span>}
        </div>
      </div>
    </Link>
  );
}

function NoResults({ query, type }) {
  const label = type ? TABS.find((t) => t.key === type)?.label.toLowerCase() : "results";

  return (
    <div className="text-center py-12">
      <FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <h3 className="text-lg font-semibold text-gray-700 mb-1">No {label} found</h3>
      <p className="text-sm text-gray-500 max-w-md mx-auto">
        We couldn&apos;t find any {label} matching &ldquo;{query}&rdquo;. Try different keywords or browse our{" "}
        <Link href="/jobs" className="text-teal-600 hover:underline">jobs</Link> and{" "}
        <Link href="/opportunities" className="text-teal-600 hover:underline">opportunities</Link> pages directly.
      </p>
    </div>
  );
}

// ─── Page Export (Suspense boundary for useSearchParams) ──
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </main>
      }
    >
      <SearchPageInner />
    </Suspense>
  );
}
