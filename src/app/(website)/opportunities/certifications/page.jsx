import OpportunityFilterView from "../../_components/OpportunityFilterView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const { generateMeta } = await import("@/lib/seo");
  const sp = await searchParams;
  const q = sp.get("q")?.trim();
  const title = q ? `${q} — Certification Programs in Kenya` : "Certification Programs in Kenya";
  const description = q
    ? `Search results for "${q}" in certifications. Find the latest certification programs in Kenya. Apply now on JobReady Kenya.`
    : "Find the latest certification programs in Kenya. Apply now on JobReady Kenya.";
  return generateMeta({ title, description, path: "/opportunities/certifications" });
}

export default async function CertificationsPage({ searchParams }) {
  return OpportunityFilterView({
    searchParams: await searchParams,
    opportunityType: "CERTIFICATION",
    pageTitle: "Certification Programs in Kenya",
    pagePath: "/opportunities/certifications",
    breadcrumbName: "Certifications",
    slug: "certifications",
    metaDescription: "Find the latest certification programs in Kenya. Apply now on JobReady Kenya.",
    searchPlaceholder: "Search certification programs...",
    emptyTitle: "No certification programs found",
    emptyDescription: "No certification programs are currently listed. Check back soon!",
    cardBadge: "Certification",
    sidebarEmoji: "🎓",
    sidebarTitle: "Free CV Review",
    sidebarDescription: "Get expert feedback on your CV. Our career coaches will review it for free and help you land more interviews.",
  });
}
