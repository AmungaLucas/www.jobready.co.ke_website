import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Volunteer Jobs in Kenya",
  pagePath: "/jobs/volunteer",
  filterKey: "employmentType",
  filterValue: "VOLUNTEER",
  breadcrumbName: "Volunteer",
});

export default async function VolunteerJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Volunteer Jobs in Kenya",
    pagePath: "/jobs/volunteer",
    filterKey: "employmentType",
    filterValue: "VOLUNTEER",
    breadcrumbName: "Volunteer",
    searchPlaceholder: "Search volunteer jobs...",
    emptyTitle: "No volunteer jobs found",
    emptyDescription: "No volunteer positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🤝",
    sidebarTitle: "Make a Difference",
    sidebarDescription: "Volunteering builds your experience. Highlight your impact with a professional CV.",
  });
}
