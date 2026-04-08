import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Media & Publishing Jobs in Kenya",
  pagePath: "/jobs/media-publishing",
  filterKey: "category",
  filterValue: "MEDIA_PUBLISHING",
  breadcrumbName: "Media & Publishing",
});

export default async function MediaPublishingJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Media & Publishing Jobs in Kenya",
    pagePath: "/jobs/media-publishing",
    filterKey: "category",
    filterValue: "MEDIA_PUBLISHING",
    breadcrumbName: "Media & Publishing",
    searchPlaceholder: "Search media & publishing jobs...",
    emptyTitle: "No media & publishing jobs found",
    emptyDescription: "No media positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "📰",
    sidebarTitle: "Media Careers",
    sidebarDescription: "Media CVs must showcase storytelling and content expertise. Stand out with our help.",
  });
}
