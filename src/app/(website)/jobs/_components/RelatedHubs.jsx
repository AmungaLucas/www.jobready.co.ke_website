import Link from "next/link";
import { getJobHubs } from "@/config/hub-config";

export default function RelatedHubs({ currentSlug }) {
  const hubs = getJobHubs().filter((h) => h.slug !== currentSlug).slice(0, 8);

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-5">
      <h3 className="text-sm font-bold text-gray-900 mb-3.5 pb-2.5 border-b-2 border-gray-100">
        Related Categories
      </h3>
      <div className="space-y-0">
        {hubs.map((hub) => (
          <Link
            key={hub.slug}
            href={`/jobs/${hub.slug}`}
            className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-b-0 group no-underline"
          >
            <span className="text-[0.84rem] text-gray-700 group-hover:text-[#1a56db] transition-colors font-medium">
              {hub.name.replace(/ in Kenya.*| in Kenya$/i, "")}
            </span>
            <svg className="w-4 h-4 text-gray-300 group-hover:text-[#1a56db] transition-colors shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
