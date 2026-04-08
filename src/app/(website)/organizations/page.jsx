import { db } from "@/lib/db";
import { generateMeta, generateBreadcrumbJsonLd } from "@/lib/seo";
import Link from "next/link";
import { getInitials } from "@/lib/normalize";
import AdPlaceholder from "../_components/AdPlaceholder";
import { FiSearch, FiFilter, FiX, FiTrendingUp } from "react-icons/fi";

export const dynamic = "force-dynamic";

const ORG_TYPES = [
  { value: "PRIVATE", label: "Private Sector" },
  { value: "SMALL_BUSINESS", label: "SME" },
  { value: "STARTUP", label: "Startup" },
  { value: "NGO", label: "NGO" },
  { value: "INTERNATIONAL_ORG", label: "International Org" },
  { value: "NATIONAL_GOV", label: "National Government" },
  { value: "COUNTY_GOV", label: "County Government" },
  { value: "STATE_CORPORATION", label: "State Corporation" },
  { value: "EDUCATION", label: "Education" },
  { value: "FOUNDATION", label: "Foundation" },
  { value: "RELIGIOUS_ORG", label: "Religious Org" },
];

const TOP_INDUSTRIES = [
  { value: "INFORMATION_TECHNOLOGY", label: "IT & Software" },
  { value: "BANKING", label: "Banking & Finance" },
  { value: "HEALTHCARE", label: "Healthcare" },
  { value: "EDUCATION", label: "Education & Training" },
  { value: "GOVERNMENT_PUBLIC_ADMIN", label: "Government" },
  { value: "MANUFACTURING", label: "Manufacturing" },
  { value: "RETAIL", label: "Retail & E-Commerce" },
  { value: "CONSTRUCTION", label: "Construction" },
  { value: "TELECOMMUNICATIONS", label: "Telecommunications" },
  { value: "HOSPITALITY_TOURISM", label: "Hospitality & Tourism" },
  { value: "NON_PROFIT", label: "Non-Profit" },
  { value: "ENERGY", label: "Energy & Utilities" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "most-jobs", label: "Most Jobs" },
];

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const q = sp.q || "";
  return generateMeta({
    title: q ? `${q} — Companies & Employers` : "Companies & Employers in Kenya",
    description: "Browse top employers and companies hiring in Kenya. View company profiles, open positions, and apply directly.",
    path: "/organizations",
  });
}

function buildSortUrl(params, sortValue) {
  const p = { ...params, sort: sortValue };
  delete p.page;
  const qs = new URLSearchParams(p).toString();
  return `/organizations${qs ? `?${qs}` : ""}`;
}

function buildFilterUrl(params, overrides = {}) {
  const p = { ...params };
  for (const [key, value] of Object.entries(overrides)) {
    if (value === null || value === undefined || value === "") {
      delete p[key];
    } else {
      p[key] = value;
    }
  }
  delete p.page;
  const qs = new URLSearchParams(p).toString();
  return `/organizations${qs ? `?${qs}` : ""}`;
}

function hasActiveFilters(params) {
  return !!(params.q || params.industry || params.county || params.orgType);
}

function buildOrgTypeLabel(orgType) {
  const found = ORG_TYPES.find((t) => t.value === orgType);
  return found ? found.label : orgType;
}

function buildIndustryLabel(industry) {
  const found = TOP_INDUSTRIES.find((i) => i.value === industry);
  return found ? found.label : industry;
}

