import OrganizationFilterView from "../../_components/OrganizationFilterView";

export const revalidate = 120;

export async function generateMetadata({ searchParams }) {
  const { generateMeta } = await import("@/lib/seo");
  const sp = await searchParams;
  const q = sp.q || "";
  const title = q ? `${q} — International Organizations in Kenya` : "International Organizations in Kenya";
  const description = "Browse international orgs in Kenya. View profiles and open positions on JobReady Kenya.";
  return generateMeta({ title, description, path: "/organizations/international" });
}

export default async function InternationalPage({ searchParams }) {
  return OrganizationFilterView({
    searchParams: await searchParams,
    pageTitle: "International Organizations in Kenya",
    pagePath: "/organizations/international",
    organizationType: "INTERNATIONAL_ORG",
    breadcrumbName: "International Orgs",
    searchPlaceholder: "Search international organizations...",
    emptyTitle: "No international organizations found",
    emptyDescription: "No international organizations are currently listed. Check back soon!",
  });
}
