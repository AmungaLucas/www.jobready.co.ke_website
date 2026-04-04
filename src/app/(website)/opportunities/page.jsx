import Link from "next/link";
import Script from "next/script";
import { FiChevronRight, FiTrendingUp } from "react-icons/fi";

import OpportunitySearchHero from "./_components/OpportunitySearchHero";
import OpportunityFilters from "./_components/OpportunityFilters";
import OpportunityCard from "../_components/OpportunityCard";
import CVReviewCTA from "../_components/CVReviewCTA";
import NewsletterForm from "../_components/NewsletterForm";
import AdSlot from "../_components/AdSlot";
import SidebarCard from "../_components/SidebarCard";
import Badge from "../_components/Badge";
import Pagination from "../_components/Pagination";
import { generateMeta, generateBreadcrumbJsonLd, generateCollectionPageJsonLd } from "@/lib/seo";
import { getOpportunityHubs } from "@/config/hub-config";

// ─── SEO ───────────────────────────────────────────────────
export async function generateMetadata() {
  return generateMeta({
    title: "Opportunities — Scholarships, Grants, Fellowships & More",
    description:
      "Discover the latest scholarships, grants, fellowships, bursaries, competitions, and volunteer opportunities for Kenyans. Updated daily on JobReady.co.ke",
    path: "/opportunities",
  });
}

const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: "Home", href: "/" },
  { name: "Opportunities", href: "/opportunities" },
]);

// ─── Data Fetching ─────────────────────────────────────────
async function fetchOpportunities(params = {}) {
  const query = new URLSearchParams(params);
  const res = await fetch(`/api/opportunities?${query.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) return { opportunities: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } };
  return res.json();
}

// ─── Related Hubs (static from hub-config) ─────────────────
function getRelatedHubs() {
  return getOpportunityHubs().map((h) => ({
    slug: h.slug,
    name: h.name.replace(/\s*2026\s*$/, "").replace(" for Kenyans", "").replace(" in Kenya", "").replace(" & Abroad", ""),
    count: "—",
  }));
}

// ─── PAGE ──────────────────────────────────────────────────
export default async function OpportunitiesPage() {
  // Fetch featured and all opportunities in parallel
  const [featuredData, allData] = await Promise.all([
    fetchOpportunities({ sort: "featured", limit: "10" }),
    fetchOpportunities({ limit: "20" }),
  ]);

  const featuredOpportunities = featuredData.opportunities.filter((o) => o.isFeatured);
  const allOpportunities = allData.opportunities;
  const totalOpportunities = allData.pagination.total;
  const relatedHubs = getRelatedHubs();

  const collectionJsonLd = generateCollectionPageJsonLd({
    name: "Opportunities for Kenyans",
    description: "Scholarships, grants, fellowships, bursaries, competitions, and volunteer opportunities in Kenya.",
    url: "/opportunities",
    totalItems: totalOpportunities,
  });

  return (
    <>
      {/* JSON-LD */}
      <Script
        id="opp-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="opp-collection-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      {/* 1. HERO */}
      <OpportunitySearchHero totalOpportunities={totalOpportunities} />

      {/* 2. FILTER TABS */}
      <OpportunityFilters />

      {/* 3. MAIN LAYOUT */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          {/* ─── LEFT COLUMN ─── */}
          <div>
            {/* Featured Opportunities */}
            {featuredOpportunities.length > 0 && (
              <div className="mb-7">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <FiTrendingUp className="w-5 h-5 text-amber-500" />
                    Featured Opportunities
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                  {featuredOpportunities.map((opp) => (
                    <div key={opp.id} className="relative">
                      <Badge variant="warning" size="sm" className="absolute top-2.5 left-2.5 z-10">
                        Featured
                      </Badge>
                      <OpportunityCard
                        title={opp.title}
                        slug={opp.slug}
                        organizationName={opp.organizationName}
                        opportunityType={opp.opportunityType}
                        type={opp.opportunityType?.toLowerCase()}
                        deadline={opp.deadline}
                        value={opp.value}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Opportunities */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-900">
                  All Opportunities
                  <span className="text-sm font-medium text-gray-400 ml-2">
                    ({totalOpportunities})
                  </span>
                </h2>
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {allOpportunities.length > 0 ? (
                  allOpportunities.map((opp) => (
                    <div key={opp.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                      <OpportunityCard
                        title={opp.title}
                        slug={opp.slug}
                        organizationName={opp.organizationName}
                        opportunityType={opp.opportunityType}
                        type={opp.opportunityType?.toLowerCase()}
                        deadline={opp.deadline}
                        value={opp.value}
                      />
                    </div>
                  ))
                ) : (
                  <div className="py-16 text-center">
                    <p className="text-gray-500 text-sm mb-4">No opportunities found. Check back soon!</p>
                  </div>
                )}
              </div>

              {/* Service Nudge */}
              <div className="mt-6 bg-white border border-gray-200 border-l-4 border-l-primary rounded-lg p-4 px-5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-[18px] h-[18px] text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-[0.85rem] text-gray-600 leading-relaxed">
                    Applying for a scholarship or fellowship? Make your application stand out with a professional CV.{" "}
                    <Link href="/cv-services" className="font-semibold text-primary hover:text-primary-dark no-underline">
                      Get Your CV Done from KSh 500 &rarr;
                    </Link>
                  </p>
                </div>
              </div>

              {/* Inline Ad */}
              <AdSlot position="inline" />
            </div>
          </div>

          {/* ─── RIGHT SIDEBAR ─── */}
          <aside className="space-y-0">
            {/* CV Review CTA */}
            <CVReviewCTA />

            {/* Related Hubs */}
            <SidebarCard title="Browse by Type" icon={FiTrendingUp}>
              <div className="space-y-0">
                {relatedHubs.map((hub) => (
                  <Link
                    key={hub.slug}
                    href={`/opportunities/${hub.slug}`}
                    className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-b-0 hover:text-primary transition-colors group no-underline"
                  >
                    <span className="text-[0.85rem] font-medium text-gray-700 group-hover:text-primary">
                      {hub.name}
                    </span>
                    <span className="flex items-center gap-1.5 text-[0.72rem] text-gray-400">
                      <FiChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </SidebarCard>

            {/* Ad Slot */}
            <AdSlot position="sidebar" />

            {/* Newsletter */}
            <SidebarCard title="Opportunity Alerts" icon={FiTrendingUp}>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                Get the latest scholarships, grants, and fellowships delivered to your inbox weekly.
              </p>
              <NewsletterForm type="opportunity_alerts" />
            </SidebarCard>
          </aside>
        </div>
      </main>
    </>
  );
}
