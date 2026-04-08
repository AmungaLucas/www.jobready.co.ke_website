import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Full Time Jobs in Kenya",
  pagePath: "/jobs/full-time",
  filterKey: "employmentType",
  filterValue: "FULL_TIME",
  breadcrumbName: "Full Time",
});

export default async function FullTimeJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Full Time Jobs in Kenya",
    pagePath: "/jobs/full-time",
    filterKey: "employmentType",
    filterValue: "FULL_TIME",
    breadcrumbName: "Full Time",
    searchPlaceholder: "Search full time jobs...",
    emptyTitle: "No full time jobs found",
    emptyDescription: "No full time positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "💼",
    sidebarTitle: "Career Growth",
    sidebarDescription: "A professional CV opens doors to better opportunities. Let our experts craft yours.",
  });
}
