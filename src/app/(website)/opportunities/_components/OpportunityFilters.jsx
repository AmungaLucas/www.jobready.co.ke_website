"use client";

import { useState } from "react";

const opportunityTypes = [
  "All",
  "Scholarships",
  "Grants",
  "Fellowships",
  "Bursaries",
  "Competitions",
  "Conferences",
  "Volunteer",
  "Apprenticeships",
];

const typeStyles = {
  All: "bg-primary text-white shadow-sm",
  Scholarships: "bg-purple-light text-purple",
  Grants: "bg-amber-100 text-amber-900",
  Fellowships: "bg-blue-100 text-blue-700",
  Bursaries: "bg-emerald-100 text-emerald-700",
  Competitions: "bg-red-100 text-red-600",
  Conferences: "bg-indigo-100 text-indigo-700",
  Volunteer: "bg-pink-100 text-pink-700",
  Apprenticeships: "bg-orange-100 text-orange-700",
};

export default function OpportunityFilters({ activeType, onTypeChange }) {
  const [active, setActive] = useState(activeType || "All");

  const handleClick = (type) => {
    setActive(type);
    if (onTypeChange) onTypeChange(type);
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-[68px] md:top-[68px] z-[90] shadow-sm">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
          {opportunityTypes.map((type) => {
            const isActive = active === type;
            return (
              <button
                key={type}
                onClick={() => handleClick(type)}
                className={`px-5 py-3 text-[0.84rem] font-medium whitespace-nowrap cursor-pointer transition-all border-b-2 shrink-0 ${
                  isActive
                    ? `${typeStyles[type] || "bg-primary text-white shadow-sm"} border-transparent font-semibold`
                    : "text-gray-500 border-transparent hover:text-primary hover:border-primary/20"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
