import Link from "next/link";
import { FiAward, FiChevronRight } from "react-icons/fi";

const iconMap = {
  Award: FiAward,
  Banknote: FiAward,
  Star: FiAward,
  BookOpen: FiAward,
  Trophy: FiAward,
  Calendar: FiAward,
  HeartHandshake: FiAward,
  HardHat: FiAward,
};

export default function OpportunityHubHero({ hub }) {
  if (!hub) return null;

  const Icon = iconMap[hub.icon] || FiAward;

  return (
    <section className="bg-gradient-to-br from-primary via-primary-dark to-[#1e3a8a] text-white relative overflow-hidden">
      {/* Decorative radial gradient */}
      <div className="absolute -top-[30%] -right-[5%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-5 py-8 md:py-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Content */}
          <div className="flex-1">
            {/* Icon */}
            <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center mb-3.5 backdrop-blur-sm">
              <Icon className="w-6 h-6 text-white" />
            </div>

            {/* Title */}
            <h1 className="text-xl md:text-[1.7rem] font-extrabold leading-tight mb-2">
              {hub.name}
            </h1>

            {/* Subtitle */}
            {hub.heroSubtitle && (
              <p className="text-sm opacity-80 mb-2">{hub.heroSubtitle}</p>
            )}

            {/* Description */}
            <p className="text-[0.88rem] opacity-80 leading-relaxed max-w-[540px]">
              {hub.description}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-5 mt-4">
              <div className="text-center">
                <p className="text-lg md:text-xl font-extrabold">156+</p>
                <p className="text-[0.68rem] opacity-60 uppercase tracking-wide">Opportunities</p>
              </div>
              <div className="w-px h-7 bg-white/20" />
              <div className="text-center">
                <p className="text-lg md:text-xl font-extrabold">23</p>
                <p className="text-[0.68rem] opacity-60 uppercase tracking-wide">Added This Month</p>
              </div>
              <div className="w-px h-7 bg-white/20" />
              <div className="text-center">
                <p className="text-lg md:text-xl font-extrabold text-amber-400">8</p>
                <p className="text-[0.68rem] opacity-60 uppercase tracking-wide">Deadline Soon</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/cv-services"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-primary text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors no-underline"
            >
              Get Your CV Done
            </Link>
          </div>
        </div>
      </div>

      {/* Breadcrumbs overlay */}
      <div className="bg-white/5 border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-5 py-3">
          <nav className="flex items-center gap-2 text-[0.8rem]">
            <Link href="/" className="text-white/60 hover:text-white transition-colors no-underline">
              Home
            </Link>
            <FiChevronRight className="w-3 h-3 text-white/40" />
            <Link href="/opportunities" className="text-white/60 hover:text-white transition-colors no-underline">
              Opportunities
            </Link>
            <FiChevronRight className="w-3 h-3 text-white/40" />
            <span className="text-white font-medium">{hub.name.replace(/\s*(in Kenya|for Kenyans|& Abroad|2026).*$/, "")}</span>
          </nav>
        </div>
      </div>
    </section>
  );
}
