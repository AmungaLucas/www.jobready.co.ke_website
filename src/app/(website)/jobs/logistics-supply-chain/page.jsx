import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Logistics & Supply Chain Jobs in Kenya",
  pagePath: "/jobs/logistics-supply-chain",
  filterKey: "category",
  filterValue: "SUPPLY_CHAIN",
  breadcrumbName: "Logistics & Supply Chain",
});

export default async function LogisticsSupplyChainJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Logistics & Supply Chain Jobs in Kenya",
    pagePath: "/jobs/logistics-supply-chain",
    filterKey: "category",
    filterValue: "SUPPLY_CHAIN",
    breadcrumbName: "Logistics & Supply Chain",
    searchPlaceholder: "Search logistics & supply chain jobs...",
    emptyTitle: "No logistics & supply chain jobs found",
    emptyDescription: "No logistics positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🚛",
    sidebarTitle: "Logistics Careers",
    sidebarDescription: "Supply chain CVs should highlight process optimization. Get yours done right.",
  });
}
