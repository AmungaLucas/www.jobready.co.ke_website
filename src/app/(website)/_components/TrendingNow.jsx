import Link from "next/link";
import { FiArrowRight, FiBriefcase, FiTruck, FiHeart, FiBookOpen, FiMonitor, FiDollarSign, FiUser } from "react-icons/fi";

const categoryIconMap = {
  TECHNOLOGY: FiMonitor,
  FINANCE_ACCOUNTING: FiDollarSign,
  HEALTHCARE: FiHeart,
  EDUCATION: FiBookOpen,
  TRANSPORTATION: FiTruck,
  ENGINEERING: FiMonitor,
  SALES_BUSINESS: FiUser,
  MARKETING_COMMUNICATIONS: FiUser,
  default: FiBriefcase,
};

function getIcon(job) {
  if (!job || !job.categories) return categoryIconMap.default;
  const cats = typeof job.categories === "string" ? JSON.parse(job.categories) : job.categories;
  if (!Array.isArray(cats)) return categoryIconMap.default;
  for (const cat of cats) {
    if (categoryIconMap[cat]) return categoryIconMap[cat];
  }
  return categoryIconMap.default;
}

export default function TrendingNow({ jobs }) {
  if (!jobs || jobs.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ color: "#1E293B" }}>
        Trending Now in Kenya
      </h2>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {jobs.map((job) => {
            const Icon = getIcon(job);
            return (
              <div key={job.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center shrink-0 text-gray-500">
                  <Icon className="w-4 h-4" />
                </div>
                <Link
                  href={`/jobs/${job.slug}`}
                  className="flex-1 text-gray-700 hover:text-teal-600 transition-colors no-underline text-sm"
                >
                  {job.title} – {job.company?.name || ""}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-4 text-right">
        <Link
          href="/jobs?sort=trending"
          className="text-sm font-medium text-teal-600 hover:text-purple-700 transition-colors inline-flex items-center gap-1"
        >
          View all trending <FiArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
