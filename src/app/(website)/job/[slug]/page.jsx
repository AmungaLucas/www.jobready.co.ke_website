import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import JobDetailHeader from "../_components/JobDetailHeader";
import JobDetailBody from "../_components/JobDetailBody";
import JobDetailSidebar from "../_components/JobDetailSidebar";
import JobToolsBar from "../_components/JobToolsBar";
import ServiceNudge from "../_components/ServiceNudge";
import MobileApplyBar from "../_components/MobileApplyBar";
import AdSlot from "../../_components/AdSlot";
import {
  generateJobJsonLd,
  generateBreadcrumbJsonLd,
  generateMeta,
} from "@/lib/seo";

// ─── Data Fetching ─────────────────────────────────────────
async function fetchJob(slug) {
  const res = await fetch(`/api/jobs/${slug}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) return null;
  return res.json();
}

// ─── SEO ───────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await fetchJob(slug);

  if (!data) {
    return { title: "Job Not Found | JobReady Kenya" };
  }

  const { job } = data;
  const company = job.company || {};

  return generateMeta({
    title: `${job.title} at ${company.name}`,
    description: `Apply for ${job.title} at ${company.name} in ${job.location}. ${job.jobType}, ${job.experienceLevel} level. Deadline: ${job.deadline}. Get your CV reviewed — JobReady.co.ke`,
    path: `/job/${job.slug}`,
  });
}

// ─── PAGE ──────────────────────────────────────────────────
export default async function JobDetailPage({ params }) {
  const { slug } = await params;
  const data = await fetchJob(slug);

  if (!data) {
    notFound();
  }

  const { job, similarJobs = [] } = data;
  const company = job.company || {};

  // Normalize API data for component compatibility:
  // API returns company.employeeSize but components expect company.size
  const normalizedJob = {
    ...job,
    company: {
      ...company,
      size: company.employeeSize,
    },
  };

  const jobJsonLd = generateJobJsonLd({
    ...normalizedJob,
    employmentType: normalizedJob.jobType,
    publishedAt: normalizedJob.publishedAt,
    company: {
      ...normalizedJob.company,
      logo:
        normalizedJob.company.logo ||
        `https://jobready.co.ke/logos/${normalizedJob.company.slug}.png`,
    },
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Jobs", href: "/jobs" },
    { name: normalizedJob.category || "All Categories", href: `/jobs` },
    { name: normalizedJob.title, href: `/job/${normalizedJob.slug}` },
  ]);

  return (
    <>
      {/* JSON-LD */}
      <Script
        id="job-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobJsonLd) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4">
        <ol className="flex items-center gap-1.5 text-[0.83rem] list-none flex-wrap">
          <li>
            <Link
              href="/"
              className="text-gray-500 hover:text-[#1a56db] transition-colors no-underline"
            >
              Home
            </Link>
          </li>
          <li className="text-gray-300">/</li>
          <li>
            <Link
              href="/jobs"
              className="text-gray-500 hover:text-[#1a56db] transition-colors no-underline"
            >
              Jobs
            </Link>
          </li>
          <li className="text-gray-300">/</li>
          <li className="text-gray-700 font-medium">
            {normalizedJob.title}
          </li>
        </ol>
      </nav>

      {/* Ad Leaderboard (hidden on mobile) */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 hidden lg:block mb-6">
        <AdSlot position="leaderboard" />
      </div>

      {/* Main layout */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 pb-16">
          {/* LEFT: Main content */}
          <div>
            {/* Job Header */}
            <JobDetailHeader job={normalizedJob} />

            {/* Pain trigger */}
            <div className="bg-gray-900 text-white rounded-lg p-5 md:p-6 mt-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="text-[1.6rem] font-extrabold text-[#f59e0b] leading-none whitespace-nowrap">
                {normalizedJob.applicationCount || 0}
                <small className="block text-[0.7rem] text-gray-400 font-normal mt-1">
                  applicants
                </small>
              </div>
              <div className="flex-1">
                <p className="text-[0.85rem] text-gray-300 leading-relaxed">
                  <strong className="text-white">
                    Stand out from {normalizedJob.applicationCount || 0} applicants.
                  </strong>{" "}
                  A professional CV tailored to this role gets you 3x more
                  interview calls.
                </p>
                <Link
                  href="/cv-services"
                  className="inline-flex items-center gap-1.5 bg-[#1a56db] text-white px-4 py-2 rounded-full text-[0.8rem] font-bold mt-2 no-underline hover:bg-[#1e40af] transition-colors"
                >
                  Get CV Tailored
                </Link>
              </div>
            </div>

            {/* Job description */}
            <JobDetailBody job={normalizedJob} />

            {/* In-content ad */}
            <AdSlot position="inline" />

            {/* Service Nudge */}
            <ServiceNudge />

            {/* Job Tools Bar */}
            <JobToolsBar job={normalizedJob} />
          </div>

          {/* RIGHT: Sidebar */}
          <JobDetailSidebar
            job={normalizedJob}
            similarJobs={similarJobs}
            companyJobs={[]}
          />
        </div>
      </div>

      {/* Mobile Apply Bar */}
      <MobileApplyBar job={normalizedJob} />
    </>
  );
}
