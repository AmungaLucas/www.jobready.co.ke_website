import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Creative Arts & Design Jobs in Kenya",
  pagePath: "/jobs/creative-design",
  filterKey: "category",
  filterValue: "CREATIVE_DESIGN",
  breadcrumbName: "Creative Arts & Design",
});

export default async function CreativeDesignJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Creative Arts & Design Jobs in Kenya",
    pagePath: "/jobs/creative-design",
    filterKey: "category",
    filterValue: "CREATIVE_DESIGN",
    breadcrumbName: "Creative Arts & Design",
    searchPlaceholder: "Search creative arts & design jobs...",
    emptyTitle: "No creative arts & design jobs found",
    emptyDescription: "No creative positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🎨",
    sidebarTitle: "Creative Careers",
    sidebarDescription: "Creative CVs should include a portfolio link. Let our experts design yours.",
  });
}
