import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { generateMeta, generateBreadcrumbJsonLd } from "@/lib/seo";
import { parseOpportunityFilters, generateOppComboTitle, generateOppComboDescription } from "@/lib/filter-parser";
import { sanitizeHtml } from "@/lib/sanitize";
import { siteConfig } from "@/config/site-config";

// ─── Client Components ──────────────────────────────────
import OptimizedImage from "@/components/OptimizedImage";
import ShareStrip from "../../_components/ShareStrip";
import AdPlaceholder from "../../_components/AdPlaceholder";
import CompanyAboutCard from "../../_components/CompanyAboutCard";
import RelatedJobsCard from "../../_components/RelatedJobsCard";
import CVWritingCTA from "../../_components/CVWritingCTA";
import CVServiceStrip from "../../_components/CVServiceStrip";

const OPP_TYPE_DISPLAY = {
  INTERNSHIP: "Internship", SPONSORSHIP: "Sponsorship", BURSARY: "Bursary",
  UNIVERSITY_ADMISSION: "University Admission", BOOTCAMP: "Bootcamp",
  MENTORSHIP: "Mentorship", SCHOLARSHIP: "Scholarship", CERTIFICATION: "Certification",
  FUNDING: "Funding", GRANT: "Grant", FELLOWSHIP: "Fellowship",
  COMPETITION: "Competition", CONFERENCE: "Conference", VOLUNTEER: "Volunteer",
  APPRENTICESHIP: "Apprenticeship",
};

const OPP_TYPE_COLORS = {
  INTERNSHIP: { bg: "bg-blue-100", text: "text-blue-800" },
  SPONSORSHIP: { bg: "bg-green-100", text: "text-green-800" },
  BURSARY: { bg: "bg-emerald-100", text: "text-emerald-800" },
  UNIVERSITY_ADMISSION: { bg: "bg-purple-100", text: "text-purple-800" },
  BOOTCAMP: { bg: "bg-orange-100", text: "text-orange-800" },
  MENTORSHIP: { bg: "bg-pink-100", text: "text-pink-800" },
  SCHOLARSHIP: { bg: "bg-indigo-100", text: "text-indigo-800" },
  CERTIFICATION: { bg: "bg-cyan-100", text: "text-cyan-800" },
  FUNDING: { bg: "bg-amber-100", text: "text-amber-800" },
  GRANT: { bg: "bg-teal-100", text: "text-teal-800" },
  FELLOWSHIP: { bg: "bg-violet-100", text: "text-violet-800" },
  COMPETITION: { bg: "bg-red-100", text: "text-red-800" },
  CONFERENCE: { bg: "bg-sky-100", text: "text-sky-800" },
  VOLUNTEER: { bg: "bg-lime-100", text: "text-lime-800" },
  APPRENTICESHIP: { bg: "bg-fuchsia-100", text: "text-fuchsia-800" },
};

export const revalidate = 300;

// ════════════════════════════════════════════════════════════
// OPPORTUNITY DETAIL (unchanged)
// ════════════════════════════════════════════════════════════
async function getOpportunity(slug) {
  try {
  const opportunity = await db.opportunity.findUnique({
    where: { slug },
    include: {
      company: {
        select: {
          id: true, name: true, slug: true, logo: true, logoColor: true,
          industry: true, size: true, description: true, county: true, country: true,
        },
      },
    },
  });
  if (!opportunity) return null;

  db.opportunity.update({
    where: { id: opportunity.id },
    data: { viewCount: { increment: 1 } },
  }).catch(() => {});

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const similarOpportunities = await db.opportunity.findMany({
    where: {
      id: { not: opportunity.id },
      opportunityType: opportunity.opportunityType,
      isActive: true,
      publishedAt: { not: null, lte: now },
      OR: [{ deadline: null }, { deadline: { gte: today } }],
    },
    orderBy: { publishedAt: "desc" },
    take: 5,
    select: {
      id: true, title: true, slug: true, excerpt: true,
      opportunityType: true, deadline: true,
      company: { select: { name: true, slug: true, logo: true, logoColor: true } },
    },
  });
  return { opportunity, similarOpportunities };
  } catch (error) {
    console.error("[getOpportunity] DB error for slug:", slug, error.message);
    return null;
  }
}

