import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Manager Jobs in Kenya",
  pagePath: "/jobs/manager",
  filterKey: "experienceLevel",
  filterValue: "MANAGER",
  breadcrumbName: "Manager",
});

export default async function ManagerJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Manager Jobs in Kenya",
    pagePath: "/jobs/manager",
    filterKey: "experienceLevel",
    filterValue: "MANAGER",
    breadcrumbName: "Manager",
    searchPlaceholder: "Search manager jobs...",
    emptyTitle: "No manager jobs found",
    emptyDescription: "No manager positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "👔",
    sidebarTitle: "Management Roles",
    sidebarDescription: "Managers need CVs that show leadership and impact. Let our experts tell your story.",
  });
}
