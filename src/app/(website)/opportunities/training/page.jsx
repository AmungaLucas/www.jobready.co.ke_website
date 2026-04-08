import OpportunityFilterView from "../../_components/OpportunityFilterView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const { generateMeta } = await import("@/lib/seo");
  const sp = await searchParams;
  const q = sp.get("q")?.trim();
  const title = q ? `${q} — Training Programs in Kenya` : "Training Programs in Kenya";
  const description = q
    ? `Search results for "${q}" in training programs. Find the latest training programs in Kenya. Apply now on JobReady Kenya.`
    : "Find the latest training programs in Kenya. Apply now on JobReady Kenya.";
  return generateMeta({ title, description, path: "/opportunities/training" });
}

export default async function TrainingPage({ searchParams }) {
  return OpportunityFilterView({
    searchParams: await searchParams,
    opportunityType: "TRAINING",
    pageTitle: "Training Programs in Kenya",
    pagePath: "/opportunities/training",
    breadcrumbName: "Training Programs",
    slug: "training",
    metaDescription: "Find the latest training programs in Kenya. Apply now on JobReady Kenya.",
    searchPlaceholder: "Search training programs...",
    emptyTitle: "No training programs found",
    emptyDescription: "No training programs are currently listed. Check back soon!",
    cardBadge: "Training",
    sidebarEmoji: "🎓",
    sidebarTitle: "Free CV Review",
    sidebarDescription: "Get expert feedback on your CV. Our career coaches will review it for free and help you land more interviews.",
  });
}