// ════════════════════════════════════════════════════════════
// COMBO FILTER — fetches opportunities with combined filters
// ════════════════════════════════════════════════════════════
async function getFilteredOpportunities(filters, searchParams) {
  const where = {
    isActive: true,
    status: "PUBLISHED",
    publishedAt: { not: null },
  };

  if (filters.opportunityType) {
    where.opportunityType = filters.opportunityType;
  }

  // Location filter — search in title/description
  if (filters.county) {
    where.OR = [
      { description: { contains: filters.county } },
      { title: { contains: filters.county } },
    ];
  } else if (filters.country) {
    where.OR = [
      { description: { contains: filters.country } },
      { title: { contains: filters.country } },
      { company: { country: filters.country } },
    ];
  }

  // Keyword search
  const q = searchParams?.q;
  if (q) {
    where.AND = [
      { OR: [{ title: { contains: q } }, { description: { contains: q } }] },
    ];
  }

  const page = parseInt(searchParams?.page) || 1;
  const perPage = 12;

  const [opportunities, total] = await Promise.all([
    db.opportunity.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        company: { select: { name: true, slug: true, logo: true, logoColor: true } },
      },
    }),
    db.opportunity.count({ where }),
  ]);

  return { opportunities, total, page, perPage };
}

// ════════════════════════════════════════════════════════════
// METADATA
// ════════════════════════════════════════════════════════════
export async function generateMetadata({ params, searchParams }) {
  const { slug: segments } = await params;
  const urlPath = `/opportunities/${segments.join("/")}`;

  // Multi-segment → combo filter
  if (segments.length >= 2) {
    const parsed = parseOpportunityFilters(segments);
    if (parsed) {
      // Check if this combo has actual results
      let hasResults = true;
      try {
        const where = {
          isActive: true,
          status: "PUBLISHED",
          publishedAt: { not: null },
        };
        if (parsed.filters.opportunityType) where.opportunityType = parsed.filters.opportunityType;
        if (parsed.filters.county) {
          where.OR = [
            { description: { contains: parsed.filters.county } },
            { title: { contains: parsed.filters.county } },
          ];
        } else if (parsed.filters.country) {
          where.OR = [
            { description: { contains: parsed.filters.country } },
            { title: { contains: parsed.filters.country } },
          ];
        }

        const count = await db.opportunity.count({ where });
        hasResults = count > 0;
      } catch {
        // On error, assume results exist (safer default)
      }

      return generateMeta({
        title: generateOppComboTitle(parsed.labels),
        description: generateOppComboDescription(parsed.labels),
        path: urlPath,
        noindex: !hasResults,
      });
    }
  }

  // Single segment → detail
  const slug = segments[0];
  try {
    const opp = await db.opportunity.findUnique({
      where: { slug },
      include: { company: { select: { name: true } } },
    });
    if (!opp) return { title: `Opportunity Not Found | ${siteConfig.companyName}` };
    const typeDisplay = OPP_TYPE_DISPLAY[opp.opportunityType] || opp.opportunityType?.replace(/_/g, " ") || "Opportunity";
    return generateMeta({
      title: `${opp.title} — ${typeDisplay}`,
      description: `${opp.excerpt || `${opp.title} at ${opp.company?.name || siteConfig.companyName}. Apply now on ${siteConfig.companyName}.`}`,
      path: `/opportunities/${slug}`,
      ogType: "article",
      publishedTime: opp.publishedAt?.toISOString(),
      modifiedTime: opp.updatedAt?.toISOString(),
    });
  } catch {
    return { title: `Opportunity Not Found | ${siteConfig.companyName}` };
  }
}

