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

  // Build filter description for title
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

  return generateMeta({
    title,
    description,
    path,
  });
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
  // Remove page when filters change
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
    <main className="py-8 md:py-12 bg-gray-50 min-h-screen">
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

      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex flex-wrap items-center gap-1">
          {breadcrumbItems.map((item, i) => (
            <span key={item.href + item.name}>
              {i > 0 && <span className="text-gray-300 mx-1">/</span>}
              {i === breadcrumbItems.length - 1 ? (
                <span className="text-gray-700 font-medium truncate max-w-[250px] sm:max-w-none inline-block align-bottom">
                  {item.name}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-teal-600 transition-colors">
                  {item.name}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* ─── Page Header ─── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Jobs in Kenya
            </h1>
            <p className="text-gray-500 mt-1">
              {total} {total === 1 ? "job" : "jobs"} available
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <label htmlFor="sort-select" className="sr-only">Sort by</label>
            <select
              id="sort-select"
              value={sort}
              onChange={undefined} // Server component — uses native form GET or links below
              className="appearance-none bg-white border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <FiTrendingUp className="w-4 h-4 text-gray-400" />
            </div>
            {/* Sort links overlay for navigation */}
            <div className="absolute inset-0 opacity-0 pointer-events-none">
              {SORT_OPTIONS.map((opt) => (
                <a key={opt.value} href={sortUrl(opt.value)} aria-label={`Sort by ${opt.label}`} />
              ))}
            </div>
          </div>
        </div>

        {/* ─── Search + Filter Bar ─── */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <form action="/jobs" method="GET" className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search jobs by title or keyword..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            {/* Job Type Select */}
            <div className="relative min-w-[160px]">
              <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                name="type"
                defaultValue={type || ""}
                className="w-full appearance-none pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 cursor-pointer bg-white"
              >
                <option value="">All Job Types</option>
                {JOB_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience Level Select */}
            <div className="relative min-w-[160px]">
              <FiStar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                name="experienceLevel"
                defaultValue={experienceLevel || ""}
                className="w-full appearance-none pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 cursor-pointer bg-white"
              >
                <option value="">All Experience</option>
                {EXPERIENCE_LEVELS.map((lvl) => (
                  <option key={lvl.value} value={lvl.value}>
                    {lvl.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Input */}
            <div className="relative min-w-[160px]">
              <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="location"
                defaultValue={location}
                placeholder="Location (county/town)"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            {/* Submit + Clear */}
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <FiFilter className="w-4 h-4" />
                Filter
              </button>
              {hasActiveFilters(params) && (
                <Link
                  href="/jobs"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-1.5 whitespace-nowrap"
                >
                  <FiX className="w-4 h-4" />
                  Clear
                </Link>
              )}
            </div>
          </form>

          {/* Active filter badges */}
          {hasActiveFilters(params) && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
              {q && (
                <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-xs font-medium px-3 py-1 rounded-full">
                  Search: &quot;{q}&quot;
                  <Link href={buildFilterUrl(params, { q: null })} className="hover:text-teal-900 ml-0.5">
                    <FiX className="w-3 h-3" />
                  </Link>
                </span>
              )}
              {type && (
                <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-xs font-medium px-3 py-1 rounded-full">
                  {formatJobType(type)}
                  <Link href={buildFilterUrl(params, { type: null })} className="hover:text-teal-900 ml-0.5">
                    <FiX className="w-3 h-3" />
                  </Link>
                </span>
              )}
              {experienceLevel && (
                <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-xs font-medium px-3 py-1 rounded-full">
                  {formatExperienceLevel(experienceLevel)}
                  <Link href={buildFilterUrl(params, { experienceLevel: null })} className="hover:text-teal-900 ml-0.5">
                    <FiX className="w-3 h-3" />
                  </Link>
                </span>
              )}
              {location && (
                <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-xs font-medium px-3 py-1 rounded-full">
                  📍 {location}
                  <Link href={buildFilterUrl(params, { location: null })} className="hover:text-teal-900 ml-0.5">
                    <FiX className="w-3 h-3" />
                  </Link>
                </span>
              )}
            </div>
          )}
        </div>

        {/* ─── Sort link buttons (mobile-friendly) ─── */}
        <div className="hidden">
          {SORT_OPTIONS.map((opt) => (
            <a key={opt.value} href={sortUrl(opt.value)} data-sort={opt.value} />
          ))}
        </div>

        {/* ─── Main Content: Grid + Sidebar ─── */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* ═══ LEFT COLUMN: Job Cards (3/4) ═══ */}
          <div className="lg:col-span-3">
            {jobs.length === 0 ? (
              /* ─── Empty State ─── */
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <FiSearch className="w-7 h-7 text-gray-400" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">No jobs found</h2>
                <p className="text-gray-500 text-sm mb-6">
                  Try adjusting your filters or search terms to find more opportunities.
                </p>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
                >
                  <FiX className="w-4 h-4" />
                  Clear All Filters
                </Link>
              </div>
            ) : (
              <>
                {/* ─── Job Cards Grid ─── */}
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {jobs.map((job) => {
                    const jobLocation = formatLocation(job);
                    const jobType = formatJobType(job.employmentType);
                    const expLevel = formatExperienceLevel(job.experienceLevel);
                    const company = job.company;
                    const initials = getInitials(company?.name || "C");
                    const logoColor = company?.logoColor || "#0D9488";

                    const salaryDisplay = job.salaryMin
                      ? `${formatCurrency(job.salaryMin)}${job.salaryMax ? ` – ${formatCurrency(job.salaryMax)}` : ""}`
                      : null;

                    return (
                      <Link
                        key={job.id}
                        href={`/jobs/${job.slug}`}
                        className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col no-underline border border-transparent hover:border-teal-100"
                      >
                        {/* Company + Featured */}
                        <div className="flex items-start gap-3 mb-3">
                          {/* Company Logo / Initials */}
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                            style={{ backgroundColor: logoColor }}
                          >
                            {company?.logo ? (
                              <img
                                src={company.logo}
                                alt={company.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            ) : (
                              initials
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            {/* Job Title */}
                            <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-teal-600 transition-colors line-clamp-2">
                              {job.title}
                            </h3>

                            {/* Company Name */}
                            <div className="flex items-center gap-1 mt-0.5">
                              {company && (
                                <Link
                                  href={`/organizations/${company.slug}`}
                                 
                                  className="text-xs text-gray-500 hover:text-teal-600 transition-colors"
                                >
                                  {company.name}
                                </Link>
                              )}
                              {company?.isVerified && (
                                <span className="text-teal-500" title="Verified company">
                                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Featured Badge */}
                          {job.isFeatured && (
                            <span className="flex-shrink-0 bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                              Featured
                            </span>
                          )}
                        </div>

                        {/* Tags / Badges */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {jobType && (
                            <span className="bg-blue-50 text-blue-700 text-[11px] font-medium px-2 py-0.5 rounded-full">
                              {jobType}
                            </span>
                          )}
                          {expLevel && (
                            <span className="bg-gray-100 text-gray-600 text-[11px] font-medium px-2 py-0.5 rounded-full">
                              {expLevel}
                            </span>
                          )}
                          {job.isRemote && (
                            <span className="bg-purple-50 text-purple-700 text-[11px] font-medium px-2 py-0.5 rounded-full">
                              Remote
                            </span>
                          )}
                        </div>

                        {/* Salary */}
                        {salaryDisplay && (
                          <div className="flex items-center gap-1 text-sm text-green-700 font-medium mb-2">
                            <FiDollarSign className="w-3.5 h-3.5" />
                            <span>{salaryDisplay}</span>
                            {job.salaryPeriod && (
                              <span className="text-green-600 text-xs font-normal">
                                /{job.salaryPeriod.toLowerCase().replace(/_/g, " ")}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Footer: Location + Posted date + Deadline */}
                        <div className="mt-auto pt-3 border-t border-gray-100 flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <FiMapPin className="w-3 h-3" />
                              {jobLocation}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <FiClock className="w-3 h-3" />
                              {formatRelativeDate(job.publishedAt || job.createdAt)}
                            </span>
                          </div>
                          {job.applicationDeadline && (
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <FiCalendar className="w-3 h-3" />
                              Closes {formatDate(job.applicationDeadline)}
                            </div>
                          )}
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
                        className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-teal-600 font-medium px-4 py-2 rounded-lg text-sm transition-colors shadow-sm"
                      >
                        <FiChevronLeft className="w-4 h-4" />
                        Previous
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-100 text-gray-300 font-medium px-4 py-2 rounded-lg text-sm cursor-not-allowed">
                        <FiChevronLeft className="w-4 h-4" />
                        Previous
                      </span>
                    )}

                    {/* Page Numbers */}
                    <div className="hidden sm:flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => {
                          // Show first, last, current, and neighbors
                          if (p === 1 || p === totalPages) return true;
                          if (Math.abs(p - page) <= 2) return true;
                          return false;
                        })
                        .reduce((acc, p, i, arr) => {
                          // Add ellipsis between non-consecutive pages
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
                              className="inline-flex items-center justify-center w-9 h-9 bg-teal-600 text-white font-semibold rounded-lg text-sm"
                            >
                              {item}
                            </span>
                          ) : (
                            <Link
                              key={item}
                              href={buildFilterUrl({ ...params, page: String(item) })}
                              className="inline-flex items-center justify-center w-9 h-9 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-teal-600 font-medium rounded-lg text-sm transition-colors"
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
                        className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-teal-600 font-medium px-4 py-2 rounded-lg text-sm transition-colors shadow-sm"
                      >
                        Next
                        <FiChevronRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-100 text-gray-300 font-medium px-4 py-2 rounded-lg text-sm cursor-not-allowed">
                        Next
                        <FiChevronRight className="w-4 h-4" />
                      </span>
                    )}
                  </nav>
                )}
              </>
            )}
          </div>

          {/* ═══ RIGHT SIDEBAR (1/4) ═══ */}
          <aside className="space-y-6">
            {/* Ad */}
            <AdPlaceholder height="250px" />

            {/* Featured on JobReady CTA */}
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-5 text-white shadow-md">
              <div className="text-center">
                <span className="text-3xl mb-2 block">🚀</span>
                <h3 className="font-bold text-lg mb-1">Featured on JobReady</h3>
                <p className="text-teal-100 text-sm mb-4 leading-relaxed">
                  Get your job seen by thousands of qualified candidates. Boost visibility with a featured listing.
                </p>
                <a
                  href={siteConfig.whatsapp.links.employer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors text-sm w-full"
                >
                  Post a Job Now
                </a>
                <p className="text-teal-200 text-xs mt-3">
                  From KSh 1,000 per listing
                </p>
              </div>
            </div>

            {/* Job Type Quick Links */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-3">Browse by Type</h3>
              <div className="space-y-2">
                {JOB_TYPES.map((t) => (
                  <Link
                    key={t.value}
                    href={`/jobs?type=${t.value}`}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-teal-600 transition-colors py-1"
                  >
                    <FiBriefcase className="w-3.5 h-3.5 text-gray-400" />
                    {t.label} Jobs
                  </Link>
                ))}
                <Link
                  href="/jobs?isRemote=true"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-teal-600 transition-colors py-1"
                >
                  <FiMapPin className="w-3.5 h-3.5 text-gray-400" />
                  Remote Jobs
                </Link>
              </div>
            </div>

            {/* CV Writing CTA */}
            <div className="bg-gradient-to-r from-purple-50 to-teal-50 p-5 rounded-xl border border-teal-200 text-center shadow-md">
              <span className="text-3xl block mb-1">📝</span>
              <h3 className="font-bold text-gray-900 mb-1">Free CV Review</h3>
              <p className="text-sm text-gray-600 mb-3">
                Get expert feedback on your CV and stand out to employers.
              </p>
              <a
                href={siteConfig.whatsapp.links.freeCvReview}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-full transition-colors text-sm"
              >
                Get Free Review
              </a>
              <div className="mt-2">
                <Link href="/cv-services" className="text-xs text-purple-700 hover:underline">
                  View CV Services →
                </Link>
              </div>
            </div>

            {/* Bottom Ad */}
            <AdPlaceholder height="200px" label="Sponsored" />
          </aside>
        </div>
      </div>

      {/* ─── Sort navigation script ─── */}
      {/* Client-side sort selector — redirects via link clicks */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var select = document.getElementById('sort-select');
              if (!select) return;
              select.addEventListener('change', function() {
                var val = this.value;
                var link = document.querySelector('[data-sort="' + val + '"]');
                if (link) link.click();
              });
            })();
          `,
        }}
      />
    </main>
  );
}
