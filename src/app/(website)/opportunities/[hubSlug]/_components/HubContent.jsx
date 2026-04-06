"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { FiChevronRight, FiFilter } from "react-icons/fi";

import OpportunityCard from "../../../_components/OpportunityCard";
import CVReviewCTA from "../../../_components/CVReviewCTA";
import NewsletterForm from "../../../_components/NewsletterForm";
import AdSlot from "../../../_components/AdSlot";
import SidebarCard from "../../../_components/SidebarCard";
import Pagination from "../../../_components/Pagination";
import { getRelatedOpportunityHubs } from "./hub-data";

function buildQueryString(hub) {
  const params = new URLSearchParams();
  if (hub.filters?.opportunityType) params.set("opportunityType", hub.filters.opportunityType);
  if (hub.filters?.category) params.set("category", hub.filters.category);
  if (hub.filters?.location) params.set("location", hub.filters.location);
  if (hub.filters?.isRemote) params.set("isRemote", "true");
  return params.toString();
}

export default function HubContent({ hub }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("deadline");
  const [currentPage, setCurrentPage] = useState(1);
  const [opportunities, setOpportunities] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 9;

  const relatedHubs = getRelatedOpportunityHubs(hub.slug);
  const oppType = hub.filters?.opportunityType?.toLowerCase() || "opportunity";

  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const baseParams = buildQueryString(hub);
      const params = new URLSearchParams(baseParams);
      params.set("limit", String(itemsPerPage));
      params.set("page", String(currentPage));
      params.set("sort", sortBy);

      if (searchQuery.trim()) {
        params.set("q", searchQuery.trim());
      }

      const baseUrl = window.location.origin;
      const res = await fetch(`/api/opportunities?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch opportunities");

      const data = await res.json();
      setOpportunities(data.opportunities || []);
      setTotalCount(data.pagination?.total || 0);
      setTotalPages(data.pagination?.totalPages || 0);
    } catch (err) {
      setError(err.message || "Something went wrong");
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  }, [hub, currentPage, sortBy, searchQuery, itemsPerPage]);

  // Fetch featured items (only on mount, not on search)
  useEffect(() => {
    async function fetchFeatured() {
      try {
        const baseParams = buildQueryString(hub);
        const params = new URLSearchParams(baseParams);
        params.set("sort", "featured");
        params.set("limit", "3");

        const res = await fetch(`/api/opportunities?${params.toString()}`);
        if (!res.ok) return;
        const data = await res.json();
        setFeaturedItems((data.opportunities || []).filter((o) => o.isFeatured));
      } catch {
        // ignore featured fetch errors
      }
    }
    fetchFeatured();
  }, [hub]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-purple-900 to-indigo-900 text-white py-12 md:py-16">
        <div className="absolute -top-[50%] -right-[20%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-[30%] -left-[10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,255,255,0.04)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="max-w-[720px] mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-[0.78rem] font-semibold mb-4">
              {totalCount}+ opportunities
            </div>

            <h1 className="text-[1.5rem] md:text-[1.8rem] lg:text-[2.2rem] font-extrabold leading-tight mb-3 tracking-tight">
              {hub.name}
            </h1>

            {hub.heroSubtitle && (
              <p className="text-[0.9rem] md:text-[1.05rem] opacity-85 leading-relaxed mb-3">
                {hub.heroSubtitle}
              </p>
            )}

            <p className="text-[0.85rem] opacity-75 leading-relaxed mb-5 max-w-[560px] mx-auto">
              {hub.description}
            </p>

            <nav>
              <ol className="inline-flex items-center gap-1.5 text-[0.83rem] list-none">
                <li><Link href="/" className="text-white/70 hover:text-white transition-colors no-underline">Home</Link></li>
                <li className="text-white/40">/</li>
                <li><Link href="/opportunities" className="text-white/70 hover:text-white transition-colors no-underline">Opportunities</Link></li>
                <li className="text-white/40">/</li>
                <li className="text-white font-medium">{hub.name.replace(/\s*2026\s*$/, "")}</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      {/* Search + Sort Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${oppType}s...`}
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-gray-400"
              />
            </div>
            <div className="relative">
              <FiChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none rotate-90" />
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="appearance-none w-full sm:w-auto pl-4 pr-9 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all cursor-pointer text-gray-700"
              >
                <option value="deadline">Deadline Soon</option>
                <option value="newest">Newest First</option>
                <option value="featured">Featured First</option>
              </select>
            </div>
            <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
              {totalCount} {oppType}{totalCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          {/* LEFT COLUMN */}
          <div>
            {featuredItems.length > 0 && !searchQuery && (
              <div className="mb-7">
                <h2 className="text-base font-bold text-gray-900 mb-4">
                  Featured {oppType.charAt(0).toUpperCase() + oppType.slice(1)}s
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                  {featuredItems.map((opp) => (
                    <OpportunityCard key={opp.id} title={opp.title} slug={opp.slug} company={opp.company} opportunityType={opp.opportunityType} type={opp.opportunityType?.toLowerCase()} deadline={opp.deadline} isOnline={opp.isOnline} />
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-base font-bold text-gray-900 mb-4">
                All {oppType.charAt(0).toUpperCase() + oppType.slice(1)}s
                <span className="text-sm font-medium text-gray-400 ml-2">({totalCount})</span>
              </h2>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                  <div className="py-16 text-center">
                    <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-gray-500 text-sm">Loading opportunities...</p>
                  </div>
                ) : error ? (
                  <div className="py-16 text-center">
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                    <button onClick={fetchOpportunities} className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
                      Try again
                    </button>
                  </div>
                ) : opportunities.length > 0 ? (
                  opportunities.map((opp) => (
                    <div key={opp.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                      <OpportunityCard title={opp.title} slug={opp.slug} company={opp.company} opportunityType={opp.opportunityType} type={opp.opportunityType?.toLowerCase()} deadline={opp.deadline} isOnline={opp.isOnline} />
                    </div>
                  ))
                ) : (
                  <div className="py-16 text-center">
                    <p className="text-gray-500 text-sm mb-4">No {oppType}s found matching your search.</p>
                    <button onClick={() => { setSearchQuery(""); setCurrentPage(1); }} className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
                      Clear search
                    </button>
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}

              <div className="mt-6 bg-white border border-gray-200 border-l-4 border-l-purple-600 rounded-lg p-4 px-5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-[18px] h-[18px] text-purple-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-[0.85rem] text-gray-600 leading-relaxed">
                    Applying for a {oppType}? A professional CV and cover letter can significantly boost your chances.{" "}
                    <Link href="/cv-services" className="font-semibold text-purple-700 hover:text-purple-900 no-underline">
                      Get Your CV Done from KSh 500 &rarr;
                    </Link>
                  </p>
                </div>
              </div>

              <AdSlot position="inline" />
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-0">
            <CVReviewCTA />

            {relatedHubs.length > 0 && (
              <SidebarCard title="Browse by Type">
                <div className="space-y-0">
                  {relatedHubs.map((rh) => (
                    <Link key={rh.slug} href={`/opportunities/${rh.slug}`} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-b-0 hover:text-primary transition-colors group no-underline">
                      <span className="text-[0.85rem] font-medium text-gray-700 group-hover:text-primary">{rh.name}</span>
                      <span className="flex items-center gap-1.5 text-[0.72rem] text-gray-400">
                        <FiChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </Link>
                  ))}
                </div>
              </SidebarCard>
            )}

            <AdSlot position="sidebar" />

            <SidebarCard title={`${oppType.charAt(0).toUpperCase() + oppType.slice(1)} Alerts`}>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                Get the latest {oppType}s delivered to your inbox weekly. Never miss a deadline.
              </p>
              <NewsletterForm type="opportunity_alerts" />
            </SidebarCard>
          </aside>
        </div>
      </main>
    </>
  );
}
