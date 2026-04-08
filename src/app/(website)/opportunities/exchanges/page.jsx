import OpportunityFilterView from "../../_components/OpportunityFilterView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const { generateMeta } = await import("@/lib/seo");
  const sp = await searchParams;
  const q = sp.get("q")?.trim();
  const title = q ? `${q} — Exchange Programs in Kenya` : "Exchange Programs in Kenya";
  const description = q
    ? `Search results for "${q}" in exchange programs. Find the latest exchange programs in Kenya. Apply now on JobReady Kenya.`
    : "Find the latest exchange programs in Kenya. Apply now on JobReady Kenya.";
  return generateMeta({ title, description, path: "/opportunities/exchanges" });
}

export default async function ExchangesPage({ searchParams }) {
  return OpportunityFilterView({
    searchParams: await searchParams,
    opportunityType: "EXCHANGE",
    pageTitle: "Exchange Programs in Kenya",
    pagePath: "/opportunities/exchanges",
    breadcrumbName: "Exchange Programs",
    slug: "exchanges",
    metaDescription: "Find the latest exchange programs in Kenya. Apply now on JobReady Kenya.",
    searchPlaceholder: "Search exchange programs...",
    emptyTitle: "No exchange programs found",
    emptyDescription: "No exchange programs are currently listed. Check back soon!",
    cardBadge: "Exchange",
    sidebarEmoji: "🎓",
    sidebarTitle: "Free CV Review",
    sidebarDescription: "Get expert feedback on your CV. Our career coaches will review it for free and help you land more interviews.",
  });
}
