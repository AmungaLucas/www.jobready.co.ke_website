import OrganizationFilterView from "../../_components/OrganizationFilterView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const { generateMeta } = await import("@/lib/seo");
  const sp = await searchParams;
  const q = sp.q || "";
  const title = q ? `${q} — Foundations in Kenya` : "Foundations in Kenya";
  const description = "Browse foundations in Kenya. View profiles and open positions on JobReady Kenya.";
  return generateMeta({ title, description, path: "/organizations/foundations" });
}

export default async function FoundationsPage({ searchParams }) {
  return OrganizationFilterView({
    searchParams: await searchParams,
    pageTitle: "Foundations in Kenya",
    pagePath: "/organizations/foundations",
    organizationType: "FOUNDATION",
    breadcrumbName: "Foundations",
    searchPlaceholder: "Search foundations...",
    emptyTitle: "No foundations found",
    emptyDescription: "No foundations are currently listed. Check back soon!",
  });
}
