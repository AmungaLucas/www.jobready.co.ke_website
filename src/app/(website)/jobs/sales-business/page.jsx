import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Sales & Business Development Jobs in Kenya",
  pagePath: "/jobs/sales-business",
  filterKey: "category",
  filterValue: "SALES_BUSINESS",
  breadcrumbName: "Sales & Business Dev",
});

export default async function SalesBusinessJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Sales & Business Development Jobs in Kenya",
    pagePath: "/jobs/sales-business",
    filterKey: "category",
    filterValue: "SALES_BUSINESS",
    breadcrumbName: "Sales & Business Dev",
    searchPlaceholder: "Search sales & business development jobs...",
    emptyTitle: "No sales & business development jobs found",
    emptyDescription: "No sales positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "📊",
    sidebarTitle: "Sales Excellence",
    sidebarDescription: "Sales CVs need numbers that impress. Let our experts highlight your achievements.",
  });
}
