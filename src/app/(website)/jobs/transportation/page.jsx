import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Transportation Jobs in Kenya",
  pagePath: "/jobs/transportation",
  filterKey: "category",
  filterValue: "TRANSPORTATION",
  breadcrumbName: "Transportation",
});

export default async function TransportationJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Transportation Jobs in Kenya",
    pagePath: "/jobs/transportation",
    filterKey: "category",
    filterValue: "TRANSPORTATION",
    breadcrumbName: "Transportation",
    searchPlaceholder: "Search transportation jobs...",
    emptyTitle: "No transportation jobs found",
    emptyDescription: "No transportation positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🚚",
    sidebarTitle: "Transportation Careers",
    sidebarDescription: "Transportation CVs should highlight safety records and reliability. Get yours crafted today.",
  });
}
