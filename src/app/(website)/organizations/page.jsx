import { db } from "@/lib/db";
import { generateMeta, generateBreadcrumbJsonLd } from "@/lib/seo";
import Link from "next/link";
import { getInitials } from "@/lib/normalize";
import AdPlaceholder from "../_components/AdPlaceholder";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const q = sp.q || "";
  return generateMeta({
    title: q ? `${q} — Companies & Employers` : "Companies & Employers in Kenya",
    description: "Browse top employers and companies hiring in Kenya. View company profiles, open positions, and apply directly.",
    path: "/organizations",
  });
}

export default async function OrganizationsPage({ searchParams }) {
  const q = (await searchParams).q || "";
  const industry = (await searchParams).industry || "";
  const county = (await searchParams).county || "";
  const page = parseInt((await searchParams).page || "1", 10);
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

  const [companies, total] = await Promise.all([
    db.company.findMany({
      where,
      select: {
        id: true, name: true, slug: true, logo: true, logoColor: true,
        industry: true, county: true, country: true, website: true,
        isVerified: true, createdAt: true,
        _count: { select: { jobs: { where: { status: "PUBLISHED", isActive: true } } } },
      },
      orderBy: { createdAt: "desc" },
      skip, take: limit,
    }),
    db.company.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Companies", href: "/organizations" },
  ];
  if (q) breadcrumbs.push({ name: q, href: `/organizations?q=${encodeURIComponent(q)}` });

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
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Companies &amp; Employers</h1>
          <p className="text-gray-500 mt-1">{total} companies hiring in Kenya</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <form className="flex-1 min-w-[200px]">
            <input type="text" name="q" defaultValue={q} placeholder="Search companies..." className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </form>
          <select name="industry" defaultValue={industry} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
            <option value="">All Industries</option>
            <option value="Technology">Technology</option>
            <option value="Finance">Finance &amp; Banking</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Government">Government</option>
            <option value="NGO">NGO / Non-Profit</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Retail">Retail &amp; E-Commerce</option>
          </select>
          <input type="text" name="county" defaultValue={county} placeholder="Location..." className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          {(q || industry || county) && (
            <a href="/organizations" className="px-4 py-2 text-sm text-red-500 hover:text-red-700">Clear</a>
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
                {page > 1 && <a href={`/organizations?page=${page-1}&q=${encodeURIComponent(q)}&industry=${industry}&county=${county}`} className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-100">Previous</a>}
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                  <a key={p} href={`/organizations?page=${p}&q=${encodeURIComponent(q)}&industry=${industry}&county=${county}`} className={`px-3 py-2 rounded-lg text-sm ${p === page ? "bg-teal-600 text-white" : "border border-gray-300 hover:bg-gray-100"}`}>{p}</a>
                ))}
                {page < totalPages && <a href={`/organizations?page=${page+1}&q=${encodeURIComponent(q)}&industry=${industry}&county=${county}`} className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-100">Next</a>}
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
    </main>
  );
}
