import { siteConfig } from "@/config/site-config";
import OrganizationFilterView from "../../_components/OrganizationFilterView";

export const revalidate = 120;

export async function generateMetadata({ searchParams }) {
  const { generateMeta } = await import("@/lib/seo");
  const sp = await searchParams;
  const q = sp.q || "";
  const title = q ? `${q} — SMEs in Kenya` : "SMEs in Kenya";
  const description = `Browse smes in Kenya. View profiles and open positions on ${siteConfig.companyName}.`;
  return generateMeta({ title, description, path: "/organizations/smes" });
}

export default async function SmesPage({ searchParams }) {
  return OrganizationFilterView({
    searchParams: await searchParams,
    pageTitle: "SMEs in Kenya",
    pagePath: "/organizations/smes",
    organizationType: "SMALL_BUSINESS",
    breadcrumbName: "SMEs",
    searchPlaceholder: "Search SMEs...",
    emptyTitle: "No SMEs found",
    emptyDescription: "No SMEs are currently listed. Check back soon!",
  });
}
