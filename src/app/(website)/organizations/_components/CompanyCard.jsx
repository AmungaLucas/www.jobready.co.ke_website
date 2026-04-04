import Link from "next/link";
import { FiMapPin, FiBriefcase, FiShield } from "react-icons/fi";

/**
 * Compute initials from a company name.
 * e.g. "Safaricom PLC" → "SP", "KCB Group" → "KG"
 */
function getInitials(name) {
  if (!name) return "?";
  const parts = name.replace(/[^a-zA-Z\s]/g, "").split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  // Single word — take first two chars
  return parts[0].slice(0, 2).toUpperCase();
}

export default function CompanyCard({ company }) {
  const initials = company.initials || getInitials(company.name);
  const location = company.city || company.location || "";
  const size = company.employeeSize || company.size || "";
  const openJobs = company.jobCount ?? company.openJobs ?? 0;

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
          {company.logo ? (
            <img src={company.logo} alt={company.name} className="w-10 h-10 rounded-lg object-cover" />
          ) : (
            initials
          )}
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
          <p className="text-xs text-gray-500 mb-1">{company.tagline || company.industry}</p>

          {/* Location + size */}
          {(location || size) && (
            <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
              {location && (
                <span className="flex items-center gap-1">
                  <FiMapPin size={12} />
                  {location}
                </span>
              )}
              {size && (
                <span className="flex items-center gap-1">
                  <FiBriefcase size={12} />
                  {size}
                </span>
              )}
            </div>
          )}

          {/* Jobs count */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.65rem] font-bold bg-blue-100 text-blue-700">
            <FiBriefcase size={10} />
            {openJobs} Open {openJobs === 1 ? "Job" : "Jobs"}
          </span>
        </div>
      </div>
    </Link>
  );
}
