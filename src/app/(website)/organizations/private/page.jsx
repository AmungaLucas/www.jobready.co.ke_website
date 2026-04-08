import OrganizationFilterView from "../../_components/OrganizationFilterView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const { generateMeta } = await import("@/lib/seo");
  const sp = await searchParams;
  const q = sp.q || "";
  const title = q ? `${q} — Private Sector Companies in Kenya` : "Private Sector Companies in Kenya";
  const description = "Browse private sector in Kenya. View profiles and open positions on JobReady Kenya.";
  return generateMeta({ title, description, path: "/organizations/private" });
}

export default async function PrivatePage({ searchParams }) {
  return OrganizationFilterView({
    searchParams: await searchParams,
    pageTitle: "Private Sector Companies in Kenya",
    pagePath: "/organizations/private",
    organizationType: "PRIVATE",
    breadcrumbName: "Private Sector",
    searchPlaceholder: "Search private sector companies...",
    emptyTitle: "No private sector companies found",
    emptyDescription: "No private sector companies are currently listed. Check back soon!",
  });
}
