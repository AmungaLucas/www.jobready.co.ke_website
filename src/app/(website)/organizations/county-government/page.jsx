import { siteConfig } from "@/config/site-config";
import OrganizationFilterView from "../../_components/OrganizationFilterView";

export const revalidate = 120;

export async function generateMetadata({ searchParams }) {
  const { generateMeta } = await import("@/lib/seo");
  const sp = await searchParams;
  const q = sp.q || "";
  const title = q ? `${q} — County Governments in Kenya` : "County Governments in Kenya";
  const description = "Browse county gov in Kenya. View profiles and open positions on ${siteConfig.companyName}.`;
  return generateMeta({ title, description, path: "/organizations/county-government" });
}

export default async function CountyGovernmentPage({ searchParams }) {
  return OrganizationFilterView({
    searchParams: await searchParams,
    pageTitle: "County Governments in Kenya",
    pagePath: "/organizations/county-government",
    organizationType: "COUNTY_GOV",
    breadcrumbName: "County Gov",
    searchPlaceholder: "Search county governments...",
    emptyTitle: "No county governments found",
    emptyDescription: "No county governments are currently listed. Check back soon!",
  });
}
