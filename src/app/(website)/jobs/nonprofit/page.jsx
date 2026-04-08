import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Nonprofit & Social Services Jobs in Kenya",
  pagePath: "/jobs/nonprofit",
  filterKey: "category",
  filterValue: "NONPROFIT",
  breadcrumbName: "Nonprofit & Social Services",
});

export default async function NonprofitJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Nonprofit & Social Services Jobs in Kenya",
    pagePath: "/jobs/nonprofit",
    filterKey: "category",
    filterValue: "NONPROFIT",
    breadcrumbName: "Nonprofit & Social Services",
    searchPlaceholder: "Search nonprofit & social services jobs...",
    emptyTitle: "No nonprofit & social services jobs found",
    emptyDescription: "No nonprofit positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🌍",
    sidebarTitle: "Nonprofit Careers",
    sidebarDescription: "Nonprofit CVs should highlight impact and mission alignment. Let our experts help.",
  });
}
