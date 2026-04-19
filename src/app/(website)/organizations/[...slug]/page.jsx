import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getInitials, buildLocation } from "@/lib/normalize";
import { generateMeta, generateOrganizationJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import { parseOrganizationFilters, generateOrgComboTitle, generateOrgComboDescription } from "@/lib/filter-parser";
import { sanitizeHtml } from "@/lib/sanitize";
import OptimizedImage, { AvatarImage } from "@/components/OptimizedImage";
import AdPlaceholder from "../../_components/AdPlaceholder";
import ShareStrip from "../../_components/ShareStrip";

export const dynamic = "force-dynamic";

// ════════════════════════════════════════════════════════════
// COMBO FILTER — fetches organizations with combined filters
// ════════════════════════════════════════════════════════════
async function getFilteredOrganizations(filters, searchParams) {
  const where = { isActive: true };

  if (filters.organizationType) {
    where.organizationType = filters.organizationType;
  }
  if (filters.county) {
    where.county = filters.county;
  }
  if (filters.country && !filters.county) {
    where.country = filters.country;
  }

  // Keyword search
  const q = searchParams?.q;
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { industry: { contains: q } },
    ];
  }

  const page = parseInt(searchParams?.page) || 1;
  const perPage = 12;

  const [companies, total] = await Promise.all([
    db.company.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: { _count: { select: { jobs: { where: { status: "PUBLISHED", isActive: true } } } } },
    }),
    db.company.count({ where }),
  ]);

  return { companies, total, page, perPage };
}

// ════════════════════════════════════════════════════════════
// METADATA
// ════════════════════════════════════════════════════════════
export async function generateMetadata({ params, searchParams }) {
  const { slug: segments } = await params;
  const urlPath = `/organizations/${segments.join("/")}`;

  // Multi-segment → combo filter
  if (segments.length >= 2) {
    const parsed = parseOrganizationFilters(segments);
    if (parsed) {
      // Check if this combo has actual results — noindex empty pages
      let noindex = false;
      try {
        const where = { isActive: true };
        if (parsed.filters.organizationType) where.organizationType = parsed.filters.organizationType;
        if (parsed.filters.county) where.county = parsed.filters.county;
        if (parsed.filters.country && !parsed.filters.county) where.country = parsed.filters.country;

        const count = await db.company.count({ where });
        noindex = count === 0;
      } catch {
        // On error, allow indexing (safer default)
      }

      return generateMeta({
        title: generateOrgComboTitle(parsed.labels),
        description: generateOrgComboDescription(parsed.labels),
        path: urlPath,
        noindex,
      });
    }
  }

  // Single segment → company detail
  const slug = segments[0];
  try {
    const company = await db.company.findUnique({ where: { slug }, select: { name: true, industry: true, county: true } });
    if (!company) return { title: "Company Not Found | JobReady Kenya" };
    return generateMeta({
      title: `${company.name} — Jobs & Company Profile`,
      description: `View open positions at ${company.name}${company.industry ? ` in ${company.industry}` : ""} on JobReady Kenya.`,
      path: `/organizations/${slug}`,
    });
  } catch { return { title: "Company Not Found | JobReady Kenya" }; }
}

