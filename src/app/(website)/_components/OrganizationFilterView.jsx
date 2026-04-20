import { db } from "@/lib/db";
import { generateBreadcrumbJsonLd } from "@/lib/seo";
import Link from "next/link";
import { getInitials } from "@/lib/normalize";
import AdPlaceholder from "./AdPlaceholder";
import { siteConfig } from "@/config/site-config";
import OptimizedImage from "@/components/OptimizedImage";

const PER_PAGE = 20;

/**
 * Shared server component for organization type filter pages.
 *
 * @param {Object} props
 * @param {Object} props.searchParams    - Resolved Next.js searchParams
 * @param {string} props.pageTitle       - H1 heading
 * @param {string} props.pagePath        - URL path e.g. "/organizations/ngos"
 * @param {string} props.organizationType - Company.organizationType enum value
 * @param {string} props.breadcrumbName  - Name shown in breadcrumb
 * @param {string} props.searchPlaceholder - Placeholder for the search input
 * @param {string} props.emptyTitle      - Empty state heading
 * @param {string} props.emptyDescription - Empty state description
 */
export default async function OrganizationFilterView({
  searchParams,
  pageTitle,
  pagePath,
  organizationType,
  breadcrumbName,
  searchPlaceholder,
  emptyTitle,
  emptyDescription,
}) {
  const q = searchParams.q || "";
  const page = parseInt(searchParams.page || "1", 10);
  const skip = (page - 1) * PER_PAGE;

  const where = { isActive: true, organizationType };
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { industry: { contains: q } },
      { county: { contains: q } },
    ];
  }

  const [companies, total] = await Promise.all([
    db.company.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        logoColor: true,
        industry: true,
        county: true,
        country: true,
        website: true,
        isVerified: true,
        createdAt: true,
        _count: {
          select: { jobs: { where: { status: "PUBLISHED", isActive: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: PER_PAGE,
    }),
    db.company.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  // Breadcrumbs
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Companies", href: "/organizations" },
    { name: breadcrumbName, href: pagePath },
  ];
  if (q) {
    breadcrumbs.push({
      name: q,
      href: `${pagePath}?q=${encodeURIComponent(q)}`,
    });
  }

  // JSON-LD
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);

  return (
    <main className="py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4 flex flex-wrap gap-1">
          {breadcrumbs.map((item, i) => (
            <span key={i}>
              {i > 0 && <span className="text-gray-300 mx-1">/</span>}
              {i === breadcrumbs.length - 1 ? (
                <span className="text-gray-700 font-medium">{item.name}</span>
              ) : (
                <Link href={item.href} className="hover:text-teal-600">
                  {item.name}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {pageTitle}
          </h1>
          <p className="text-gray-500 mt-1">
            {total} {breadcrumbName.toLowerCase()} in Kenya
          </p>
        </div>

        {/* Search */}
        <div className="flex flex-wrap gap-3 mb-6 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <form className="flex-1 min-w-[200px]" action={pagePath} method="get">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder={searchPlaceholder}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </form>
          {q && (
            <a
              href={pagePath}
              className="px-4 py-2 text-sm text-red-500 hover:text-red-700 self-center"
            >
              Clear
            </a>
          )}
        </div>

        {/* Grid */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          <div>
            {companies.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {companies.map((c) => (
                  <Link
                    key={c.id}
                    href={`/organizations/${c.slug}`}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-teal-200 transition-all no-underline group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold overflow-hidden shrink-0"
                        style={{
                          backgroundColor: c.logoColor || "#5B21B6",
                        }}
                      >
                        {c.logo ? (
                          <OptimizedImage
                            src={c.logo}
                            alt={`${c.name} logo`}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          getInitials(c.name)
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <h3 className="font-semibold text-gray-900 text-sm truncate group-hover:text-teal-600">
                            {c.name}
                          </h3>
                          {c.isVerified && (
                            <span className="text-teal-500 text-xs">✓</span>
                          )}
                        </div>
                        {c.industry && (
                          <p className="text-xs text-gray-500">{c.industry}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>
                        {[c.county, c.country].filter(Boolean).join(", ")}
                      </span>
                      <span className="font-medium text-teal-600">
                        {c._count.jobs} job
                        {c._count.jobs !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg mb-2">{emptyTitle}</p>
                <p className="text-gray-400 text-sm mb-4">
                  {emptyDescription}
                </p>
                <Link
                  href="/organizations"
                  className="text-sm text-teal-600 hover:underline"
                >
                  View all companies
                </Link>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {page > 1 && (
                  <a
                    href={`${pagePath}?page=${page - 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-100"
                  >
                    Previous
                  </a>
                )}
                {Array.from(
                  { length: Math.min(totalPages, 5) },
                  (_, i) => i + 1,
                ).map((p) => (
                  <a
                    key={p}
                    href={`${pagePath}?page=${p}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      p === page
                        ? "bg-teal-600 text-white"
                        : "border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </a>
                ))}
                {page < totalPages && (
                  <a
                    href={`${pagePath}?page=${page + 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-100"
                  >
                    Next
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <AdPlaceholder height="250px" />
            <div className="bg-gradient-to-r from-purple-50 to-teal-50 p-5 rounded-xl border border-teal-200 text-center">
              <h3 className="font-bold text-gray-900 mb-2">
                Are You an Employer?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Post jobs and find top talent on Kenya&apos;s #1 job board.
              </p>
              <a
                href={siteConfig.whatsapp.links.employer}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
              >
                Get Started →
              </a>
            </div>
            <AdPlaceholder height="200px" label="Sponsored" />
          </aside>
        </div>
      </div>
    </main>
  );
}
