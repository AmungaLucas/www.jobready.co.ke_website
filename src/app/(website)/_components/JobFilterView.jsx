import { db } from "@/lib/db";
import { formatDate, formatCurrency, formatJobType, formatExperienceLevel, formatRelativeDate } from "@/lib/format";
import { formatLocation, getInitials } from "@/lib/normalize";
import { generateMeta, generateBreadcrumbJsonLd } from "@/lib/seo";
import Link from "next/link";
import AdPlaceholder from "./AdPlaceholder";
import FilterSidebarWrapper from "./FilterSidebarWrapper";
import { siteConfig } from "@/config/site-config";
import { getJobHubs } from "@/config/hub-config";
import { FiSearch, FiMapPin, FiClock, FiBriefcase, FiChevronLeft, FiChevronRight, FiStar, FiDollarSign, FiCalendar, FiFilter, FiX, FiArrowRight, FiZap } from "react-icons/fi";
import OptimizedImage from "@/components/OptimizedImage";

// ─── Related Filter Links (internal linking for SEO) ────────────
const TOP_LOCATIONS = [
  { slug: "nairobi", label: "Nairobi" },
  { slug: "mombasa", label: "Mombasa" },
  { slug: "kisumu", label: "Kisumu" },
  { slug: "nakuru", label: "Nakuru" },
  { slug: "kiambu", label: "Kiambu" },
  { slug: "machakos", label: "Machakos" },
  { slug: "uasin-gishu", label: "Uasin Gishu" },
  { slug: "kakamega", label: "Kakamega" },
];

const TOP_CATEGORIES = [
  { slug: "technology", label: "Technology" },
  { slug: "finance-accounting", label: "Finance & Accounting" },
  { slug: "engineering", label: "Engineering" },
  { slug: "healthcare", label: "Healthcare" },
  { slug: "education-training", label: "Education" },
  { slug: "marketing-communications", label: "Marketing" },
  { slug: "human-resources", label: "Human Resources" },
  { slug: "government-public-sector", label: "Government" },
  { slug: "ngos", label: "NGO & Nonprofit" },
  { slug: "logistics-supply-chain", label: "Logistics" },
];

const JOB_TYPE_LINKS = [
  { slug: "full-time", label: "Full-Time" },
  { slug: "part-time", label: "Part-Time" },
  { slug: "contract", label: "Contract" },
  { slug: "internships", label: "Internships" },
  { slug: "remote", label: "Remote" },
  { slug: "temporary", label: "Temporary" },
];

const EXP_LEVEL_LINKS = [
  { slug: "entry-level", label: "Entry Level" },
  { slug: "mid-level", label: "Mid Level" },
  { slug: "senior", label: "Senior" },
  { slug: "manager", label: "Manager" },
  { slug: "executive", label: "Executive" },
];

