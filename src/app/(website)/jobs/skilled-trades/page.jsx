import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Skilled Trades & Manual Work Jobs in Kenya",
  pagePath: "/jobs/skilled-trades",
  filterKey: "category",
  filterValue: "SKILLED_TRADES",
  breadcrumbName: "Skilled Trades",
});

export default async function SkilledTradesJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Skilled Trades & Manual Work Jobs in Kenya",
    pagePath: "/jobs/skilled-trades",
    filterKey: "category",
    filterValue: "SKILLED_TRADES",
    breadcrumbName: "Skilled Trades",
    searchPlaceholder: "Search skilled trades & manual work jobs...",
    emptyTitle: "No skilled trades & manual work jobs found",
    emptyDescription: "No skilled trades positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🔧",
    sidebarTitle: "Skilled Trades",
    sidebarDescription: "Trade CVs should highlight certifications and hands-on experience. Get yours crafted.",
  });
}
