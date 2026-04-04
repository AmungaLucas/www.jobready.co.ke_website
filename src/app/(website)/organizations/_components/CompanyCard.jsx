import Link from "next/link";
import { FiMapPin, FiBriefcase, FiShield } from "react-icons/fi";

export default function CompanyCard({ company }) {
  return (
    <Link
      href={`/organizations/${company.slug}`}
      className="block bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all no-underline group"
    >
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg text-white"
          style={{
            background: `linear-gradient(135deg, ${company.logoColor}, ${company.logoColor}dd)`,
          }}
        >
          {company.initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Name row */}
          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
              {company.name}
            </h3>
            {company.isVerified && (
              <FiShield size={14} className="text-emerald-600 shrink-0" />
            )}
          </div>

          {/* Meta */}
          <p className="text-xs text-gray-500 mb-1">{company.industry}</p>

          {/* Location + size */}
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
            <span className="flex items-center gap-1">
              <FiMapPin size={12} />
              {company.location}
            </span>
            <span className="flex items-center gap-1">
              <FiBriefcase size={12} />
              {company.size}
            </span>
          </div>

          {/* Jobs count */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.65rem] font-bold bg-blue-100 text-blue-700">
            <FiBriefcase size={10} />
            {company.openJobs} Open {company.openJobs === 1 ? "Job" : "Jobs"}
          </span>
        </div>
      </div>
    </Link>
  );
}
