import Link from "next/link";
import { FiZap, FiClock, FiFileText, FiSend, FiGlobe, FiMonitor, FiDollarSign, FiTool, FiHeart, FiFlag } from "react-icons/fi";
import { FaGraduationCap, FaChartLine, FaAward } from "react-icons/fa6";
import { HiSparkles } from "react-icons/hi2";
import Script from "next/script";

import HeroSection from "./_components/home/HeroSection";
import HomepageSidebar from "./_components/home/HomepageSidebar";
import JobCardGrid from "./_components/JobCardGrid";
import CategoryCard from "./_components/CategoryCard";
import OpportunityCard from "./_components/OpportunityCard";
import DeadlineCard from "./_components/DeadlineCard";
import AdSlot from "./_components/AdSlot";
import { generateWebSiteJsonLd } from "@/lib/seo";
import {
  trendingJobs,
  latestJobs,
  featuredJobs,
  internshipJobs,
  urgentDeadlines,
  categories,
  opportunities,
  trustedLogos,
} from "./_components/home/mock-data";

// Icon mapping for categories
const categoryIcons = {
  FiMonitor,
  FiDollarSign,
  FiTool,
  FiHeart,
  FaGraduationCap,
  FaChartLine,
  FiFlag,
  FiGlobe,
};

// ─── SEO ───────────────────────────────────────────────────
export async function generateMetadata() {
  return {
    title: "JobReady Kenya — Jobs, Internships & Scholarships in Kenya",
    description:
      "Find jobs, internships, scholarships & government opportunities in Kenya. Updated daily. Get your professional CV done from KSh 500 — JobReady.co.ke",
    alternates: {
      canonical: "https://jobready.co.ke",
    },
    openGraph: {
      title: "JobReady Kenya — Jobs, Internships & Scholarships",
      description:
        "Kenya's #1 job board. Find jobs, internships, scholarships & career services. Updated daily.",
      url: "https://jobready.co.ke",
      type: "website",
    },
  };
}

