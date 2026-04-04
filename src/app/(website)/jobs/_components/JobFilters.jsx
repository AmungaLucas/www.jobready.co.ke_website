"use client";

import { useState } from "react";
import { HiChevronDown } from "react-icons/hi2";
const filterCategories = [
  { label: "Technology", value: "TECHNOLOGY" },
  { label: "Finance & Accounting", value: "FINANCE_ACCOUNTING" },
  { label: "Engineering", value: "ENGINEERING" },
  { label: "Healthcare", value: "HEALTHCARE" },
  { label: "Education", value: "EDUCATION" },
  { label: "Marketing", value: "MARKETING_COMMUNICATIONS" },
  { label: "Government", value: "GOVERNMENT_PUBLIC_SECTOR" },
  { label: "NGO & Development", value: "NONPROFIT" },
  { label: "Creative & Design", value: "CREATIVE_DESIGN" },
  { label: "Customer Service", value: "CUSTOMER_SERVICE" },
  { label: "Logistics & Supply Chain", value: "SUPPLY_CHAIN" },
  { label: "Legal", value: "LEGAL" },
];

const filterJobTypes = [
  { label: "Full-time", value: "FULL_TIME" },
  { label: "Part-time", value: "PART_TIME" },
  { label: "Contract", value: "CONTRACT" },
  { label: "Internship", value: "INTERNSHIP" },
  { label: "Remote", value: "Remote" },
];

const filterExperienceLevels = [
  { label: "Entry Level", value: "ENTRY" },
  { label: "Mid Level", value: "MID" },
  { label: "Senior Level", value: "SENIOR" },
  { label: "Manager/Director", value: "MANAGER" },
];

const filterLocations = [
  { label: "Nairobi", value: "Nairobi" },
  { label: "Mombasa", value: "Mombasa" },
  { label: "Kisumu", value: "Kisumu" },
  { label: "Nakuru", value: "Nakuru" },
  { label: "Remote", value: "Remote" },
  { label: "Nationwide", value: "Nationwide" },
];

function FilterSection({ title, options, selected, onToggle, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-sm font-bold text-gray-900 pb-2.5 border-b-2 border-gray-100 cursor-pointer bg-transparent border-none font-sans text-left"
      >
        <span>{title}</span>
        <HiChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${!isOpen ? "-rotate-90" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="mt-3 max-h-[240px] overflow-y-auto">
          {options.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2.5 py-1.5 cursor-pointer group"
            >
              <div
                className={`w-[18px] h-[18px] border-2 rounded flex items-center justify-center shrink-0 transition-all ${
                  selected.includes(opt.value)
                    ? "bg-[#1a56db] border-[#1a56db]"
                    : "border-gray-300 group-hover:border-[#1a56db]"
                }`}
              >
                {selected.includes(opt.value) && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className="flex-1 text-[0.84rem] text-gray-700 group-hover:text-[#1a56db] transition-colors">
                {opt.label}
              </span>
              {opt.count !== undefined && opt.count !== null && (
                <span className="text-[0.72rem] text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full min-w-[32px] text-center">
                  {opt.count}
                </span>
              )}
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={() => onToggle(opt.value)}
                className="sr-only"
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function JobFilters({ filters, onFiltersChange }) {
  const toggleCategory = (value) => {
    const newCategory = filters.category === value ? "" : value;
    onFiltersChange({ ...filters, category: newCategory });
  };

  const toggleJobType = (value) => {
    const newType = filters.jobType === value ? "" : value;
    onFiltersChange({ ...filters, jobType: newType });
  };

  const toggleExperience = (value) => {
    const newExp = filters.experienceLevel === value ? "" : value;
    onFiltersChange({ ...filters, experienceLevel: newExp });
  };

  const toggleLocation = (value) => {
    const newLoc = filters.location === value ? "" : value;
    onFiltersChange({ ...filters, location: newLoc });
  };

  const toggleRemote = () => {
    onFiltersChange({ ...filters, isRemote: !filters.isRemote });
  };

  const hasFilters =
    filters.category ||
    filters.jobType ||
    filters.experienceLevel ||
    filters.location ||
    filters.isRemote;

  const clearAll = () => {
    onFiltersChange({
      category: "",
      jobType: "",
      experienceLevel: "",
      location: "",
      isRemote: false,
    });
  };

  return (
    <aside className="hidden lg:block">
      {/* Remote toggle */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm font-bold text-gray-900">Remote Only</span>
          <div
            className={`w-11 h-6 rounded-full transition-colors duration-200 relative cursor-pointer ${
              filters.isRemote ? "bg-[#1a56db]" : "bg-gray-300"
            }`}
            onClick={toggleRemote}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                filters.isRemote ? "translate-x-[22px]" : "translate-x-0.5"
              }`}
            />
          </div>
        </label>
      </div>

      <FilterSection
        title="Category"
        options={filterCategories}
        selected={filters.category ? [filters.category] : []}
        onToggle={toggleCategory}
      />

      <FilterSection
        title="Job Type"
        options={filterJobTypes}
        selected={filters.jobType ? [filters.jobType] : []}
        onToggle={toggleJobType}
      />

      <FilterSection
        title="Experience Level"
        options={filterExperienceLevels}
        selected={filters.experienceLevel ? [filters.experienceLevel] : []}
        onToggle={toggleExperience}
        defaultOpen={false}
      />

      <FilterSection
        title="Location"
        options={filterLocations}
        selected={filters.location ? [filters.location] : []}
        onToggle={toggleLocation}
        defaultOpen={false}
      />

      {/* Reset button */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="w-full py-2.5 text-[0.82rem] font-semibold text-red-500 bg-white border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer font-sans"
        >
          Clear All Filters
        </button>
      )}
    </aside>
  );
}
