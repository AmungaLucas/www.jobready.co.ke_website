import { FiShield, FiMapPin, FiBriefcase, FiTag } from "react-icons/fi";

export default function CompanyProfileHeader({ company }) {
  return (
    <section className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 text-white py-10 md:py-14 relative overflow-hidden">
      <div className="absolute -top-1/3 -right-1/4 w-[500px] h-[500px] rounded-full bg-white/5 pointer-events-none" />
      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Logo */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 font-extrabold text-3xl text-white border-4 border-white/20"
            style={{
              background: `linear-gradient(135deg, ${company.logoColor}, ${company.logoColor}dd)`,
            }}
          >
            {company.initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Name */}
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-extrabold">{company.name}</h1>
              {company.isVerified && (
                <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold border border-white/25">
                  <FiShield size={12} />
                  Verified Employer
                </span>
              )}
            </div>

            {/* Tagline */}
            <p className="text-sm opacity-80 mb-4">{company.tagline}</p>

            {/* Stat pills */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold border border-white/20">
                <FiBriefcase size={12} />
                {company.stats.openJobs} Active Jobs
              </span>
              {company.location && (
                <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold border border-white/20">
                  <FiMapPin size={12} />
                  {company.location}
                </span>
              )}
              {company.industry && (
                <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold border border-white/20">
                  <FiTag size={12} />
                  {company.industry}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