// ─── PAGE ──────────────────────────────────────────────────
export default function HomePage() {
  const jsonLd = generateWebSiteJsonLd();

  return (
    <>
      {/* JSON-LD */}
      <Script
        id="website-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. TRUSTED BY BAR */}
      <section className="bg-white border-b border-gray-100 py-10 md:py-14">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <p className="text-[0.75rem] text-gray-400 uppercase tracking-widest font-semibold text-center mb-5">
            Trusted by top employers
          </p>
          <div className="flex items-center justify-center gap-5 md:gap-10 flex-wrap opacity-50">
            {trustedLogos.map((name) => (
              <div
                key={name}
                className="text-[0.85rem] font-bold text-gray-500 px-4 py-1.5 border border-gray-200 rounded-lg bg-gray-50"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. AD LEADERBOARD (hidden on mobile) */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-8 pb-4 hidden lg:block">
        <AdSlot position="leaderboard" />
      </div>

      {/* 4. MAIN LAYOUT — 2-column grid */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 pt-10 md:pt-14 pb-20">
          {/* ─── LEFT COLUMN ─── */}
          <div>
            {/* 5. TRENDING NOW */}
            <div className="mb-10 md:mb-12">
            <JobCardGrid
              jobs={trendingJobs}
              title="Trending Now"
              icon={HiSparkles}
              viewAllHref="/search?sort=trending"
            />
            </div>

            {/* 6. URGENT DEADLINES — Deadline Today */}
            <div className="mb-10 md:mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <FiClock className="w-5 h-5 text-red-500" />
                  Don&apos;t Miss Out — Deadline Today
                </h2>
                <Link
                  href="/search?deadline=today"
                  className="text-[0.84rem] font-semibold text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1 no-underline"
                >
                  View all
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
                {urgentDeadlines.map((item) => (
                  <DeadlineCard
                    key={item.slug}
                    title={item.title}
                    slug={item.slug}
                    company={item.company}
                    deadline={item.deadline}
                  />
                ))}
              </div>
            </div>

            {/* 7. LATEST JOBS */}
            <div className="mb-10 md:mb-12">
            <JobCardGrid
              jobs={latestJobs}
              title="Latest Jobs"
              icon={FiClock}
              viewAllHref="/jobs"
            />
            </div>

            {/* 8. INLINE AD */}
            <AdSlot position="inline" />

            {/* 9. FEATURED JOBS */}
            <div className="mb-10 md:mb-12">
              <JobCardGrid
                jobs={featuredJobs}
                title="Featured Jobs"
                icon={FaAward}
                viewAllHref="/search?sort=featured"
              />
            </div>

            {/* 10. SERVICE NUDGE — mid-page CTA */}
            <div className="mb-10 md:mb-12 bg-white border border-gray-200 border-l-4 border-l-[#1a56db] rounded-lg p-6 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="w-10 h-10 bg-[#dbeafe] rounded-full flex items-center justify-center shrink-0">
                <FiFileText className="w-[18px] h-[18px] text-[#1a56db]" />
              </div>
              <div className="flex-1">
                <p className="text-[0.85rem] text-gray-600 leading-relaxed">
                  Before you apply, get a professional CV that gets you shortlisted.{" "}
                  <Link href="/cv-services" className="font-semibold text-primary hover:text-primary-dark no-underline">
                    Get Your CV Done from KSh 500 &rarr;
                  </Link>
                </p>
              </div>
            </div>

            {/* 11. CATEGORY GRID */}
            <div className="mb-10 md:mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <FiZap className="w-5 h-5 text-[#1a56db]" />
                  Browse by Category
                </h2>
                <Link
                  href="/jobs"
                  className="text-[0.84rem] font-semibold text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1 no-underline"
                >
                  View all
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
                {categories.map((cat) => (
                  <CategoryCard
                    key={cat.href}
                    name={cat.name}
                    count={cat.count}
                    href={cat.href}
                    color={cat.color}
                    icon={categoryIcons[cat.icon]}
                  />
                ))}
              </div>
            </div>

            {/* 12. INTERNSHIP OPPORTUNITIES */}
            <div className="mb-10 md:mb-12">
              <JobCardGrid
                jobs={internshipJobs}
                title="Internship Opportunities"
                icon={FaGraduationCap}
                viewAllHref="/jobs/internships"
              />
            </div>

            {/* 13. SCHOLARSHIPS & OPPORTUNITIES */}
            <div className="mb-10 md:mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <FaGraduationCap className="w-5 h-5 text-[#7c3aed]" />
                  Scholarships &amp; Opportunities
                </h2>
                <Link
                  href="/opportunities"
                  className="text-[0.84rem] font-semibold text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1 no-underline"
                >
                  View all
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {opportunities.map((opp) => (
                  <OpportunityCard
                    key={opp.slug}
                    title={opp.title}
                    slug={opp.slug}
                    organizationName={opp.organizationName}
                    opportunityType={opp.opportunityType}
                    type={opp.type}
                    deadline={opp.deadline}
                    value={opp.value}
                  />
                ))}
              </div>
            </div>

            {/* 14. DOCUMENT WRITING CTA STRIP */}
            <div className="mb-10 md:mb-12 bg-gradient-to-br from-[#1a56db] to-[#1e3a8a] rounded-2xl p-8 md:p-10 text-white relative overflow-hidden">
              <div className="absolute -top-[40%] -right-[10%] w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,transparent_70%)] pointer-events-none" />
              <div className="relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {/* Header spans full width on desktop, first on mobile */}
                  <div className="sm:col-span-3">
                    <h3 className="text-lg font-extrabold mb-1.5 flex items-center gap-2">
                      <FiFileText className="w-5 h-5" />
                      Professional Document Writing Services
                    </h3>
                    <p className="text-[0.85rem] opacity-80 leading-relaxed mb-4">
                      Stand out from thousands of applicants. Our expert writers craft ATS-optimized documents tailored to the Kenyan job market &mdash; delivered fast.
                    </p>
                  </div>

                  {/* CV Writing */}
                  <Link
                    href="/cv-services"
                    className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-5 text-center hover:bg-white/18 hover:-translate-y-0.5 transition-all no-underline text-white block"
                  >
                    <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-3">
                      <FiFileText className="w-[22px] h-[22px] text-white" />
                    </div>
                    <h4 className="text-[0.9rem] font-bold mb-1">CV Writing</h4>
                    <p className="text-[0.75rem] opacity-75 mb-3.5 leading-relaxed">
                      ATS-optimized, tailored to your industry. From KSh 500.
                    </p>
                    <span className="inline-flex items-center justify-center px-5 py-2 bg-white text-[#1a56db] text-[0.78rem] font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                      Get Started
                    </span>
                  </Link>

                  {/* Cover Letter */}
                  <Link
                    href="/cv-services"
                    className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-5 text-center hover:bg-white/18 hover:-translate-y-0.5 transition-all no-underline text-white block"
                  >
                    <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-3">
                      <FiSend className="w-[22px] h-[22px] text-white" />
                    </div>
                    <h4 className="text-[0.9rem] font-bold mb-1">Cover Letter</h4>
                    <p className="text-[0.75rem] opacity-75 mb-3.5 leading-relaxed">
                      Customized for each application. Same-day delivery.
                    </p>
                    <span className="inline-flex items-center justify-center px-5 py-2 bg-white text-[#1a56db] text-[0.78rem] font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                      Order Now
                    </span>
                  </Link>

                  {/* LinkedIn Profile */}
                  <Link
                    href="/cv-services"
                    className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-5 text-center hover:bg-white/18 hover:-translate-y-0.5 transition-all no-underline text-white block"
                  >
                    <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-3">
                      <FiGlobe className="w-[22px] h-[22px] text-white" />
                    </div>
                    <h4 className="text-[0.9rem] font-bold mb-1">LinkedIn Profile</h4>
                    <p className="text-[0.75rem] opacity-75 mb-3.5 leading-relaxed">
                      Optimize your profile for recruiters. Get noticed.
                    </p>
                    <span className="inline-flex items-center justify-center px-5 py-2 bg-white text-[#1a56db] text-[0.78rem] font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                      Optimize
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* 15. PAID AD */}
            <AdSlot position="inline" />
          </div>

          {/* ─── RIGHT SIDEBAR ─── */}
          <HomepageSidebar />
        </div>
      </main>
    </>
  );
}
