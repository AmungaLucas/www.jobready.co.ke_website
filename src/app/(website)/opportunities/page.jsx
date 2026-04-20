export const revalidate = 120;

import Link from "next/link";
import { db } from "@/lib/db";
import { cache } from "react";
import { formatDate, formatRelativeDate } from "@/lib/format";
import { getInitials } from "@/lib/normalize";
import {
  generateMeta,
  generateCollectionPageJsonLd,
  generateItemListJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/seo";
import OptimizedImage, { AvatarImage } from "@/components/OptimizedImage";
import AdPlaceholder from "../_components/AdPlaceholder";
import { siteConfig } from "@/config/site-config";
import { FiSearch, FiClock, FiChevronLeft, FiChevronRight, FiStar, FiMessageCircle } from "react-icons/fi";

const getPublishedOpportunityCount = cache(async () => {
  try {
    return await db.opportunity.count({
      where: { status: "PUBLISHED", isActive: true },
    });
  } catch {
    return 0;
  }
});

// ─── Constants ──────────────────────────────────────────

const OPP_TYPE_DISPLAY = {
  INTERNSHIP: "Internship",
  SPONSORSHIP: "Sponsorship",
  BURSARY: "Bursary",
  UNIVERSITY_ADMISSION: "University Admission",
  BOOTCAMP: "Bootcamp",
  MENTORSHIP: "Mentorship",
  SCHOLARSHIP: "Scholarship",
  CERTIFICATION: "Certification",
  FUNDING: "Funding",
  GRANT: "Grant",
  FELLOWSHIP: "Fellowship",
  COMPETITION: "Competition",
  CONFERENCE: "Conference",
  VOLUNTEER: "Volunteer",
  APPRENTICESHIP: "Apprenticeship",
};

const OPP_TYPE_COLORS = {
  INTERNSHIP: { bg: "bg-blue-100", text: "text-blue-800", activeBg: "bg-blue-600", activeText: "text-white" },
  SPONSORSHIP: { bg: "bg-green-100", text: "text-green-800", activeBg: "bg-green-600", activeText: "text-white" },
  BURSARY: { bg: "bg-emerald-100", text: "text-emerald-800", activeBg: "bg-emerald-600", activeText: "text-white" },
  UNIVERSITY_ADMISSION: { bg: "bg-purple-100", text: "text-purple-800", activeBg: "bg-purple-600", activeText: "text-white" },
  BOOTCAMP: { bg: "bg-orange-100", text: "text-orange-800", activeBg: "bg-orange-600", activeText: "text-white" },
  MENTORSHIP: { bg: "bg-pink-100", text: "text-pink-800", activeBg: "bg-pink-600", activeText: "text-white" },
  SCHOLARSHIP: { bg: "bg-indigo-100", text: "text-indigo-800", activeBg: "bg-indigo-600", activeText: "text-white" },
  CERTIFICATION: { bg: "bg-cyan-100", text: "text-cyan-800", activeBg: "bg-cyan-600", activeText: "text-white" },
  FUNDING: { bg: "bg-amber-100", text: "text-amber-800", activeBg: "bg-amber-600", activeText: "text-white" },
  GRANT: { bg: "bg-teal-100", text: "text-teal-800", activeBg: "bg-teal-600", activeText: "text-white" },
  FELLOWSHIP: { bg: "bg-violet-100", text: "text-violet-800", activeBg: "bg-violet-600", activeText: "text-white" },
  COMPETITION: { bg: "bg-red-100", text: "text-red-800", activeBg: "bg-red-600", activeText: "text-white" },
  CONFERENCE: { bg: "bg-sky-100", text: "text-sky-800", activeBg: "bg-sky-600", activeText: "text-white" },
  VOLUNTEER: { bg: "bg-lime-100", text: "text-lime-800", activeBg: "bg-lime-600", activeText: "text-white" },
  APPRENTICESHIP: { bg: "bg-fuchsia-100", text: "text-fuchsia-800", activeBg: "bg-fuchsia-600", activeText: "text-white" },
};

const ALL_TYPES = Object.keys(OPP_TYPE_DISPLAY);

const PER_PAGE = 20;

// ─── Helpers ────────────────────────────────────────────

function getDeadlineCountdown(deadline) {
  if (!deadline) return null;
  const now = new Date();
  const dl = new Date(deadline);
  const diffMs = dl.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Closed";
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "1 day left";
  if (diffDays <= 7) return `${diffDays} days left`;
  if (diffDays <= 30) return `${Math.floor(diffDays / 7)}w left`;
  return formatDate(deadline);
}

function buildWhereClause(searchParams) {
  const q = (searchParams.q || "").trim();
  const type = (searchParams.type || "").trim().toUpperCase();

  // Don't show expired opportunities (deadline passed)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const conditions = [
    { status: "PUBLISHED" },
    { isActive: true },
    { publishedAt: { not: null } },
    { OR: [{ deadline: null }, { deadline: { gte: today } }] },
  ];

  if (type && ALL_TYPES.includes(type)) {
    conditions.push({ opportunityType: type });
  }

  if (q) {
    conditions.push({
      OR: [
        { title: { contains: q } },
        { excerpt: { contains: q } },
        { description: { contains: q } },
      ],
    });
  }

  return { AND: conditions };
}

