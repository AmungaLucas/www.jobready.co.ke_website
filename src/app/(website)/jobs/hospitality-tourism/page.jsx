import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Hospitality & Tourism Jobs in Kenya",
  pagePath: "/jobs/hospitality-tourism",
  filterKey: "category",
  filterValue: "HOSPITALITY",
  breadcrumbName: "Hospitality & Tourism",
});

export default async function HospitalityTourismJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Hospitality & Tourism Jobs in Kenya",
    pagePath: "/jobs/hospitality-tourism",
    filterKey: "category",
    filterValue: "HOSPITALITY",
    breadcrumbName: "Hospitality & Tourism",
    searchPlaceholder: "Search hospitality & tourism jobs...",
    emptyTitle: "No hospitality & tourism jobs found",
    emptyDescription: "No hospitality positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🏨",
    sidebarTitle: "Hospitality Careers",
    sidebarDescription: "Hospitality CVs need to showcase customer service excellence. Get yours crafted today.",
  });
}
