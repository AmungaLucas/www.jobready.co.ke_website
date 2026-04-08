"use client";

import { useRef } from "react";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight, FiArrowRight, FiMonitor } from "react-icons/fi";
import { HiAcademicCap, HiUserGroup, HiStar, HiCurrencyDollar } from "react-icons/hi";

const opportunities = [
  {
    title: "Scholarships",
    description: "Fully funded & partial scholarships for Kenyan students.",
    slug: "scholarships",
    Icon: HiAcademicCap,
  },
  {
    title: "Sponsorships",
    description: "Training, conference, and event sponsorships.",
    slug: "scholarships",
    Icon: HiUserGroup,
  },
  {
    title: "University Applications",
    description: "Guidance on admissions & application deadlines.",
    slug: "scholarships",
    Icon: HiAcademicCap,
  },
  {
    title: "Fellowships",
    description: "Leadership and professional development programs.",
    slug: "fellowships",
    Icon: HiStar,
  },
  {
    title: "Grants",
    description: "Funding for research, startups, and community projects.",
    slug: "grants",
    Icon: HiCurrencyDollar,
  },
  {
    title: "Training Programs",
    description: "Short courses and certification programs.",
    slug: "competitions",
    Icon: HiUserGroup,
  },
  {
    title: "Competitions",
    description: "Business plan, hackathons, and innovation contests.",
    slug: "competitions",
    Icon: HiStar,
  },
  {
    title: "Awards",
    description: "Recognition for achievements in various fields.",
    slug: "competitions",
    Icon: HiStar,
  },
  {
    title: "Bootcamps",
    description: "Intensive coding and skills bootcamps.",
    slug: "scholarships",
    Icon: FiMonitor,
  },
  {
    title: "Mentorship",
    description: "Connect with industry experts for career guidance.",
    slug: "fellowships",
    Icon: HiUserGroup,
  },
];

export default function OpportunityGrid() {
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
        <h2 className="text-xl md:text-2xl font-bold mb-5" style={{ color: "#1E293B" }}>
          Opportunities Hub
        </h2>

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
            {opportunities.map((opp) => (
              <div
                key={opp.title}
                className="flex-shrink-0 w-64 bg-white rounded-xl shadow-md p-5 text-center hover:shadow-lg transition-shadow"
              >
                <opp.Icon className="w-10 h-10 mx-auto" style={{ color: "#5B21B6" }} />
                <h3 className="font-bold text-lg mt-3" style={{ color: "#1E293B" }}>
                  {opp.title}
                </h3>
                <p className="text-gray-500 text-sm mt-2">{opp.description}</p>
                <Link
                  href={`/opportunities/${opp.slug}`}
                  className="inline-block mt-4 text-sm font-medium text-teal-600 hover:text-purple-700 transition-colors"
                >
                  Learn More <FiArrowRight className="w-3 h-3 inline" />
                </Link>
              </div>
            ))}
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

        <div className="mt-5 text-center">
          <Link
            href="/opportunities"
            className="text-sm font-medium text-teal-600 hover:text-purple-700 transition-colors inline-flex items-center gap-1"
          >
            View all opportunities <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