export default async function OrganizationsPage({ searchParams }) {
  const params = await searchParams;
  const q = params.q || "";
  const industry = params.industry || "";
  const county = params.county || "";
  const orgType = params.orgType || "";
  const sort = params.sort || "newest";
  const page = parseInt(params.page || "1", 10);
  const limit = 20;
  const skip = (page - 1) * limit;

  const where = { isActive: true };
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { industry: { contains: q } },
      { county: { contains: q } },
    ];
  }
  if (industry) where.industry = { contains: industry };
  if (county) where.county = { contains: county };
  if (orgType) where.organizationType = orgType;

  const orderBy = sort === "most-jobs"
    ? { createdAt: "desc" }
    : { createdAt: "desc" };

  const [companies, total] = await Promise.all([
    db.company.findMany({
      where,
      select: {
        id: true, name: true, slug: true, logo: true, logoColor: true,
        industry: true, county: true, country: true, website: true,
        organizationType: true,
        isVerified: true, createdAt: true,
        _count: { select: { jobs: { where: { status: "PUBLISHED", isActive: true } } } },
      },
      orderBy,
      skip, take: limit,
    }),
    db.company.count({ where }),
  ]);

  // Sort by most jobs in-memory (since jobCount is denormalized)
  if (sort === "most-jobs") {
    companies.sort((a, b) => b._count.jobs - a._count.jobs);
  }

  const totalPages = Math.ceil(total / limit);
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Companies", href: "/organizations" },
  ];
  if (q) breadcrumbs.push({ name: q, href: `/organizations?q=${encodeURIComponent(q)}` });

  // Pagination URL helper preserving all filters
  const paginationUrl = (p) => {
    const qs = new URLSearchParams({ ...params, page: p.toString() }).toString();
    return `/organizations?${qs}`;
  };

  return (
    <main className="py-8 md:py-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4 flex flex-wrap gap-1">
          {breadcrumbs.map((item, i) => (
            <span key={i}>
              {i > 0 && <span className="text-gray-300 mx-1">/</span>}
              {i === breadcrumbs.length - 1 ? (
                <span className="text-gray-700 font-medium">{item.name}</span>
              ) : (
                <Link href={item.href} className="hover:text-teal-600">{item.name}</Link>
              )}
            </span>
          ))}
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Companies &amp; Employers</h1>
            <p className="text-gray-500 mt-1">{total} companies hiring in Kenya</p>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <label htmlFor="org-sort-select" className="sr-only">Sort by</label>
            <select
              id="org-sort-select"
              value={sort}
              className="appearance-none bg-white border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <FiTrendingUp className="w-4 h-4 text-gray-400" />
            </div>
            <div className="absolute inset-0 opacity-0 pointer-events-none">
              {SORT_OPTIONS.map((opt) => (
                <a key={opt.value} href={buildSortUrl(params, opt.value)} aria-label={`Sort by ${opt.label}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Filters — all inside a single form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <form action="/organizations" method="GET" className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" name="q" defaultValue={q} placeholder="Search companies..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
            </div>

            {/* Industry */}
            <select name="industry" defaultValue={industry} className="appearance-none px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 cursor-pointer min-w-[170px]">
              <option value="">All Industries</option>
              {TOP_INDUSTRIES.map((ind) => (
                <option key={ind.value} value={ind.value}>{ind.label}</option>
              ))}
            </select>

            {/* Org Type */}
            <select name="orgType" defaultValue={orgType} className="appearance-none px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 cursor-pointer min-w-[160px]">
              <option value="">All Organization Types</option>
              {ORG_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>

            {/* Location */}
            <div className="relative min-w-[140px]">
              <input type="text" name="county" defaultValue={county} placeholder="Location..." className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
            </div>

            {/* Submit + Clear */}
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <FiFilter className="w-4 h-4" />
                Filter
              </button>
              {hasActiveFilters(params) && (
                <Link
                  href="/organizations"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-1.5 whitespace-nowrap"
                >
                  <FiX className="w-4 h-4" />
                  Clear
                </Link>
              )}
            </div>
          </form>

          {/* Active filter badges */}
          {hasActiveFilters(params) && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
              {q && (
                <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-xs font-medium px-3 py-1 rounded-full">
                  Search: &quot;{q}&quot;
                  <Link href={buildFilterUrl(params, { q: null })} className="hover:text-teal-900 ml-0.5">
                    <FiX className="w-3 h-3" />
                  </Link>
                </span>
              )}
              {industry && (
                <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-xs font-medium px-3 py-1 rounded-full">
                  {buildIndustryLabel(industry)}
                  <Link href={buildFilterUrl(params, { industry: null })} className="hover:text-teal-900 ml-0.5">
                    <FiX className="w-3 h-3" />
                  </Link>
                </span>
              )}
              {orgType && (
                <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-xs font-medium px-3 py-1 rounded-full">
                  {buildOrgTypeLabel(orgType)}
                  <Link href={buildFilterUrl(params, { orgType: null })} className="hover:text-teal-900 ml-0.5">
                    <FiX className="w-3 h-3" />
                  </Link>
                </span>
              )}
              {county && (
                <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-xs font-medium px-3 py-1 rounded-full">
                  📍 {county}
                  <Link href={buildFilterUrl(params, { county: null })} className="hover:text-teal-900 ml-0.5">
                    <FiX className="w-3 h-3" />
                  </Link>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Grid */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          <div>
            {companies.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {companies.map((c) => (
                  <Link key={c.id} href={`/organizations/${c.slug}`} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-teal-200 transition-all no-underline group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold overflow-hidden shrink-0" style={{ backgroundColor: c.logoColor || "#5B21B6" }}>
                        {c.logo ? <img src={c.logo} alt="" className="w-full h-full object-cover" /> : getInitials(c.name)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <h3 className="font-semibold text-gray-900 text-sm truncate group-hover:text-teal-600">{c.name}</h3>
                          {c.isVerified && <span className="text-teal-500 text-xs">✓</span>}
                        </div>
                        {c.industry && <p className="text-xs text-gray-500">{c.industry}</p>}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{[c.county, c.country].filter(Boolean).join(", ")}</span>
                      <span className="font-medium text-teal-600">{c._count.jobs} job{c._count.jobs !== 1 ? "s" : ""}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg mb-2">No companies found</p>
                <Link href="/organizations" className="text-sm text-teal-600 hover:underline">View all companies</Link>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {page > 1 && <a href={paginationUrl(page - 1)} className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-100">Previous</a>}
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                  <a key={p} href={paginationUrl(p)} className={`px-3 py-2 rounded-lg text-sm ${p === page ? "bg-teal-600 text-white" : "border border-gray-300 hover:bg-gray-100"}`}>{p}</a>
                ))}
                {page < totalPages && <a href={paginationUrl(page + 1)} className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-100">Next</a>}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <AdPlaceholder height="250px" />
            <div className="bg-gradient-to-r from-purple-50 to-teal-50 p-5 rounded-xl border border-teal-200 text-center">
              <h3 className="font-bold text-gray-900 mb-2">Are You an Employer?</h3>
              <p className="text-sm text-gray-600 mb-4">Post jobs and find top talent on Kenya&apos;s #1 job board.</p>
              <a href="https://wa.me/254786090635?text=Hi%20JobReady%2C%20I%27d%20like%20to%20post%20a%20job%20on%20your%20platform." target="_blank" rel="noopener noreferrer" className="inline-block w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors">Get Started →</a>
            </div>
            <AdPlaceholder height="200px" label="Sponsored" />
          </aside>
        </div>
      </div>

      {/* Sort navigation script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var select = document.getElementById('org-sort-select');
              if (!select) return;
              select.addEventListener('change', function() {
                var val = this.value;
                var links = select.parentElement.querySelectorAll('a[aria-label]');
                links.forEach(function(link) {
                  if (link.getAttribute('aria-label') === 'Sort by ' + select.options[select.selectedIndex].text) {
                    link.click();
                  }
                });
              });
            })();
          `,
        }}
      />
    </main>
  );
}
