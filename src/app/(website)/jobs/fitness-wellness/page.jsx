import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: "Fitness & Wellness Jobs in Kenya",
  pagePath: "/jobs/fitness-wellness",
  filterKey: "category",
  filterValue: "FITNESS_WELLNESS",
  breadcrumbName: "Fitness & Wellness",
});

export default async function FitnessWellnessJobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: "Fitness & Wellness Jobs in Kenya",
    pagePath: "/jobs/fitness-wellness",
    filterKey: "category",
    filterValue: "FITNESS_WELLNESS",
    breadcrumbName: "Fitness & Wellness",
    searchPlaceholder: "Search fitness & wellness jobs...",
    emptyTitle: "No fitness & wellness jobs found",
    emptyDescription: "No fitness positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "💪",
    sidebarTitle: "Fitness Careers",
    sidebarDescription: "Fitness CVs should highlight certifications and client results. Let our experts craft yours.",
  });
}