function buildOrderBy(sort) {
  switch (sort) {
    case "deadline":
      return [{ deadline: "asc" }, { publishedAt: "desc" }];
    case "trending":
      return [{ viewCount: "desc" }, { publishedAt: "desc" }];
    case "newest":
    default:
      return [{ publishedAt: "desc" }, { createdAt: "desc" }];
  }
}

// ─── Metadata ───────────────────────────────────────────
export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const q = (sp.q || "").trim();
  const type = (sp.type || "").trim().toUpperCase();
  const currentPage = Math.max(1, parseInt(sp.page, 10) || 1);

  const where = buildWhereClause(sp);

  let title = "Scholarships, Grants & Fellowships in Kenya";
  let description = `Browse 60+ scholarships, grants, fellowships, and career opportunities in Kenya. Updated daily. Apply now on ${siteConfig.companyName}.`;

  if (type && OPP_TYPE_DISPLAY[type]) {
    const typeDisplay = OPP_TYPE_DISPLAY[type];
    title = `${typeDisplay} Opportunities`;
    description = `Find the latest ${typeDisplay.toLowerCase()} opportunities in Kenya. Apply now on ${siteConfig.companyName}.`;
  }

  if (q) {
    title = q ? `${q} — Opportunities` : title;
    description = `Search results for "${q}" in opportunities. ${description}`;
  }

  if (currentPage > 1) title = `${title} — Page ${currentPage}`;

  const basePath = type ? `/opportunities?type=${type.toLowerCase()}` : "/opportunities";

  // Build prev/next pagination links
  let totalPages = 1;
  try {
    const total = await db.opportunity.count({
      where: { isActive: true, status: "PUBLISHED", publishedAt: { not: null } },
    });
    totalPages = Math.ceil(total / PER_PAGE);
  } catch {}

  const alternates = { canonical: currentPage === 1 ? basePath : `${basePath}&page=${currentPage}` };
  if (currentPage > 1) {
    alternates.prev = currentPage === 2 ? basePath : `${basePath}&page=${currentPage - 1}`;
  }
  if (currentPage < totalPages) {
    alternates.next = `${basePath}&page=${currentPage + 1}`;
  }

  return {
    ...generateMeta({
      title,
      description,
      path: currentPage === 1 ? basePath : `${basePath}&page=${currentPage}`,
      noindex: currentPage > 20,
    }),
    alternates,
  };
}

// ─── Data Fetching ──────────────────────────────────────
async function getOpportunities(searchParams) {
  const sp = searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10));
  const sort = sp.sort || "newest";

  const where = buildWhereClause(sp);
  const orderBy = buildOrderBy(sort);

  const [opportunities, total] = await Promise.all([
    db.opportunity.findMany({
      where,
      orderBy,
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            logoColor: true,
          },
        },
      },
    }),
    getPublishedOpportunityCount(),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  return { opportunities, total, page, totalPages, sort };
}

