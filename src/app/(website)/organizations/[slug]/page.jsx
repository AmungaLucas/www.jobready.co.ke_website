import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { getInitials, buildLocation } from "@/lib/normalize";
import { generateMeta, generateOrganizationJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import AdPlaceholder from "../../_components/AdPlaceholder";
import ShareStrip from "../../_components/ShareStrip";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
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

export default async function CompanyDetailPage({ params }) {
  const { slug } = await params;

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
        {/* Breadcrumb */}
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
          {/* LEFT COLUMN (2/3) */}
          <div className="md:col-span-2">
            {/* Company Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-xl font-bold overflow-hidden shrink-0" style={{ backgroundColor: company.logoColor || "#5B21B6" }}>
                  {company.logo ? <img src={company.logo} alt="" className="w-full h-full object-cover" /> : getInitials(company.name)}
                </div>
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

            {/* Description */}
            {company.description && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">About {company.name}</h2>
                {hasHtmlDescription ? (
                  <div
                    className="prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: company.description }}
                  />
                ) : (
                  <div className="prose prose-sm max-w-none text-gray-700">
                    {company.description.split(/\n{2,}/).filter(Boolean).map((para, i) => (
                      <p key={i} className="mb-2 leading-relaxed">{para}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── Share Strip ─── */}
            <ShareStrip title={`${company.name} — Jobs & Company Profile`} type="company" />

            {/* Jobs */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Open Positions ({jobs.length})</h2>
              {jobs.length > 0 ? (
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <Link key={job.id} href={`/jobs/${job.slug}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors no-underline group">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: job.company?.logoColor || "#5B21B6" }}>
                        {job.company?.logo ? <img src={job.company.logo} alt="" className="w-full h-full object-cover" /> : getInitials(job.company?.name)}
                      </div>
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

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            <AdPlaceholder height="250px" />

            {/* Key Details */}
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
