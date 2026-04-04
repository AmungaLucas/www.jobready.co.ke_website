import Link from "next/link";
import Script from "next/script";
import { generateMeta, generateBreadcrumbJsonLd, generateCollectionPageJsonLd } from "@/lib/seo";
import OrganizationsContent from "./_components/OrganizationsContent";

export const metadata = generateMeta({
  title: "Top Employers in Kenya — Browse Companies Hiring Now",
  description:
    "Explore top Kenyan companies hiring now. Browse verified employers across Banking, Tech, Telecom, NGOs, and more. Find your next employer on JobReady.co.ke.",
  path: "/organizations",
});

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Companies", href: "/organizations" },
];

const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);

const collectionJsonLd = generateCollectionPageJsonLd({
  name: "Top Employers in Kenya",
  description: "Explore verified companies hiring across Kenya — Banking, Tech, Telecom, NGOs, and more.",
  url: "/organizations",
  totalItems: 500,
});

// ─── Data Fetching ─────────────────────────────────────────
async function fetchCompanies(params = {}) {
  const query = new URLSearchParams(params);
  const res = await fetch(`/api/companies?${query.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) return { companies: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } };
  return res.json();
}

export default async function OrganizationsPage() {
  const data = await fetchCompanies({ limit: "50", sort: "featured" });
  const companies = data.companies || [];

  return (
    <>
      {/* JSON-LD */}
      <Script
        id="org-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="org-collection-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-white/5 pointer-events-none" />
        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold mb-4 border border-white/20">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
              Top Employers
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 tracking-tight">
              Top Employers in Kenya
            </h1>
            <p className="text-base opacity-85 leading-relaxed max-w-xl mx-auto">
              Explore verified companies hiring in Kenya. From multinational corporations
              to innovative startups, find your next employer.
            </p>
            <nav className="flex items-center justify-center gap-1.5 mt-5 text-sm opacity-70">
              <Link href="/" className="hover:text-white transition-colors no-underline text-white/85">
                Home
              </Link>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              <span>Companies</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Interactive content */}
      <OrganizationsContent companies={companies} />
    </>
  );
}
