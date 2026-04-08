import Link from "next/link";
import {
  FiSearch,
  FiMapPin,
  FiClock,
  FiBriefcase,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiX,
  FiTrendingUp,
  FiStar,
  FiDollarSign,
  FiCalendar,
  FiArrowRight,
  FiZap,
  FiUsers,
  FiAward,
} from "react-icons/fi";
import { db } from "@/lib/db";
import {
  formatDate,
  formatCurrency,
  formatJobType,
  formatExperienceLevel,
  formatRelativeDate,
} from "@/lib/format";
import { formatLocation, getInitials } from "@/lib/normalize";
import {
  generateMeta,
  generateCollectionPageJsonLd,
  generateItemListJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/seo";
import { siteConfig } from "@/config/site-config";
import AdPlaceholder from "../_components/AdPlaceholder";

export const dynamic = "force-dynamic";

const PER_PAGE = 20;

// ─── Constants ──────────────────────────────────────────────────────────────────
const JOB_TYPES = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "FREELANCE", label: "Freelance" },
  { value: "VOLUNTEER", label: "Volunteer" },
];

const EXPERIENCE_LEVELS = [
  { value: "ENTRY_LEVEL", label: "Entry Level" },
  { value: "JUNIOR", label: "Junior" },
  { value: "MID_LEVEL", label: "Mid Level" },
  { value: "SENIOR", label: "Senior" },
  { value: "LEAD", label: "Lead" },
  { value: "MANAGER", label: "Manager" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "trending", label: "Most Viewed" },
  { value: "deadline", label: "Closing Soon" },
  { value: "salary", label: "Highest Salary" },
];

const POPULAR_CATEGORIES = [
  { label: "Technology", href: "/jobs/technology" },
  { label: "Finance", href: "/jobs/finance-accounting" },
  { label: "Healthcare", href: "/jobs/healthcare" },
  { label: "Engineering", href: "/jobs/engineering" },
  { label: "Marketing", href: "/jobs/marketing-communications" },
  { label: "Government", href: "/jobs/government" },
  { label: "Remote", href: "/jobs/remote" },
  { label: "Internships", href: "/jobs/internships" },
  { label: "Customer Service", href: "/jobs/customer-service" },
  { label: "NGO / Nonprofit", href: "/jobs/nonprofit" },
  { label: "Education", href: "/jobs/education-training" },
  { label: "Sales", href: "/jobs/sales-business" },
];

// ─── Data Fetching ──────────────────────────────────────────────────────────────
function buildWhereClause({ q, type, location, experienceLevel }) {
  const where = {
    AND: [
      { isActive: true },
      { status: "PUBLISHED" },
      {
        OR: [
          { applicationDeadline: null },
          { applicationDeadline: { gte: new Date() } },
        ],
      },
    ],
  };

  if (q) {
    where.AND.push({
      OR: [
        { title: { contains: q } },
        { description: { contains: q } },
      ],
    });
  }

  if (type) {
    where.AND.push({ employmentType: type });
  }

  if (location) {
    where.AND.push({
      OR: [
        { county: { contains: location } },
        { town: { contains: location } },
      ],
    });
  }

  if (experienceLevel) {
    where.AND.push({ experienceLevel });
  }

  return where;
}

function buildOrderBy(sort) {
  switch (sort) {
    case "trending":
      return [{ isFeatured: "desc" }, { viewCount: "desc" }, { createdAt: "desc" }];
    case "deadline":
      return { applicationDeadline: "asc" };
    case "salary":
      return { salaryMin: "desc" };
    case "newest":
    default:
      return { publishedAt: "desc" };
  }
}

async function fetchJobs(searchParams) {
  const q = searchParams.q || null;
  const type = searchParams.type || null;
  const location = searchParams.location || null;
  const experienceLevel = searchParams.experienceLevel || null;
  const page = Math.max(1, parseInt(searchParams.page, 10) || 1);
  const sort = searchParams.sort || "newest";

  const where = buildWhereClause({ q, type, location, experienceLevel });
  const orderBy = buildOrderBy(sort);

  const [jobs, total] = await Promise.all([
    db.job.findMany({
      where,
      orderBy,
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      include: {
        company: {
          select: {
            name: true,
            slug: true,
            logo: true,
            logoColor: true,
            industry: true,
            isVerified: true,
          },
        },
      },
    }),
    db.job.count({ where }),
  ]);

  return { jobs, total, page, totalPages: Math.ceil(total / PER_PAGE) };
}

