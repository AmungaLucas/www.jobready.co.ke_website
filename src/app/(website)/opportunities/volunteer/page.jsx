import OpportunityFilterView from "../../_components/OpportunityFilterView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const { generateMeta } = await import("@/lib/seo");
  const sp = await searchParams;
  const q = ((sp.q || "") || "").trim();
  const title = q ? `${q} — Volunteer Opportunities in Kenya` : "Volunteer Opportunities in Kenya";
  const description = q
    ? `Search results for "${q}" in volunteer. Find the latest volunteer opportunities in Kenya. Apply now on JobReady Kenya.`
    : "Find the latest volunteer opportunities in Kenya. Apply now on JobReady Kenya.";
  return generateMeta({ title, description, path: "/opportunities/volunteer" });
}

export default async function VolunteerPage({ searchParams }) {
  return OpportunityFilterView({
    searchParams: await searchParams,
    opportunityType: "VOLUNTEER",
    pageTitle: "Volunteer Opportunities in Kenya",
    pagePath: "/opportunities/volunteer",
    breadcrumbName: "Volunteer",
    slug: "volunteer",
    metaDescription: "Find the latest volunteer opportunities in Kenya. Apply now on JobReady Kenya.",
    searchPlaceholder: "Search volunteer opportunities...",
    emptyTitle: "No volunteer opportunities found",
    emptyDescription: "No volunteer opportunities are currently listed. Check back soon!",
    cardBadge: "Volunteer",
    sidebarEmoji: "🎓",
    sidebarTitle: "Free CV Review",
    sidebarDescription: "Get expert feedback on your CV. Our career coaches will review it for free and help you land more interviews.",
  });
}
