import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Finance & Accounting Jobs in Kenya",
  pagePath: "/jobs/finance-accounting",
  filterKey: "category",
  filterValue: "FINANCE_ACCOUNTING",
  breadcrumbName: "Finance & Accounting",
});

export default async function FinanceAccountingJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Finance & Accounting Jobs in Kenya",
    pagePath: "/jobs/finance-accounting",
    filterKey: "category",
    filterValue: "FINANCE_ACCOUNTING",
    breadcrumbName: "Finance & Accounting",
    searchPlaceholder: "Search finance & accounting jobs...",
    emptyTitle: "No finance & accounting jobs found",
    emptyDescription: "No finance positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "💰",
    sidebarTitle: "Finance Careers",
    sidebarDescription: "Finance CVs must highlight precision and results. Let our experts craft yours.",
  });
}
