import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Technology & IT Jobs in Kenya",
  pagePath: "/jobs/technology",
  filterKey: "category",
  filterValue: "TECHNOLOGY",
  breadcrumbName: "Technology & IT",
});

export default async function TechnologyJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Technology & IT Jobs in Kenya",
    pagePath: "/jobs/technology",
    filterKey: "category",
    filterValue: "TECHNOLOGY",
    breadcrumbName: "Technology & IT",
    searchPlaceholder: "Search technology & IT jobs...",
    emptyTitle: "No technology & IT jobs found",
    emptyDescription: "No technology positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "💻",
    sidebarTitle: "Tech Talent",
    sidebarDescription: "Tech employers look for skills-first CVs. Get a modern, ATS-friendly resume from our experts.",
  });
}
