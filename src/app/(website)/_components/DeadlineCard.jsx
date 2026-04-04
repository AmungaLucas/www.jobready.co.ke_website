import Link from "next/link";
import { Clock, AlertTriangle } from "lucide-react";
import { formatRelativeDate } from "@/lib/format";

export default function DeadlineCard({ title, slug, company, deadline }) {
  const href = slug ? `/job/${slug}` : "#";
  const isExpired = deadline && new Date(deadline) < new Date();

  return (
    <Link
      href={href}
      className="block bg-white rounded-xl shadow-sm overflow-hidden p-6 border-l-4 border-red-500 hover:shadow-md transition-shadow cursor-pointer no-underline"
    >
      {/* Top row */}
      <div className="flex justify-between items-start mb-2.5">
        <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-1 pr-2">
          {title}
        </h3>
        <span className="bg-red-100 text-red-600 text-[0.65rem] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
          <AlertTriangle size={10} className="inline mr-0.5 -mt-0.5" />
          Urgent
        </span>
      </div>

      {/* Company */}
      {company && (
        <p className="text-xs text-gray-500 mb-2">
          {typeof company === "string" ? company : company.name}
        </p>
      )}

      {/* Timer */}
      {deadline && (
        <p
          className={`text-xs font-bold flex items-center gap-1 ${
            isExpired ? "text-gray-400" : "text-red-500"
          }`}
        >
          <Clock size={14} />
          {isExpired ? "Closed" : `${formatRelativeDate(deadline)} left`}
        </p>
      )}
    </Link>
  );
}
