import OpportunityFilterView from "../../_components/OpportunityFilterView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const { generateMeta } = await import("@/lib/seo");
  const sp = await searchParams;
  const q = sp.get("q")?.trim();
  const title = q ? `${q} — Workshops in Kenya` : "Workshops in Kenya";
  const description = q
    ? `Search results for "${q}" in workshops. Find the latest workshops in Kenya. Apply now on JobReady Kenya.`
    : "Find the latest workshops in Kenya. Apply now on JobReady Kenya.";
  return generateMeta({ title, description, path: "/opportunities/workshops" });
}

export default async function WorkshopsPage({ searchParams }) {
  return OpportunityFilterView({
    searchParams: await searchParams,
    opportunityType: "WORKSHOP",
    pageTitle: "Workshops in Kenya",
    pagePath: "/opportunities/workshops",
    breadcrumbName: "Workshops",
    slug: "workshops",
    metaDescription: "Find the latest workshops in Kenya. Apply now on JobReady Kenya.",
    searchPlaceholder: "Search workshops...",
    emptyTitle: "No workshops found",
    emptyDescription: "No workshops are currently listed. Check back soon!",
    cardBadge: "Workshop",
    sidebarEmoji: "🎓",
    sidebarTitle: "Free CV Review",
    sidebarDescription: "Get expert feedback on your CV. Our career coaches will review it for free and help you land more interviews.",
  });
}
