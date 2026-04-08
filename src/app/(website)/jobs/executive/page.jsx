import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Executive Jobs in Kenya",
  pagePath: "/jobs/executive",
  filterKey: "experienceLevel",
  filterValue: "EXECUTIVE",
  breadcrumbName: "Executive",
});

export default async function ExecutiveJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Executive Jobs in Kenya",
    pagePath: "/jobs/executive",
    filterKey: "experienceLevel",
    filterValue: "EXECUTIVE",
    breadcrumbName: "Executive",
    searchPlaceholder: "Search executive jobs...",
    emptyTitle: "No executive jobs found",
    emptyDescription: "No executive positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "⭐",
    sidebarTitle: "C-Suite Ready",
    sidebarDescription: "Executive roles require strategic CVs. Our experts craft resumes that command attention.",
  });
}
