import { db } from "@/lib/db";
import { formatDate, formatRelativeDate } from "@/lib/format";
import { getInitials } from "@/lib/normalize";
import { generateBreadcrumbJsonLd } from "@/lib/seo";
import Link from "next/link";
import AdPlaceholder from "./AdPlaceholder";
import OptimizedImage from "@/components/OptimizedImage";
import { siteConfig } from "@/config/site-config";
import { FiSearch, FiClock, FiChevronLeft, FiChevronRight, FiStar, FiMessageCircle } from "react-icons/fi";

// ─── Constants ───────────────────────────────────────
const PER_PAGE = 20;

// ─── Helpers ─────────────────────────────────────────

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

// ─── Data Fetching ──────────────────────────────────────
async function getOpportunities(searchParams, opportunityType) {
  const sp = searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10));
  const q = ((sp.q || "") || "").trim();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const where = {
    status: "PUBLISHED",
    isActive: true,
    opportunityType,
    publishedAt: { not: null },
    OR: [
      { deadline: null },
      { deadline: { gte: today } },
    ],
  };

  if (q) {
    where.OR = [
      ...where.OR,
      { title: { contains: q } },
      { excerpt: { contains: q } },
      { description: { contains: q } },
    ];
  }

  const [opportunities, total] = await Promise.all([
    db.opportunity.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
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
    db.opportunity.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  return { opportunities, total, page, totalPages };
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

// ─── Component ─────────────────────────────────────────
export default async function OpportunityFilterView({
  searchParams,
  opportunityType,
  pageTitle,
  pagePath,
  breadcrumbName,
  slug,
  metaDescription,
  searchPlaceholder,
  emptyTitle,
  emptyDescription,
  cardBadge,
  pluralBadge,
  sidebarEmoji = "🎓",
  sidebarTitle = "Free CV Review",
  sidebarDescription = "Get expert feedback on your CV. Our career coaches will review it for free and help you land more interviews.",
}) {
  const sp = searchParams;
  const q = ((sp.q || "") || "").trim() || "";
  const { opportunities, total, page, totalPages } = await getOpportunities(sp, opportunityType);

  // JSON-LD
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Opportunities", href: "/opportunities" },
    { name: breadcrumbName, href: pagePath },
  ]);

  // Query string helper
  function buildQS(overrides = {}) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (overrides.page && overrides.page > 1) params.set("page", overrides.page.toString());
    const qs = params.toString();
    return qs ? `${pagePath}?${qs}` : pagePath;
  }

  // Plural label helper for count
  const plural = pluralBadge || `${cardBadge.toLowerCase()}s`;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* ═══ Breadcrumb ═══ */}
        <nav className="text-sm text-gray-500 mb-6 flex flex-wrap items-center gap-1">
          <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
          <span className="text-gray-300 mx-1">/</span>
          <Link href="/opportunities" className="hover:text-teal-600 transition-colors">Opportunities</Link>
          <span className="text-gray-300 mx-1">/</span>
          <span className="text-gray-700 font-medium">{breadcrumbName}</span>
        </nav>

        {/* ═══ Page Header ═══ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{pageTitle}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {total.toLocaleString()} {total === 1 ? cardBadge.toLowerCase() : plural} available
              {q && (
                <span>
                  {" "}for &ldquo;<span className="font-medium text-gray-700">{q}</span>&rdquo;
                </span>
              )}
            </p>
          </div>

          {/* Search */}
          <form action={pagePath} method="get" className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder={searchPlaceholder}
                className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
            </div>
          </form>
        </div>

        {/* ═══ Content Grid ═══ */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ─── Left: Opportunity Cards Grid ─── */}
          <div className="flex-1 min-w-0">
            {opportunities.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h2 className="text-lg font-semibold text-gray-700 mb-1">{emptyTitle}</h2>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  {q
                    ? `We couldn't find any results matching "${q}". Try different keywords or clear your search.`
                    : emptyDescription}
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
                  const countdown = getDeadlineCountdown(opp.deadline);

                  return (
                    <Link
                      key={opp.id}
                      href={`/opportunities/${opp.slug}`}
                      className="block bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-purple-200 transition-all group no-underline"
                    >
                      {/* Top: badges */}
                      <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          {cardBadge}
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
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 overflow-hidden"
                            style={{ backgroundColor: opp.company.logoColor || "#7c3aed" }}
                          >
                            {opp.company.logo ? (
                              <OptimizedImage src={opp.company.logo} alt={`${opp.company.name} logo`} fill className="object-cover" />
                            ) : (
                              getInitials(opp.company.name)
                            )}
                          </div>
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
                  href={page > 1 ? buildQS({ page: page - 1 }) : "#"}
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

                <div className="hidden sm:flex items-center gap-1">
                  {generatePageNumbers(page, totalPages).map((p, i) =>
                    p === "..." ? (
                      <span key={`dots-${i}`} className="px-2 text-gray-400 text-sm">...</span>
                    ) : (
                      <Link
                        key={p}
                        href={buildQS({ page: p })}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors no-underline ${
                          page === p ? "bg-purple-600 text-white" : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {p}
                      </Link>
                    )
                  )}
                </div>
                <span className="sm:hidden text-sm text-gray-500 px-2">Page {page} of {totalPages}</span>

                <Link
                  href={page < totalPages ? buildQS({ page: page + 1 }) : "#"}
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
              <h3 className="font-bold text-lg mb-2">{sidebarTitle}</h3>
              <p className="text-sm text-purple-100 leading-relaxed mb-4">
                {sidebarDescription}
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
