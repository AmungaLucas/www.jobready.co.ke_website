import OpportunityFilterView from "../../_components/OpportunityFilterView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const { generateMeta } = await import("@/lib/seo");
  const sp = await searchParams;
  const q = ((sp.q || "") || "").trim();
  const title = q ? `${q} — Residencies in Kenya` : "Residencies in Kenya";
  const description = q
    ? `Search results for "${q}" in residencies. Find the latest residencies in Kenya. Apply now on JobReady Kenya.`
    : "Find the latest residencies in Kenya. Apply now on JobReady Kenya.";
  return generateMeta({ title, description, path: "/opportunities/residencies" });
}

export default async function ResidenciesPage({ searchParams }) {
  return OpportunityFilterView({
    searchParams: await searchParams,
    opportunityType: "RESIDENCY",
    pageTitle: "Residencies in Kenya",
    pagePath: "/opportunities/residencies",
    breadcrumbName: "Residencies",
    slug: "residencies",
    metaDescription: "Find the latest residencies in Kenya. Apply now on JobReady Kenya.",
    searchPlaceholder: "Search residencies...",
    emptyTitle: "No residencies found",
    emptyDescription: "No residencies are currently listed. Check back soon!",
    cardBadge: "Residency",
    sidebarEmoji: "🎓",
    sidebarTitle: "Free CV Review",
    sidebarDescription: "Get expert feedback on your CV. Our career coaches will review it for free and help you land more interviews.",
  });
}
