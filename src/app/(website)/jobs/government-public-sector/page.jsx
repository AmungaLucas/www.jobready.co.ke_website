import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Government & Public Sector Jobs in Kenya",
  pagePath: "/jobs/government-public-sector",
  filterKey: "category",
  filterValue: "GOVERNMENT_PUBLIC_SECTOR",
  breadcrumbName: "Government & Public Sector",
});

export default async function GovernmentPublicSectorJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Government & Public Sector Jobs in Kenya",
    pagePath: "/jobs/government-public-sector",
    filterKey: "category",
    filterValue: "GOVERNMENT_PUBLIC_SECTOR",
    breadcrumbName: "Government & Public Sector",
    searchPlaceholder: "Search government & public sector jobs...",
    emptyTitle: "No government & public sector jobs found",
    emptyDescription: "No government positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🏛️",
    sidebarTitle: "Gov Job Alerts",
    sidebarDescription: "Never miss a government vacancy. Get a professional CV and be ready when the next one opens.",
  });
}
