import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Science & Research Jobs in Kenya",
  pagePath: "/jobs/science-research",
  filterKey: "category",
  filterValue: "SCIENCE_RESEARCH",
  breadcrumbName: "Science & Research",
});

export default async function ScienceResearchJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Science & Research Jobs in Kenya",
    pagePath: "/jobs/science-research",
    filterKey: "category",
    filterValue: "SCIENCE_RESEARCH",
    breadcrumbName: "Science & Research",
    searchPlaceholder: "Search science & research jobs...",
    emptyTitle: "No science & research jobs found",
    emptyDescription: "No science positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🔬",
    sidebarTitle: "Research Careers",
    sidebarDescription: "Science CVs should highlight publications and research impact. Let our experts help.",
  });
}
