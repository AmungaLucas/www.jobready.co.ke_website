import OpportunityFilterView from "../../_components/OpportunityFilterView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const { generateMeta } = await import("@/lib/seo");
  const sp = await searchParams;
  const q = sp.get("q")?.trim();
  const title = q ? `${q} — Competitions in Kenya` : "Competitions in Kenya";
  const description = q
    ? `Search results for "${q}" in competitions. Find the latest competitions in Kenya. Apply now on JobReady Kenya.`
    : "Find the latest competitions in Kenya. Apply now on JobReady Kenya.";
  return generateMeta({ title, description, path: "/opportunities/competitions" });
}

export default async function CompetitionsPage({ searchParams }) {
  return OpportunityFilterView({
    searchParams: await searchParams,
    opportunityType: "COMPETITION",
    pageTitle: "Competitions in Kenya",
    pagePath: "/opportunities/competitions",
    breadcrumbName: "Competitions",
    slug: "competitions",
    metaDescription: "Find the latest competitions in Kenya. Apply now on JobReady Kenya.",
    searchPlaceholder: "Search competitions...",
    emptyTitle: "No competitions found",
    emptyDescription: "No competitions are currently listed. Check back soon!",
    cardBadge: "Competition",
    sidebarEmoji: "🎓",
    sidebarTitle: "Free CV Review",
    sidebarDescription: "Get expert feedback on your CV. Our career coaches will review it for free and help you land more interviews.",
  });
}
