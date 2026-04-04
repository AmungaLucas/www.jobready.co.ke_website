import Link from "next/link";
import SidebarCard from "@/app/(website)/_components/SidebarCard";
import { FiTrendingUp } from "react-icons/fi";
import { popularArticles } from "./mock-data";

export default function PopularArticles() {
  return (
    <SidebarCard title="Popular Articles" icon={FiTrendingUp}>
      <ul className="list-none">
        {popularArticles.map((article, index) => (
          <li
            key={article.slug}
            className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-b-0"
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${
                index < 3
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <Link
                href={`/career-advice/${article.slug}`}
                className="text-sm font-semibold text-gray-800 leading-snug hover:text-blue-600 transition-colors line-clamp-2 no-underline"
              >
                {article.title}
              </Link>
              <p className="text-xs text-gray-400 mt-0.5">{article.views} views</p>
            </div>
          </li>
        ))}
      </ul>
    </SidebarCard>
  );
}