// ════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ════════════════════════════════════════════════════════════
export default async function OpportunityCatchAllPage({ params, searchParams }) {
  const { slug: segments } = await params;
  const resolvedSearchParams = await searchParams;

  // ── MULTI-SEGMENT → combo filter page ──────────────────
  if (segments.length >= 2) {
    const parsed = parseOpportunityFilters(segments);
    if (!parsed) notFound();

    // Check if this combo has actual results — 404 empty combos to save crawl budget
    try {
      const where = {
        isActive: true,
        status: "PUBLISHED",
        publishedAt: { not: null },
      };
      const { filters } = parsed;
      if (filters.opportunityType) where.opportunityType = filters.opportunityType;
      if (filters.county) {
        where.OR = [
          { description: { contains: filters.county } },
          { title: { contains: filters.county } },
        ];
      } else if (filters.country) {
        where.OR = [
          { description: { contains: filters.country } },
          { title: { contains: filters.country } },
        ];
      }
      const count = await db.opportunity.count({ where });
      if (count === 0) notFound();
    } catch {
      // On error, render the page normally (safer default)
    }

    const { filters, labels } = parsed;
    const urlPath = `/opportunities/${segments.join("/")}`;

    const titleParts = [];
    if (labels.type) titleParts.push(labels.type);
    if (labels.location) titleParts.push(`in ${labels.location}`);
    const pageTitle = `${titleParts.join(" ")} — ${siteConfig.companyLegalName}`;

    let opportunities = [];
    let total = 0;
    let page = 1;
    let perPage = 12;
    try {
      const result = await getFilteredOpportunities(filters, resolvedSearchParams);
      opportunities = result.opportunities;
      total = result.total;
      page = result.page;
      perPage = result.perPage;
    } catch (err) {
      console.error("[OpportunityCatchAllPage] Combo filter error:", err.message);
    }
    const totalPages = Math.ceil(total / perPage);
    const typeColor = OPP_TYPE_COLORS[filters.opportunityType] || { bg: "bg-gray-100", text: "text-gray-700" };
    const typeDisplay = OPP_TYPE_DISPLAY[filters.opportunityType] || filters.opportunityType?.replace(/_/g, " ");

    const breadcrumbItems = [
      { name: "Home", href: "/" },
      { name: "Opportunities", href: "/opportunities" },
    ];
    if (labels.type) {
      breadcrumbItems.push({ name: labels.type, href: `/opportunities/${segments[0]}` });
    }
    if (labels.location) {
      breadcrumbItems.push({ name: labels.location });
    }

    return (
      <main className="py-8 md:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-6 flex flex-wrap items-center gap-1">
            {breadcrumbItems.map((item, i) => (
              <span key={i}>
                {i > 0 && <span className="text-gray-300 mx-1">/</span>}
                {!item.href || i === breadcrumbItems.length - 1 ? (
                  <span className="text-gray-700 font-medium">{item.name}</span>
                ) : (
                  <Link href={item.href} className="hover:text-teal-600">{item.name}</Link>
                )}
              </span>
            ))}
          </nav>

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className={`${typeColor.bg} ${typeColor.text} text-sm font-semibold px-3 py-1 rounded-full`}>
                {typeDisplay || "Opportunities"}
              </span>
              {labels.location && (
                <span className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
                  📍 {labels.location}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
            <p className="text-gray-500 mt-2">{total} opportunities found</p>
          </div>

          {/* Results Grid */}
          {opportunities.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opp) => {
                const oppTypeDisplay = OPP_TYPE_DISPLAY[opp.opportunityType] || opp.opportunityType?.replace(/_/g, " ");
                const oppColor = OPP_TYPE_COLORS[opp.opportunityType] || { bg: "bg-gray-100", text: "text-gray-700" };
                return (
                  <Link key={opp.id} href={`/opportunities/${opp.slug}`} className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                    {opp.featuredImage ? (
                      <div className="h-40 bg-gray-100 relative">
                        <OptimizedImage src={opp.featuredImage} alt="" fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="h-24 bg-gradient-to-r from-teal-500 to-blue-500" />
                    )}
                    <div className="p-4">
                      <span className={`${oppColor.bg} ${oppColor.text} text-xs font-semibold px-2 py-0.5 rounded-full`}>
                        {oppTypeDisplay}
                      </span>
                      <h3 className="text-base font-semibold text-gray-900 mt-2 group-hover:text-teal-600 line-clamp-2">{opp.title}</h3>
                      {opp.company?.name && <p className="text-sm text-gray-500 mt-1">{opp.company.name}</p>}
                      {opp.deadline && (
                        <p className="text-xs text-amber-600 mt-2">⏳ Deadline: {formatDate(opp.deadline)}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <p className="text-gray-400 text-lg">No opportunities found matching these criteria.</p>
              <Link href="/opportunities" className="text-teal-600 hover:underline mt-2 inline-block">← Browse all opportunities</Link>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {page > 1 && (
                <Link href={`${urlPath}?page=${page - 1}`} className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow text-sm text-gray-700">
                  ← Previous
                </Link>
              )}
              <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
              {page < totalPages && (
                <Link href={`${urlPath}?page=${page + 1}`} className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow text-sm text-gray-700">
                  Next →
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
    );
  }

  // ── SINGLE SEGMENT → opportunity detail page ───────────
  const slug = segments[0];
  const data = await getOpportunity(slug);

  if (!data) notFound();

  const { opportunity: opp, similarOpportunities } = data;
  const company = opp.company;
  const typeDisplay = OPP_TYPE_DISPLAY[opp.opportunityType] || opp.opportunityType?.replace(/_/g, " ") || "Opportunity";
  const typeColor = OPP_TYPE_COLORS[opp.opportunityType] || { bg: "bg-gray-100", text: "text-gray-700" };
  const postedDate = formatDate(opp.publishedAt || opp.createdAt);
  const deadlineDate = opp.deadline ? formatDate(opp.deadline) : null;

  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Opportunities", href: "/opportunities" },
  ];
  if (opp.opportunityType) {
    breadcrumbItems.push({ name: typeDisplay, href: `/opportunities/${opp.opportunityType.toLowerCase()}` });
  }
  breadcrumbItems.push({ name: opp.title, href: `/opportunities/${slug}` });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbItems);
  const hasDescription = !!opp.description;

  return (
    <main className="py-8 md:py-12 bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <nav className="text-sm text-gray-500 mb-4 flex flex-wrap items-center gap-1">
              {breadcrumbItems.map((item, i) => (
                <span key={item.href}>
                  {i > 0 && <span className="text-gray-300 mx-1">/</span>}
                  {i === breadcrumbItems.length - 1 ? (
                    <span className="text-gray-700 font-medium truncate max-w-[200px] sm:max-w-none inline-block align-bottom">{item.name}</span>
                  ) : (
                    <Link href={item.href} className="hover:text-teal-600 transition-colors">{item.name}</Link>
                  )}
                </span>
              ))}
            </nav>

            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className={`${typeColor.bg} ${typeColor.text} text-xs font-semibold px-2.5 py-0.5 rounded-full`}>{typeDisplay}</span>
                {opp.isFeatured && <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">⭐ Featured</span>}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{opp.title}</h1>
              <div className="text-sm text-gray-600 mt-1.5">
                {company?.name ? <span className="font-medium">{company.name}</span> : <span className="font-medium">{siteConfig.companyName}</span>}
              </div>
              <div className="text-sm text-gray-500 flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                {postedDate && <span>📅 Posted: {postedDate}</span>}
                {deadlineDate && (<><span className="text-gray-300">|</span><span>⏳ Deadline: {deadlineDate}</span></>)}
                {opp.viewCount > 0 && (<><span className="text-gray-300">|</span><span>👁️ {opp.viewCount.toLocaleString()} views</span></>)}
              </div>
              {opp.howToApply && (
                <div className="flex flex-wrap gap-3 mt-5">
                  <a href="#how-to-apply" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-md transition-colors">Apply Now</a>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold mb-3 text-gray-900">Description</h2>
              <div
                className="prose prose-sm max-w-none text-gray-700 prose-headings:text-gray-900 prose-h3:text-lg prose-h3:font-bold prose-h3:mt-6 prose-h3:mb-2 prose-ul:my-3 prose-li:my-1"
                dangerouslySetInnerHTML={{ __html: hasDescription ? sanitizeHtml(opp.description) : (opp.excerpt || "<p>No description provided.</p>") }}
              />
              {opp.howToApply && (
                <div className="mt-6 pt-4 border-t border-gray-200" id="how-to-apply">
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">How to Apply</h3>
                  <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: sanitizeHtml(opp.howToApply) }} />
                </div>
              )}
            </div>

            <CVServiceStrip />
            <ShareStrip title={opp.title} type="opportunity" opportunityType={opp.opportunityType} />
          </div>

          <div className="space-y-6">
            <AdPlaceholder height="250px" />
            <CompanyAboutCard company={company} />
            <RelatedJobsCard jobs={similarOpportunities} title="Related Opportunities" type="opportunity" />
            <CVWritingCTA />
            <AdPlaceholder height="200px" label="Sponsored" />
          </div>
        </div>
      </div>
    </main>
  );
}
