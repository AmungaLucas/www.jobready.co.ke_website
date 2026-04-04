import Link from "next/link";
import { generateMeta, generateOrganizationJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import { company, companyJobs, similarCompanies, browseIndustries } from "./_components/mock-data";
import CompanyProfileHeader from "./_components/CompanyProfileHeader";
import CompanyStats from "./_components/CompanyStats";
import CompanyInfo from "./_components/CompanyInfo";
import JobCard from "@/app/(website)/_components/JobCard";
import CVReviewCTA from "@/app/(website)/_components/CVReviewCTA";
import AdSlot from "@/app/(website)/_components/AdSlot";
import SidebarCard from "@/app/(website)/_components/SidebarCard";
import { siteConfig } from "@/config/site-config";
import { FiChevronRight, FiBriefcase } from "react-icons/fi";
import { HiBuildingOffice } from "react-icons/hi2";

// Mock slug lookup
const allCompanies = {
  "safaricom-plc": company,
};

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Companies", href: "/organizations" },
  { name: company.name },
];

const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);

const organizationJsonLd = generateOrganizationJsonLd({
  name: company.name,
  website: company.website,
  description: company.description[0],
  industry: company.industry,
  city: "Nairobi",
  address: company.fullAddress,
  employeeSize: "5,000+",
  foundedYear: company.founded,
  tickerSymbol: company.tickerSymbol,
});

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const comp = allCompanies[slug] || company;

  return generateMeta({
    title: `${comp.name} Jobs & Careers | JobReady Kenya`,
    description: `View open jobs at ${comp.name}. ${comp.openJobs}+ positions available. Apply now on JobReady.co.ke — Kenya's #1 job board.`,
    path: `/organizations/${comp.slug}`,
  });
}

export default async function CompanyProfilePage({ params }) {
  const { slug } = await params;
  const comp = allCompanies[slug] || company;

  const activeFilter = "All";
  const filteredJobs = companyJobs;

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
            <Link href="/" className="hover:text-blue-600 transition-colors no-underline">Home</Link>
            <FiChevronRight size={14} className="text-gray-400" />
            <Link href="/organizations" className="hover:text-blue-600 transition-colors no-underline">Companies</Link>
            <FiChevronRight size={14} className="text-gray-400" />
            <span className="text-gray-700 font-medium">{comp.name}</span>
          </div>
        </div>
      </div>

      {/* Company Header */}
      <CompanyProfileHeader company={comp} />

      {/* Main Layout */}
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 py-10 md:py-14">
          {/* Main Column */}
          <div className="min-w-0">
            {/* About Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">About {comp.name}</h2>
              {comp.description.map((para, idx) => (
                <p key={idx} className="text-sm text-gray-600 leading-relaxed mb-3 last:mb-0">
                  {para}
                </p>
              ))}

              {/* Key Details */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-5 border-t border-gray-100">
                {comp.keyDetails.map((detail) => (
                  <div key={detail.label} className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <FiBriefcase size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{detail.label}</p>
                      <p className="text-sm font-semibold text-gray-800">{detail.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <CompanyStats stats={comp.stats} />

            {/* Open Jobs */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">
                  Open Jobs at {comp.name}
                </h2>
                <span className="text-sm font-semibold text-blue-600">
                  {filteredJobs.length} positions
                </span>
              </div>

              {/* Filter bar */}
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100 overflow-x-auto">
                {["All", "Full-Time", "Contract", "Internship"].map((type) => {
                  const count =
                    type === "All"
                      ? filteredJobs.length
                      : filteredJobs.filter((j) =>
                          j.jobType.toLowerCase().includes(type.toLowerCase())
                        ).length;
                  return (
                    <button
                      key={type}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        activeFilter === type
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      {type} {count}
                    </button>
                  );
                })}
              </div>

              {/* Job List */}
              {filteredJobs.map((job) => (
                <JobCard key={job.slug} job={job} />
              ))}

              {filteredJobs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-sm">No open jobs at the moment.</p>
                </div>
              )}

              {/* Pagination */}
              <div className="flex items-center justify-center gap-1 mt-5">
                <button className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-semibold bg-blue-600 text-white shadow-sm cursor-pointer">
                  1
                </button>
                <button className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  2
                </button>
                <button className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  3
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-[84px]">
              {/* CV CTA */}
              <div className="bg-white rounded-xl shadow-sm p-5 mb-5 border-2 border-blue-200 text-center">
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  Applying to {comp.name}?
                </h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                  Stand out with a professionally written CV tailored for {comp.name}.
                </p>
                <a
                  href={`${siteConfig.whatsapp.link}?text=${encodeURIComponent(`Hi JobReady, I need a CV for ${comp.name} jobs. Please help.`)}`}
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
              <SidebarCard title="Similar Companies" icon={HiBuildingOffice}>
                <ul className="list-none">
                  {similarCompanies.map((sc) => (
                    <li key={sc.slug} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-b-0">
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
