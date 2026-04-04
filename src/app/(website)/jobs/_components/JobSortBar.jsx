"use client";

import { useState } from "react";
import { HiChevronDown } from "react-icons/hi2";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";

export default function JobSortBar({ totalJobs, currentPage, pageSize = 10, sort, onSortChange }) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const showing = Math.min(currentPage * pageSize, totalJobs);

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
      {/* Left: Results count + mobile filter button */}
      <div className="flex items-center gap-3">
        <p className="text-[0.88rem] text-gray-600">
          Showing <strong className="text-gray-900">{showing}</strong> of{" "}
          <strong className="text-gray-900">{totalJobs.toLocaleString()}</strong> jobs
        </p>

        {/* Mobile filter button */}
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="lg:hidden inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 rounded-full text-[0.84rem] font-semibold text-gray-700 bg-white cursor-pointer hover:bg-gray-50 font-sans"
        >
          <HiAdjustmentsHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Right: Sort dropdown */}
      <div className="flex items-center gap-2 text-[0.84rem] text-gray-500">
        <span>Sort by:</span>
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none pl-3 pr-9 py-1.5 border border-gray-200 rounded-lg text-[0.84rem] font-sans text-gray-700 bg-white cursor-pointer focus:outline-none focus:border-[#1a56db]"
          >
            <option value="newest">Newest First</option>
            <option value="deadline">Deadline Soon</option>
            <option value="featured">Featured</option>
          </select>
          <HiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
