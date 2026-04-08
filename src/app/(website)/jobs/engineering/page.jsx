import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Engineering Jobs in Kenya",
  pagePath: "/jobs/engineering",
  filterKey: "category",
  filterValue: "ENGINEERING",
  breadcrumbName: "Engineering",
});

export default async function EngineeringJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Engineering Jobs in Kenya",
    pagePath: "/jobs/engineering",
    filterKey: "category",
    filterValue: "ENGINEERING",
    breadcrumbName: "Engineering",
    searchPlaceholder: "Search engineering jobs...",
    emptyTitle: "No engineering jobs found",
    emptyDescription: "No engineering positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "⚙️",
    sidebarTitle: "Engineering Careers",
    sidebarDescription: "Engineering CVs must detail projects and technical expertise. Get yours done right.",
  });
}
