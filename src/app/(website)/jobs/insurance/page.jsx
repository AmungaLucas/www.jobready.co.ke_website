import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Insurance Jobs in Kenya",
  pagePath: "/jobs/insurance",
  filterKey: "category",
  filterValue: "INSURANCE",
  breadcrumbName: "Insurance",
});

export default async function InsuranceJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Insurance Jobs in Kenya",
    pagePath: "/jobs/insurance",
    filterKey: "category",
    filterValue: "INSURANCE",
    breadcrumbName: "Insurance",
    searchPlaceholder: "Search insurance jobs...",
    emptyTitle: "No insurance jobs found",
    emptyDescription: "No insurance positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🛡️",
    sidebarTitle: "Insurance Careers",
    sidebarDescription: "Insurance CVs should highlight expertise and client relationships. Let our experts help.",
  });
}
