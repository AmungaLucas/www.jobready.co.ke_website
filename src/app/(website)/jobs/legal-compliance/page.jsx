import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Legal & Compliance Jobs in Kenya",
  pagePath: "/jobs/legal-compliance",
  filterKey: "category",
  filterValue: "LEGAL",
  breadcrumbName: "Legal & Compliance",
});

export default async function LegalComplianceJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Legal & Compliance Jobs in Kenya",
    pagePath: "/jobs/legal-compliance",
    filterKey: "category",
    filterValue: "LEGAL",
    breadcrumbName: "Legal & Compliance",
    searchPlaceholder: "Search legal & compliance jobs...",
    emptyTitle: "No legal & compliance jobs found",
    emptyDescription: "No legal positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "⚖️",
    sidebarTitle: "Legal Careers",
    sidebarDescription: "Legal CVs demand precision and professionalism. Get a CV that matches your standards.",
  });
}
