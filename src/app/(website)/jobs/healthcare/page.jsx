import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Healthcare & Medical Jobs in Kenya",
  pagePath: "/jobs/healthcare",
  filterKey: "category",
  filterValue: "HEALTHCARE",
  breadcrumbName: "Healthcare & Medical",
});

export default async function HealthcareJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Healthcare & Medical Jobs in Kenya",
    pagePath: "/jobs/healthcare",
    filterKey: "category",
    filterValue: "HEALTHCARE",
    breadcrumbName: "Healthcare & Medical",
    searchPlaceholder: "Search healthcare & medical jobs...",
    emptyTitle: "No healthcare & medical jobs found",
    emptyDescription: "No healthcare positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🏥",
    sidebarTitle: "Healthcare Careers",
    sidebarDescription: "Healthcare CVs need to highlight certifications and patient care. Let our experts help.",
  });
}
