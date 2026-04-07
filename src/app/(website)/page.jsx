import Link from "next/link";
import {
  FiZap,
  FiClock,
  FiFileText,
  FiSend,
  FiGlobe,
  FiMonitor,
  FiDollarSign,
  FiTool,
  FiHeart,
  FiFlag,
  FiTrendingUp,
  FiBookOpen,
  FiHome,
  FiTarget,
} from "react-icons/fi";
import {
  FaGraduationCap,
  FaChartLine,
  FaAward,
  FaUniversity,
  FaHandHoldingUsd,
  FaBuilding,
  FaLandmark,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { MdSchool, MdWorkOutline } from "react-icons/md";
import Script from "next/script";

import HeroSection from "./_components/home/HeroSection";
import HomepageSidebar from "./_components/home/HomepageSidebar";
import JobCardGrid from "./_components/JobCardGrid";
import CategoryCard from "./_components/CategoryCard";
import OpportunityCard from "./_components/OpportunityCard";
import DeadlineCard from "./_components/DeadlineCard";
import ArticleCard from "./_components/ArticleCard";
import AdSlot from "./_components/AdSlot";
import { generateWebSiteJsonLd } from "@/lib/seo";
import { normalizeJobs, formatTimeLeft } from "@/lib/normalize";
import { db } from "@/lib/db";

// ─── Icon mapping for categories ──────────────────────────────
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

// ─── Static configs (no API for these) ────────────────────────
const categories = [
  { name: "Technology", count: 0, href: "/jobs/technology", color: "#1a56db", icon: "FiMonitor" },
  { name: "Finance & Accounting", count: 0, href: "/jobs/finance-accounting", color: "#059669", icon: "FiDollarSign" },
  { name: "Engineering", count: 0, href: "/jobs/engineering", color: "#f59e0b", icon: "FiTool" },
  { name: "Healthcare", count: 0, href: "/jobs/healthcare", color: "#dc2626", icon: "FiHeart" },
  { name: "Education", count: 0, href: "/jobs/education", color: "#7c3aed", icon: "FaGraduationCap" },
  { name: "Marketing", count: 0, href: "/jobs/sales-marketing", color: "#ec4899", icon: "FaChartLine" },
  { name: "Government", count: 0, href: "/jobs/government", color: "#1e40af", icon: "FiFlag" },
  { name: "NGO & International", count: 0, href: "/jobs/ngo", color: "#009688", icon: "FiGlobe" },
];

const trustedLogos = [
  "Safaricom",
  "Equity Bank",
  "KCB Group",
  "KRA",
  "UNDP Kenya",
  "Kenya Power",
  "NCBA",
];

const locations = [
  { label: "Nairobi", href: "/jobs/nairobi" },
  { label: "Mombasa", href: "/jobs/mombasa" },
  { label: "Kisumu", href: "/jobs/kisumu" },
  { label: "Nakuru", href: "/jobs/nakuru" },
  { label: "Remote", href: "/jobs/remote", highlight: true },
];

// Force dynamic rendering (no static generation at build time)
export const dynamic = "force-dynamic";

// ─── Shared Prisma where clause for active, published jobs ───
function activeJobsWhere(overrides = []) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return {
    AND: [
      { isActive: true },
      { status: "Published" },
      { OR: [{ applicationDeadline: null }, { applicationDeadline: { gte: today } }] },
      ...overrides,
    ],
  };
}

const jobInclude = {
  company: {
    select: {
      name: true,
      slug: true,
      logo: true,
      logoColor: true,
      isVerified: true,
    },
  },
};

// ─── Section header component (reusable) ─────────────────────
function SectionHeader({ icon: Icon, title, iconColor = "text-primary", href }) {
  return (
    <div className="flex items-center justify-between mb-4 md:mb-5">
      <div className="flex items-center gap-2">
        {Icon && (
          <span className={iconColor}>
            <Icon size={20} />
          </span>
        )}
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark transition-colors hover:no-underline"
        >
          View All
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      )}
    </div>
  );
}

// ─── SEO ──────────────────────────────────────────────────────
export async function generateMetadata() {
  return {
    title: "JobNet Kenya — Jobs, Internships, Scholarships & Government Opportunities",
    description:
      "Find jobs, internships, scholarships, government jobs & bursaries in Kenya. Updated daily. Get your professional CV done from KSh 500 — JobNet.co.ke",
    alternates: {
      canonical: "https://jobnet.co.ke",
    },
    openGraph: {
      title: "JobNet Kenya — Jobs, Internships, Scholarships & Govt Opportunities",
      description:
        "Kenya's #1 job board. Find jobs, internships, scholarships, government vacancies & career services. Updated daily.",
      url: "https://jobnet.co.ke",
      type: "website",
    },
  };
}

