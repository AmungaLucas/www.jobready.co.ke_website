"use client";

import { useRef } from "react";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";
import { HiAcademicCap, HiUserGroup, HiStar, HiCurrencyDollar, HiLightningBolt } from "react-icons/hi";
import { FiMonitor } from "react-icons/fi";
import { formatDate } from "@/lib/format";

// Icon mapping for opportunity types
const typeIcons = {
  SCHOLARSHIP: HiAcademicCap,
  SPONSORSHIP: HiUserGroup,
  UNIVERSITY_ADMISSION: HiAcademicCap,
  VOLUNTEER: HiUserGroup,
  TRAINING: FiMonitor,
  GRANT: HiCurrencyDollar,
  CERTIFICATION: HiStar,
  FUNDING: HiCurrencyDollar,
  FELLOWSHIP: HiStar,
  APPRENTICESHIP: HiUserGroup,
  WORKSHOP: FiMonitor,
  CONFERENCE: HiUserGroup,
  COMPETITION: HiLightningBolt,
  AWARD: HiStar,
  RESIDENCY: HiAcademicCap,
  MENTORSHIP: HiUserGroup,
  ACCELERATOR: HiLightningBolt,
  INCUBATOR: HiLightningBolt,
  BOOTCAMP: FiMonitor,
  EXCHANGE: HiAcademicCap,
  RESEARCH: HiAcademicCap,
  BURSARY: HiCurrencyDollar,
  INTERNSHIP: HiUserGroup,
};

// Label mapping
const typeLabels = {
  SCHOLARSHIP: "Scholarship",
  SPONSORSHIP: "Sponsorship",
  UNIVERSITY_ADMISSION: "University Admission",
  VOLUNTEER: "Volunteer",
  TRAINING: "Training Program",
  GRANT: "Grant",
  CERTIFICATION: "Certification",
  FUNDING: "Funding",
  FELLOWSHIP: "Fellowship",
  APPRENTICESHIP: "Apprenticeship",
  WORKSHOP: "Workshop",
  CONFERENCE: "Conference",
  COMPETITION: "Competition",
  AWARD: "Award",
  RESIDENCY: "Residency",
  MENTORSHIP: "Mentorship",
  ACCELERATOR: "Accelerator",
  INCUBATOR: "Incubator",
  BOOTCAMP: "Bootcamp",
  EXCHANGE: "Exchange",
  RESEARCH: "Research",
  BURSARY: "Bursary",
  INTERNSHIP: "Internship",
};

export default function OpportunityGrid({ opportunities = [] }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  // Show mock category cards if no real opportunities yet
  if (opportunities.length === 0) {
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
              View all <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="text-gray-400 text-sm">No opportunities available at this time. Check back soon!</p>
        </div>
      </section>
    );
  }

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
            View all <FiArrowRight className="w-3.5 h-3.5" />
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
            {opportunities.map((opp) => {
              const Icon = typeIcons[opp.opportunityType] || HiAcademicCap;
              const label = typeLabels[opp.opportunityType] || opp.opportunityType;
              return (
                <Link
                  key={opp.id}
                  href={`/opportunities/${opp.slug}`}
                  className="flex-shrink-0 w-72 bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow no-underline"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5" style={{ color: "#5B21B6" }} />
                    </div>
                    <div className="min-w-0">
                      <span className="inline-block text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 mb-1.5">
                        {label}
                      </span>
                      <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-snug">
                        {opp.title}
                      </h3>
                    </div>
                  </div>
                  {opp.company && (
                    <p className="text-xs text-gray-500 mt-2 truncate">
                      {opp.company.name}
                    </p>
                  )}
                  {opp.excerpt && (
                    <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">
                      {opp.excerpt}
                    </p>
                  )}
                  {opp.deadline && (
                    <div className="mt-3 flex items-center gap-1 text-xs text-red-500 font-medium">
                      <span>Deadline:</span>
                      <span>{formatDate(opp.deadline)}</span>
                    </div>
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
