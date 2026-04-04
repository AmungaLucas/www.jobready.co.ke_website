import Link from "next/link";
import { notFound } from "next/navigation";
import {
  generateMeta,
  generateOrganizationJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/seo";
import {
  normalizeCompany,
  normalizeSimilarCompanies,
  normalizeJobs,
} from "@/lib/normalize";
import CompanyProfileHeader from "./_components/CompanyProfileHeader";
import CompanyStats from "./_components/CompanyStats";
import JobCard from "@/app/(website)/_components/JobCard";
import CVReviewCTA from "@/app/(website)/_components/CVReviewCTA";
import AdSlot from "@/app/(website)/_components/AdSlot";
import SidebarCard from "@/app/(website)/_components/SidebarCard";
import { siteConfig } from "@/config/site-config";
import { FiChevronRight, FiBriefcase } from "react-icons/fi";
import { HiBuildingOffice } from "react-icons/hi2";

// Static config — browse industries sidebar (no API for counts)
const browseIndustries = [
  { name: "Banking & Finance", count: 18 },
  { name: "IT & Technology", count: 22 },
  { name: "Government", count: 24 },
  { name: "NGO & Development", count: 31 },
  { name: "Telecommunications", count: 5 },
  { name: "Healthcare", count: 12 },
];

// ─── Metadata ─────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://jobready.co.ke";
    const res = await fetch(`${baseUrl}/api/companies/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return generateMeta({
        title: "Company Not Found",
        path: `/organizations/${slug}`,
      });
    }

    const data = await res.json();
    const { company } = data;

    return generateMeta({
      title: company.metaTitle
        ? company.metaTitle
        : `${company.name} Jobs & Careers | JobReady Kenya`,
      description: company.metaDescription
        ? company.metaDescription
        : `View open jobs at ${company.name}. Apply now on JobReady.co.ke — Kenya's #1 job board.`,
      path: `/organizations/${company.slug}`,
    });
  } catch {
    return generateMeta({
      title: "Company Not Found",
      path: `/organizations/${slug}`,
    });
  }
}