function RelatedFilterLinks({ filterKey, filterValue }) {
  // Determine which sections to show based on current filter
  const showLocations = filterKey !== "isRemote";
  const showCategories = filterKey !== "category";
  const showJobTypes = filterKey !== "employmentType";
  const showExpLevels = filterKey !== "experienceLevel";

  if (!showLocations && !showCategories && !showJobTypes && !showExpLevels) return null;

  const currentBase = `/jobs/${(filterValue || "").toLowerCase()}`;

  return (
    <div className="mt-10 border-t border-gray-200 pt-8">
      <h2 className="text-lg font-bold text-gray-900 mb-5">Explore Related Jobs</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Browse by Location */}
        {showLocations && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              📍 Top Locations
            </h3>
            <ul className="space-y-1.5">
              {TOP_LOCATIONS.map((loc) => (
                <li key={loc.slug}>
                  <Link
                    href={filterKey === "category" && filterValue
                      ? `/jobs/${filterValue.toLowerCase().replace(/_/g, "-")}/${loc.slug}`
                      : `/jobs/${loc.slug}`}
                    className="text-sm text-gray-600 hover:text-purple-700 transition-colors flex items-center gap-1.5"
                  >
                    <FiMapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    {loc.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Browse by Category */}
        {showCategories && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              💼 Popular Categories
            </h3>
            <ul className="space-y-1.5">
              {TOP_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/jobs/${cat.slug}`}
                    className="text-sm text-gray-600 hover:text-purple-700 transition-colors flex items-center gap-1.5"
                  >
                    <FiBriefcase className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Browse by Job Type */}
        {showJobTypes && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              🏷️ By Job Type
            </h3>
            <ul className="space-y-1.5">
              {JOB_TYPE_LINKS.map((jt) => (
                <li key={jt.slug}>
                  <Link
                    href={`/jobs/${jt.slug}`}
                    className="text-sm text-gray-600 hover:text-purple-700 transition-colors flex items-center gap-1.5"
                  >
                    <FiClock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    {jt.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Browse by Experience Level */}
        {showExpLevels && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              📊 By Experience
            </h3>
            <ul className="space-y-1.5">
              {EXP_LEVEL_LINKS.map((el) => (
                <li key={el.slug}>
                  <Link
                    href={`/jobs/${el.slug}`}
                    className="text-sm text-gray-600 hover:text-purple-700 transition-colors flex items-center gap-1.5"
                  >
                    <FiStar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    {el.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

const PER_PAGE = 20;

const EMPLOYMENT_TYPES = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "TEMPORARY", label: "Temporary" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "VOLUNTEER", label: "Volunteer" },
];

const EXPERIENCE_LEVELS = [
  { value: "ENTRY_LEVEL", label: "Entry Level" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "MID_LEVEL", label: "Mid Level" },
  { value: "SENIOR", label: "Senior" },
  { value: "LEAD", label: "Lead" },
  { value: "MANAGER", label: "Manager" },
  { value: "DIRECTOR", label: "Director" },
  { value: "EXECUTIVE", label: "Executive" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "trending", label: "Most Viewed" },
  { value: "deadline", label: "Closing Soon" },
  { value: "salary", label: "Highest Salary" },
];

function buildOrderBy(sort) {
  switch (sort) {
    case "trending":
      return [{ isFeatured: "desc" }, { viewCount: "desc" }, { createdAt: "desc" }];
    case "deadline":
      return { applicationDeadline: "asc" };
    case "salary":
      return { salaryMin: "desc" };
    default:
      return { publishedAt: "desc" };
  }
}

function buildBaseFilters(q) {
  const base = [
    { isActive: true },
    { status: "PUBLISHED" },
    {
      OR: [
        { applicationDeadline: null },
        { applicationDeadline: { gte: new Date() } },
      ],
    },
  ];
  if (q) {
    base.push({
      OR: [
        { title: { contains: q } },
        { description: { contains: q } },
      ],
    });
  }
  return base;
}

function buildWhere(config, searchParams) {
  const q = searchParams.q || null;
  const location = searchParams.location || null;
  const employmentType = searchParams.employmentType || null;
  const experienceLevel = searchParams.experienceLevel || null;

  const baseFilters = buildBaseFilters(q);

  if (config.filterKey === "category") {
    const categoryValue = config.filterValue;
    const fallbackKeywords = categoryValue.split("_").map((w) => w.toLowerCase());

    const andConditions = [
      ...baseFilters,
      {
        categories: {
          path: "$",
          array_contains: categoryValue,
        },
      },
    ];

    if (location) {
      andConditions.push({
        OR: [
          { county: { contains: location } },
          { town: { contains: location } },
        ],
      });
    }
    if (employmentType) {
      andConditions.push({ employmentType });
    }
    if (experienceLevel) {
      andConditions.push({ experienceLevel });
    }

    const whereCategories = { AND: andConditions };

    const whereFallback = {
      AND: [
        ...baseFilters,
        {
          OR: [
            ...fallbackKeywords.map((kw) => ({ title: { contains: kw } })),
            ...fallbackKeywords.map((kw) => ({ description: { contains: kw } })),
          ],
        },
      ],
    };

    return { whereCategories, whereFallback };
  }

  const fieldFilter = config.filterKey === "isRemote"
    ? { [config.filterKey]: true }
    : { [config.filterKey]: config.filterValue };

  const where = {
    AND: [...baseFilters, fieldFilter],
  };

  if (location) {
    where.AND.push({
      OR: [
        { county: { contains: location } },
        { town: { contains: location } },
      ],
    });
  }
  if (employmentType && config.filterKey !== "employmentType") {
    where.AND.push({ employmentType });
  }
  if (experienceLevel && config.filterKey !== "experienceLevel") {
    where.AND.push({ experienceLevel });
  }

  return { where };
}

async function fetchJobs(config, searchParams) {
  const page = Math.max(1, parseInt(searchParams.page, 10) || 1);
  const sort = searchParams.sort || "newest";

  const orderBy = buildOrderBy(sort);
  const queryResult = buildWhere(config, searchParams);

  let jobs = [];
  let total = 0;

  if (config.filterKey === "category") {
    const { whereCategories, whereFallback } = queryResult;

    try {
      const result = await Promise.all([
        db.job.findMany({
          where: whereCategories,
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
        db.job.count({ where: whereCategories }),
      ]);
      jobs = result[0];
      total = result[1];
    } catch {
      try {
        const result = await Promise.all([
          db.job.findMany({
            where: whereFallback,
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
          db.job.count({ where: whereFallback }),
        ]);
        jobs = result[0];
        total = result[1];
      } catch {
        // Both failed — return empty
      }
    }
  } else {
    const { where } = queryResult;
    const [fetchedJobs, count] = await Promise.all([
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
    jobs = fetchedJobs;
    total = count;
  }

  return { jobs, total, page, totalPages: Math.ceil(total / PER_PAGE) };
}

function buildUrl(pagePath, params, overrides = {}) {
  const p = { ...params, ...overrides };
  const qs = new URLSearchParams(p).toString();
  return `${pagePath}${qs ? `?${qs}` : ""}`;
}

function pluralize(word, count) {
  return count === 1 ? word : `${word}s`;
}

export function createJobFilterMetadata(config) {
  return async function generateMetadata({ searchParams }) {
    const params = await searchParams;
    const q = params.q || "";
    const title = q
      ? `${config.breadcrumbName} Jobs in Kenya — "${q}"`
      : config.pageTitle;
    const description = q
      ? `Search ${config.breadcrumbName.toLowerCase()} job results for "${q}" in Kenya. Apply for the latest positions on ${siteConfig.companyName}.`
      : `Browse the latest ${config.breadcrumbName.toLowerCase()} jobs in Kenya. Updated daily. Apply now on ${siteConfig.companyName}.`;

    const pathParams = new URLSearchParams();
    if (q) pathParams.set("q", q);
    const pathString = pathParams.toString();
    const path = `${config.pagePath}${pathString ? `?${pathString}` : ""}`;

    return generateMeta({ title, description, path });
  };
}

export default async function JobFilterView({ searchParams, ...config }) {
  const params = await searchParams;
  const { jobs, total, page, totalPages } = await fetchJobs(config, params);

  const q = params.q || "";
  const sort = params.sort || "newest";
  const location = params.location || "";
  const employmentType = params.employmentType || "";
  const experienceLevel = params.experienceLevel || "";

  const showEmploymentTypeFilter = config.filterKey !== "employmentType";
  const showExperienceLevelFilter = config.filterKey !== "experienceLevel";

  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Jobs", href: "/jobs" },
    { name: config.breadcrumbName, href: config.pagePath },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbItems);

  const vacancyLabel = config.filterKey === "isRemote"
    ? "remote job"
    : config.filterKey === "category"
      ? "vacancy"
      : "job";

  const hasAnyFilter = !!(q || location || employmentType || experienceLevel);

  return (
    <main className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ═══ Compact Header ═══ */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 pt-6 pb-6">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-400 mb-4 flex flex-wrap items-center gap-1">
            {breadcrumbItems.map((item, i) => (
              <span key={item.href + item.name}>
                {i > 0 && <span className="text-gray-300 mx-1.5">/</span>}
                {i === breadcrumbItems.length - 1 ? (
                  <span className="text-gray-700 font-medium">{item.name}</span>
                ) : (
                  <Link href={item.href} className="hover:text-gray-700 transition-colors">
                    {item.name}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          {/* Title + Count */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">{config.pageTitle}</h1>
            <span className="text-sm text-gray-500">
              {total.toLocaleString()} {pluralize(vacancyLabel, total)} available
            </span>
          </div>

          {/* Search Bar */}
          <form action={config.pagePath} method="GET" className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder={config.searchPlaceholder || `Search ${config.breadcrumbName.toLowerCase()} jobs...`}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all"
              />
            </div>
            <div className="relative sm:w-40">
              <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                name="location"
                defaultValue={location}
                placeholder="Location..."
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all"
              />
            </div>
            <button
              type="submit"
              className="bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <FiSearch className="w-4 h-4" />
              Search
            </button>
          </form>

          {/* Active filter badges */}
          {hasAnyFilter && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {q && (
                <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-100">
                  &quot;{q}&quot;
                  <Link href={buildUrl(config.pagePath, params, { q: undefined })} className="hover:text-purple-900 ml-0.5">
                    <FiX className="w-3 h-3" />
                  </Link>
                </span>
              )}
              {location && (
                <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-100">
                  📍 {location}
                  <Link href={buildUrl(config.pagePath, params, { location: undefined })} className="hover:text-purple-900 ml-0.5">
                    <FiX className="w-3 h-3" />
                  </Link>
                </span>
              )}
              {showEmploymentTypeFilter && employmentType && (
                <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-100">
                  {formatJobType(employmentType)}
                  <Link href={buildUrl(config.pagePath, params, { employmentType: undefined })} className="hover:text-purple-900 ml-0.5">
                    <FiX className="w-3 h-3" />
                  </Link>
                </span>
              )}
              {showExperienceLevelFilter && experienceLevel && (
                <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-100">
                  {formatExperienceLevel(experienceLevel)}
                  <Link href={buildUrl(config.pagePath, params, { experienceLevel: undefined })} className="hover:text-purple-900 ml-0.5">
                    <FiX className="w-3 h-3" />
                  </Link>
                </span>
              )}
              <Link href={config.pagePath} className="text-xs text-gray-400 hover:text-gray-600 transition-colors ml-1">
                Clear all
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ═══ Main Content ═══ */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ═══ LEFT SIDEBAR — Filters (toggleable + mobile drawer) ═══ */}
          <aside className="lg:w-64 flex-shrink-0">
            <FilterSidebarWrapper>
            <div className="space-y-5">

              {/* Filter Header */}
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <FiFilter className="w-4 h-4 text-purple-600" />
                  Filters
                </h2>
                {hasAnyFilter && (
                  <Link
                    href={config.pagePath}
                    className="text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1 transition-colors"
                  >
                    <FiX className="w-3 h-3" />
                    Reset
                  </Link>
                )}
              </div>

              {/* Sort */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Sort By</h3>
                <div className="space-y-1">
                  {SORT_OPTIONS.map((opt) => (
                    <Link
                      key={opt.value}
                      href={buildUrl(config.pagePath, params, { sort: opt.value, page: undefined })}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${sort === opt.value ? "bg-purple-50 text-purple-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      <span>{opt.label}</span>
                      {sort === opt.value && <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Employment Type */}
              {showEmploymentTypeFilter && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Job Type</h3>
                  <div className="space-y-1">
                    <Link
                      href={buildUrl(config.pagePath, params, { employmentType: undefined })}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${!employmentType ? "bg-purple-50 text-purple-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      All Types
                    </Link>
                    {EMPLOYMENT_TYPES.map((t) => (
                      <Link
                        key={t.value}
                        href={buildUrl(config.pagePath, params, { employmentType: t.value })}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${employmentType === t.value ? "bg-purple-50 text-purple-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                      >
                        <span>{t.label}</span>
                        {employmentType === t.value && <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience Level */}
              {showExperienceLevelFilter && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Experience Level</h3>
                  <div className="space-y-1">
                    <Link
                      href={buildUrl(config.pagePath, params, { experienceLevel: undefined })}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${!experienceLevel ? "bg-purple-50 text-purple-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      All Levels
                    </Link>
                    {EXPERIENCE_LEVELS.map((lvl) => (
                      <Link
                        key={lvl.value}
                        href={buildUrl(config.pagePath, params, { experienceLevel: lvl.value })}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${experienceLevel === lvl.value ? "bg-purple-50 text-purple-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                      >
                        <span>{lvl.label}</span>
                        {experienceLevel === lvl.value && <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Ad */}
              <AdPlaceholder height="250px" />

              {/* CTA */}
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
            </FilterSidebarWrapper>
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
              <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
                <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <FiSearch className="w-8 h-8 text-gray-300" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{config.emptyTitle || `No ${config.breadcrumbName.toLowerCase()} jobs found`}</h2>
                <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                  {config.emptyDescription || "No positions match your search. Check back soon — new positions are posted regularly."}
                </p>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors shadow-lg shadow-purple-500/25"
                >
                  Browse All Jobs
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
                                <OptimizedImage src={company.logo} alt={company.name} width={48} height={48} className="w-12 h-12 rounded-xl object-cover" />
                              ) : (
                                <span className="text-base">{initials}</span>
                              )}
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 min-w-0">
                              {/* Title + Featured */}
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

                              {/* Tags */}
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

                          {/* Mobile: Salary + Time row */}
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
                    {page > 1 ? (
                      <Link
                        href={buildUrl(config.pagePath, params, { page: String(page - 1) })}
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

                    <div className="hidden sm:flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                        .reduce((acc, p, i, arr) => {
                          if (i > 0 && p - arr[i - 1] > 1) acc.push("ellipsis");
                          acc.push(p);
                          return acc;
                        }, [])
                        .map((item) =>
                          item === "ellipsis" ? (
                            <span key={`ellipsis-${item}`} className="px-2 text-gray-400 text-sm">...</span>
                          ) : item === page ? (
                            <span key={item} className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl text-sm shadow-lg shadow-purple-500/25">
                              {item}
                            </span>
                          ) : (
                            <Link
                              key={item}
                              href={buildUrl(config.pagePath, params, { page: String(item) })}
                              className="inline-flex items-center justify-center w-10 h-10 bg-white border border-gray-200 text-gray-600 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 font-medium rounded-xl text-sm transition-all"
                            >
                              {item}
                            </Link>
                          )
                        )}
                    </div>

                    <span className="sm:hidden text-sm text-gray-500 font-medium px-3">
                      Page {page} of {totalPages}
                    </span>

                    {page < totalPages ? (
                      <Link
                        href={buildUrl(config.pagePath, params, { page: String(page + 1) })}
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

          {/* ═══ INTERNAL LINKING — Related Filter Pages ═══ */}
          <RelatedFilterLinks filterKey={config.filterKey} filterValue={config.filterValue} />

          {/* ═══ RIGHT SIDEBAR — CTAs (xl only) ═══ */}
          <aside className="hidden xl:block w-64 flex-shrink-0">
            <div className="space-y-5">
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
                  <p className="text-gray-400 text-xs mt-2.5">From KSh 500</p>
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
