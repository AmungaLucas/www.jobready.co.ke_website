"use client";

import { useRef } from "react";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";
import { HiAcademicCap, HiUserGroup, HiStar, HiCurrencyDollar } from "react-icons/hi";
import { FiMonitor } from "react-icons/fi";

// ─── The 9 opportunity types we showcase on the homepage ─────────
const hubCategories = [
  {
    type: "INTERNSHIP",
    label: "Internships",
    description: "Paid & unpaid internship placements across Kenya and beyond.",
    Icon: HiUserGroup,
    color: "#0D9488", // teal
    bgColor: "#F0FDFA",
  },
  {
    type: "SPONSORSHIP",
    label: "Sponsorships",
    description: "Training, conference, and event sponsorships.",
    Icon: HiUserGroup,
    color: "#7C3AED", // violet
    bgColor: "#F5F3FF",
  },
  {
    type: "BURSARY",
    label: "Bursaries",
    description: "Financial aid for students in need of tuition support.",
    Icon: HiCurrencyDollar,
    color: "#EA580C", // orange
    bgColor: "#FFF7ED",
  },
  {
    type: "UNIVERSITY_ADMISSION",
    label: "University Admissions",
    description: "Admissions, application deadlines & guidance.",
    Icon: HiAcademicCap,
    color: "#2563EB", // blue
    bgColor: "#EFF6FF",
  },
  {
    type: "BOOTCAMP",
    label: "Bootcamps",
    description: "Intensive coding and skills bootcamps.",
    Icon: FiMonitor,
    color: "#DC2626", // red
    bgColor: "#FEF2F2",
  },
  {
    type: "MENTORSHIP",
    label: "Mentorship",
    description: "Connect with industry experts for career guidance.",
    Icon: HiStar,
    color: "#059669", // emerald
    bgColor: "#ECFDF5",
  },
  {
    type: "SCHOLARSHIP",
    label: "Scholarships",
    description: "Fully funded & partial scholarships for Kenyan students.",
    Icon: HiAcademicCap,
    color: "#5B21B6", // purple
    bgColor: "#FAF5FF",
  },
  {
    type: "CERTIFICATION",
    label: "Certifications",
    description: "Professional certification programmes & sponsorships.",
    Icon: HiStar,
    color: "#0891B2", // cyan
    bgColor: "#ECFEFF",
  },
  {
    type: "FUNDING",
    label: "Funding",
    description: "Grants, seed capital & research funding opportunities.",
    Icon: HiCurrencyDollar,
    color: "#CA8A04", // yellow-dark
    bgColor: "#FEFCE8",
  },
];

export default function OpportunityGrid({ typeCounts = {} }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl md:text-2xl font-bold" style={{ color: "#1E293B" }}>
            Opportunities Hub
          </h2>
          <Link
            href="/opportunities"
            className="text-sm font-medium text-teal-600 hover:text-purple-700 transition-colors inline-flex items-center gap-1"
          >
            View all opportunities <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="relative">
          {/* Left chevron */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors text-teal-600 hidden md:block cursor-pointer"
            aria-label="Scroll left"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>

          {/* Carousel */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto space-x-5 pb-4 hide-scrollbar scroll-smooth"
          >
            {hubCategories.map((cat) => {
              const count = typeCounts[cat.type] || 0;
              return (
                <Link
                  key={cat.type}
                  href={`/opportunities?type=${cat.type}`}
                  className="flex-shrink-0 w-64 bg-white rounded-xl shadow-md p-5 text-center hover:shadow-lg transition-shadow no-underline group"
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: cat.bgColor }}
                  >
                    <cat.Icon className="w-7 h-7" style={{ color: cat.color }} />
                  </div>
                  <h3 className="font-bold text-base text-gray-900">
                    {cat.label}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">
                    {cat.description}
                  </p>
                  {count > 0 && (
                    <span
                      className="inline-block mt-3 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: cat.bgColor, color: cat.color }}
                    >
                      {count} {count === 1 ? "opportunity" : "opportunities"}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right chevron */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors text-teal-600 hidden md:block cursor-pointer"
            aria-label="Scroll right"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
