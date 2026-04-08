import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Lead Jobs in Kenya",
  pagePath: "/jobs/lead",
  filterKey: "experienceLevel",
  filterValue: "LEAD",
  breadcrumbName: "Lead",
});

export default async function LeadJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Lead Jobs in Kenya",
    pagePath: "/jobs/lead",
    filterKey: "experienceLevel",
    filterValue: "LEAD",
    breadcrumbName: "Lead",
    searchPlaceholder: "Search lead jobs...",
    emptyTitle: "No lead jobs found",
    emptyDescription: "No lead positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🎯",
    sidebarTitle: "Lead With Impact",
    sidebarDescription: "Lead roles require a CV that demonstrates vision and results. Get yours done right.",
  });
}
