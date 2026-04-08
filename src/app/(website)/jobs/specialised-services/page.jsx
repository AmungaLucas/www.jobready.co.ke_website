import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Specialised Services Jobs in Kenya",
  pagePath: "/jobs/specialised-services",
  filterKey: "category",
  filterValue: "SPECIALISED_SERVICES",
  breadcrumbName: "Specialised Services",
});

export default async function SpecialisedServicesJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Specialised Services Jobs in Kenya",
    pagePath: "/jobs/specialised-services",
    filterKey: "category",
    filterValue: "SPECIALISED_SERVICES",
    breadcrumbName: "Specialised Services",
    searchPlaceholder: "Search specialised services jobs...",
    emptyTitle: "No specialised services jobs found",
    emptyDescription: "No specialised services positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🔧",
    sidebarTitle: "Specialist Roles",
    sidebarDescription: "Specialised roles demand targeted CVs. Let our experts craft one that highlights your unique expertise.",
  });
}