// ─── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const { q, type, location, experienceLevel } = params;

  const filters = [];
  if (type) filters.push(formatJobType(type));
  if (location) filters.push(location);
  if (experienceLevel) filters.push(formatExperienceLevel(experienceLevel));
  if (q) filters.push(`"${q}"`);

  const filterSuffix = filters.length > 0 ? ` — ${filters.join(", ")}` : "";
  const title = `Jobs in Kenya${filterSuffix}`;

  const description = q
    ? `Search results for "${q}" — ${filters.join(", ")} jobs. Browse and apply for the latest opportunities on JobReady Kenya.`
    : filters.length > 0
      ? `Browse ${filters.join(", ")} jobs in Kenya. Find and apply for the latest opportunities on JobReady Kenya.`
      : "Browse the latest jobs in Kenya. Full-time, part-time, internship, contract, and remote positions updated daily. Apply now on JobReady Kenya.";

  const pathParams = new URLSearchParams();
  if (q) pathParams.set("q", q);
  if (type) pathParams.set("type", type);
  if (location) pathParams.set("location", location);
  if (experienceLevel) pathParams.set("experienceLevel", experienceLevel);
  const pathString = pathParams.toString();
  const path = `/jobs${pathString ? `?${pathString}` : ""}`;

  return generateMeta({ title, description, path });
}

// ─── Helper: Build search params URL ───────────────────────────────────────────
function buildFilterUrl(searchParams, overrides = {}) {
  const params = { ...searchParams };
  for (const [key, value] of Object.entries(overrides)) {
    if (value === null || value === undefined || value === "") {
      delete params[key];
    } else {
      params[key] = value;
    }
  }
  delete params.page;
  const qs = new URLSearchParams(params).toString();
  return `/jobs${qs ? `?${qs}` : ""}`;
}

function hasActiveFilters(searchParams) {
  return !!(searchParams.q || searchParams.type || searchParams.location || searchParams.experienceLevel);
}

