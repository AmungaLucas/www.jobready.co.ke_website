import OpportunityFilterView from "../../_components/OpportunityFilterView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const { generateMeta } = await import("@/lib/seo");
  const sp = await searchParams;
  const q = sp.get("q")?.trim();
  const title = q ? `${q} — Incubator Programs in Kenya` : "Incubator Programs in Kenya";
  const description = q
    ? `Search results for "${q}" in incubator programs. Find the latest incubator programs in Kenya. Apply now on JobReady Kenya.`
    : "Find the latest incubator programs in Kenya. Apply now on JobReady Kenya.";
  return generateMeta({ title, description, path: "/opportunities/incubators" });
}

export default async function IncubatorsPage({ searchParams }) {
  return OpportunityFilterView({
    searchParams: await searchParams,
    opportunityType: "INCUBATOR",
    pageTitle: "Incubator Programs in Kenya",
    pagePath: "/opportunities/incubators",
    breadcrumbName: "Incubator Programs",
    slug: "incubators",
    metaDescription: "Find the latest incubator programs in Kenya. Apply now on JobReady Kenya.",
    searchPlaceholder: "Search incubator programs...",
    emptyTitle: "No incubator programs found",
    emptyDescription: "No incubator programs are currently listed. Check back soon!",
    cardBadge: "Incubator",
    sidebarEmoji: "🎓",
    sidebarTitle: "Free CV Review",
    sidebarDescription: "Get expert feedback on your CV. Our career coaches will review it for free and help you land more interviews.",
  });
}
