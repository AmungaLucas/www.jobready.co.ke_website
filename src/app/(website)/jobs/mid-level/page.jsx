import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Mid Level Jobs in Kenya",
  pagePath: "/jobs/mid-level",
  filterKey: "experienceLevel",
  filterValue: "MID_LEVEL",
  breadcrumbName: "Mid Level",
});

export default async function MidLevelJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Mid Level Jobs in Kenya",
    pagePath: "/jobs/mid-level",
    filterKey: "experienceLevel",
    filterValue: "MID_LEVEL",
    breadcrumbName: "Mid Level",
    searchPlaceholder: "Search mid level jobs...",
    emptyTitle: "No mid level jobs found",
    emptyDescription: "No mid level positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "📈",
    sidebarTitle: "Level Up Your Career",
    sidebarDescription: "Mid-level roles demand a results-driven CV. Let our experts showcase your achievements.",
  });
}