// ─── Page Component ─────────────────────────────────────
export default async function OpportunitiesPage({ searchParams }) {
  const sp = await searchParams;
  const q = (sp.q || "").trim() || "";
  const activeType = (sp.type || "").trim().toUpperCase() || "";
  const sort = sp.sort || "newest";

  const { opportunities, total, page, totalPages } = await getOpportunities(sp);

  const activeTypeDisplay = activeType ? (OPP_TYPE_DISPLAY[activeType] || "") : "";

  // JSON-LD
  const collectionName = activeTypeDisplay
    ? `${activeTypeDisplay} Opportunities`
    : "All Opportunities";

  const collectionJsonLd = generateCollectionPageJsonLd({
    name: collectionName,
    description: `Browse scholarships, grants, internships, fellowships and more on ${siteConfig.companyName}.`,
    url: "/opportunities",
    totalItems: total,
  });

  const breadcrumbItems = [{ name: "Home", href: "/" }];
  breadcrumbItems.push({ name: "Opportunities", href: "/opportunities" });
  if (activeTypeDisplay) {
    breadcrumbItems.push({ name: activeTypeDisplay, href: `/opportunities?type=${activeType.toLowerCase()}` });
  }

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbItems);

  const itemListJsonLd = generateItemListJsonLd({
    name: collectionName,
    url: "/opportunities",
    totalItems: total,
    items: opportunities.map((opp, i) => ({
      position: i + 1,
      name: opp.title,
      url: `/opportunities/${opp.slug}`,
    })),
  });

  // Build query string helper
  function buildQueryString(overrides = {}) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (activeType) params.set("type", activeType.toLowerCase());
    if (overrides.sort && overrides.sort !== "newest") params.set("sort", overrides.sort);
    else if (sort !== "newest" && !overrides.sort) params.set("sort", sort);
    if (overrides.type) params.set("type", overrides.type);
    if (overrides.page && overrides.page > 1) params.set("page", overrides.page.toString());
    const qs = params.toString();
    return qs ? `/opportunities?${qs}` : "/opportunities";
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* ═══ Breadcrumb ═══ */}
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

        {/* ═══ Page Header ═══ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {activeTypeDisplay ? `${activeTypeDisplay} Opportunities` : "Opportunities"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {total.toLocaleString()} {total === 1 ? "opportunity" : "opportunities"} available
              {q && (
                <span>
                  {" "}for &ldquo;<span className="font-medium text-gray-700">{q}</span>&rdquo;
                </span>
              )}
            </p>
          </div>

          {/* Search */}
          <form
            action="/opportunities"
            method="get"
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            {activeType && <input type="hidden" name="type" value={activeType.toLowerCase()} />}
            <div className="relative flex-1 sm:flex-initial">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search opportunities..."
                className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
            </div>
          </form>
        </div>

        {/* ═══ Type Filter Tabs ═══ */}
        <div className="mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {/* All tab */}
            <Link
              href={buildQueryString({ type: null })}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors no-underline ${
                !activeType
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200"
              }`}
            >
              All
            </Link>
            {ALL_TYPES.map((type) => {
              const colors = OPP_TYPE_COLORS[type] || {};
              const isActive = activeType === type;
              return (
                <Link
                  key={type}
                  href={buildQueryString({ type: type.toLowerCase(), page: 1 })}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors no-underline ${
                    isActive
                      ? `${colors.activeBg} ${colors.activeText} shadow-sm`
                      : `${colors.bg} ${colors.text} hover:opacity-80`
                  }`}
                >
                  {OPP_TYPE_DISPLAY[type]}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ═══ Sort Bar ═══ */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            Showing {(page - 1) * PER_PAGE + 1}&ndash;{Math.min(page * PER_PAGE, total)} of {total.toLocaleString()}
          </p>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400 mr-1">Sort:</span>
            {[
              { value: "newest", label: "Newest" },
              { value: "deadline", label: "Deadline" },
              { value: "trending", label: "Trending" },
            ].map((s) => (
              <Link
                key={s.value}
                href={buildQueryString({ sort: s.value, page: 1 })}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors no-underline ${
                  sort === s.value
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ═══ Content Grid ═══ */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ─── Left: Opportunities Grid ─── */}
          <div className="flex-1 min-w-0">
            {opportunities.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h2 className="text-lg font-semibold text-gray-700 mb-1">No opportunities found</h2>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  {q
                    ? `We couldn't find any opportunities matching "${q}". Try different keywords or clear your filters.`
                    : "No opportunities are currently listed in this category. Check back soon!"}
                </p>
                <Link
                  href="/opportunities"
                  className="inline-block mt-4 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                >
                  Browse all opportunities
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {opportunities.map((opp) => {
                  const typeDisplay = OPP_TYPE_DISPLAY[opp.opportunityType] || opp.opportunityType?.replace(/_/g, " ") || "Opportunity";
                  const typeColor = OPP_TYPE_COLORS[opp.opportunityType] || { bg: "bg-gray-100", text: "text-gray-700" };
                  const countdown = getDeadlineCountdown(opp.deadline);

                  return (
                    <Link
                      key={opp.id}
                      href={`/opportunities/${opp.slug}`}
                      className="block bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-purple-200 transition-all group no-underline"
                    >
                      {/* Top: badges */}
                      <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                        <span className={`${typeColor.bg} ${typeColor.text} text-xs font-semibold px-2.5 py-0.5 rounded-full`}>
                          {typeDisplay}
                        </span>
                        {opp.isFeatured && (
                          <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-0.5">
                            <FiStar className="w-3 h-3" /> Featured
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-gray-900 text-base leading-snug group-hover:text-purple-700 transition-colors line-clamp-2 mb-1.5">
                        {opp.title}
                      </h3>

                      {/* Company */}
                      {opp.company && (
                        <div className="flex items-center gap-2 mb-2">
                          <AvatarImage
                            src={opp.company.logo}
                            name={opp.company.name}
                            color={opp.company.logoColor || "#7c3aed"}
                            size="xs"
                          />
                          <span className="text-sm text-gray-600 font-medium truncate">{opp.company.name}</span>
                        </div>
                      )}

                      {/* Excerpt */}
                      {opp.excerpt && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                          {opp.excerpt}
                        </p>
                      )}

                      {/* Bottom: deadline + meta */}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <FiClock className="w-3.5 h-3.5" />
                          <span>
                            {countdown === "Closed" ? (
                              <span className="text-red-500 font-medium">Closed</span>
                            ) : countdown === "Due today" ? (
                              <span className="text-orange-500 font-medium">Due today</span>
                            ) : (
                              countdown
                            )}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {formatRelativeDate(opp.publishedAt || opp.createdAt)}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* ─── Pagination ─── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Link
                  href={page > 1 ? buildQueryString({ page: page - 1 }) : "#"}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg border text-sm font-medium transition-colors no-underline ${
                    page <= 1
                      ? "border-gray-200 text-gray-300 cursor-not-allowed pointer-events-none"
                      : "border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  }`}
                  aria-disabled={page <= 1}
                >
                  <FiChevronLeft className="w-4 h-4" />
                  Previous
                </Link>

                {/* Page numbers */}
                <div className="hidden sm:flex items-center gap-1">
                  {generatePageNumbers(page, totalPages).map((p, i) =>
                    p === "..." ? (
                      <span key={`dots-${i}`} className="px-2 text-gray-400 text-sm">
                        ...
                      </span>
                    ) : (
                      <Link
                        key={p}
                        href={buildQueryString({ page: p })}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors no-underline ${
                          page === p
                            ? "bg-purple-600 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {p}
                      </Link>
                    )
                  )}
                </div>
                <span className="sm:hidden text-sm text-gray-500 px-2">
                  Page {page} of {totalPages}
                </span>

                <Link
                  href={page < totalPages ? buildQueryString({ page: page + 1 }) : "#"}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg border text-sm font-medium transition-colors no-underline ${
                    page >= totalPages
                      ? "border-gray-200 text-gray-300 cursor-not-allowed pointer-events-none"
                      : "border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  }`}
                  aria-disabled={page >= totalPages}
                >
                  Next
                  <FiChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* ─── Right Sidebar ─── */}
          <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
            <AdPlaceholder height="250px" />

            {/* Free CV Review CTA */}
            <div className="bg-gradient-to-br from-purple-600 to-teal-500 rounded-xl p-6 text-white text-center">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMessageCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Free CV Review</h3>
              <p className="text-sm text-purple-100 leading-relaxed mb-4">
                Get expert feedback on your CV. Our career coaches will review it for free and help you land more interviews.
              </p>
              <a
                href={siteConfig.whatsapp.links.freeCvReview}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-purple-700 font-semibold px-6 py-2.5 rounded-lg hover:bg-purple-50 transition-colors text-sm no-underline"
              >
                Get Free Review
              </a>
            </div>

            <AdPlaceholder height="200px" label="Sponsored" />
          </aside>
        </div>
      </div>
    </main>
  );
}

// ─── Pagination Helpers ─────────────────────────────────
function generatePageNumbers(current, totalPages) {
  const pages = [];
  const delta = 2;

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }

  pages.push(1);

  const rangeStart = Math.max(2, current - delta);
  const rangeEnd = Math.min(totalPages - 1, current + delta);

  if (rangeStart > 2) pages.push("...");

  for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);

  if (rangeEnd < totalPages - 1) pages.push("...");

  pages.push(totalPages);

  return pages;
}
