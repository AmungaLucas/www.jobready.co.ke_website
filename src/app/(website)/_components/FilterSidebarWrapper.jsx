"use client";

import { useState } from "react";
import { FiFilter, FiX } from "react-icons/fi";

/**
 * Wraps a filter sidebar to provide:
 * - Desktop: toggle show/hide button
 * - Mobile: slide-in drawer with overlay
 *
 * Usage:
 *   <FilterSidebarWrapper>
 *     <div>... filter content ...</div>
 *   </FilterSidebarWrapper>
 */
export default function FilterSidebarWrapper({ children }) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <>
      {/* ── Desktop toggle button ── */}
      <button
        onClick={() => setShowFilters((v) => !v)}
        className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer"
      >
        <FiFilter className="w-4 h-4" />
        <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
      </button>

      {/* ── Desktop filter sidebar (toggleable) ── */}
      {showFilters && (
        <div className="hidden lg:block">{children}</div>
      )}

      {/* ── Mobile filter drawer overlay ── */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-black/40 z-[200] lg:hidden"
          onClick={() => setShowFilters(false)}
        />
      )}

      {/* ── Mobile filter drawer ── */}
      <div
        className={`fixed top-0 left-0 h-full w-[300px] max-w-[85vw] bg-gray-50 z-[210] shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${
          showFilters ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <FiFilter className="w-4 h-4 text-purple-600" />
            Filters
          </h2>
          <button
            onClick={() => setShowFilters(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        {/* Drawer content */}
        <div className="p-4">{children}</div>
      </div>
    </>
  );
}