// ─── PAGE ─────────────────────────────────────────────────────
export default async function CompanyProfilePage({ params }) {
  const { slug } = await params;

  // Fetch company data from API
  let companyData;
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://jobready.co.ke";
    const res = await fetch(`${baseUrl}/api/companies/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      notFound();
    }

    companyData = await res.json();
  } catch {
    notFound();
  }

  const { company: rawCompany, jobs: rawJobs, pagination, similarCompanies: rawSimilar } = companyData;

  // Normalize data for components
  const company = normalizeCompany(rawCompany, pagination);
  const companyJobs = normalizeJobs(rawJobs);
  const similarCompanies = normalizeSimilarCompanies(rawSimilar);

  // Breadcrumbs
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Companies", href: "/organizations" },
    { name: company.name },
  ];
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);

  // Organization JSON-LD
  const location = [company.city, company.country].filter(Boolean).join(", ");
  const organizationJsonLd = generateOrganizationJsonLd({
    name: company.name,
    website: company.website,
    description: Array.isArray(company.description)
      ? company.description[0]
      : (company.description || "").slice(0, 200),
    industry: company.industry,
    city: company.city,
    address: company.address,
    employeeSize: company.employeeSize,
    foundedYear: company.foundedYear,
    tickerSymbol: company.tickerSymbol,
  });

  const totalPages = pagination?.totalPages || 1;
  const currentPage = pagination?.page || 1;

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container py-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600 transition-colors no-underline">
              Home
            </Link>
            <FiChevronRight size={14} className="text-gray-400" />
            <Link href="/organizations" className="hover:text-blue-600 transition-colors no-underline">
              Companies
            </Link>
            <FiChevronRight size={14} className="text-gray-400" />
            <span className="text-gray-700 font-medium">{company.name}</span>
          </div>
        </div>
      </div>

      {/* Company Header */}
      <CompanyProfileHeader company={company} />

      {/* Main Layout */}
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 py-10 md:py-14">
          {/* Main Column */}
          <div className="min-w-0">
            {/* About Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                About {company.name}
              </h2>
              {Array.isArray(company.description) ? (
                company.description.map((para, idx) => (
                  <p
                    key={idx}
                    className="text-sm text-gray-600 leading-relaxed mb-3 last:mb-0"
                  >
                    {para}
                  </p>
                ))
              ) : (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {company.description}
                </p>
              )}

              {/* Key Details */}
              {company.keyDetails && company.keyDetails.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-5 border-t border-gray-100">
                  {company.keyDetails.map((detail) => (
                    <div key={detail.label} className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                        <FiBriefcase size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">{detail.label}</p>
                        {detail.href ? (
                          <a
                            href={detail.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors no-underline"
                          >
                            {detail.value}
                          </a>
                        ) : (
                          <p className="text-sm font-semibold text-gray-800">
                            {detail.value}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stats */}
            <CompanyStats stats={company.stats} />

            {/* Open Jobs */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">
                  Open Jobs at {company.name}
                </h2>
                <span className="text-sm font-semibold text-blue-600">
                  {pagination?.total ?? companyJobs.length} positions
                </span>
              </div>

              {/* Filter bar */}
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100 overflow-x-auto">
                {["All", "Full-Time", "Contract", "Internship"].map((type) => {
                  const count =
                    type === "All"
                      ? companyJobs.length
                      : companyJobs.filter((j) =>
                          (j.jobType || "").toLowerCase().includes(type.toLowerCase())
                        ).length;
                  return (
                    <span
                      key={type}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                        type === "All"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      {type} {count}
                    </span>
                  );
                })}
              </div>

              {/* Job List */}
              {companyJobs.map((job) => (
                <JobCard key={job.slug || job.id} job={job} />
              ))}

              {companyJobs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-sm">
                    No open jobs at the moment.
                  </p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 mt-5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                          page === currentPage
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-gray-600 bg-white border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-[84px]">
              {/* CV CTA */}
              <div className="bg-white rounded-xl shadow-sm p-5 mb-5 border-2 border-blue-200 text-center">
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  Applying to {company.name}?
                </h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                  Stand out with a professionally written CV tailored for{" "}
                  {company.name}.
                </p>
                <a
                  href={`${siteConfig.whatsapp.link}?text=${encodeURIComponent(
                    `Hi JobReady, I need a CV for ${company.name} jobs. Please help.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors no-underline"
                >
                  Get Your CV Done
                </a>
                <p className="text-xs text-gray-400 mt-2">from KSh 500</p>
              </div>

              <AdSlot position="sidebar" />

              {/* Similar Companies */}
              {similarCompanies.length > 0 && (
                <SidebarCard title="Similar Companies" icon={HiBuildingOffice}>
                  <ul className="list-none">
                    {similarCompanies.map((sc) => (
                      <li
                        key={sc.slug}
                        className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-b-0"
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs text-white"
                          style={{
                            background: `linear-gradient(135deg, ${sc.logoColor}, ${sc.logoColor}dd)`,
                          }}
                        >
                          {sc.initials}
                        </div>
                        <Link
                          href={`/organizations/${sc.slug}`}
                          className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-1 no-underline flex-1"
                        >
                          {sc.name}
                        </Link>
                        <span className="text-[0.65rem] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                          {sc.openJobs} jobs
                        </span>
                      </li>
                    ))}
                  </ul>
                </SidebarCard>
              )}

              {/* Browse by Industry */}
              <SidebarCard title="Browse by Industry">
                <ul className="list-none">
                  {browseIndustries.map((ind) => (
                    <li key={ind.name} className="mb-0.5">
                      <span className="flex justify-between items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all cursor-pointer">
                        {ind.name}
                        <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
                          {ind.count}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </SidebarCard>

              <AdSlot position="sidebar" />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
