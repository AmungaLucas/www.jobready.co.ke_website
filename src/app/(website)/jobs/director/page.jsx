import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Director Jobs in Kenya",
  pagePath: "/jobs/director",
  filterKey: "experienceLevel",
  filterValue: "DIRECTOR",
  breadcrumbName: "Director",
});

export default async function DirectorJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Director Jobs in Kenya",
    pagePath: "/jobs/director",
    filterKey: "experienceLevel",
    filterValue: "DIRECTOR",
    breadcrumbName: "Director",
    searchPlaceholder: "Search director jobs...",
    emptyTitle: "No director jobs found",
    emptyDescription: "No director positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🏛️",
    sidebarTitle: "Executive Positions",
    sidebarDescription: "Director-level roles demand an executive CV. Stand out with our premium CV writing service.",
  });
}
