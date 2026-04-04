import Link from "next/link";
import { FiTrendingUp, FiSearch } from "react-icons/fi";
import SidebarCard from "../../_components/SidebarCard";
import NewsletterForm from "../../_components/NewsletterForm";
import AdSlot from "../../_components/AdSlot";
import { trendingSearches, popularTags } from "./mock-data";

export default function TrendingSearches() {
  return (
    <>
      {/* Trending Searches */}
      <SidebarCard title="Trending Searches" icon={FiTrendingUp}>
        <div>
          {trendingSearches.map((item) => (
            <Link
              key={item.query}
              href={`/search?q=${encodeURIComponent(item.query)}`}
              className="flex items-center gap-2.5 py-2 border-b border-gray-100 last:border-b-0 group no-underline"
            >
              <FiSearch className="w-3.5 h-3.5 text-gray-400 shrink-0 group-hover:text-primary transition-colors" />
              <span className="flex-1 text-[0.84rem] text-gray-700 group-hover:text-primary transition-colors truncate">
                {item.query}
              </span>
              <span className="text-[0.72rem] text-gray-400 font-medium shrink-0">
                {item.count.toLocaleString()}
              </span>
            </Link>
          ))}
        </div>
      </SidebarCard>

      {/* Ad Slot */}
      <AdSlot position="sidebar" />

      {/* Popular Tags */}
      <SidebarCard title="Popular Tags" icon={FiTrendingUp}>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Link
              key={tag}
              href={`/search?q=${encodeURIComponent(tag)}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[0.78rem] font-medium text-gray-600 bg-gray-100 hover:bg-primary-light hover:text-primary transition-all cursor-pointer no-underline border border-transparent hover:border-primary-light"
            >
              {tag}
            </Link>
          ))}
        </div>
      </SidebarCard>

      {/* Job Alerts Newsletter */}
      <SidebarCard title="Job Alerts" icon={FiTrendingUp}>
        <p className="text-xs text-gray-500 mb-3 leading-relaxed">
          Get matching jobs delivered to your inbox daily. Never miss an opportunity.
        </p>
        <NewsletterForm type="job_alerts" />
      </SidebarCard>
    </>
  );
}
