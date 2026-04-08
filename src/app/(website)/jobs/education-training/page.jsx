import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Education & Training Jobs in Kenya",
  pagePath: "/jobs/education-training",
  filterKey: "category",
  filterValue: "EDUCATION",
  breadcrumbName: "Education & Training",
});

export default async function EducationTrainingJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Education & Training Jobs in Kenya",
    pagePath: "/jobs/education-training",
    filterKey: "category",
    filterValue: "EDUCATION",
    breadcrumbName: "Education & Training",
    searchPlaceholder: "Search education & training jobs...",
    emptyTitle: "No education & training jobs found",
    emptyDescription: "No education positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "📚",
    sidebarTitle: "Education Careers",
    sidebarDescription: "Education CVs should highlight qualifications and teaching impact. Get yours crafted by experts.",
  });
}
