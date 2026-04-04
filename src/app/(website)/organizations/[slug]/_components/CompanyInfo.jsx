import { FiMapPin, FiGlobe, FiCalendar, FiTag, FiBriefcase, FiExternalLink } from "react-icons/fi";

export default function CompanyInfo({ company }) {
  const iconMap = {
    Industry: FiTag,
    Founded: FiCalendar,
    Size: FiBriefcase,
    Location: FiMapPin,
    Website: FiGlobe,
    Type: FiBriefcase,
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2.5 border-b-2 border-gray-100 flex items-center gap-2">
        <FiBriefcase size={18} className="text-blue-600" />
        Company Info
      </h3>

      <div className="space-y-3">
        {company.keyDetails.map((detail) => {
          const Icon = iconMap[detail.label] || FiTag;
          return (
            <div key={detail.label} className="flex items-center gap-3">
              <Icon size={16} className="text-gray-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-400">{detail.label}</p>
                {detail.href ? (
                  <a
                    href={detail.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors no-underline flex items-center gap-1"
                  >
                    {detail.value}
                    <FiExternalLink size={12} />
                  </a>
                ) : (
                  <p className="text-sm font-medium text-gray-800">{detail.value}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
