"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Script from "next/script";
import { FiBriefcase, FiAlertCircle, FiSearch } from "react-icons/fi";
import Link from "next/link";

import SearchBar from "./_components/SearchBar";
import SearchFilters from "./_components/SearchFilters";
import SearchResultsList from "./_components/SearchResultsList";
import TrendingSearches from "./_components/TrendingSearches";
import CVReviewCTA from "../_components/CVReviewCTA";
import Pagination from "../_components/Pagination";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const location = searchParams.get("location") || "All Locations";
  const type = searchParams.get("type") || "jobs";

  const hasQuery = query.trim().length > 0;

  // JSON-LD for search results page
  const jsonLd = hasQuery
    ? {
        "@context": "https://schema.org/",
        "@type": "SearchResultsPage",
        name: "JobReady Kenya - Search Results",
        url: `https://jobready.co.ke/search?q=${encodeURIComponent(query)}`,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: 47,
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              item: {
                "@type": "JobPosting",
                title: "Senior Accountant",
                hiringOrganization: {
                  "@type": "Organization",
                  name: "Safaricom",
                },
              },
            },
          ],
        },
      }
    : null;

  return (
    <>
      {/* JSON-LD */}
      {jsonLd && (
        <Script
          id="search-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* 1. SEARCH BAR */}
      <SearchBar initialQuery={query} initialLocation={location} />

      {/* 2. MAIN SEARCH LAYOUT */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 md:py-14">
        {hasQuery ? (
          <>
            {/* Active Filters Bar */}
            <div className="flex items-center gap-2 flex-wrap py-3">
              <span className="text-[0.8rem] font-semibold text-gray-500 whitespace-nowrap">
                Filters:
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.78rem] font-semibold bg-primary-light text-primary border border-transparent hover:border-primary">
                {query}
                <Link
                  href="/search"
                  className="hover:text-primary-dark"
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </Link>
              </span>
              {location !== "All Locations" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.78rem] font-semibold bg-primary-light text-primary border border-transparent hover:border-primary">
                  {location}
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}`}
                    className="hover:text-primary-dark"
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </Link>
                </span>
              )}
              {type !== "jobs" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.78rem] font-semibold bg-primary-light text-primary border border-transparent hover:border-primary">
                  {type}
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}`}
                    className="hover:text-primary-dark"
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </Link>
                </span>
              )}
              <Link
                href="/search"
                className="text-[0.8rem] font-semibold text-red-500 hover:text-red-600 hover:underline no-underline"
              >
                Clear all
              </Link>
            </div>

            {/* 3-column layout: Filters | Results | Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-8 pb-16">
              {/* LEFT: Filter Sidebar */}
              <SearchFilters />

              {/* CENTER: Results */}
              <SearchResultsList query={query} location={location} initialType={type} />

              {/* RIGHT: Sidebar */}
              <aside className="hidden xl:block space-y-0">
                <TrendingSearches />
              </aside>
            </div>
          </>
        ) : (
          /* ── NO QUERY: Show helpful empty state ── */
          <div className="max-w-xl mx-auto text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <FiAlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Search for jobs and opportunities
            </h2>
            <p className="text-[0.9rem] text-gray-500 mb-6 leading-relaxed">
              Enter a keyword, job title, company name, or skill in the search bar above to find matching jobs, scholarships, grants, and more.
            </p>

            {/* Suggestions */}
            <div className="bg-white rounded-xl shadow-sm p-6 text-left">
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FiSearch className="w-4 h-4 text-primary" />
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "accounting jobs",
                  "software developer",
                  "scholarships",
                  "nursing jobs",
                  "internship Nairobi",
                  "government jobs",
                ].map((term) => (
                  <Link
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[0.82rem] font-medium text-gray-600 bg-gray-50 border border-gray-200 hover:bg-primary-light hover:text-primary hover:border-primary-light transition-all no-underline"
                  >
                    <FiSearch className="w-3.5 h-3.5 text-gray-400" />
                    {term}
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick categories */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Link
                href="/jobs"
                className="flex items-center justify-center gap-2 py-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all no-underline text-gray-700 hover:text-primary group"
              >
                <FiBriefcase className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                <span className="text-sm font-semibold">Browse All Jobs</span>
              </Link>
              <Link
                href="/opportunities"
                className="flex items-center justify-center gap-2 py-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all no-underline text-gray-700 hover:text-primary group"
              >
                <svg className="w-4 h-4 text-gray-400 group-hover:text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                <span className="text-sm font-semibold">Browse Opportunities</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1200px] mx-auto px-5 py-16 text-center text-gray-400 text-sm">
          Loading search...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