// ════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ════════════════════════════════════════════════════════════
export default async function OrganizationCatchAllPage({ params, searchParams }) {
  const { slug: segments } = await params;
  const resolvedSearchParams = await searchParams;

  // ── MULTI-SEGMENT → combo filter page ──────────────────
  if (segments.length >= 2) {
    const parsed = parseOrganizationFilters(segments);
    if (!parsed) notFound();

    const { filters, labels } = parsed;
    const urlPath = `/organizations/${segments.join("/")}`;

    const titleParts = [];
    if (labels.type) titleParts.push(labels.type);
    if (labels.location) titleParts.push(`in ${labels.location}`);
    const pageTitle = `${titleParts.join(" ")} — JobNet.co.ke`;

    let companies = [];
    let total = 0;
    let page = 1;
    let perPage = 12;
    try {
      const result = await getFilteredOrganizations(filters, resolvedSearchParams);
      companies = result.companies;
      total = result.total;
      page = result.page;
      perPage = result.perPage;
    } catch (err) {
      console.error("[OrganizationCatchAllPage] Combo filter error:", err.message);
    }
    const totalPages = Math.ceil(total / perPage);

    const breadcrumbItems = [
      { name: "Home", href: "/" },
      { name: "Organizations", href: "/organizations" },
    ];
    if (labels.type) {
      breadcrumbItems.push({ name: labels.type, href: `/organizations/${segments[0]}` });
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
              {labels.type && (
                <span className="bg-teal-100 text-teal-800 text-sm font-semibold px-3 py-1 rounded-full">
                  {labels.type}
                </span>
              )}
              {labels.location && (
                <span className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
                  📍 {labels.location}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
            <p className="text-gray-500 mt-2">{total} organizations found</p>
          </div>

          {/* Results Grid */}
          {companies.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company) => (
                <Link key={company.id} href={`/organizations/${company.slug}`} className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                  <div className="p-5">
                    <div className="flex items-center gap-3">
                      <AvatarImage
                        src={company.logo}
                        name={company.name}
                        color={company.logoColor || "#5B21B6"}
                        size="lg"
                        rounded="xl"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-teal-600 truncate">{company.name}</h3>
                        {company.industry && <p className="text-xs text-gray-500 truncate">{company.industry}</p>}
                        {(company.county || company.country) && (
                          <p className="text-xs text-gray-400">📍 {[company.county, company.country !== "Kenya" ? company.country : null].filter(Boolean).join(", ")}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs text-teal-600 font-medium">{company._count.jobs} open job{company._count.jobs !== 1 ? "s" : ""}</span>
                      {company.isVerified && <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">✓ Verified</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <p className="text-gray-400 text-lg">No organizations found matching these criteria.</p>
              <Link href="/organizations" className="text-teal-600 hover:underline mt-2 inline-block">← Browse all organizations</Link>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {page > 1 && (
                <Link href={`${urlPath}?page=${page - 1}`} className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow text-sm text-gray-700">← Previous</Link>
              )}
              <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
              {page < totalPages && (
                <Link href={`${urlPath}?page=${page + 1}`} className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow text-sm text-gray-700">Next →</Link>
              )}
            </div>
          )}
        </div>
      </main>
    );
  }

  // ── SINGLE SEGMENT → company detail page (unchanged) ──
  const slug = segments[0];

  let company;
  let jobs;
  try {
    company = await db.company.findUnique({
      where: { slug },
      include: { _count: { select: { jobs: { where: { status: "PUBLISHED", isActive: true } } } } },
    });
    if (!company) notFound();

    jobs = await db.job.findMany({
      where: { companyId: company.id, status: "PUBLISHED", isActive: true },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { company: { select: { name: true, slug: true, logo: true, logoColor: true, isVerified: true } } },
    });
  } catch { notFound(); }

  const location = buildLocation(company);
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Companies", href: "/organizations" },
    { name: company.name, href: `/organizations/${slug}` },
  ];

  const jsonLd = generateOrganizationJsonLd(company);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);
  const hasHtmlDescription = !!company.description && /<[a-z][\s\S]*>/i.test(company.description);

  const keyDetails = [];
  if (company.industry) keyDetails.push({ label: "Industry", value: company.industry });
  if (location) keyDetails.push({ label: "Location", value: location });
  if (company.website) keyDetails.push({ label: "Website", value: company.website.replace(/^https?:\/\//, ""), href: company.website });
  if (company.contactEmail) keyDetails.push({ label: "Email", value: company.contactEmail, href: `mailto:${company.contactEmail}` });
  if (company.size) keyDetails.push({ label: "Size", value: company.size });

  return (
    <main className="py-8 md:py-12 bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <nav className="text-sm text-gray-500 mb-4 flex flex-wrap gap-1">
          {breadcrumbs.map((item, i) => (
            <span key={i}>
              {i > 0 && <span className="text-gray-300 mx-1">/</span>}
              {i === breadcrumbs.length - 1 ? (
                <span className="text-gray-700 font-medium truncate max-w-[200px] sm:max-w-none inline-block align-bottom">{item.name}</span>
              ) : (
                <Link href={item.href} className="hover:text-teal-600">{item.name}</Link>
              )}
            </span>
          ))}
        </nav>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-start gap-4">
                <AvatarImage
                  src={company.logo}
                  name={company.name}
                  color={company.logoColor || "#5B21B6"}
                  size="xl"
                  rounded="xl"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
                    {company.isVerified && <span className="bg-teal-100 text-teal-700 text-xs font-semibold px-2 py-0.5 rounded-full">✓ Verified</span>}
                  </div>
                  {company.industry && <p className="text-gray-500 text-sm mt-0.5">{company.industry}</p>}
                  {location && <p className="text-gray-400 text-sm">📍 {location}</p>}
                  <p className="text-teal-600 text-sm font-medium mt-1">{company._count.jobs} open job{company._count.jobs !== 1 ? "s" : ""}</p>
                </div>
              </div>
            </div>

            {company.description && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">About {company.name}</h2>
                {hasHtmlDescription ? (
                  <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: sanitizeHtml(company.description) }} />
                ) : (
                  <div className="prose prose-sm max-w-none text-gray-700">
                    {company.description.split(/\n{2,}/).filter(Boolean).map((para, i) => (
                      <p key={i} className="mb-2 leading-relaxed">{para}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            <ShareStrip title={`${company.name} — Jobs & Company Profile`} type="company" />

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Open Positions ({jobs.length})</h2>
              {jobs.length > 0 ? (
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <Link key={job.id} href={`/jobs/${job.slug}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors no-underline group">
                      <AvatarImage
                        src={job.company?.logo}
                        name={job.company?.name}
                        color={job.company?.logoColor || "#5B21B6"}
                        size="md"
                        rounded="lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-teal-600 truncate">{job.title}</h3>
                        <p className="text-xs text-gray-500">{[job.county, job.town].filter(Boolean).join(", ")}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 shrink-0">
                        {job.employmentType && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{job.employmentType}</span>}
                        {job.isRemote && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Remote</span>}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No open positions at this time.</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <AdPlaceholder height="250px" />
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Company Details</h3>
              <div className="space-y-3">
                {keyDetails.map((detail) => (
                  <div key={detail.label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{detail.label}</span>
                    {detail.href ? (
                      <a href={detail.href} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline truncate max-w-[160px]">{detail.value}</a>
                    ) : (
                      <span className="text-gray-900 font-medium text-right">{detail.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <AdPlaceholder height="200px" label="Sponsored" />
          </div>
        </div>
      </div>
    </main>
  );
}
