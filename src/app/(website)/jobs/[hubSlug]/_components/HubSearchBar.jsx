"use client";

import { FiSearch, FiArrowDown } from "react-icons/fi";

export default function HubSearchBar({ searchQuery, onSearchChange, sortBy, onSortChange, resultCount }) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <div className="relative flex-1">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search jobs in this category..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-gray-400"
        />
      </div>

      <div className="relative">
        <FiArrowDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="appearance-none w-full sm:w-auto pl-4 pr-9 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all cursor-pointer text-gray-700"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="deadline">Deadline Soon</option>
        </select>
      </div>

      <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
        {resultCount} job{resultCount !== 1 ? "s" : ""}
      </span>
    </div>
  );
}
