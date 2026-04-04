"use client";

import { useState } from "react";

const categories = [
  "All",
  "CV Tips",
  "Interview Prep",
  "Salary Guide",
  "Career Growth",
  "Industry Insights",
  "Job Search",
  "Government Jobs",
];

export default function ArticleCategoryPills({ activeCategory, onCategoryChange }) {
  return (
    <div className="mb-6">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border cursor-pointer ${
              activeCategory === cat
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
