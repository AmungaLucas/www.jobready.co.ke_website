import OrganizationFilterView from "../../_components/OrganizationFilterView";

export const revalidate = 120;

export async function generateMetadata({ searchParams }) {
  const { generateMeta } = await import("@/lib/seo");
  const sp = await searchParams;
  const q = sp.q || "";
  const title = q ? `${q} — State Corporations in Kenya` : "State Corporations in Kenya";
  const description = "Browse state corporations in Kenya. View profiles and open positions on JobReady Kenya.";
  return generateMeta({ title, description, path: "/organizations/state-corporations" });
}

export default async function StateCorporationsPage({ searchParams }) {
  return OrganizationFilterView({
    searchParams: await searchParams,
    pageTitle: "State Corporations in Kenya",
    pagePath: "/organizations/state-corporations",
    organizationType: "STATE_CORPORATION",
    breadcrumbName: "State Corporations",
    searchPlaceholder: "Search state corporations...",
    emptyTitle: "No state corporations found",
    emptyDescription: "No state corporations are currently listed. Check back soon!",
  });
}
