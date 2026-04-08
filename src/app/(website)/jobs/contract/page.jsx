import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Contract Jobs in Kenya",
  pagePath: "/jobs/contract",
  filterKey: "employmentType",
  filterValue: "CONTRACT",
  breadcrumbName: "Contract",
});

export default async function ContractJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Contract Jobs in Kenya",
    pagePath: "/jobs/contract",
    filterKey: "employmentType",
    filterValue: "CONTRACT",
    breadcrumbName: "Contract",
    searchPlaceholder: "Search contract jobs...",
    emptyTitle: "No contract jobs found",
    emptyDescription: "No contract positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "📋",
    sidebarTitle: "Contract Opportunities",
    sidebarDescription: "Contract roles often lead to permanent positions. A strong CV helps you convert them.",
  });
}
