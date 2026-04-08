import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Internship Level Jobs in Kenya",
  pagePath: "/jobs/internship",
  filterKey: "experienceLevel",
  filterValue: "INTERNSHIP",
  breadcrumbName: "Internship Level",
});

export default async function InternshipLevelJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Internship Level Jobs in Kenya",
    pagePath: "/jobs/internship",
    filterKey: "experienceLevel",
    filterValue: "INTERNSHIP",
    breadcrumbName: "Internship Level",
    searchPlaceholder: "Search internship-level jobs...",
    emptyTitle: "No internship-level jobs found",
    emptyDescription: "No internship-level positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🎓",
    sidebarTitle: "Internship Level",
    sidebarDescription: "Looking for your first role? A professional CV sets you apart. Get yours crafted by our experts.",
  });
}
