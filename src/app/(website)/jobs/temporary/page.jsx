import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Temporary Jobs in Kenya",
  pagePath: "/jobs/temporary",
  filterKey: "employmentType",
  filterValue: "TEMPORARY",
  breadcrumbName: "Temporary",
});

export default async function TemporaryJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Temporary Jobs in Kenya",
    pagePath: "/jobs/temporary",
    filterKey: "employmentType",
    filterValue: "TEMPORARY",
    breadcrumbName: "Temporary",
    searchPlaceholder: "Search temporary jobs...",
    emptyTitle: "No temporary jobs found",
    emptyDescription: "No temporary positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "⏱️",
    sidebarTitle: "Temp Opportunities",
    sidebarDescription: "Temporary roles are a great way to build experience. A polished CV helps you land the best ones.",
  });
}
