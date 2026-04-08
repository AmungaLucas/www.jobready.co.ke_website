import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Part Time Jobs in Kenya",
  pagePath: "/jobs/part-time",
  filterKey: "employmentType",
  filterValue: "PART_TIME",
  breadcrumbName: "Part Time",
});

export default async function PartTimeJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Part Time Jobs in Kenya",
    pagePath: "/jobs/part-time",
    filterKey: "employmentType",
    filterValue: "PART_TIME",
    breadcrumbName: "Part Time",
    searchPlaceholder: "Search part time jobs...",
    emptyTitle: "No part time jobs found",
    emptyDescription: "No part time positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "⏰",
    sidebarTitle: "Flexible Work",
    sidebarDescription: "Balance work and life with a polished CV that highlights your versatility and reliability.",
  });
}
