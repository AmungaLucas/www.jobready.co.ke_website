import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Senior Jobs in Kenya",
  pagePath: "/jobs/senior",
  filterKey: "experienceLevel",
  filterValue: "SENIOR",
  breadcrumbName: "Senior",
});

export default async function SeniorJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Senior Jobs in Kenya",
    pagePath: "/jobs/senior",
    filterKey: "experienceLevel",
    filterValue: "SENIOR",
    breadcrumbName: "Senior",
    searchPlaceholder: "Search senior jobs...",
    emptyTitle: "No senior jobs found",
    emptyDescription: "No senior positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🏆",
    sidebarTitle: "Senior Leadership",
    sidebarDescription: "Your experience deserves a world-class CV. Stand out with a professionally crafted resume.",
  });
}
