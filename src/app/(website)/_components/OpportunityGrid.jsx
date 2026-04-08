import Link from "next/link";
import { FiCalendar, FiArrowRight } from "react-icons/fi";
import { formatDate } from "@/lib/format";

const typeColors = {
  SCHOLARSHIP: "bg-purple-100 text-purple-800",
  GRANT: "bg-teal-100 text-teal-800",
  FELLOWSHIP: "bg-amber-100 text-amber-800",
  BURSARY: "bg-green-100 text-green-800",
  COMPETITION: "bg-rose-100 text-rose-800",
  CONFERENCE: "bg-sky-100 text-sky-800",
  VOLUNTEER: "bg-emerald-100 text-emerald-800",
  APPRENTICESHIP: "bg-orange-100 text-orange-800",
};

function formatType(type) {
  return type
    ? type
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "Opportunity";
}

export default function OpportunityGrid({ opportunities }) {
  if (!opportunities || opportunities.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Latest Opportunities</h2>
        <Link
          href="/opportunities"
          className="text-sm text-purple-700 hover:text-purple-800 font-medium no-underline"
        >
          All opportunities
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {opportunities.map((opp) => {
          const colorClass = typeColors[opp.opportunityType] || "bg-gray-100 text-gray-800";

          return (
            <Link
              key={opp.id}
              href={`/opportunities/${opp.slug}`}
              className="group bg-white border border-gray-100 rounded-lg p-5 hover:shadow-md hover:border-purple-100 transition-all no-underline"
            >
              {/* Type badge */}
              <span
                className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full mb-3 ${colorClass}`}
              >
                {formatType(opp.opportunityType)}
              </span>

              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-purple-700 transition-colors mb-1 line-clamp-2">
                {opp.title}
              </h3>

              {opp.company?.name && (
                <p className="text-xs text-gray-500 mb-2">{opp.company.name}</p>
              )}

              {opp.deadline && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <FiCalendar className="w-3.5 h-3.5" />
                  Deadline: {formatDate(opp.deadline)}
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-gray-50">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 group-hover:text-purple-800">
                  View details <FiArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
