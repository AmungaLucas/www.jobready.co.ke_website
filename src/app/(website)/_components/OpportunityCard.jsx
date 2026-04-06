import Link from "next/link";
import { Clock, Globe } from "lucide-react";
import { formatDate } from "@/lib/format";

const typeColors = {
  scholarship: "text-purple",
  bursary: "text-primary",
  internship: "text-secondary",
  grant: "text-accent",
  fellowship: "text-primary",
};

// Maps opportunity types to hub slugs for correct URL routing
const typeToHubSlug = {
  scholarship: "scholarships",
  grant: "grants",
  fellowship: "fellowships",
  bursary: "bursaries",
  competition: "competitions",
  conference: "conferences",
  volunteer: "volunteer",
  apprenticeship: "apprenticeships",
};

export default function OpportunityCard({
  title,
  slug,
  company,
  opportunityType,
  deadline,
  isOnline,
  href,
  type,
}) {
  const colorClass = typeColors[type] || typeColors[opportunityType] || "text-primary";
  const typeLower = (type || opportunityType || "").toLowerCase();
  const hubSlug = typeToHubSlug[typeLower] || `${typeLower}s`;
  const link = href || (slug && typeLower) ? `/opportunities/${hubSlug}/${slug}` : "#";

  const orgName = company?.name;

  return (
    <Link
      href={link}
      className="block bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md hover:-translate-y-px border-2 border-transparent hover:border-primary/20 no-underline"
    >
      {/* Top section */}
      <div className="px-5 pt-5 pb-4">
        {/* Type label */}
        <p className={`text-[0.65rem] font-bold uppercase tracking-wide mb-2 ${colorClass}`}>
          {opportunityType || type || "Opportunity"}
        </p>

        {/* Title */}
        <h3 className="text-sm font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Provider */}
        {orgName && (
          <p className="text-xs text-gray-500 mb-1">{orgName}</p>
        )}

        {/* Online indicator */}
        {isOnline && (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <Globe className="w-3 h-3" />
            Online
          </span>
        )}
      </div>

      {/* Bottom section */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        {/* Deadline */}
        {deadline && (
          <span className="text-xs text-red-500 font-semibold inline-flex items-center gap-1">
            <Clock size={13} />
            {formatDate(deadline)}
          </span>
        )}
      </div>
    </Link>
  );
}
