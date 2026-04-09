import OpportunityFilterView from "../../_components/OpportunityFilterView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const { generateMeta } = await import("@/lib/seo");
  const sp = await searchParams;
  const q = ((sp.q || "") || "").trim();
  const title = q ? `${q} — Funding Opportunities in Kenya` : "Funding Opportunities in Kenya";
  const description = q
    ? `Search results for "${q}" in funding. Find the latest funding opportunities in Kenya. Apply now on JobReady Kenya.`
    : "Find the latest funding opportunities in Kenya. Apply now on JobReady Kenya.";
  return generateMeta({ title, description, path: "/opportunities/funding" });
}

export default async function FundingPage({ searchParams }) {
  return OpportunityFilterView({
    searchParams: await searchParams,
    opportunityType: "FUNDING",
    pageTitle: "Funding Opportunities in Kenya",
    pagePath: "/opportunities/funding",
    breadcrumbName: "Funding",
    slug: "funding",
    metaDescription: "Find the latest funding opportunities in Kenya. Apply now on JobReady Kenya.",
    searchPlaceholder: "Search funding opportunities...",
    emptyTitle: "No funding opportunities found",
    emptyDescription: "No funding opportunities are currently listed. Check back soon!",
    cardBadge: "Funding",
    sidebarEmoji: "🎓",
    sidebarTitle: "Free CV Review",
    sidebarDescription: "Get expert feedback on your CV. Our career coaches will review it for free and help you land more interviews.",
  });
}
