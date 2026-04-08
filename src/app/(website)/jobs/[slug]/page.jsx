import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate, formatCurrency, formatJobType, formatExperienceLevel } from "@/lib/format";
import { formatLocation } from "@/lib/normalize";
import { generateMeta, generateJobJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import { siteConfig } from "@/config/site-config";

// ─── Client Components ──────────────────────────────────
import BookmarkButton from "../_components/BookmarkButton";
import ShareStrip from "../_components/ShareStrip";
import AdPlaceholder from "../_components/AdPlaceholder";
import CompanyAboutCard from "../_components/CompanyAboutCard";
import RelatedJobsCard from "../_components/RelatedJobsCard";
import CVWritingCTA from "../_components/CVWritingCTA";
import CVServiceStrip from "../_components/CVServiceStrip";

// ─── Data Fetching ──────────────────────────────────────
async function getJob(slug) {
  try {
  const job = await db.job.findUnique({
    where: { slug },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          logoColor: true,
          industry: true,
          size: true,
          county: true,
          country: true,
          website: true,
          isVerified: true,
          description: true,
          contactEmail: true,
          phoneNumber: true,
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
      id: true,
      title: true,
      slug: true,
      employmentType: true,
      applicationDeadline: true,
      county: true,
      town: true,
      company: {
        select: { name: true, slug: true, logo: true, logoColor: true },
      },
    },
  });

  return { job, similarJobs };
  } catch (error) {
    console.error("[getJob] DB error for slug:", slug, error.message);
    return null;
  }
}

// ─── Metadata ───────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const job = await db.job.findUnique({
      where: { slug },
      include: {
        company: { select: { name: true, county: true } },
      },
    });

    if (!job) return { title: "Job Not Found | JobReady Kenya" };

    const location = formatLocation(job);
    const salary = job.salaryMin
      ? `${formatCurrency(job.salaryMin)}${job.salaryMax ? ` – ${formatCurrency(job.salaryMax)}` : ""}`
      : "Competitive";

    return generateMeta({
      title: `${job.title} at ${job.company?.name || "JobReady Kenya"}`,
      description: `Apply for ${job.title} at ${job.company?.name || "a top company"}${location ? ` in ${location}` : ""}. ${formatJobType(job.employmentType)}. ${salary}. Apply now on JobReady Kenya.`,
      path: `/jobs/${slug}`,
      ogType: "article",
      publishedTime: job.publishedAt?.toISOString(),
      modifiedTime: job.updatedAt?.toISOString(),
    });
  } catch {
    return { title: "Job Not Found | JobReady Kenya" };
  }
}

// ─── Page Component ─────────────────────────────────────
export default async function JobDetailPage({ params }) {
  const { slug } = await params;
  const data = await getJob(slug);

  if (!data) notFound();

  const { job, similarJobs } = data;
  const company = job.company;
  const location = formatLocation(job);
  const jobType = formatJobType(job.employmentType);
  const expLevel = formatExperienceLevel(job.experienceLevel);
  const postedDate = formatDate(job.createdAt || job.publishedAt);
  const deadlineDate = job.applicationDeadline ? formatDate(job.applicationDeadline) : null;

  // Salary display
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

  // JSON-LD
  const jobJsonLd = generateJobJsonLd(job);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbItems);

  // Parse description into paragraphs
  const descriptionParagraphs = job.description
    ? job.description.split(/\n{2,}/).filter(Boolean)
    : [];

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
              <div className="prose prose-sm max-w-none text-gray-700">
                {descriptionParagraphs.length > 0 ? (
                  descriptionParagraphs.map((para, i) => {
                    // Detect headings (short lines without punctuation at end, or starting with #)
                    const trimmed = para.trim();
                    const isHeading = trimmed.length < 80 && !trimmed.endsWith(".") && !trimmed.endsWith(",") && (
                      /^[A-Z][A-Za-z\s&:]+$/.test(trimmed) ||
                      trimmed.endsWith(":")
                    );

                    if (isHeading) {
                      return (
                        <h3 key={i} className="font-semibold text-gray-800 mt-4 mb-1">
                          {trimmed.replace(/:$/, "")}
                        </h3>
                      );
                    }

                    // Detect list items (lines starting with - or *)
                    if (/^[-•*]\s/.test(trimmed)) {
                      return (
                        <li key={i} className="ml-5 list-disc text-gray-700">
                          {trimmed.replace(/^[-•*]\s*/, "")}
                        </li>
                      );
                    }

                    return (
                      <p key={i} className="mb-2 leading-relaxed">{trimmed}</p>
                    );
                  })
                ) : (
                  <p className="text-gray-500">No description provided.</p>
                )}
              </div>

              {/* How to Apply */}
              {job.howToApply && (
                <div className="mt-6 pt-4 border-t border-gray-200" id="how-to-apply">
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">How to Apply</h3>
                  <div className="text-gray-700 text-sm whitespace-pre-line">
                    {job.howToApply}
                  </div>
                </div>
              )}
            </div>

            {/* ─── CV Service Strip ─── */}
            <CVServiceStrip />

            {/* ─── Share Strip ─── */}
            <ShareStrip title={job.title} />
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
