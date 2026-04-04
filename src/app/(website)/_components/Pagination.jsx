"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (!totalPages || totalPages <= 1) return null;

  function getPageNumbers() {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if near start
      if (currentPage <= 3) {
        end = Math.min(4, totalPages - 1);
      }
      // Adjust if near end
      if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - 3);
      }

      // Add ellipsis before range
      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis after range
      if (end < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  }

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Page Numbers */}
      {pages.map((page, idx) =>
        page === "..." ? (
          <span
            key={`dots-${idx}`}
            className="inline-flex items-center justify-center w-9 h-9 text-sm text-gray-400"
          >
            <MoreHorizontal size={16} />
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
              page === currentPage
                ? "bg-primary text-white shadow-sm"
                : "text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            }`}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
