"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiMapPin, FiX } from "react-icons/fi";

const locations = [
  "All Locations",
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Eldoret",
  "Remote",
];

export default function SearchBar({ initialQuery = "", initialLocation = "All Locations" }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (location && location !== "All Locations") params.set("location", location);
    router.push(`/search?${params.toString()}`);
  };

  const clearQuery = () => {
    setQuery("");
  };

  return (
    <section className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-[1200px] mx-auto px-5">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Job title, keyword, or company..."
              className="w-full py-3 pl-12 pr-10 border-2 border-gray-200 rounded-xl text-[0.92rem] text-gray-800 bg-white placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={clearQuery}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <FiX className="w-3.5 h-3.5 text-gray-500" />
              </button>
            )}
          </div>

          {/* Location Select */}
          <div className="relative">
            <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 pointer-events-none" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full sm:w-[160px] py-3 pl-11 pr-8 border-2 border-gray-200 rounded-xl text-[0.9rem] text-gray-700 bg-white appearance-none cursor-pointer focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white text-[0.9rem] font-bold rounded-xl transition-all hover:-translate-y-px flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <FiSearch className="w-4 h-4" />
            Search
          </button>
        </form>
      </div>
    </section>
  );
}
