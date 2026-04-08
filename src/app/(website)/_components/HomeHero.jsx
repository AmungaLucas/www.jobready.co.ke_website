"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiSearch, FiUsers } from "react-icons/fi";

const popularTags = [
  { label: "Internships", href: "/jobs/internships" },
  { label: "Government Jobs", href: "/jobs/government" },
  { label: "Remote", href: "/jobs/remote" },
  { label: "Nairobi", href: "/jobs/nairobi" },
];

export default function HomeHero() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="bg-gradient-to-br from-white to-gray-50 py-8 md:py-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 text-center">
        <h1 className="text-2xl md:text-4xl font-bold mb-4" style={{ color: "#1E293B" }}>
          Find Your Next{" "}
          <span style={{ color: "#5B21B6" }}>Opportunity</span> in Kenya
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          Jobs, internships, scholarships, and government vacancies — all in one place.
        </p>

        {/* Search form */}
        <form
          onSubmit={handleSearch}
          className="max-w-2xl mx-auto mb-4"
        >
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Job title, keyword, or company..."
                className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-gray-800"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-full font-semibold text-white transition-colors cursor-pointer whitespace-nowrap"
              style={{ backgroundColor: "#F97316" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ea580c")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#F97316")}
            >
              Search Jobs
            </button>
          </div>
        </form>

        {/* Popular tags */}
        <div className="flex flex-wrap justify-center gap-2 text-sm mb-5">
          <span className="text-gray-500">Popular:</span>
          {popularTags.map((tag, i) => (
            <span key={tag.label} className="flex items-center gap-2">
              {i > 0 && <span className="text-gray-300">&bull;</span>}
              <Link
                href={tag.href}
                className="text-teal-600 hover:text-purple-700 transition-colors"
              >
                {tag.label}
              </Link>
            </span>
          ))}
        </div>

        {/* Bottom tagline */}
        <div className="max-w-2xl mx-auto pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <FiUsers className="text-teal-600 w-4 h-4" />
            Join 10,000+ job seekers getting hired faster with optimized CVs and real opportunities.
          </p>
        </div>
      </div>
    </section>
  );
}
