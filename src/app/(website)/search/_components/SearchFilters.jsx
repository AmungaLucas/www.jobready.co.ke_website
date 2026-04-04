"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { filterOptions } from "./mock-data";

function FilterSection({ title, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left cursor-pointer mb-3.5 pb-2.5 border-b-2 border-gray-100 bg-transparent border-none p-0"
      >
        <h3 className="text-[0.9rem] font-bold text-gray-900">{title}</h3>
        <FiChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            !isOpen ? "-rotate-90" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="max-h-[300px] overflow-y-auto scrollbar-thin">{children}</div>
      )}
    </div>
  );
}

function CheckboxOption({ label, count, active, onToggle }) {
  return (
    <div
      onClick={onToggle}
      className="flex items-center gap-2.5 py-1.5 cursor-pointer group"
    >
      <div
        className={`w-[18px] h-[18px] rounded flex items-center justify-center shrink-0 transition-all border-2 ${
          active
            ? "bg-primary border-primary"
            : "border-gray-300 group-hover:border-primary"
        }`}
      >
        {active && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-[12px] h-[12px] text-white"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      <span className="flex-1 text-[0.84rem] text-gray-700 group-hover:text-primary transition-colors">
        {label}
      </span>
      {count !== undefined && (
        <span className="text-[0.72rem] text-gray-400 font-medium bg-gray-100 px-2.5 py-0.5 rounded-full min-w-[32px] text-center">
          {count}
        </span>
      )}
    </div>
  );
}

function RadioOption({ label, active, onToggle }) {
  return (
    <div
      onClick={onToggle}
      className="flex items-center gap-2.5 py-1.5 cursor-pointer group"
    >
      <div
        className={`w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 transition-all border-2 ${
          active ? "border-primary" : "border-gray-300 group-hover:border-primary"
        }`}
      >
        {active && <div className="w-2 h-2 rounded-full bg-primary" />}
      </div>
      <span className="text-[0.84rem] text-gray-700 group-hover:text-primary transition-colors">
        {label}
      </span>
    </div>
  );
}

export default function SearchFilters() {
  const [activeJobTypes, setActiveJobTypes] = useState(["Full-Time"]);
  const [activeExperience, setActiveExperience] = useState([]);
  const [activeLocations, setActiveLocations] = useState(["Nairobi"]);
  const [activeCompanies, setActiveCompanies] = useState([]);
  const [activeDate, setActiveDate] = useState("Any time");
  const [activeCategories, setActiveCategories] = useState([]);

  const toggleItem = (arr, setArr, item) => {
    setArr((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  return (
    <aside className="hidden md:block min-w-[280px]">
      {/* Category */}
      <FilterSection title="Category">
        {filterOptions.category.map((cat) => (
          <CheckboxOption
            key={cat.label}
            label={cat.label}
            count={cat.count}
            active={activeCategories.includes(cat.label)}
            onToggle={() => toggleItem(activeCategories, setActiveCategories, cat.label)}
          />
        ))}
      </FilterSection>

      {/* Job Type */}
      <FilterSection title="Job Type">
        {filterOptions.jobType.map((jt) => (
          <CheckboxOption
            key={jt.label}
            label={jt.label}
            count={jt.count}
            active={activeJobTypes.includes(jt.label)}
            onToggle={() => toggleItem(activeJobTypes, setActiveJobTypes, jt.label)}
          />
        ))}
      </FilterSection>

      {/* Experience Level */}
      <FilterSection title="Experience Level">
        {filterOptions.experienceLevel.map((el) => (
          <CheckboxOption
            key={el.label}
            label={el.label}
            count={el.count}
            active={activeExperience.includes(el.label)}
            onToggle={() => toggleItem(activeExperience, setActiveExperience, el.label)}
          />
        ))}
      </FilterSection>

      {/* Date Posted */}
      <FilterSection title="Date Posted">
        {filterOptions.datePosted.map((d) => (
          <RadioOption
            key={d}
            label={d}
            active={activeDate === d}
            onToggle={() => setActiveDate(d)}
          />
        ))}
      </FilterSection>

      {/* Location */}
      <FilterSection title="Location">
        {filterOptions.location.map((loc) => (
          <CheckboxOption
            key={loc.label}
            label={loc.label}
            count={loc.count}
            active={activeLocations.includes(loc.label)}
            onToggle={() => toggleItem(activeLocations, setActiveLocations, loc.label)}
          />
        ))}
      </FilterSection>

      {/* Company */}
      <FilterSection title="Company" defaultOpen={false}>
        {filterOptions.company.map((c) => (
          <CheckboxOption
            key={c.label}
            label={c.label}
            count={c.count}
            active={activeCompanies.includes(c.label)}
            onToggle={() => toggleItem(activeCompanies, setActiveCompanies, c.label)}
          />
        ))}
      </FilterSection>

      {/* Reset / Apply */}
      <div className="flex gap-2 mt-2">
        <button className="flex-1 py-2.5 text-[0.82rem] font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
          Reset
        </button>
        <button className="flex-1 py-2.5 text-[0.82rem] font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors cursor-pointer">
          Apply Filters
        </button>
      </div>
    </aside>
  );
}