// ─── PAGE ─────────────────────────────────────────────────────
export default async function HomePage() {
  // ── Fetch all data from Prisma in parallel ──
  const [
    featuredJobs,
    latestJobs,
    internshipJobs,
    deadlineJobs,
    entryLevelJobs,
    governmentJobs,
    allOpportunities,
    articles,
  ] = await Promise.allSettled([
    // 1. Featured jobs
    db.job.findMany({
      where: activeJobsWhere(),
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 5,
      include: jobInclude,
    }),
    // 2. Latest jobs (used for Trending + Latest)
    db.job.findMany({
      where: activeJobsWhere(),
      orderBy: { createdAt: "desc" },
      take: 10,
      include: jobInclude,
    }),
    // 3. Internship jobs
    db.job.findMany({
      where: activeJobsWhere([{ employmentType: "Internship" }]),
      orderBy: { createdAt: "desc" },
      take: 5,
      include: jobInclude,
    }),
    // 4. Deadline jobs (for urgent deadlines + sidebar)
    db.job.findMany({
      where: activeJobsWhere(),
      orderBy: [{ applicationDeadline: "asc" }, { createdAt: "desc" }],
      take: 10,
      include: jobInclude,
    }),
    // 5. Entry level jobs
    db.job.findMany({
      where: activeJobsWhere([{ experienceLevel: "Entry" }]),
      orderBy: { createdAt: "desc" },
      take: 5,
      include: jobInclude,
    }),
    // 6. Government jobs (national + county)
    db.job.findMany({
      where: activeJobsWhere([{ categories: { string_contains: '"GOVERNMENT_PUBLIC_SECTOR"' } }]),
      orderBy: { createdAt: "desc" },
      take: 10,
      include: jobInclude,
    }),
    // 7. All opportunities (filter by type in code)
    db.opportunity.findMany({
      where: {
        isActive: true,
        publishedAt: { not: null, lte: new Date() },
      },
      orderBy: { publishedAt: "desc" },
      take: 20,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        opportunityType: true,
        category: true,
        country: true,
        city: true,
        isRemote: true,
        isOnline: true,
        deadline: true,
        company: {
          select: {
            name: true,
            logo: true,
            logoColor: true,
            industry: true,
          },
        },
        isFeatured: true,
        viewsCount: true,
        publishedAt: true,
      },
    }),
    // 8. Latest blog articles
    db.blogArticle.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        readingTime: true,
        viewsCount: true,
        createdAt: true,
        category: {
          select: { name: true },
        },
        author: {
          select: { name: true },
        },
      },
    }),
  ]);

  // ── Unwrap settled results ──
  const unwrap = (result) => (result.status === "fulfilled" ? result.value : []);
  const featuredRaw = unwrap(featuredJobs);
  const latestRaw = unwrap(latestJobs);
  const internshipRaw = unwrap(internshipJobs);
  const deadlineRaw = unwrap(deadlineJobs);
  const entryLevelRaw = unwrap(entryLevelJobs);
  const governmentRaw = unwrap(governmentJobs);
  const oppRaw = unwrap(allOpportunities);
  const articlesRaw = unwrap(articles);

  // ── Normalize job datasets ──
  const _featuredJobs = normalizeJobs(featuredRaw);
  const _latestJobs = normalizeJobs(latestRaw);
  const _internshipJobs = normalizeJobs(internshipRaw);
  const _entryLevelJobs = normalizeJobs(entryLevelRaw);

  // Trending = first 5 from latest
  const trendingJobs = normalizeJobs(latestRaw).slice(0, 5);

  // ── Urgent deadlines: jobs closing within 7 days ──
  const now = new Date();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const urgentJobs = deadlineRaw.filter((j) => {
    if (!j.applicationDeadline) return false;
    const dl = new Date(j.applicationDeadline);
    return dl > now && dl.getTime() - now.getTime() < sevenDaysMs;
  });
  const urgentDeadlines = urgentJobs.length
    ? urgentJobs.slice(0, 3).map((j) => ({
        slug: j.slug,
        title: j.title,
        company: j.company?.name || "",
        deadline: j.applicationDeadline,
      }))
    : [];

  // ── Government jobs — split into national vs county ──
  const _nationalGovJobs = normalizeJobs(
    governmentRaw.filter((j) => {
      const t = (j.title || "").toLowerCase();
      const d = (j.description || "").toLowerCase();
      return t.includes("national") || t.includes("government") || t.includes("public service") || t.includes("state department") || t.includes("ministry") || t.includes("commission") || d.includes("national government");
    })
  ).slice(0, 5);

  const _countyGovJobs = normalizeJobs(
    governmentRaw.filter((j) => {
      const t = (j.title || "").toLowerCase();
      const d = (j.description || "").toLowerCase();
      return t.includes("county") || d.includes("county government");
    })
  ).slice(0, 5);

  // If national/county split yields nothing, show all gov jobs under "Government Jobs"
  const _allGovJobs = normalizeJobs(governmentRaw).slice(0, 5);

  // ── Opportunities — filter by type ──
  const _scholarships = oppRaw.filter((o) => o.opportunityType === "SCHOLARSHIP").slice(0, 6);
  const _bursaries = oppRaw.filter((o) => o.opportunityType === "BURSARY").slice(0, 6);
  const _grants = oppRaw.filter((o) => o.opportunityType === "GRANT").slice(0, 6);
  const _fellowships = oppRaw.filter((o) => o.opportunityType === "FELLOWSHIP").slice(0, 6);
  const _universityOpps = oppRaw.filter((o) => {
    const t = (o.title || "").toLowerCase();
    const cat = (o.category || "").toLowerCase();
    return t.includes("university") || t.includes("admission") || t.includes("degree") || cat === "education";
  }).slice(0, 6);

  // ── Blog articles ──
  const _articles = articlesRaw.map((a) => ({
    ...a,
    category: a.category?.name || "Career Advice",
    publishedAt: a.createdAt,
  }));

  // ─── Sidebar data ───────────────────────────────────────

  // Top employers: from latest jobs' companies, deduplicated
  const companyMap = new Map();
  for (const job of latestRaw) {
    const c = job.company;
    if (c && c.name && !companyMap.has(c.slug)) {
      companyMap.set(c.slug, {
        name: c.name,
        slug: c.slug,
        logoColor: c.logoColor || "#1a56db",
        jobCount: 1,
      });
    } else if (c && c.slug && companyMap.has(c.slug)) {
      companyMap.get(c.slug).jobCount += 1;
    }
  }
  const topEmployers = companyMap.size > 0
    ? Array.from(companyMap.values()).sort((a, b) => b.jobCount - a.jobCount).slice(0, 6)
    : [];

  // Sidebar featured jobs
  const sidebarFeaturedJobs = _featuredJobs.length > 0
    ? _featuredJobs.slice(0, 4).map((j) => ({
        title: j.title,
        slug: j.slug,
        company: j.company?.name || "",
        location: j.location || "",
        logoColor: j.company?.logoColor || "#1a56db",
      }))
    : [];

  // Sidebar deadlines
  const sidebarDeadlines = deadlineRaw.length > 0
    ? deadlineRaw.slice(0, 5).map((j) => ({
        name: j.title,
        timeLeft: formatTimeLeft(j.applicationDeadline),
      }))
    : [];

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
      <section className="bg-white border-b border-gray-100 py-6 md:py-8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <p className="text-[0.75rem] text-gray-400 uppercase tracking-widest font-semibold text-center mb-3">
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

      {/* 3. GOOGLE AD PLACEHOLDER — Leaderboard */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-4 pb-2">
        <AdSlot position="leaderboard" />
      </div>

      {/* 4. MAIN LAYOUT — 2-column grid */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 pt-6 md:pt-8 pb-8">
          {/* ─── LEFT COLUMN ─── */}
          <div>
            {/* 5. TRENDING NOW */}
            <div className="mb-6 md:mb-8">
              <JobCardGrid
                jobs={trendingJobs}
                title="Trending Now"
                icon={HiSparkles}
                viewAllHref="/search?sort=trending"
              />
            </div>

            {/* 6. DON'T MISS OUT — Job Applications Deadline Today */}
            {urgentDeadlines.length > 0 && (
              <div className="mb-6 md:mb-8">
                <SectionHeader
                  icon={FiClock}
                  title="Don't Miss Out — Application Deadlines"
                  iconColor="text-red-500"
                  href="/search?deadline=today"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
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
            )}

            {/* 7. LATEST JOBS */}
            <div className="mb-6 md:mb-8">
              <JobCardGrid
                jobs={_latestJobs}
                title="Latest Jobs"
                icon={FiTrendingUp}
                viewAllHref="/jobs"
              />
            </div>

            {/* 8. GOOGLE AD PLACEHOLDER — Inline */}
            <div className="mb-6 md:mb-8">
              <AdSlot position="inline" />
            </div>

            {/* 9. FEATURED JOBS */}
            {_featuredJobs.length > 0 && (
              <div className="mb-6 md:mb-8">
                <JobCardGrid
                  jobs={_featuredJobs}
                  title="Featured Jobs"
                  icon={FaAward}
                  viewAllHref="/search?sort=featured"
                />
              </div>
            )}

            {/* 10. ENTRY LEVEL JOBS */}
            {_entryLevelJobs.length > 0 && (
              <div className="mb-6 md:mb-8">
                <JobCardGrid
                  jobs={_entryLevelJobs}
                  title="Entry Level Jobs"
                  icon={MdWorkOutline}
                  viewAllHref="/jobs/entry-level"
                />
              </div>
            )}

            {/* 11. INTERNSHIP OPPORTUNITIES */}
            {_internshipJobs.length > 0 && (
              <div className="mb-6 md:mb-8">
                <JobCardGrid
                  jobs={_internshipJobs}
                  title="Internship Opportunities"
                  icon={FaGraduationCap}
                  viewAllHref="/jobs/internships"
                />
              </div>
            )}

            {/* 12. NATIONAL GOVERNMENT JOBS */}
            {(_nationalGovJobs.length > 0 || _allGovJobs.length > 0) && (
              <div className="mb-6 md:mb-8">
                <JobCardGrid
                  jobs={_nationalGovJobs.length > 0 ? _nationalGovJobs : _allGovJobs}
                  title="National Government Jobs"
                  icon={FaLandmark}
                  viewAllHref="/jobs/government"
                />
              </div>
            )}

            {/* 13. COUNTY GOVERNMENT JOBS */}
            {_countyGovJobs.length > 0 && (
              <div className="mb-6 md:mb-8">
                <JobCardGrid
                  jobs={_countyGovJobs}
                  title="County Government Jobs"
                  icon={FaBuilding}
                  viewAllHref="/jobs/government"
                />
              </div>
            )}

            {/* 14. PAID ADS PLACEHOLDER */}
            <div className="mb-6 md:mb-8">
              <AdSlot position="inline" />
            </div>

            {/* 15. SCHOLARSHIPS & BURSARIES (combined) */}
            {(_scholarships.length > 0 || _bursaries.length > 0) && (
              <div className="mb-6 md:mb-8">
                <SectionHeader
                  icon={FaGraduationCap}
                  title="Scholarships & Bursaries"
                  iconColor="text-[#7c3aed]"
                  href="/opportunities"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                  {_scholarships.map((opp) => (
                    <OpportunityCard
                      key={opp.slug}
                      title={opp.title}
                      slug={opp.slug}
                      company={opp.company}
                      opportunityType={opp.opportunityType}
                      deadline={opp.deadline}
                      isOnline={opp.isOnline}
                    />
                  ))}
                  {_bursaries.map((opp) => (
                    <OpportunityCard
                      key={opp.slug}
                      title={opp.title}
                      slug={opp.slug}
                      company={opp.company}
                      opportunityType={opp.opportunityType}
                      deadline={opp.deadline}
                      isOnline={opp.isOnline}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 16. SCHOLARSHIPS (dedicated section) */}
            {_scholarships.length > 0 && (
              <div className="mb-6 md:mb-8">
                <SectionHeader
                  icon={FaGraduationCap}
                  title="Scholarships"
                  iconColor="text-[#7c3aed]"
                  href="/opportunities/scholarships"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                  {_scholarships.slice(0, 3).map((opp) => (
                    <OpportunityCard
                      key={opp.slug}
                      title={opp.title}
                      slug={opp.slug}
                      company={opp.company}
                      opportunityType={opp.opportunityType}
                      deadline={opp.deadline}
                      isOnline={opp.isOnline}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 17. UNIVERSITY APPLICATIONS */}
            {_universityOpps.length > 0 && (
              <div className="mb-6 md:mb-8">
                <SectionHeader
                  icon={FaUniversity}
                  title="University Applications"
                  iconColor="text-[#1e40af]"
                  href="/opportunities"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                  {_universityOpps.slice(0, 3).map((opp) => (
                    <OpportunityCard
                      key={opp.slug}
                      title={opp.title}
                      slug={opp.slug}
                      company={opp.company}
                      opportunityType={opp.opportunityType}
                      deadline={opp.deadline}
                      isOnline={opp.isOnline}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 18. SPONSORSHIPS & GRANTS */}
            {_grants.length > 0 && (
              <div className="mb-6 md:mb-8">
                <SectionHeader
                  icon={FaHandHoldingUsd}
                  title="Sponsorships & Grants"
                  iconColor="text-[#059669]"
                  href="/opportunities/grants"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                  {_grants.slice(0, 3).map((opp) => (
                    <OpportunityCard
                      key={opp.slug}
                      title={opp.title}
                      slug={opp.slug}
                      company={opp.company}
                      opportunityType={opp.opportunityType}
                      deadline={opp.deadline}
                      isOnline={opp.isOnline}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 19. FELLOWSHIPS & MORE OPPORTUNITIES */}
            {_fellowships.length > 0 && (
              <div className="mb-6 md:mb-8">
                <SectionHeader
                  icon={FiTarget}
                  title="Fellowships & Opportunities"
                  iconColor="text-[#f59e0b]"
                  href="/opportunities/fellowships"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                  {_fellowships.slice(0, 3).map((opp) => (
                    <OpportunityCard
                      key={opp.slug}
                      title={opp.title}
                      slug={opp.slug}
                      company={opp.company}
                      opportunityType={opp.opportunityType}
                      deadline={opp.deadline}
                      isOnline={opp.isOnline}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 20. SERVICE NUDGE — mid-page CTA */}
            <div className="mb-6 md:mb-8 bg-white border border-gray-200 border-l-4 border-l-[#1a56db] rounded-lg p-4 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="w-10 h-10 bg-[#dbeafe] rounded-full flex items-center justify-center shrink-0">
                <FiFileText className="w-[18px] h-[18px] text-[#1a56db]" />
              </div>
              <div className="flex-1">
                <p className="text-[0.85rem] text-gray-600 leading-relaxed">
                  Before you apply, get a professional CV that gets you shortlisted.{" "}
                  <Link
                    href="/cv-services"
                    className="font-semibold text-primary hover:text-primary-dark no-underline"
                  >
                    Get Your CV Done from KSh 500 &rarr;
                  </Link>
                </p>
              </div>
            </div>

            {/* 21. CATEGORY GRID */}
            <div className="mb-6 md:mb-8">
              <SectionHeader
                icon={FiZap}
                title="Browse by Category"
                iconColor="text-[#1a56db]"
                href="/jobs"
              />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
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

            {/* 22. BLOGS / CAREER ADVICE */}
            {_articles.length > 0 && (
              <div className="mb-6 md:mb-8">
                <SectionHeader
                  icon={FiBookOpen}
                  title="Career Advice & Blogs"
                  iconColor="text-[#059669]"
                  href="/career-advice"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 md:gap-6">
                  {_articles.slice(0, 4).map((article) => (
                    <ArticleCard
                      key={article.slug}
                      title={article.title}
                      slug={article.slug}
                      excerpt={article.excerpt}
                      featuredImage={article.featuredImage}
                      author={article.author}
                      category={article.category}
                      readingTime={article.readingTime ? `${article.readingTime} min read` : null}
                      viewsCount={article.viewsCount}
                      publishedAt={article.publishedAt}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 23. DOCUMENT WRITING BUSINESS CTAs */}
            <div className="mb-6 md:mb-8 bg-gradient-to-br from-[#1a56db] to-[#1e3a8a] rounded-2xl p-5 md:p-7 text-white relative overflow-hidden">
              <div className="absolute -top-[40%] -right-[10%] w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,transparent_70%)] pointer-events-none" />
              <div className="relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="sm:col-span-3">
                    <h3 className="text-lg font-extrabold mb-1.5 flex items-center gap-2">
                      <FiFileText className="w-5 h-5" />
                      Professional Document Writing Services
                    </h3>
                    <p className="text-[0.85rem] opacity-80 leading-relaxed mb-4">
                      Stand out from thousands of applicants. Our expert writers craft
                      ATS-optimized documents tailored to the Kenyan job market &mdash;
                      delivered fast.
                    </p>
                  </div>

                  {/* CV Writing */}
                  <Link
                    href="/cv-services"
                    className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-4 text-center hover:bg-white/18 hover:-translate-y-0.5 transition-all no-underline text-white block"
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
                    className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-4 text-center hover:bg-white/18 hover:-translate-y-0.5 transition-all no-underline text-white block"
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
                    className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-4 text-center hover:bg-white/18 hover:-translate-y-0.5 transition-all no-underline text-white block"
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

            {/* 24. PAID ADS PLACEHOLDER — Bottom */}
            <div className="mb-6 md:mb-8">
              <AdSlot position="inline" />
            </div>
          </div>

          {/* ─── RIGHT SIDEBAR ─── */}
          <HomepageSidebar
            topEmployers={topEmployers}
            sidebarFeaturedJobs={sidebarFeaturedJobs}
            sidebarDeadlines={sidebarDeadlines}
            locations={locations}
          />
        </div>
      </main>
    </>
  );
}
