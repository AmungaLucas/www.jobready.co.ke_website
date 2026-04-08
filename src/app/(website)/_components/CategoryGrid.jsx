import Link from "next/link";
import {
  FiMonitor,
  FiDollarSign,
  FiTool,
  FiHeart,
  FiUsers,
  FiTrendingUp,
  FiMapPin,
  FiGlobe,
} from "react-icons/fi";
import { HiAcademicCap, HiUserGroup } from "react-icons/hi";
import { hubConfig } from "@/config/hub-config";

const iconMap = {
  Monitor: FiMonitor,
  Calculator: FiDollarSign,
  Wrench: FiTool,
  Heart: FiHeart,
  GraduationCap: HiAcademicCap,
  TrendingUp: FiTrendingUp,
  Landmark: FiMapPin,
  UserPlus: HiUserGroup,
  Globe: FiGlobe,
  Users: FiUsers,
};

// Show only the first 8 job category hubs on homepage
const homepageHubs = hubConfig.filter((h) => h.type === "job").slice(0, 8);

const categoryColors = [
  "bg-purple-100 text-purple-700",
  "bg-teal-100 text-teal-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-orange-100 text-orange-700",
  "bg-indigo-100 text-indigo-700",
];

export default function CategoryGrid() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Browse by Category</h2>
        <Link
          href="/jobs"
          className="text-sm text-purple-700 hover:text-purple-800 font-medium no-underline"
        >
          All categories
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {homepageHubs.map((hub, idx) => {
          const Icon = iconMap[hub.icon] || FiMonitor;
          const colorClass = categoryColors[idx % categoryColors.length];

          return (
            <Link
              key={hub.slug}
              href={`/${hub.type === "opportunity" ? "opportunities" : "jobs"}/${hub.slug}`}
              className="group bg-white border border-gray-100 rounded-lg p-4 hover:shadow-md hover:border-purple-100 transition-all no-underline text-center"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${colorClass} group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-purple-700 transition-colors mb-0.5">
                {hub.name.replace(/ in Kenya.*|Jobs in Kenya.*/g, "").replace(/ in Kenya/g, "")}
              </h3>
              <p className="text-xs text-gray-400">{hub.filters?.category?.replace(/_/g, " ") || ""}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
