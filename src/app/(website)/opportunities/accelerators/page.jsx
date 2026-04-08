import OpportunityFilterView from "../../_components/OpportunityFilterView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const { generateMeta } = await import("@/lib/seo");
  const sp = await searchParams;
  const q = sp.get("q")?.trim();
  const title = q ? `${q} — Accelerator Programs in Kenya` : "Accelerator Programs in Kenya";
  const description = q
    ? `Search results for "${q}" in accelerator programs. Find the latest accelerator programs in Kenya. Apply now on JobReady Kenya.`
    : "Find the latest accelerator programs in Kenya. Apply now on JobReady Kenya.";
  return generateMeta({ title, description, path: "/opportunities/accelerators" });
}

export default async function AcceleratorsPage({ searchParams }) {
  return OpportunityFilterView({
    searchParams: await searchParams,
    opportunityType: "ACCELERATOR",
    pageTitle: "Accelerator Programs in Kenya",
    pagePath: "/opportunities/accelerators",
    breadcrumbName: "Accelerator Programs",
    slug: "accelerators",
    metaDescription: "Find the latest accelerator programs in Kenya. Apply now on JobReady Kenya.",
    searchPlaceholder: "Search accelerator programs...",
    emptyTitle: "No accelerator programs found",
    emptyDescription: "No accelerator programs are currently listed. Check back soon!",
    cardBadge: "Accelerator",
    sidebarEmoji: "🎓",
    sidebarTitle: "Free CV Review",
    sidebarDescription: "Get expert feedback on your CV. Our career coaches will review it for free and help you land more interviews.",
  });
}
