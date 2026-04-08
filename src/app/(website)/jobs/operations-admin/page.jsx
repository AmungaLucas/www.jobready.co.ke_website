import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Operations & Administration Jobs in Kenya",
  pagePath: "/jobs/operations-admin",
  filterKey: "category",
  filterValue: "OPERATIONS_ADMIN",
  breadcrumbName: "Operations & Admin",
});

export default async function OperationsAdminJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Operations & Administration Jobs in Kenya",
    pagePath: "/jobs/operations-admin",
    filterKey: "category",
    filterValue: "OPERATIONS_ADMIN",
    breadcrumbName: "Operations & Admin",
    searchPlaceholder: "Search operations & admin jobs...",
    emptyTitle: "No operations & admin jobs found",
    emptyDescription: "No operations positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "📁",
    sidebarTitle: "Operations Careers",
    sidebarDescription: "Operations CVs must show efficiency and organizational skills. Let our experts help.",
  });
}
