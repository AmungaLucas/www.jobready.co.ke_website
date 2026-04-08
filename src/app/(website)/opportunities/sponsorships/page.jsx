import OpportunityFilterView from "../../_components/OpportunityFilterView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const { generateMeta } = await import("@/lib/seo");
  const sp = await searchParams;
  const q = sp.get("q")?.trim();
  const title = q ? `${q} — Sponsorships in Kenya` : "Sponsorships in Kenya";
  const description = q
    ? `Search results for "${q}" in sponsorships. Find the latest sponsorships in Kenya. Apply now on JobReady Kenya.`
    : "Find the latest sponsorships in Kenya. Apply now on JobReady Kenya.";
  return generateMeta({ title, description, path: "/opportunities/sponsorships" });
}

export default async function SponsorshipsPage({ searchParams }) {
  return OpportunityFilterView({
    searchParams: await searchParams,
    opportunityType: "SPONSORSHIP",
    pageTitle: "Sponsorships in Kenya",
    pagePath: "/opportunities/sponsorships",
    breadcrumbName: "Sponsorships",
    slug: "sponsorships",
    metaDescription: "Find the latest sponsorships in Kenya. Apply now on JobReady Kenya.",
    searchPlaceholder: "Search sponsorships...",
    emptyTitle: "No sponsorships found",
    emptyDescription: "No sponsorships are currently listed. Check back soon!",
    cardBadge: "Sponsorship",
    sidebarEmoji: "🎓",
    sidebarTitle: "Free CV Review",
    sidebarDescription: "Get expert feedback on your CV. Our career coaches will review it for free and help you land more interviews.",
  });
}
