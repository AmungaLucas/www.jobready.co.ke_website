import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate, formatCurrency, formatJobType, formatExperienceLevel } from "@/lib/format";
import { formatLocation } from "@/lib/normalize";
import { generateMeta, generateJobJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import { parseJobFilters, generateJobComboTitle, generateJobComboDescription } from "@/lib/filter-parser";
import { sanitizeHtml } from "@/lib/sanitize";

// ─── Client Components ──────────────────────────────────
import BookmarkButton from "../../_components/BookmarkButton";
import ShareStrip from "../../_components/ShareStrip";
import AdPlaceholder from "../../_components/AdPlaceholder";
import CompanyAboutCard from "../../_components/CompanyAboutCard";
import RelatedJobsCard from "../../_components/RelatedJobsCard";
import CVWritingCTA from "../../_components/CVWritingCTA";
import CVServiceStrip from "../../_components/CVServiceStrip";
import JobFilterView from "../../_components/JobFilterView";

export const revalidate = 300;

// ════════════════════════════════════════════════════════════
// JOB DETAIL DATA FETCHING (unchanged from original)
// ════════════════════════════════════════════════════════════
async function getJob(slug) {
  try {
  const job = await db.job.findUnique({
    where: { slug },
    include: {
      company: {
        select: {
          id: true, name: true, slug: true, logo: true, logoColor: true,
          industry: true, size: true, county: true, country: true,
          website: true, isVerified: true, description: true,
          contactEmail: true, phoneNumber: true,
        },
      },
    },
  });

  if (!job) return null;

  // Fire-and-forget viewCount increment
  db.job.update({
    where: { id: job.id },
    data: { viewCount: { increment: 1 } },
  }).catch(() => {});

  // Fetch similar jobs
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const jobCategories = Array.isArray(job.categories) ? job.categories : [];
  const categoryFilter = jobCategories.length > 0
    ? { OR: jobCategories.map((cat) => ({ categories: { string_contains: `"${cat}"` } })) }
    : {};

  const similarJobs = await db.job.findMany({
    where: {
      id: { not: job.id },
      ...categoryFilter,
      isActive: true,
      status: "PUBLISHED",
      OR: [
        { applicationDeadline: null },
        { applicationDeadline: { gte: today } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true, title: true, slug: true, employmentType: true,
      applicationDeadline: true, county: true, town: true,
      company: { select: { name: true, slug: true, logo: true, logoColor: true } },
    },
  });

  return { job, similarJobs };
  } catch (error) {
    console.error("[getJob] DB error for slug:", slug, error.message);
    return null;
  }
}

// ════════════════════════════════════════════════════════════
// METADATA — handles both detail and combo pages
// ════════════════════════════════════════════════════════════
export async function generateMetadata({ params, searchParams }) {
  const { slug: segments } = await params;
  const urlPath = `/jobs/${segments.join("/")}`;

  // Multi-segment → combo filter page
  if (segments.length >= 2) {
    const parsed = parseJobFilters(segments);
    if (parsed) {
      // Check if this combo has actual results
      let hasResults = true;
      try {
        const where = {
          status: "PUBLISHED",
          isActive: true,
        };
        if (parsed.filters.category) where.categories = { string_contains: `"${parsed.filters.category}"` };
        if (parsed.filters.employmentType) where.employmentType = parsed.filters.employmentType;
        if (parsed.filters.experienceLevel) where.experienceLevel = parsed.filters.experienceLevel;
        if (parsed.filters.isRemote) where.isRemote = true;
        if (parsed.filters.county) where.county = parsed.filters.county;
        if (parsed.filters.country) where.country = parsed.filters.country;

        const count = await db.job.count({ where });
        hasResults = count > 0;
      } catch {
        // On error, assume results exist (safer default)
      }

      return generateMeta({
        title: generateJobComboTitle(parsed.labels),
        description: generateJobComboDescription(parsed.labels),
        path: urlPath,
        noindex: !hasResults,
      });
    }
  }

  // Single segment → try job detail
  const slug = segments[0];
  try {
    const job = await db.job.findUnique({
      where: { slug },
      select: {
        title: true, slug: true, employmentType: true, experienceLevel: true,
        county: true, town: true, country: true, isRemote: true,
        salaryMin: true, salaryMax: true, salaryPeriod: true,
        positions: true, publishedAt: true, updatedAt: true,
        noIndex: true,
        company: { select: { name: true, county: true } },
      },
    });

    if (!job) return { title: `Job Not Found | ${siteConfig.companyName}` };

    const location = formatLocation(job);
    const salary = job.salaryMin
      ? `${formatCurrency(job.salaryMin)}${job.salaryMax ? ` – ${formatCurrency(job.salaryMax)}` : ""}`
      : "Competitive";

    return generateMeta({
      title: `${job.title} at ${job.company?.name || siteConfig.companyName}`,
      description: `Apply for ${job.title} at ${job.company?.name || "a top company"}${location ? ` in ${location}` : ""}. ${formatJobType(job.employmentType)}. ${salary}. Apply now on ${siteConfig.companyName}.`,
      path: `/jobs/${slug}`,
      ogType: "article",
      publishedTime: job.publishedAt?.toISOString(),
      modifiedTime: job.updatedAt?.toISOString(),
      noindex: job.noIndex === true,
    });
  } catch {
    return { title: `Job Not Found | ${siteConfig.companyName}` };
  }
}

// ════════════════════════════════════════════════════════════
// PAGE COMPONENT — routes to detail or combo filter view
// ════════════════════════════════════════════════════════════
export default async function JobCatchAllPage({ params, searchParams }) {
  const { slug: segments } = await params;
  const resolvedSearchParams = await searchParams;

  // ── MULTI-SEGMENT → combo filter page ──────────────────
  if (segments.length >= 2) {
    const parsed = parseJobFilters(segments);

    if (!parsed) notFound();

    // Check if this combo has actual results — 404 empty combos to save crawl budget
    try {
      const where = { status: "PUBLISHED", isActive: true };
      const { filters } = parsed;
      if (filters.category) where.categories = { string_contains: `"${filters.category}"` };
      if (filters.employmentType) where.employmentType = filters.employmentType;
      if (filters.experienceLevel) where.experienceLevel = filters.experienceLevel;
      if (filters.isRemote) where.isRemote = true;
      if (filters.county) where.county = filters.county;
      if (filters.country) where.country = filters.country;
      const count = await db.job.count({ where });
      if (count === 0) notFound();
    } catch {
      // On error, render the page normally (safer default)
    }

    const { filters, labels } = parsed;
    const urlPath = `/jobs/${segments.join("/")}`;

    // Build the page title from labels
    const titleParts = [];
    if (labels.category) titleParts.push(labels.category);
    else if (labels.employmentType) titleParts.push(labels.employmentType);
    else if (labels.experienceLevel) titleParts.push(labels.experienceLevel);
    else if (labels.isRemote) titleParts.push("Remote");
    if (labels.location) titleParts.push(`in ${labels.location}`);
    const pageTitle = `${titleParts.join(" Jobs ")} in Kenya`;

    // Determine filterKey and filterValue for JobFilterView
    let filterKey, filterValue;

    if (filters.category) {
      filterKey = "category";
      filterValue = filters.category;
    } else if (filters.employmentType) {
      filterKey = "employmentType";
      filterValue = filters.employmentType;
    } else if (filters.experienceLevel) {
      filterKey = "experienceLevel";
      filterValue = filters.experienceLevel;
    } else if (filters.isRemote) {
      filterKey = "isRemote";
      filterValue = true;
    }

    // Pass additional filters via searchParams merge
    const mergedParams = { ...resolvedSearchParams };
    if (filters.county && filterKey !== "isRemote") {
      mergedParams.location = filters.county;
    }
    if (filters.country && !filters.county) {
      mergedParams.location = filters.country;
    }

    // Build breadcrumb name
    const breadcrumbName = titleParts.join(" ");

    return JobFilterView({
      searchParams: mergedParams,
      pageTitle,
      pagePath: urlPath,
      filterKey,
      filterValue,
      breadcrumbName,
      emptyTitle: `No ${breadcrumbName.toLowerCase()} found`,
      emptyDescription: `There are currently no ${breadcrumbName.toLowerCase()} matching your criteria. Check back soon or try adjusting your filters.`,
    });
  }

  // ── SINGLE SEGMENT → job detail page ───────────────────
  const slug = segments[0];
  const data = await getJob(slug);

  if (!data) notFound();

  const { job, similarJobs } = data;
  const company = job.company;
  const location = formatLocation(job);
  const jobType = formatJobType(job.employmentType);
  const expLevel = formatExperienceLevel(job.experienceLevel);
  const postedDate = formatDate(job.createdAt || job.publishedAt);
  const deadlineDate = job.applicationDeadline ? formatDate(job.applicationDeadline) : null;

  const salaryDisplay = job.salaryMin
    ? `${formatCurrency(job.salaryMin)}${job.salaryMax ? ` – ${formatCurrency(job.salaryMax)}` : ""} / ${job.salaryPeriod ? job.salaryPeriod.toLowerCase().replace(/_/g, " ") : "month"}`
    : null;

  // Breadcrumb items
  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Jobs", href: "/jobs" },
  ];
  if (job.county) {
    breadcrumbItems.push({ name: job.county, href: `/jobs?county=${encodeURIComponent(job.county)}` });
  }
  if (job.town && job.town !== job.county) {
    breadcrumbItems.push({ name: job.town, href: `/jobs?town=${encodeURIComponent(job.town)}` });
  }
  breadcrumbItems.push({ name: job.title, href: `/jobs/${slug}` });

  const jobJsonLd = generateJobJsonLd(job);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbItems);
  const hasDescription = !!job.description;

  return (
    <main className="py-8 md:py-12 bg-gray-50">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {/* ═══ LEFT COLUMN (2/3) ═══ */}
          <div className="md:col-span-2">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-4 flex flex-wrap items-center gap-1">
              {breadcrumbItems.map((item, i) => (
                <span key={item.href}>
                  {i > 0 && <span className="text-gray-300 mx-1">/</span>}
                  {i === breadcrumbItems.length - 1 ? (
                    <span className="text-gray-700 font-medium truncate max-w-[200px] sm:max-w-none inline-block align-bottom">
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

            {/* ─── Job Header Card ─── */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{job.title}</h1>

              <div className="text-sm text-gray-600 mt-1.5">
                <span className="font-medium">{company?.name || "Company"}</span>
                {job.categories?.length > 0 && (
                  <span> &middot; {job.categories.map((c) => c.replace(/_/g, " ")).join(" / ")}</span>
                )}
              </div>

              <div className="text-sm text-gray-500 flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                {location && (
                  <span>
                    📍 {location}
                    {job.isRemote && <span className="text-teal-600 font-medium"> (Remote option)</span>}
                  </span>
                )}
                {postedDate && (
                  <>
                    <span className="text-gray-300">|</span>
                    <span>📅 Posted: {postedDate}</span>
                  </>
                )}
                {deadlineDate && (
                  <>
                    <span className="text-gray-300">|</span>
                    <span>⏳ Deadline: {deadlineDate}</span>
                  </>
                )}
              </div>

              {/* Badges */}
              <div className="mt-3 flex flex-wrap gap-2">
                {salaryDisplay && (
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                    💰 {salaryDisplay}
                  </span>
                )}
                {job.isRemote && (
                  <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                    💻 Remote option
                  </span>
                )}
                {jobType && (
                  <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {jobType}
                  </span>
                )}
                {expLevel && (
                  <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                    {expLevel}
                  </span>
                )}
                {job.positions && job.positions > 1 && (
                  <span className="bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full">
                    {job.positions} Positions
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-5">
                {job.howToApply && (
                  <a
                    href="#how-to-apply"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-md transition-colors"
                  >
                    Apply Now
                  </a>
                )}
                <BookmarkButton jobId={job.id} />
              </div>
            </div>

            {/* ─── Description + How to Apply ─── */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold mb-3 text-gray-900">Job Description</h2>
              <div
                className="prose prose-sm max-w-none text-gray-700 prose-headings:text-gray-900 prose-h3:text-lg prose-h3:font-bold prose-h3:mt-6 prose-h3:mb-2 prose-ul:my-3 prose-li:my-1"
                dangerouslySetInnerHTML={{ __html: hasDescription ? sanitizeHtml(job.description) : "<p>No description provided.</p>" }}
              />

              {job.howToApply && (
                <div className="mt-6 pt-4 border-t border-gray-200" id="how-to-apply">
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">How to Apply</h3>
                  <div
                    className="prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(job.howToApply) }}
                  />
                </div>
              )}
            </div>

            {/* ─── CV Service Strip ─── */}
            <CVServiceStrip />

            {/* ─── Share Strip ─── */}
            <ShareStrip title={job.title} type="job" />
          </div>

          {/* ═══ RIGHT SIDEBAR (1/3) ═══ */}
          <div className="space-y-6">
            <AdPlaceholder height="250px" />
            <CompanyAboutCard company={company} />
            <RelatedJobsCard jobs={similarJobs} title="Related Jobs" type="job" />
            <CVWritingCTA />
            <AdPlaceholder height="200px" label="Sponsored" />
          </div>
        </div>
      </div>
    </main>
  );
}
