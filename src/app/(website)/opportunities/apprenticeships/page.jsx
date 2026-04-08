import OpportunityFilterView from "../../_components/OpportunityFilterView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const { generateMeta } = await import("@/lib/seo");
  const sp = await searchParams;
  const q = sp.get("q")?.trim();
  const title = q ? `${q} — Apprenticeships in Kenya` : "Apprenticeships in Kenya";
  const description = q
    ? `Search results for "${q}" in apprenticeships. Find the latest apprenticeships in Kenya. Apply now on JobReady Kenya.`
    : "Find the latest apprenticeships in Kenya. Apply now on JobReady Kenya.";
  return generateMeta({ title, description, path: "/opportunities/apprenticeships" });
}

export default async function ApprenticeshipsPage({ searchParams }) {
  return OpportunityFilterView({
    searchParams: await searchParams,
    opportunityType: "APPRENTICESHIP",
    pageTitle: "Apprenticeships in Kenya",
    pagePath: "/opportunities/apprenticeships",
    breadcrumbName: "Apprenticeships",
    slug: "apprenticeships",
    metaDescription: "Find the latest apprenticeships in Kenya. Apply now on JobReady Kenya.",
    searchPlaceholder: "Search apprenticeships...",
    emptyTitle: "No apprenticeships found",
    emptyDescription: "No apprenticeships are currently listed. Check back soon!",
    cardBadge: "Apprenticeship",
    sidebarEmoji: "🎓",
    sidebarTitle: "Free CV Review",
    sidebarDescription: "Get expert feedback on your CV. Our career coaches will review it for free and help you land more interviews.",
  });
}
