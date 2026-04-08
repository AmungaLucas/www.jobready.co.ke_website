import OpportunityFilterView from "../../_components/OpportunityFilterView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const { generateMeta } = await import("@/lib/seo");
  const sp = await searchParams;
  const q = sp.get("q")?.trim();
  const title = q ? `${q} — Conferences in Kenya` : "Conferences in Kenya";
  const description = q
    ? `Search results for "${q}" in conferences. Find the latest conferences in Kenya. Apply now on JobReady Kenya.`
    : "Find the latest conferences in Kenya. Apply now on JobReady Kenya.";
  return generateMeta({ title, description, path: "/opportunities/conferences" });
}

export default async function ConferencesPage({ searchParams }) {
  return OpportunityFilterView({
    searchParams: await searchParams,
    opportunityType: "CONFERENCE",
    pageTitle: "Conferences in Kenya",
    pagePath: "/opportunities/conferences",
    breadcrumbName: "Conferences",
    slug: "conferences",
    metaDescription: "Find the latest conferences in Kenya. Apply now on JobReady Kenya.",
    searchPlaceholder: "Search conferences...",
    emptyTitle: "No conferences found",
    emptyDescription: "No conferences are currently listed. Check back soon!",
    cardBadge: "Conference",
    sidebarEmoji: "🎓",
    sidebarTitle: "Free CV Review",
    sidebarDescription: "Get expert feedback on your CV. Our career coaches will review it for free and help you land more interviews.",
  });
}
