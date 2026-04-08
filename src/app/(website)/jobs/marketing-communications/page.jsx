import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Marketing & Communications Jobs in Kenya",
  pagePath: "/jobs/marketing-communications",
  filterKey: "category",
  filterValue: "MARKETING_COMMUNICATIONS",
  breadcrumbName: "Marketing & Comms",
});

export default async function MarketingCommunicationsJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Marketing & Communications Jobs in Kenya",
    pagePath: "/jobs/marketing-communications",
    filterKey: "category",
    filterValue: "MARKETING_COMMUNICATIONS",
    breadcrumbName: "Marketing & Comms",
    searchPlaceholder: "Search marketing & communications jobs...",
    emptyTitle: "No marketing & communications jobs found",
    emptyDescription: "No marketing positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "📣",
    sidebarTitle: "Marketing Careers",
    sidebarDescription: "Marketing CVs must showcase creativity and ROI. Stand out with a professionally designed resume.",
  });
}
