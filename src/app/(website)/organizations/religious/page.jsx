import { siteConfig } from "@/config/site-config";
import OrganizationFilterView from "../../_components/OrganizationFilterView";

export const revalidate = 120;

export async function generateMetadata({ searchParams }) {
  const { generateMeta } = await import("@/lib/seo");
  const sp = await searchParams;
  const q = sp.q || "";
  const title = q ? `${q} — Religious Organizations in Kenya` : "Religious Organizations in Kenya";
  const description = "Browse religious orgs in Kenya. View profiles and open positions on ${siteConfig.companyName}.`;
  return generateMeta({ title, description, path: "/organizations/religious" });
}

export default async function ReligiousPage({ searchParams }) {
  return OrganizationFilterView({
    searchParams: await searchParams,
    pageTitle: "Religious Organizations in Kenya",
    pagePath: "/organizations/religious",
    organizationType: "RELIGIOUS_ORG",
    breadcrumbName: "Religious Orgs",
    searchPlaceholder: "Search religious organizations...",
    emptyTitle: "No religious organizations found",
    emptyDescription: "No religious organizations are currently listed. Check back soon!",
  });
}
