import { getJobHubs } from "@/config/hub-config";

export function hubSidebarFilters(hubSlug) {
  const locationHubs = ["nairobi", "mombasa", "kisumu", "nakuru"];
  if (locationHubs.includes(hubSlug)) {
    return [
      { label: "Technology", value: "technology" },
      { label: "Finance & Accounting", value: "finance-accounting" },
      { label: "Engineering", value: "engineering" },
      { label: "Healthcare", value: "healthcare" },
      { label: "Education", value: "education" },
      { label: "Marketing", value: "sales-marketing" },
    ];
  }
  if (hubSlug === "internships") return [
    { label: "Paid Internships", value: "paid" },
    { label: "Unpaid Internships", value: "unpaid" },
    { label: "Remote Internships", value: "remote" },
    { label: "Government Internships", value: "government" },
    { label: "NGO Internships", value: "ngo" },
  ];
  if (hubSlug === "part-time") return [
    { label: "Weekend Jobs", value: "weekend" },
    { label: "Evening Jobs", value: "evening" },
    { label: "Student Jobs", value: "student" },
    { label: "Freelance Gigs", value: "freelance" },
  ];
  if (hubSlug === "remote") return [
    { label: "Full-time Remote", value: "full-time" },
    { label: "Part-time Remote", value: "part-time" },
    { label: "Contract Remote", value: "contract" },
    { label: "International", value: "international" },
  ];
  if (hubSlug === "entry-level") return [
    { label: "No Degree Required", value: "no-degree" },
    { label: "Graduate Trainee", value: "trainee" },
    { label: "Certificate Holders", value: "certificate" },
  ];
  return [
    { label: "Full-time", value: "full-time" },
    { label: "Part-time", value: "part-time" },
    { label: "Contract", value: "contract" },
    { label: "Internship", value: "internship" },
    { label: "Remote", value: "remote" },
  ];
}

export function getRelatedJobHubs(currentSlug) {
  const allHubs = getJobHubs();
  const categoryHubs = allHubs.filter(
    (h) => h.filters.category && !h.filters.location && !h.filters.jobType && !h.filters.experienceLevel && !h.filters.isRemote
  );
  const locationHubs = allHubs.filter((h) => h.filters.location);
  const typeHubs = allHubs.filter(
    (h) => h.filters.jobType || h.filters.experienceLevel || h.filters.isRemote
  );
  let related = [];
  if (["technology", "finance-accounting", "engineering"].includes(currentSlug)) {
    related = categoryHubs.filter((h) => h.slug !== currentSlug).slice(0, 6);
  } else if (locationHubs.some((h) => h.slug === currentSlug)) {
    related = locationHubs.filter((h) => h.slug !== currentSlug);
  } else if (typeHubs.some((h) => h.slug === currentSlug)) {
    related = typeHubs.filter((h) => h.slug !== currentSlug);
  } else {
    related = categoryHubs.slice(0, 6);
  }
  return related.map((h) => ({
    slug: h.slug,
    name: h.name.replace(/ in Kenya.*| in Kenya$/i, "").replace(" in Kenya 2026", ""),
    count: 20 + Math.floor(Math.random() * 300),
  }));
}
