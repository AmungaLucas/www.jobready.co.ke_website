import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Real Estate Jobs in Kenya",
  pagePath: "/jobs/real-estate",
  filterKey: "category",
  filterValue: "REAL_ESTATE",
  breadcrumbName: "Real Estate",
});

export default async function RealEstateJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Real Estate Jobs in Kenya",
    pagePath: "/jobs/real-estate",
    filterKey: "category",
    filterValue: "REAL_ESTATE",
    breadcrumbName: "Real Estate",
    searchPlaceholder: "Search real estate jobs...",
    emptyTitle: "No real estate jobs found",
    emptyDescription: "No real estate positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🏠",
    sidebarTitle: "Real Estate Careers",
    sidebarDescription: "Real estate CVs must highlight sales records and market knowledge. Get yours done right.",
  });
}
