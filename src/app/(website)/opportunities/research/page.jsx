import OpportunityFilterView from "../../_components/OpportunityFilterView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const { generateMeta } = await import("@/lib/seo");
  const sp = await searchParams;
  const q = sp.get("q")?.trim();
  const title = q ? `${q} — Research Opportunities in Kenya` : "Research Opportunities in Kenya";
  const description = q
    ? `Search results for "${q}" in research opportunities. Find the latest research opportunities in Kenya. Apply now on JobReady Kenya.`
    : "Find the latest research opportunities in Kenya. Apply now on JobReady Kenya.";
  return generateMeta({ title, description, path: "/opportunities/research" });
}

export default async function ResearchPage({ searchParams }) {
  return OpportunityFilterView({
    searchParams: await searchParams,
    opportunityType: "RESEARCH",
    pageTitle: "Research Opportunities in Kenya",
    pagePath: "/opportunities/research",
    breadcrumbName: "Research Opportunities",
    slug: "research",
    metaDescription: "Find the latest research opportunities in Kenya. Apply now on JobReady Kenya.",
    searchPlaceholder: "Search research opportunities...",
    emptyTitle: "No research opportunities found",
    emptyDescription: "No research opportunities are currently listed. Check back soon!",
    cardBadge: "Research",
    sidebarEmoji: "🎓",
    sidebarTitle: "Free CV Review",
    sidebarDescription: "Get expert feedback on your CV. Our career coaches will review it for free and help you land more interviews.",
  });
}
