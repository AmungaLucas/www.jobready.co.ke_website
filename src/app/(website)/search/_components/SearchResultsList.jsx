"use client";

import { useState, useEffect, useCallback } from "react";
import { FiBriefcase, FiAward, FiLoader, FiSearch } from "react-icons/fi";
import JobCard from "../../_components/JobCard";
import OpportunityCard from "../../_components/OpportunityCard";

export default function SearchResultsList({
  query,
  location = "All Locations",
  initialType = "jobs",
}) {
  const [activeTab, setActiveTab] = useState(
    initialType === "jobs" || initialType === "opportunities"
      ? initialType
      : "jobs"
  );
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResults = useCallback(async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        q: query,
        type: activeTab,
        limit: "10",
      });
      if (location && location !== "All Locations") {
        params.set("location", location);
      }

      const res = await fetch(`/api/search?${params.toString()}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setResults(data.results || {});
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, [query, activeTab, location]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const jobItems = results?.jobs?.items || [];
  const jobTotal = results?.jobs?.total || 0;
  const oppItems = results?.opportunities?.items || [];
  const oppTotal = results?.opportunities?.total || 0;

  const tabs = [
    { key: "jobs", label: "Jobs", icon: FiBriefcase, count: jobTotal },
    {
      key: "opportunities",
      label: "Opportunities",
      icon: FiAward,
      count: oppTotal,
    },
  ];

  return (
    <div className="min-w-0">
      {/* Tab Toggle */}
      <div className="flex items-center gap-3 mb-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              <span
                className={`text-[0.72rem] font-bold px-2 py-0.5 rounded-full ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <FiLoader className="w-8 h-8 text-primary animate-spin" />
          <span className="mt-3 text-sm text-gray-500">Searching...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <FiSearch className="w-8 h-8 text-red-400" />
          <p className="mt-3 text-sm text-red-500">{error}</p>
          <button
            onClick={fetchResults}
            className="mt-2 text-sm text-primary font-semibold hover:underline cursor-pointer"
          >
            Try again
          </button>
        </div>
      )}

      {/* Results */}
      {!loading && !error && results && (
        <>
          {/* Results Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-gray-100 mb-1">
            <p className="text-[0.88rem] text-gray-600">
              {activeTab === "jobs" ? jobTotal : oppTotal} results
              {query ? (
                <>
                  {" "}
                  for{" "}
                  <span className="font-semibold text-primary bg-primary-light px-1.5 py-0.5 rounded text-[0.84rem]">
                    {query}
                  </span>
                </>
              ) : null}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[0.84rem] text-gray-500">Sort:</span>
              <select className="py-1.5 px-3 pr-8 border-2 border-gray-200 rounded-lg text-[0.84rem] text-gray-700 bg-white appearance-none cursor-pointer focus:outline-none focus:border-primary">
                <option>Most Relevant</option>
                <option>Newest First</option>
                <option>Recently Updated</option>
              </select>
            </div>
          </div>

          {/* Job Results */}
          {activeTab === "jobs" && (
            jobItems.length > 0 ? (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {jobItems.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FiSearch className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">
                  No jobs found matching your search.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Try different keywords or remove filters.
                </p>
              </div>
            )
          )}

          {/* Opportunity Results */}
          {activeTab === "opportunities" && (
            oppItems.length > 0 ? (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {oppItems.map((opp) => (
                  <div
                    key={opp.id}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    <OpportunityCard
                      title={opp.title}
                      slug={opp.slug}
                      organizationName={opp.organizationName}
                      opportunityType={opp.opportunityType}
                      type={opp.opportunityType?.toLowerCase()}
                      deadline={opp.deadline}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FiSearch className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">
                  No opportunities found matching your search.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Try different keywords or remove filters.
                </p>
              </div>
            )
          )}
        </>
      )}

      {/* CV Service Nudge */}
      {!loading && (
        <div className="mt-6 bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-400 rounded-xl p-5 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shrink-0">
            <svg
              className="w-[22px] h-[22px] text-amber-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h4 className="text-[0.92rem] font-bold text-amber-900 mb-0.5">
              Want to stand out from other applicants?
            </h4>
            <p className="text-[0.8rem] text-amber-900/80 leading-relaxed">
              Get a professional, ATS-optimized CV tailored to your target role.
              Our experts write CVs that get you shortlisted.
            </p>
          </div>
          <a
            href="/cv-services"
            className="px-5 py-2.5 bg-amber-900 text-white text-[0.82rem] font-bold rounded-lg hover:bg-amber-800 transition-colors no-underline shrink-0"
          >
            Get CV from KSh 500
          </a>
        </div>
      )}
    </div>
  );
}
