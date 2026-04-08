import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Customer Service Jobs in Kenya",
  pagePath: "/jobs/customer-service",
  filterKey: "category",
  filterValue: "CUSTOMER_SERVICE",
  breadcrumbName: "Customer Service",
});

export default async function CustomerServiceJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Customer Service Jobs in Kenya",
    pagePath: "/jobs/customer-service",
    filterKey: "category",
    filterValue: "CUSTOMER_SERVICE",
    breadcrumbName: "Customer Service",
    searchPlaceholder: "Search customer service jobs...",
    emptyTitle: "No customer service jobs found",
    emptyDescription: "No customer service positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🎧",
    sidebarTitle: "Customer Service",
    sidebarDescription: "Customer service CVs should highlight communication and problem-solving skills.",
  });
}
