import OpportunityFilterView from "../../_components/OpportunityFilterView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const { generateMeta } = await import("@/lib/seo");
  const sp = await searchParams;
  const q = ((sp.q || "") || "").trim();
  const title = q ? `${q} — Mentorship Programs in Kenya` : "Mentorship Programs in Kenya";
  const description = q
    ? `Search results for "${q}" in mentorship programs. Find the latest mentorship programs in Kenya. Apply now on JobReady Kenya.`
    : "Find the latest mentorship programs in Kenya. Apply now on JobReady Kenya.";
  return generateMeta({ title, description, path: "/opportunities/mentorships" });
}

export default async function MentorshipsPage({ searchParams }) {
  return OpportunityFilterView({
    searchParams: await searchParams,
    opportunityType: "MENTORSHIP",
    pageTitle: "Mentorship Programs in Kenya",
    pagePath: "/opportunities/mentorships",
    breadcrumbName: "Mentorship Programs",
    slug: "mentorships",
    metaDescription: "Find the latest mentorship programs in Kenya. Apply now on JobReady Kenya.",
    searchPlaceholder: "Search mentorship programs...",
    emptyTitle: "No mentorship programs found",
    emptyDescription: "No mentorship programs are currently listed. Check back soon!",
    cardBadge: "Mentorship",
    sidebarEmoji: "🎓",
    sidebarTitle: "Free CV Review",
    sidebarDescription: "Get expert feedback on your CV. Our career coaches will review it for free and help you land more interviews.",
  });
}