// ─── Page Component ────────────────────────────────────────────────────────────
export default async function JobsPage({ searchParams }) {
  const params = await searchParams;
  const { jobs, total, page, totalPages } = await fetchJobs(params);

  // Current filter values
  const q = params.q || "";
  const type = params.type || "";
  const location = params.location || "";
  const experienceLevel = params.experienceLevel || "";
  const sort = params.sort || "newest";

  // Breadcrumb items
  const breadcrumbItems = [{ name: "Home", href: "/" }];
  const filterLabels = [];
  if (type) filterLabels.push(formatJobType(type));
  if (location) filterLabels.push(location);
  if (experienceLevel) filterLabels.push(formatExperienceLevel(experienceLevel));
  if (q) filterLabels.push(`"${q}"`);

  breadcrumbItems.push({ name: "Jobs", href: "/jobs" });
  if (filterLabels.length > 0) {
    breadcrumbItems.push({ name: filterLabels.join(", "), href: `/jobs?${new URLSearchParams(params).toString()}` });
  }

  // JSON-LD
  const listUrl = `/jobs${hasActiveFilters(params) ? `?${new URLSearchParams(params).toString()}` : ""}`;
  const collectionPageJsonLd = generateCollectionPageJsonLd({
    name: `Jobs in Kenya${filterLabels.length > 0 ? ` — ${filterLabels.join(", ")}` : ""}`,
    description: `${total} jobs available on JobReady Kenya`,
    url: listUrl,
    totalItems: total,
  });

  const itemListJsonLd = generateItemListJsonLd({
    name: "Jobs",
    url: listUrl,
    totalItems: total,
    items: jobs.map((job, i) => ({
      name: job.title,
      url: `/jobs/${job.slug}`,
      position: (page - 1) * PER_PAGE + i + 1,
    })),
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbItems);

  // Sort URL helper (preserves filters)
  const sortUrl = (sortValue) => {
    const p = { ...params, sort: sortValue };
    delete p.page;
    return `/jobs?${new URLSearchParams(p).toString()}`;
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 1 — Hero / Search Header
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e3a5f] via-[#2d4a7a] to-[#5B21B6]">
        {/* Decorative background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-3xl" />
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        <div className="relative max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 pt-10 pb-14 md:pt-14 md:pb-20">
          {/* Breadcrumb */}
          <nav className="text-sm text-white/50 mb-6 flex flex-wrap items-center gap-1">
            {breadcrumbItems.map((item, i) => (
              <span key={item.href + item.name}>
                {i > 0 && <span className="text-white/30 mx-1.5">/</span>}
                {i === breadcrumbItems.length - 1 ? (
                  <span className="text-white/80 font-medium truncate max-w-[250px] sm:max-w-none inline-block align-bottom">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.href} className="hover:text-white/80 transition-colors">
                    {item.name}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 tracking-tight">
              Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-200">Dream Job</span>
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-xl mx-auto">
              {total.toLocaleString()} opportunities from Kenya&apos;s top employers — updated daily
            </p>
          </div>

          {/* ─── Search Bar ─── */}
          <div className="max-w-3xl mx-auto">
            <form action="/jobs" method="GET" className="relative bg-white rounded-2xl shadow-2xl shadow-black/20 p-2 flex flex-col md:flex-row gap-2">
              {/* Search Input */}
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="q"
                  defaultValue={q}
                  placeholder="Job title, keyword, or company..."
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                />
              </div>

              {/* Location Input */}
              <div className="relative md:w-48">
                <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  defaultValue={location}
                  placeholder="Location..."
                  className="w-full pl-10 pr-4 py-3.5 bg-gray-50 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="bg-gradient-to-r from-[#5B21B6] to-[#7c3aed] hover:from-[#4C1D95] hover:to-[#6d28d9] text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
              >
                <FiSearch className="w-4 h-4" />
                Search Jobs
              </button>
            </form>

            {/* Active filter badges */}
            {hasActiveFilters(params) && (
              <div className="flex flex-wrap items-center gap-2 mt-4 justify-center">
                <span className="text-white/50 text-xs">Active filters:</span>
                {q && (
                  <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/10">
                    &quot;{q}&quot;
                    <Link href={buildFilterUrl(params, { q: null })} className="hover:text-red-200 transition-colors">
                      <FiX className="w-3 h-3" />
                    </Link>
                  </span>
                )}
                {type && (
                  <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/10">
                    {formatJobType(type)}
                    <Link href={buildFilterUrl(params, { type: null })} className="hover:text-red-200 transition-colors">
                      <FiX className="w-3 h-3" />
                    </Link>
                  </span>
                )}
                {experienceLevel && (
                  <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/10">
                    {formatExperienceLevel(experienceLevel)}
                    <Link href={buildFilterUrl(params, { experienceLevel: null })} className="hover:text-red-200 transition-colors">
                      <FiX className="w-3 h-3" />
                    </Link>
                  </span>
                )}
                {location && (
                  <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/10">
                    📍 {location}
                    <Link href={buildFilterUrl(params, { location: null })} className="hover:text-red-200 transition-colors">
                      <FiX className="w-3 h-3" />
                    </Link>
                  </span>
                )}
                <Link
                  href="/jobs"
                  className="text-white/60 hover:text-white text-xs underline underline-offset-2 transition-colors"
                >
                  Clear all
                </Link>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-white/50 text-xs">
            <div className="flex items-center gap-1.5">
              <FiBriefcase className="w-3.5 h-3.5" />
              <span><strong className="text-white/80">{total.toLocaleString()}</strong> Active Jobs</span>
            </div>
            <div className="w-1 h-1 bg-white/20 rounded-full hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <FiZap className="w-3.5 h-3.5" />
              <span>Updated Daily</span>
            </div>
            <div className="w-1 h-1 bg-white/20 rounded-full hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <FiUsers className="w-3.5 h-3.5" />
              <span><strong className="text-white/80">500+</strong> Employers</span>
            </div>
            <div className="w-1 h-1 bg-white/20 rounded-full hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <FiAward className="w-3.5 h-3.5" />
              <span><strong className="text-white/80">92%</strong> Success Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 2 — Popular Categories (Scrollable Pills)
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-3 overflow-x-auto hide-scrollbar">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap flex-shrink-0">
              Popular:
            </span>
            {POPULAR_CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium text-gray-600 bg-gray-50 hover:bg-purple-50 hover:text-purple-700 border border-gray-100 hover:border-purple-200 transition-all duration-200 whitespace-nowrap"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 3 — Main Content Area
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ═══ LEFT SIDEBAR — Filters ═══ */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-16 space-y-5">

              {/* Filter Header */}
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <FiFilter className="w-4 h-4 text-purple-600" />
                  Filters
                </h2>
                {hasActiveFilters(params) && (
                  <Link
                    href="/jobs"
                    className="text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1 transition-colors"
                  >
                    <FiX className="w-3 h-3" />
                    Reset
                  </Link>
                )}
              </div>

              {/* Job Type Filter */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Job Type
                </h3>
                <div className="space-y-1">
                  <Link
                    href={buildFilterUrl(params, { type: null })}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${!type ? "bg-purple-50 text-purple-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    All Types
                  </Link>
                  {JOB_TYPES.map((t) => (
                    <Link
                      key={t.value}
                      href={buildFilterUrl(params, { type: t.value })}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${type === t.value ? "bg-purple-50 text-purple-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      <span>{t.label}</span>
                      {type === t.value && (
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Experience Level Filter */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Experience Level
                </h3>
                <div className="space-y-1">
                  <Link
                    href={buildFilterUrl(params, { experienceLevel: null })}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${!experienceLevel ? "bg-purple-50 text-purple-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    All Levels
                  </Link>
                  {EXPERIENCE_LEVELS.map((lvl) => (
                    <Link
                      key={lvl.value}
                      href={buildFilterUrl(params, { experienceLevel: lvl.value })}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${experienceLevel === lvl.value ? "bg-purple-50 text-purple-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      <span>{lvl.label}</span>
                      {experienceLevel === lvl.value && (
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Sort By
                </h3>
                <div className="space-y-1">
                  {SORT_OPTIONS.map((opt) => (
                    <Link
                      key={opt.value}
                      href={sortUrl(opt.value)}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${sort === opt.value ? "bg-purple-50 text-purple-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      <span>{opt.label}</span>
                      {sort === opt.value && (
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Ad */}
              <AdPlaceholder height="250px" />

              {/* Post a Job CTA */}
              <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-5 text-white shadow-lg">
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto mb-3 bg-white/10 rounded-full flex items-center justify-center">
                    <FiZap className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm mb-1">Employer?</h3>
                  <p className="text-purple-200 text-xs mb-3 leading-relaxed">
                    Get your job seen by thousands of qualified candidates today.
                  </p>
                  <a
                    href={siteConfig.whatsapp.links.employer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 bg-white text-purple-700 font-semibold py-2 px-4 rounded-lg transition-colors text-xs hover:bg-purple-50 w-full"
                  >
                    Post a Job
                    <FiArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* ═══ RIGHT COLUMN — Job Listings ═══ */}
          <div className="flex-1 min-w-0">

            {/* Results Header */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                Showing <strong className="text-gray-900">{(page - 1) * PER_PAGE + 1}</strong>–<strong className="text-gray-900">{Math.min(page * PER_PAGE, total)}</strong> of <strong className="text-gray-900">{total.toLocaleString()}</strong> jobs
              </p>
            </div>

            {jobs.length === 0 ? (
              /* ─── Empty State ─── */
              <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
                <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <FiSearch className="w-8 h-8 text-gray-300" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h2>
                <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                  We couldn&apos;t find any jobs matching your criteria. Try broadening your search or removing some filters.
                </p>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors shadow-lg shadow-purple-500/25"
                >
                  <FiX className="w-4 h-4" />
                  Clear All Filters
                </Link>
              </div>
            ) : (
              <>
                {/* ─── Job Cards — List Layout ─── */}
                <div className="space-y-3">
                  {jobs.map((job) => {
                    const jobLocation = formatLocation(job);
                    const jobType = formatJobType(job.employmentType);
                    const expLevel = formatExperienceLevel(job.experienceLevel);
                    const company = job.company;
                    const initials = getInitials(company?.name || "C");
                    const logoColor = company?.logoColor || "#5B21B6";

                    const salaryDisplay = job.salaryMin
                      ? `${formatCurrency(job.salaryMin)}${job.salaryMax ? ` – ${formatCurrency(job.salaryMax)}` : ""}`
                      : null;

                    return (
                      <Link
                        key={job.id}
                        href={`/jobs/${job.slug}`}
                        className="group block bg-white rounded-xl border border-gray-200 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300 overflow-hidden no-underline"
                      >
                        <div className="p-4 md:p-5">
                          <div className="flex items-start gap-4">
                            {/* Company Logo */}
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm"
                              style={{ backgroundColor: logoColor }}
                            >
                              {company?.logo ? (
                                <img
                                  src={company.logo}
                                  alt={company.name}
                                  className="w-12 h-12 rounded-xl object-cover"
                                />
                              ) : (
                                <span className="text-base">{initials}</span>
                              )}
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 min-w-0">
                              {/* Top Row: Title + Featured */}
                              <div className="flex items-start justify-between gap-3 mb-1">
                                <div>
                                  <h3 className="font-semibold text-gray-900 text-base leading-snug group-hover:text-purple-700 transition-colors line-clamp-1">
                                    {job.title}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    {company && (
                                      <span className="text-sm text-gray-500 group-hover:text-purple-600 transition-colors">
                                        {company.name}
                                      </span>
                                    )}
                                    {company?.isVerified && (
                                      <span className="text-teal-500 flex-shrink-0" title="Verified company">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {job.isFeatured && (
                                  <span className="flex-shrink-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide shadow-sm">
                                    Featured
                                  </span>
                                )}
                              </div>

                              {/* Tags Row */}
                              <div className="flex flex-wrap items-center gap-2 mt-2.5">
                                {jobType && (
                                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-lg">
                                    <FiBriefcase className="w-3 h-3" />
                                    {jobType}
                                  </span>
                                )}
                                {expLevel && (
                                  <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-lg">
                                    <FiStar className="w-3 h-3" />
                                    {expLevel}
                                  </span>
                                )}
                                {job.isRemote && (
                                  <span className="inline-flex items-center gap-1 bg-violet-50 text-violet-700 text-xs font-medium px-2.5 py-1 rounded-lg">
                                    <FiMapPin className="w-3 h-3" />
                                    Remote
                                  </span>
                                )}
                                <span className="inline-flex items-center gap-1 text-gray-400 text-xs">
                                  <FiMapPin className="w-3 h-3" />
                                  {jobLocation}
                                </span>
                              </div>
                            </div>

                            {/* Right Side: Salary + Time */}
                            <div className="hidden sm:flex flex-col items-end gap-2 flex-shrink-0">
                              {salaryDisplay && (
                                <div className="flex items-center gap-1 text-sm text-emerald-600 font-semibold">
                                  <FiDollarSign className="w-3.5 h-3.5" />
                                  <span>{salaryDisplay}</span>
                                </div>
                              )}
                              <span className="flex items-center gap-1 text-xs text-gray-400">
                                <FiClock className="w-3 h-3" />
                                {formatRelativeDate(job.publishedAt || job.createdAt)}
                              </span>
                              {job.applicationDeadline && (
                                <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md font-medium">
                                  <FiCalendar className="w-3 h-3" />
                                  {formatDate(job.applicationDeadline)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Mobile: Salary + Time + Deadline row */}
                          <div className="sm:hidden flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                              {salaryDisplay && (
                                <span className="flex items-center gap-1 text-sm text-emerald-600 font-semibold">
                                  <FiDollarSign className="w-3.5 h-3.5" />
                                  {salaryDisplay}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <FiClock className="w-3 h-3" />
                                {formatRelativeDate(job.publishedAt || job.createdAt)}
                              </span>
                              {job.applicationDeadline && (
                                <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md font-medium">
                                  <FiCalendar className="w-3 h-3" />
                                  {formatDate(job.applicationDeadline)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* ─── Pagination ─── */}
                {totalPages > 1 && (
                  <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
                    {/* Previous */}
                    {page > 1 ? (
                      <Link
                        href={buildFilterUrl({ ...params, page: String(page - 1) })}
                        className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-600 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 font-medium px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm"
                      >
                        <FiChevronLeft className="w-4 h-4" />
                        Previous
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-100 text-gray-300 font-medium px-4 py-2.5 rounded-xl text-sm cursor-not-allowed">
                        <FiChevronLeft className="w-4 h-4" />
                        Previous
                      </span>
                    )}

                    {/* Page Numbers */}
                    <div className="hidden sm:flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => {
                          if (p === 1 || p === totalPages) return true;
                          if (Math.abs(p - page) <= 2) return true;
                          return false;
                        })
                        .reduce((acc, p, i, arr) => {
                          if (i > 0 && p - arr[i - 1] > 1) {
                            acc.push("ellipsis");
                          }
                          acc.push(p);
                          return acc;
                        }, [])
                        .map((item) =>
                          item === "ellipsis" ? (
                            <span
                              key={`ellipsis-${item}`}
                              className="px-2 text-gray-400 text-sm"
                            >
                              ...
                            </span>
                          ) : item === page ? (
                            <span
                              key={item}
                              className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl text-sm shadow-lg shadow-purple-500/25"
                            >
                              {item}
                            </span>
                          ) : (
                            <Link
                              key={item}
                              href={buildFilterUrl({ ...params, page: String(item) })}
                              className="inline-flex items-center justify-center w-10 h-10 bg-white border border-gray-200 text-gray-600 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 font-medium rounded-xl text-sm transition-all"
                            >
                              {item}
                            </Link>
                          )
                        )}
                    </div>

                    {/* Mobile page indicator */}
                    <span className="sm:hidden text-sm text-gray-500 font-medium px-3">
                      Page {page} of {totalPages}
                    </span>

                    {/* Next */}
                    {page < totalPages ? (
                      <Link
                        href={buildFilterUrl({ ...params, page: String(page + 1) })}
                        className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-600 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 font-medium px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm"
                      >
                        Next
                        <FiChevronRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-100 text-gray-300 font-medium px-4 py-2.5 rounded-xl text-sm cursor-not-allowed">
                        Next
                        <FiChevronRight className="w-4 h-4" />
                      </span>
                    )}
                  </nav>
                )}
              </>
            )}
          </div>

          {/* ═══ RIGHT SIDEBAR — CTAs ═══ */}
          <aside className="hidden xl:block w-64 flex-shrink-0">
            <div className="sticky top-16 space-y-5">
              {/* CV Writing CTA */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                    <span className="text-xl">📝</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">Professional CV Writing</h3>
                  <p className="text-gray-500 text-xs mb-4 leading-relaxed">
                    Get a professionally written CV that gets you noticed by top employers.
                  </p>
                  <a
                    href={siteConfig.whatsapp.links.cvService}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm w-full shadow-sm shadow-teal-500/20"
                  >
                    Get Started
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </a>
                  <p className="text-gray-400 text-xs mt-2.5">
                    From KSh 500
                  </p>
                </div>
              </div>

              {/* Free CV Review */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100 p-5 text-center">
                <span className="text-2xl block mb-2">✨</span>
                <h3 className="font-bold text-gray-900 text-sm mb-1">Free CV Review</h3>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                  Get expert feedback on your CV — identify gaps and improve your chances.
                </p>
                <a
                  href={siteConfig.whatsapp.links.freeCvReview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 bg-white text-purple-700 font-semibold py-2 px-4 rounded-lg transition-colors text-sm border border-purple-200 hover:bg-purple-50 w-full"
                >
                  Get Free Review
                </a>
              </div>

              {/* Ad */}
              <AdPlaceholder height="300px" label="Sponsored" />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
