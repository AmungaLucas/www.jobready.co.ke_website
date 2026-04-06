import { FiMapPin, FiGlobe, FiTag, FiBriefcase, FiExternalLink, FiMail, FiPhone } from "react-icons/fi";

const iconMap = {
  Industry: FiTag,
  Location: FiMapPin,
  Website: FiGlobe,
  "Contact Email": FiMail,
  Phone: FiPhone,
};

export default function CompanyInfo({ company }) {
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

      {/* Social Links */}
      {company.socialLinks && company.socialLinks.length > 0 && (
        <div className="mt-5 pt-4 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Social Links</p>
          <div className="space-y-2.5">
            {company.socialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors no-underline"
              >
                <FiGlobe size={14} className="text-gray-400 shrink-0" />
                <span className="truncate">{link.platform || link.url}</span>
                <FiExternalLink size={11} className="text-gray-300 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
