"use client";

import { useState } from "react";
import CompanyCard from "./CompanyCard";
import CompanyFilters from "./CompanyFilters";
import CVReviewCTA from "@/app/(website)/_components/CVReviewCTA";
import AdSlot from "@/app/(website)/_components/AdSlot";
import SidebarCard from "@/app/(website)/_components/SidebarCard";
import Link from "next/link";

const browseIndustries = [
  { name: "Banking & Finance", count: 18 },
  { name: "IT & Technology", count: 22 },
  { name: "Government", count: 24 },
  { name: "NGO & Development", count: 31 },
  { name: "Telecommunications", count: 5 },
  { name: "Healthcare", count: 12 },
];

/**
 * Compute initials from a company name for sidebar display.
 */
function getInitials(name) {
  if (!name) return "?";
  const parts = name.replace(/[^a-zA-Z\s]/g, "").split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

const PER_PAGE = 9;

export default function OrganizationsContent({ companies }) {
  const [filters, setFilters] = useState({
    industry: "All Industries",
    location: "All Locations",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = companies.filter((c) => {
    if (filters.industry !== "All Industries" && c.industry !== filters.industry) return false;
    if (filters.location !== "All Locations" && c.city !== filters.location) return false;
    return true;
  });

  const featuredCompanies = companies
    .filter((c) => (c.jobCount ?? 0) >= 8)
    .slice(0, 5);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  return (
    <div className="container">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 py-10 md:py-14">
        {/* Main Column */}
        <div className="min-w-0">
          <CompanyFilters onFilterChange={setFilters} />

          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              Showing <strong className="text-gray-900 font-bold">{filtered.length}</strong> companies
            </p>
          </div>

          {/* Company Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {paged.map((company) => (
              <CompanyCard key={company.slug} company={company} />
            ))}
          </div>

          {paged.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <p className="text-gray-500 text-sm">No companies found matching your filters.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-6">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-40 cursor-pointer"
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                    page === currentPage
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 bg-white border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-40 cursor-pointer"
              >
                ›
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-[84px]">
            <CVReviewCTA />
            <AdSlot position="sidebar" />

            {/* Featured Companies */}
            <SidebarCard title="Featured Companies">
              <ul className="list-none">
                {featuredCompanies.map((company) => (
                  <li key={company.slug} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-b-0">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs text-white"
                      style={{
                        background: `linear-gradient(135deg, ${company.logoColor}, ${company.logoColor}dd)`,
                      }}
                    >
                      {company.logo ? (
                        <img src={company.logo} alt={company.name} className="w-7 h-7 rounded-md object-cover" />
                      ) : (
                        getInitials(company.name)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/organizations/${company.slug}`}
                        className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-1 no-underline"
                      >
                        {company.name}
                      </Link>
                    </div>
                    <span className="text-[0.65rem] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {company.jobCount ?? 0} jobs
                    </span>
                  </li>
                ))}
              </ul>
            </SidebarCard>

            {/* Browse by Industry */}
            <SidebarCard title="Browse by Industry">
              <ul className="list-none">
                {browseIndustries.map((ind) => (
                  <li key={ind.name} className="mb-0.5">
                    <span className="flex justify-between items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all cursor-pointer">
                      {ind.name}
                      <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
                        {ind.count}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </SidebarCard>

            <AdSlot position="sidebar" />
          </div>
        </aside>
      </div>
    </div>
  );
}
