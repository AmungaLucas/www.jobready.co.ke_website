import { siteConfig } from "@/config/site-config";
import OrganizationFilterView from "../../_components/OrganizationFilterView";

export const revalidate = 120;

export async function generateMetadata({ searchParams }) {
  const { generateMeta } = await import("@/lib/seo");
  const sp = await searchParams;
  const q = sp.q || "";
  const title = q ? `${q} — Universities & Academic Institutions in Kenya` : "Universities & Academic Institutions in Kenya";
  const description = `Browse universities in Kenya. View profiles and open positions on ${siteConfig.companyName}.`;
  return generateMeta({ title, description, path: "/organizations/universities" });
}

export default async function UniversitiesPage({ searchParams }) {
  return OrganizationFilterView({
    searchParams: await searchParams,
    pageTitle: "Universities & Academic Institutions in Kenya",
    pagePath: "/organizations/universities",
    organizationType: "EDUCATION",
    breadcrumbName: "Universities",
    searchPlaceholder: "Search universities...",
    emptyTitle: "No universities found",
    emptyDescription: "No universities are currently listed. Check back soon!",
  });
}
