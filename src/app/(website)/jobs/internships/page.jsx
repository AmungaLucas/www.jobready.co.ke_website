import { db } from "@/lib/db";
import { formatDate, formatCurrency, formatJobType, formatExperienceLevel, formatRelativeDate } from "@/lib/format";
import { formatLocation, getInitials } from "@/lib/normalize";
import { generateMeta, generateBreadcrumbJsonLd } from "@/lib/seo";
import Link from "next/link";
import OptimizedImage, { AvatarImage } from "@/components/OptimizedImage";
import AdPlaceholder from "../../_components/AdPlaceholder";
import { siteConfig } from "@/config/site-config";
import { FiSearch, FiMapPin, FiClock, FiBriefcase, FiChevronLeft, FiChevronRight, FiTrendingUp, FiStar, FiDollarSign, FiCalendar, FiFilter, FiX } from "react-icons/fi";

export const dynamic = "force-dynamic";

const PER_PAGE = 20;
const PAGE_TITLE = "Internships in Kenya";
const PAGE_PATH = "/jobs/internships";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "trending", label: "Most Viewed" },
  { value: "deadline", label: "Closing Soon" },
  { value: "salary", label: "Highest Salary" },
];

function buildWhere(q) {
  const where = {
    AND: [
      { isActive: true },
      { status: "PUBLISHED" },
      { employmentType: "INTERNSHIP" },
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
    default:
      return { publishedAt: "desc" };
  }
}

async function fetchJobs(searchParams) {
  const q = searchParams.q || null;
  const page = Math.max(1, parseInt(searchParams.page, 10) || 1);
  const sort = searchParams.sort || "newest";

  const where = buildWhere(q);
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

function buildUrl(params, overrides = {}) {
  const p = { ...params, ...overrides };
  const qs = new URLSearchParams(p).toString();
  return `${PAGE_PATH}${qs ? `?${qs}` : ""}`;
}

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const q = params.q || "";
  const title = q ? `Internships in Kenya — "${q}"` : PAGE_TITLE;
  const description = q
    ? `Search internship results for "${q}" in Kenya. Apply for the latest internship positions on JobReady Kenya.`
    : "Browse the latest internship opportunities in Kenya. Gain hands-on experience at top companies. Apply now on JobReady Kenya.";

  const pathParams = new URLSearchParams();
  if (q) pathParams.set("q", q);
  const pathString = pathParams.toString();
  const path = `${PAGE_PATH}${pathString ? `?${pathString}` : ""}`;

  return generateMeta({ title, description, path });
}

export default async function InternshipsPage({ searchParams }) {
  const params = await searchParams;
  const { jobs, total, page, totalPages } = await fetchJobs(params);

  const q = params.q || "";
  const sort = params.sort || "newest";

  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Jobs", href: "/jobs" },
    { name: PAGE_TITLE, href: PAGE_PATH },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbItems);

  return (
    <main className="py-8 md:py-12 bg-gray-50 min-h-screen">
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
                <span className="text-gray-700 font-medium">{item.name}</span>
              ) : (
                <Link href={item.href} className="hover:text-teal-600 transition-colors">
                  {item.name}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{PAGE_TITLE}</h1>
            <p className="text-gray-500 mt-1">
              {total} {total === 1 ? "internship" : "internships"} available
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <label htmlFor="sort-select" className="sr-only">Sort by</label>
            <select
              id="sort-select"
              value={sort}
              className="appearance-none bg-white border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <FiTrendingUp className="w-4 h-4 text-gray-400" />
            </div>
            <div className="absolute inset-0 opacity-0 pointer-events-none">
              {SORT_OPTIONS.map((opt) => (
                <a key={opt.value} href={buildUrl(params, { sort: opt.value, page: undefined })} aria-label={`Sort by ${opt.label}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <form action={PAGE_PATH} method="GET" className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search internships by title or keyword..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <FiFilter className="w-4 h-4" />
              Search
            </button>
            {q && (
              <Link
                href={PAGE_PATH}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <FiX className="w-4 h-4" />
                Clear
              </Link>
            )}
          </form>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Job Cards */}
          <div className="lg:col-span-3">
            {jobs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <FiSearch className="w-7 h-7 text-gray-400" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">No internships found</h2>
                <p className="text-gray-500 text-sm mb-6">
                  Try adjusting your search terms or check back later for new internship opportunities.
                </p>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
                >
                  Browse All Jobs
                </Link>
              </div>
            ) : (
              <>
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
                        <div className="flex items-start gap-3 mb-3">
                          <AvatarImage
                            src={company?.logo}
                            name={company?.name}
                            color={logoColor}
                            size="md"
                            rounded="lg"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-teal-600 transition-colors line-clamp-2">
                              {job.title}
                            </h3>
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
                          {job.isFeatured && (
                            <span className="flex-shrink-0 bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                              Featured
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {jobType && (
                            <span className="bg-blue-50 text-blue-700 text-[11px] font-medium px-2 py-0.5 rounded-full">{jobType}</span>
                          )}
                          {expLevel && (
                            <span className="bg-gray-100 text-gray-600 text-[11px] font-medium px-2 py-0.5 rounded-full">{expLevel}</span>
                          )}
                          {job.isRemote && (
                            <span className="bg-purple-50 text-purple-700 text-[11px] font-medium px-2 py-0.5 rounded-full">Remote</span>
                          )}
                        </div>

                        {salaryDisplay && (
                          <div className="flex items-center gap-1 text-sm text-green-700 font-medium mb-2">
                            <FiDollarSign className="w-3.5 h-3.5" />
                            <span>{salaryDisplay}</span>
                            {job.salaryPeriod && (
                              <span className="text-green-600 text-xs font-normal">/{job.salaryPeriod.toLowerCase().replace(/_/g, " ")}</span>
                            )}
                          </div>
                        )}

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

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
                    {page > 1 ? (
                      <Link
                        href={buildUrl(params, { page: String(page - 1) })}
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
                            <span key={item} className="inline-flex items-center justify-center w-9 h-9 bg-teal-600 text-white font-semibold rounded-lg text-sm">
                              {item}
                            </span>
                          ) : (
                            <Link
                              key={item}
                              href={buildUrl(params, { page: String(item) })}
                              className="inline-flex items-center justify-center w-9 h-9 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-teal-600 font-medium rounded-lg text-sm transition-colors"
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
                        href={buildUrl(params, { page: String(page + 1) })}
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

          {/* Sidebar */}
          <aside className="space-y-6">
            <AdPlaceholder height="250px" />

            <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-5 text-white shadow-md">
              <div className="text-center">
                <span className="text-3xl mb-2 block">🎓</span>
                <h3 className="font-bold text-lg mb-1">Land Your Dream Internship</h3>
                <p className="text-teal-100 text-sm mb-4 leading-relaxed">
                  A professional CV increases your chances of getting hired. Let our experts craft yours.
                </p>
                <a
                  href={siteConfig.whatsapp.links.cvService}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors text-sm w-full"
                >
                  Get Your CV Done
                </a>
                <div className="mt-2">
                  <Link href="/cv-services" className="text-teal-200 text-xs hover:underline">
                    View CV Services →
                  </Link>
                </div>
              </div>
            </div>

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
            </div>

            <AdPlaceholder height="200px" label="Sponsored" />
          </aside>
        </div>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var select = document.getElementById('sort-select');
              if (!select) return;
              select.addEventListener('change', function() {
                var val = this.value;
                var links = select.parentElement.querySelectorAll('a[aria-label]');
                links.forEach(function(link) {
                  if (link.getAttribute('aria-label') === 'Sort by ' + select.options[select.selectedIndex].text) {
                    link.click();
                  }
                });
              });
            })();
          `,
        }}
      />
    </main>
  );
}
