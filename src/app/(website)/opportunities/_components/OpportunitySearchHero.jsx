"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiMapPin, FiAward } from "react-icons/fi";
import { opportunityStats } from "./mock-data";

const locations = [
  "All Locations",
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Remote",
  "International",
];

export default function OpportunitySearchHero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("All Locations");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (location && location !== "All Locations") params.set("location", location);
    router.push(`/search?${params.toString()}&type=opportunities`);
  };

  return (
    <section className="bg-gradient-to-br from-primary via-primary-dark to-[#1e3a8a] text-white relative overflow-hidden">
      {/* Decorative radial gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(255,255,255,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 md:py-16 relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 rounded-full text-[0.75rem] font-semibold mb-4 backdrop-blur-sm">
          <FiAward className="w-3.5 h-3.5" />
          Scholarships, Grants, Fellowships &amp; More
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-[2rem] font-extrabold leading-tight mb-3">
          Opportunities for Kenyans
        </h1>

        {/* Subtitle */}
        <p className="text-[0.9rem] md:text-base opacity-85 leading-relaxed mb-6 max-w-[560px]">
          Discover scholarships, grants, fellowships, bursaries, competitions, and volunteer programs.
          Updated daily with verified opportunities.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-[640px]">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search opportunities — e.g. 'scholarship for engineering students'"
              className="w-full py-3 pl-11 pr-4 border-2 border-gray-200 rounded-xl text-sm text-gray-800 bg-white placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>
          <div className="relative">
            <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 pointer-events-none" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full sm:w-[160px] py-3 pl-11 pr-4 border-2 border-gray-200 rounded-xl text-sm text-gray-700 bg-white appearance-none cursor-pointer focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition-all hover:-translate-y-px flex items-center justify-center gap-2 shrink-0"
          >
            <FiSearch className="w-4 h-4" />
            Search
          </button>
        </form>

        {/* Stats */}
        <div className="flex items-center gap-6 mt-8 flex-wrap">
          <div className="text-center">
            <p className="text-xl md:text-2xl font-extrabold">{opportunityStats.totalOpportunities}+</p>
            <p className="text-[0.72rem] opacity-70 uppercase tracking-wide">Opportunities</p>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <p className="text-xl md:text-2xl font-extrabold">{opportunityStats.thisMonth}</p>
            <p className="text-[0.72rem] opacity-70 uppercase tracking-wide">Added This Month</p>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <p className="text-xl md:text-2xl font-extrabold">{opportunityStats.providers}</p>
            <p className="text-[0.72rem] opacity-70 uppercase tracking-wide">Providers</p>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <p className="text-xl md:text-2xl font-extrabold text-amber-400">{opportunityStats.deadlineSoon}</p>
            <p className="text-[0.72rem] opacity-70 uppercase tracking-wide">Deadline Soon</p>
          </div>
        </div>
      </div>
    </section>
  );
}
