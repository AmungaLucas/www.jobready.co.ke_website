"use client";

import { useRef } from "react";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";
import {
  FiCode, FiTrendingUp, FiBarChart2, FiFlag, FiUsers, FiSettings, FiHeart, FiBookOpen,
  FiClipboard, FiTruck, FiCoffee, FiSun, FiEdit3, FiGrid, FiZap, FiHeadphones,
  FiTool, FiFileText, FiGlobe, FiHome, FiActivity, FiAward, FiMessageSquare, FiShield,
  FiNavigation,
} from "react-icons/fi";

const categories = [
  { value: "TECHNOLOGY", label: "Technology", slug: "technology", Icon: FiCode },
  { value: "FINANCE_ACCOUNTING", label: "Finance", slug: "finance-accounting", Icon: FiTrendingUp },
  { value: "SALES_BUSINESS", label: "Sales", slug: "sales-business", Icon: FiBarChart2 },
  { value: "MARKETING_COMMUNICATIONS", label: "Marketing", slug: "marketing-communications", Icon: FiFlag },
  { value: "HUMAN_RESOURCES", label: "Human Resources", slug: "human-resources", Icon: FiUsers },
  { value: "ENGINEERING", label: "Engineering", slug: "engineering", Icon: FiSettings },
  { value: "HEALTHCARE", label: "Healthcare", slug: "healthcare", Icon: FiHeart },
  { value: "EDUCATION", label: "Education", slug: "education-training", Icon: FiBookOpen },
  { value: "OPERATIONS_ADMIN", label: "Operations", slug: "operations-admin", Icon: FiClipboard },
  { value: "SUPPLY_CHAIN", label: "Supply Chain", slug: "logistics-supply-chain", Icon: FiTruck },
  { value: "HOSPITALITY", label: "Hospitality", slug: "hospitality-tourism", Icon: FiCoffee },
  { value: "AGRICULTURE", label: "Agriculture", slug: "agriculture", Icon: FiSun },
  { value: "LEGAL", label: "Legal", slug: "legal-compliance", Icon: FiShield },
  { value: "CREATIVE_DESIGN", label: "Creative", slug: "creative-design", Icon: FiEdit3 },
  { value: "ARCHITECTURE_CONSTRUCTION", label: "Architecture", slug: "architecture-construction", Icon: FiGrid },
  { value: "SCIENCE_RESEARCH", label: "Science", slug: "science-research", Icon: FiZap },
  { value: "CUSTOMER_SERVICE", label: "Customer Service", slug: "customer-service", Icon: FiHeadphones },
  { value: "SKILLED_TRADES", label: "Skilled Trades", slug: "skilled-trades", Icon: FiTool },
  { value: "MEDIA_PUBLISHING", label: "Media", slug: "media-publishing", Icon: FiFileText },
  { value: "NONPROFIT", label: "Nonprofit", slug: "nonprofit", Icon: FiGlobe },
  { value: "REAL_ESTATE", label: "Real Estate", slug: "real-estate", Icon: FiHome },
  { value: "FITNESS_WELLNESS", label: "Fitness", slug: "fitness-wellness", Icon: FiActivity },
  { value: "GOVERNMENT_PUBLIC_SECTOR", label: "Government", slug: "government", Icon: FiAward },
  { value: "CONSULTING", label: "Consulting", slug: "consulting", Icon: FiMessageSquare },
  { value: "INSURANCE", label: "Insurance", slug: "insurance", Icon: FiShield },
  { value: "TRANSPORTATION", label: "Transport", slug: "transportation", Icon: FiNavigation },
];

export default function CategoryGrid() {
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
          Browse by Category
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
            className="flex overflow-x-auto space-x-4 pb-4 hide-scrollbar scroll-smooth"
          >
            {categories.map((cat) => (
              <Link
                key={cat.value}
                href={`/jobs/${cat.slug}`}
                className="flex-shrink-0 w-32 md:w-36 bg-white rounded-xl shadow-sm p-4 text-center hover:shadow-md transition-shadow no-underline group"
              >
                <cat.Icon
                  className="w-8 h-8 mx-auto text-3xl"
                  style={{ color: "#5B21B6", fontSize: "1.75rem" }}
                />
                <p className="text-sm font-medium mt-2" style={{ color: "#1E293B" }}>
                  {cat.label}
                </p>
              </Link>
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
            href="/jobs"
            className="text-sm font-medium text-teal-600 hover:text-purple-700 transition-colors inline-flex items-center gap-1"
          >
            View all 26 categories <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
