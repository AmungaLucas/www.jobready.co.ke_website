"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiZap } from "react-icons/fi";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { siteConfig } from "@/config/site-config";

const locationOptions = [
  "All Locations",
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Remote",
];

export default function HeroSection() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("All Locations");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (location !== "All Locations") params.set("location", location);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1a56db] via-[#1e3a8a] to-[#1e40af] text-white py-16 md:py-20 lg:py-28">
      {/* Decorative radial gradients */}
      <div className="absolute -top-[50%] -right-[20%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -bottom-[30%] -left-[10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,255,255,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 py-4">
        <div className="max-w-[720px] mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-[0.78rem] font-semibold mb-6">
            <FiZap className="w-3.5 h-3.5" />
            {siteConfig.stats.totalJobs.toLocaleString()}+ jobs updated daily
          </div>

          {/* H1 */}
          <h1 className="text-[1.6rem] md:text-[2rem] lg:text-[2.4rem] font-extrabold leading-tight mb-5 tracking-tight">
            Find Your Next{" "}
            <span className="text-[#93c5fd]">Opportunity in Kenya</span>
          </h1>

          {/* Subtitle */}
          <p className="text-[0.92rem] md:text-[1.08rem] opacity-85 leading-relaxed mb-8 max-w-[560px] mx-auto">
            Browse jobs, internships, scholarships &amp; government positions. Updated daily.
            Get your professional CV done and land your dream job faster.
          </p>

          {/* Search form */}
          <form
            onSubmit={handleSearch}
            className="flex gap-3 max-w-[680px] mx-auto mb-8 flex-col sm:flex-row"
          >
            <input
              type="text"
              placeholder="Job title, keyword, or company..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 min-w-0 px-[18px] py-3.5 rounded-xl text-[0.95rem] bg-white text-gray-800 shadow-[0_4px_12px_rgba(0,0,0,0.1)] focus:outline-none focus:shadow-[0_4px_16px_rgba(0,0,0,0.15)] placeholder:text-gray-400 font-sans"
            />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-4 py-3.5 rounded-xl text-[0.9rem] bg-white text-gray-700 cursor-pointer font-sans min-w-[140px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] focus:outline-none"
            >
              {locationOptions.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-7 py-3.5 bg-[#f59e0b] hover:bg-[#d97706] text-white rounded-xl text-[0.95rem] font-bold cursor-pointer transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2 font-sans border-none"
            >
              <HiMagnifyingGlass className="w-[18px] h-[18px]" />
              Search
            </button>
          </form>

          {/* Stats */}
          <div className="flex justify-center gap-8 sm:gap-10 mt-10">
            <div className="text-center">
              <span className="text-xl md:text-[1.5rem] font-extrabold block">
                {(siteConfig.stats.totalJobs * 5).toLocaleString()}+
              </span>
              <span className="text-[0.75rem] opacity-65 uppercase tracking-wide">
                Active Jobs
              </span>
            </div>
            <div className="w-px bg-white/20 self-stretch" />
            <div className="text-center">
              <span className="text-xl md:text-[1.5rem] font-extrabold block">
                {siteConfig.stats.totalCompanies.toLocaleString()}+
              </span>
              <span className="text-[0.75rem] opacity-65 uppercase tracking-wide">
                Companies
              </span>
            </div>
            <div className="w-px bg-white/20 self-stretch" />
            <div className="text-center">
              <span className="text-xl md:text-[1.5rem] font-extrabold block">
                {siteConfig.stats.successRate}%
              </span>
              <span className="text-[0.75rem] opacity-65 uppercase tracking-wide">
                Success Rate
              </span>
            </div>
          </div>

          {/* Quick links — hidden on mobile */}
          <div className="hidden md:flex justify-center gap-3 mt-8 flex-wrap">
            {[
              { label: "Internships", href: "/jobs/internships" },
              { label: "Govt Jobs", href: "/jobs/government" },
              { label: "Remote", href: "/jobs/remote" },
              { label: "Part-Time", href: "/jobs/part-time" },
              { label: "Scholarships", href: "/opportunities/scholarships" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-1.5 bg-white/10 border border-white/15 rounded-full text-[0.78rem] font-medium text-white/85 hover:bg-white/20 hover:text-white transition-all no-underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
