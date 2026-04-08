import OpportunityFilterView from "../../_components/OpportunityFilterView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const { generateMeta } = await import("@/lib/seo");
  const sp = await searchParams;
  const q = sp.get("q")?.trim();
  const title = q ? `${q} — Bootcamps in Kenya` : "Bootcamps in Kenya";
  const description = q
    ? `Search results for "${q}" in bootcamps. Find the latest bootcamps in Kenya. Apply now on JobReady Kenya.`
    : "Find the latest bootcamps in Kenya. Apply now on JobReady Kenya.";
  return generateMeta({ title, description, path: "/opportunities/bootcamps" });
}

export default async function BootcampsPage({ searchParams }) {
  return OpportunityFilterView({
    searchParams: await searchParams,
    opportunityType: "BOOTCAMP",
    pageTitle: "Bootcamps in Kenya",
    pagePath: "/opportunities/bootcamps",
    breadcrumbName: "Bootcamps",
    slug: "bootcamps",
    metaDescription: "Find the latest bootcamps in Kenya. Apply now on JobReady Kenya.",
    searchPlaceholder: "Search bootcamps...",
    emptyTitle: "No bootcamps found",
    emptyDescription: "No bootcamps are currently listed. Check back soon!",
    cardBadge: "Bootcamp",
    sidebarEmoji: "🎓",
    sidebarTitle: "Free CV Review",
    sidebarDescription: "Get expert feedback on your CV. Our career coaches will review it for free and help you land more interviews.",
  });
}
