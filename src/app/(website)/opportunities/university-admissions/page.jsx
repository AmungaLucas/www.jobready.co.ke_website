import OpportunityFilterView from "../../_components/OpportunityFilterView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const { generateMeta } = await import("@/lib/seo");
  const sp = await searchParams;
  const q = ((sp.q || "") || "").trim();
  const title = q ? `${q} — University Admissions in Kenya` : "University Admissions in Kenya";
  const description = q
    ? `Search results for "${q}" in university admissions. Find the latest university admissions in Kenya. Apply now on JobReady Kenya.`
    : "Find the latest university admissions in Kenya. Apply now on JobReady Kenya.";
  return generateMeta({ title, description, path: "/opportunities/university-admissions" });
}

export default async function UniversityAdmissionsPage({ searchParams }) {
  return OpportunityFilterView({
    searchParams: await searchParams,
    opportunityType: "UNIVERSITY_ADMISSION",
    pageTitle: "University Admissions in Kenya",
    pagePath: "/opportunities/university-admissions",
    breadcrumbName: "University Admissions",
    slug: "university-admissions",
    metaDescription: "Find the latest university admissions in Kenya. Apply now on JobReady Kenya.",
    searchPlaceholder: "Search university admissions...",
    emptyTitle: "No university admissions found",
    emptyDescription: "No university admissions are currently listed. Check back soon!",
    cardBadge: "University Admission",
    sidebarEmoji: "🎓",
    sidebarTitle: "Free CV Review",
    sidebarDescription: "Get expert feedback on your CV. Our career coaches will review it for free and help you land more interviews.",
  });
}
