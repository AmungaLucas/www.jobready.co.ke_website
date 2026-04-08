"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiSearch, FiMapPin, FiClock, FiBriefcase, FiUsers, FiTrendingUp } from "react-icons/fi";
import { siteConfig } from "@/config/site-config";

const quickLinks = [
  { label: "Internships", href: "/jobs/internships", icon: FiUsers },
  { label: "Govt Jobs", href: "/jobs/government", icon: FiBriefcase },
  { label: "Remote", href: "/jobs/remote", icon: FiMapPin },
  { label: "Scholarships", href: "/opportunities/scholarships", icon: FiTrendingUp },
];

export default function HomeHero({ stats }) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (location.trim()) params.set("location", location.trim());
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="relative bg-gradient-to-br from-purple-800 via-purple-700 to-purple-900 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-400 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-sm font-medium px-4 py-2 rounded-full border border-white/20">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            {stats?.totalJobs || siteConfig.stats.totalJobs?.toLocaleString()}+ jobs updated daily
          </span>
        </div>

        {/* H1 */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center leading-tight mb-4">
          Find Your Next Opportunity{" "}
          <span className="text-teal-300">in Kenya</span>
        </h1>

        {/* Subtitle */}
        <p className="text-center text-purple-100 text-base sm:text-lg max-w-2xl mx-auto mb-10">
          Browse thousands of jobs, internships, and scholarships from top employers.
          Your dream career is one search away.
        </p>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-xl p-2 shadow-xl max-w-3xl mx-auto flex flex-col sm:flex-row gap-2 mb-10"
        >
          <div className="flex-1 flex items-center gap-2 px-3">
            <FiSearch className="text-gray-400 w-5 h-5 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Job title, keyword, or company..."
              className="w-full py-3 text-gray-800 placeholder-gray-400 text-sm outline-none bg-transparent"
            />
          </div>
          <div className="flex items-center gap-2 px-3 border-t sm:border-t-0 sm:border-l border-gray-200">
            <FiMapPin className="text-gray-400 w-5 h-5 shrink-0" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location (e.g. Nairobi)"
              className="w-full py-3 text-gray-800 placeholder-gray-400 text-sm outline-none bg-transparent"
            />
          </div>
          <button
            type="submit"
            className="bg-purple-700 hover:bg-purple-800 text-white font-semibold px-6 sm:px-8 py-3 rounded-lg transition-colors text-sm whitespace-nowrap cursor-pointer"
          >
            Search Jobs
          </button>
        </form>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-12 mb-10">
          {[
            {
              value: `${(stats?.totalJobs || siteConfig.stats.totalJobs).toLocaleString()}+`,
              label: "Active Jobs",
              icon: FiBriefcase,
            },
            {
              value: `${(stats?.totalCompanies || siteConfig.stats.totalCompanies).toLocaleString()}+`,
              label: "Companies",
              icon: FiTrendingUp,
            },
            {
              value: `${(stats?.monthlyVisitors || siteConfig.stats.monthlyVisitors).toLocaleString()}+`,
              label: "Monthly Visitors",
              icon: FiUsers,
            },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="flex items-center justify-center gap-1.5 text-2xl sm:text-3xl font-bold">
                {stat.icon && <stat.icon className="w-6 h-6 text-teal-300" />}
                {stat.value}
              </div>
              <p className="text-purple-200 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap justify-center gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-lg border border-white/15 transition-colors no-underline"
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
