import { siteConfig } from "@/config/site-config";
import OrganizationFilterView from "../../_components/OrganizationFilterView";

export const revalidate = 120;

export async function generateMetadata({ searchParams }) {
  const { generateMeta } = await import("@/lib/seo");
  const sp = await searchParams;
  const q = sp.q || "";
  const title = q ? `${q} — Government Agencies in Kenya` : "Government Agencies in Kenya";
  const description = `Browse government in Kenya. View profiles and open positions on ${siteConfig.companyName}.`;
  return generateMeta({ title, description, path: "/organizations/government" });
}

export default async function GovernmentPage({ searchParams }) {
  return OrganizationFilterView({
    searchParams: await searchParams,
    pageTitle: "Government Agencies in Kenya",
    pagePath: "/organizations/government",
    organizationType: "NATIONAL_GOV",
    breadcrumbName: "Government",
    searchPlaceholder: "Search government agencies...",
    emptyTitle: "No government agencies found",
    emptyDescription: "No government agencies are currently listed. Check back soon!",
  });
}
