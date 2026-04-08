import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Human Resources Jobs in Kenya",
  pagePath: "/jobs/human-resources",
  filterKey: "category",
  filterValue: "HUMAN_RESOURCES",
  breadcrumbName: "Human Resources",
});

export default async function HumanResourcesJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Human Resources Jobs in Kenya",
    pagePath: "/jobs/human-resources",
    filterKey: "category",
    filterValue: "HUMAN_RESOURCES",
    breadcrumbName: "Human Resources",
    searchPlaceholder: "Search human resources jobs...",
    emptyTitle: "No human resources jobs found",
    emptyDescription: "No HR positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "👥",
    sidebarTitle: "HR Careers",
    sidebarDescription: "HR professionals need CVs that reflect their people skills and strategic thinking.",
  });
}
