import Link from "next/link";
import { FiMonitor, FiDollarSign, FiTool, FiHeart, FiGlobe, FiFlag, FiClock, FiMapPin, FiUsers, FiTrendingUp, FiBriefcase, FiLayout } from "react-icons/fi";
import { FaGraduationCap, FaChartLine, FaAward, FaUserTie } from "react-icons/fa6";
import { HiRocketLaunch, HiLightBulb, HiTruck, HiMagnifyingGlass } from "react-icons/hi2";

const iconMap = {
  Monitor: FiMonitor,
  Calculator: FiDollarSign,
  Wrench: FiTool,
  Heart: FiHeart,
  GraduationCap: FaGraduationCap,
  TrendingUp: FiTrendingUp,
  Landmark: FiFlag,
  UserPlus: FiUsers,
  Clock: FiClock,
  Globe: FiGlobe,
  MapPin: FiMapPin,
  Rocket: HiRocketLaunch,
  Briefcase: FiBriefcase,
  Award: FaAward,
  "User-Tie": FaUserTie,
  ChartLine: FaChartLine,
  Lightbulb: HiLightBulb,
  Truck: HiTruck,
  Headphones: FiUsers,
  Palette: FiLayout,
  Scale: FiTrendingUp,
};

export default function HubHero({ hub }) {
  const IconComponent = iconMap[hub.icon] || FiBriefcase;
  const jobCount = hub.jobCount || 0;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1a56db] via-[#1e3a8a] to-[#1e40af] text-white py-12 md:py-16">
      {/* Decorative radial gradients */}
      <div className="absolute -top-[50%] -right-[20%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -bottom-[30%] -left-[10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,255,255,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="max-w-[720px] mx-auto">
          {/* Icon + Badge */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
              <IconComponent className="w-5 h-5" />
            </div>
            <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-[0.78rem] font-semibold">
              {jobCount.toLocaleString()}+ jobs
            </div>
          </div>

          {/* H1 */}
          <h1 className="text-[1.5rem] md:text-[1.8rem] lg:text-[2.2rem] font-extrabold leading-tight mb-3 tracking-tight text-center">
            {hub.name}
          </h1>

          {/* Subtitle */}
          {hub.heroSubtitle && (
            <p className="text-[0.9rem] md:text-[1.05rem] opacity-85 leading-relaxed mb-3 text-center">
              {hub.heroSubtitle}
            </p>
          )}

          {/* Description */}
          <p className="text-[0.85rem] opacity-75 leading-relaxed mb-5 text-center max-w-[560px] mx-auto">
            {hub.description}
          </p>

          {/* Breadcrumb */}
          <nav className="text-center">
            <ol className="inline-flex items-center gap-1.5 text-[0.83rem] list-none">
              <li>
                <Link href="/" className="text-white/70 hover:text-white transition-colors no-underline">
                  Home
                </Link>
              </li>
              <li className="text-white/40">/</li>
              <li>
                <Link href="/jobs" className="text-white/70 hover:text-white transition-colors no-underline">
                  Jobs
                </Link>
              </li>
              <li className="text-white/40">/</li>
              <li className="text-white font-medium">{hub.name.replace(/ in Kenya.*| in Kenya$/i, "")}</li>
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
}
