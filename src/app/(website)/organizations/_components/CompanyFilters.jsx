"use client";

import { useState } from "react";
const industries = [
  "All Industries",
  "Banking & Finance",
  "Telecommunications",
  "Consulting",
  "IT & Technology",
  "NGO & Development",
  "Government",
  "Healthcare",
  "Manufacturing",
  "Education",
  "Energy & Utilities",
  "Insurance",
  "FinTech",
];

const locations = [
  "All Locations",
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Remote",
];

export default function CompanyFilters({ onFilterChange }) {
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");

  const handleFilter = (type, value) => {
    if (type === "industry") setSelectedIndustry(value);
    if (type === "location") setSelectedLocation(value);

    onFilterChange({
      industry: type === "industry" ? value : selectedIndustry,
      location: type === "location" ? value : selectedLocation,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
      <h3 className="text-sm font-bold text-gray-900 mb-4">Filter Companies</h3>

      {/* Industry */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Industry</p>
        <div className="flex flex-wrap gap-1.5">
          {industries.slice(0, 7).map((ind) => (
            <button
              key={ind}
              onClick={() => handleFilter("industry", ind)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedIndustry === ind
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Location</p>
        <div className="flex flex-wrap gap-1.5">
          {locations.slice(0, 5).map((loc) => (
            <button
              key={loc}
              onClick={() => handleFilter("location", loc)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedLocation === loc
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
