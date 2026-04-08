import OrganizationFilterView from "../../_components/OrganizationFilterView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const { generateMeta } = await import("@/lib/seo");
  const sp = await searchParams;
  const q = sp.q || "";
  const title = q ? `${q} — NGOs & Non-Profits in Kenya` : "NGOs & Non-Profits in Kenya";
  const description = "Browse ngos in Kenya. View profiles and open positions on JobReady Kenya.";
  return generateMeta({ title, description, path: "/organizations/ngos" });
}

export default async function NgosPage({ searchParams }) {
  return OrganizationFilterView({
    searchParams: await searchParams,
    pageTitle: "NGOs & Non-Profits in Kenya",
    pagePath: "/organizations/ngos",
    organizationType: "NGO",
    breadcrumbName: "NGOs",
    searchPlaceholder: "Search NGOs...",
    emptyTitle: "No NGOs found",
    emptyDescription: "No NGOs are currently listed. Check back soon!",
  });
}
