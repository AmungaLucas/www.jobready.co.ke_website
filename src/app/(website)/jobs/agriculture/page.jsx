import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Agriculture & Agribusiness Jobs in Kenya",
  pagePath: "/jobs/agriculture",
  filterKey: "category",
  filterValue: "AGRICULTURE",
  breadcrumbName: "Agriculture & Agribusiness",
});

export default async function AgricultureJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Agriculture & Agribusiness Jobs in Kenya",
    pagePath: "/jobs/agriculture",
    filterKey: "category",
    filterValue: "AGRICULTURE",
    breadcrumbName: "Agriculture & Agribusiness",
    searchPlaceholder: "Search agriculture & agribusiness jobs...",
    emptyTitle: "No agriculture & agribusiness jobs found",
    emptyDescription: "No agriculture positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🌾",
    sidebarTitle: "Agribusiness Careers",
    sidebarDescription: "Agriculture CVs should highlight innovation and sustainability. Let our experts help.",
  });
}
