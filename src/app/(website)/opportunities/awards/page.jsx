import OpportunityFilterView from "../../_components/OpportunityFilterView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const { generateMeta } = await import("@/lib/seo");
  const sp = await searchParams;
  const q = sp.get("q")?.trim();
  const title = q ? `${q} — Awards in Kenya` : "Awards in Kenya";
  const description = q
    ? `Search results for "${q}" in awards. Find the latest awards in Kenya. Apply now on JobReady Kenya.`
    : "Find the latest awards in Kenya. Apply now on JobReady Kenya.";
  return generateMeta({ title, description, path: "/opportunities/awards" });
}

export default async function AwardsPage({ searchParams }) {
  return OpportunityFilterView({
    searchParams: await searchParams,
    opportunityType: "AWARD",
    pageTitle: "Awards in Kenya",
    pagePath: "/opportunities/awards",
    breadcrumbName: "Awards",
    slug: "awards",
    metaDescription: "Find the latest awards in Kenya. Apply now on JobReady Kenya.",
    searchPlaceholder: "Search awards...",
    emptyTitle: "No awards found",
    emptyDescription: "No awards are currently listed. Check back soon!",
    cardBadge: "Award",
    sidebarEmoji: "🎓",
    sidebarTitle: "Free CV Review",
    sidebarDescription: "Get expert feedback on your CV. Our career coaches will review it for free and help you land more interviews.",
  });
}
