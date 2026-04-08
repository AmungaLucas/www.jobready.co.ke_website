import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Consulting Jobs in Kenya",
  pagePath: "/jobs/consulting",
  filterKey: "category",
  filterValue: "CONSULTING",
  breadcrumbName: "Consulting",
});

export default async function ConsultingJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Consulting Jobs in Kenya",
    pagePath: "/jobs/consulting",
    filterKey: "category",
    filterValue: "CONSULTING",
    breadcrumbName: "Consulting",
    searchPlaceholder: "Search consulting jobs...",
    emptyTitle: "No consulting jobs found",
    emptyDescription: "No consulting positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "💡",
    sidebarTitle: "Consulting Careers",
    sidebarDescription: "Consulting CVs must showcase analytical thinking and client impact. Get yours done right.",
  });
}
