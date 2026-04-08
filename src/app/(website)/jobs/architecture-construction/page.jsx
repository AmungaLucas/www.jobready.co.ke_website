import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Architecture & Construction Jobs in Kenya",
  pagePath: "/jobs/architecture-construction",
  filterKey: "category",
  filterValue: "ARCHITECTURE_CONSTRUCTION",
  breadcrumbName: "Architecture & Construction",
});

export default async function ArchitectureConstructionJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Architecture & Construction Jobs in Kenya",
    pagePath: "/jobs/architecture-construction",
    filterKey: "category",
    filterValue: "ARCHITECTURE_CONSTRUCTION",
    breadcrumbName: "Architecture & Construction",
    searchPlaceholder: "Search architecture & construction jobs...",
    emptyTitle: "No architecture & construction jobs found",
    emptyDescription: "No architecture positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🏗️",
    sidebarTitle: "Built Environment",
    sidebarDescription: "Architecture CVs must showcase projects and technical skills. Get yours done right.",
  });
}
