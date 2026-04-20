import { siteConfig } from "@/config/site-config";
import OrganizationFilterView from "../../_components/OrganizationFilterView";

export const revalidate = 120;

export async function generateMetadata({ searchParams }) {
  const { generateMeta } = await import("@/lib/seo");
  const sp = await searchParams;
  const q = sp.q || "";
  const title = q ? `${q} — Startups in Kenya` : "Startups in Kenya";
  const description = `Browse startups in Kenya. View profiles and open positions on ${siteConfig.companyName}.`;
  return generateMeta({ title, description, path: "/organizations/startups" });
}

export default async function StartupsPage({ searchParams }) {
  return OrganizationFilterView({
    searchParams: await searchParams,
    pageTitle: "Startups in Kenya",
    pagePath: "/organizations/startups",
    organizationType: "STARTUP",
    breadcrumbName: "Startups",
    searchPlaceholder: "Search startups...",
    emptyTitle: "No startups found",
    emptyDescription: "No startups are currently listed. Check back soon!",
  });
}
