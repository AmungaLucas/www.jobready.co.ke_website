import { getOpportunityHubs } from "@/config/hub-config";

// Related hubs sidebar — static, derived from hub-config
export function getRelatedOpportunityHubs(currentSlug) {
  const allHubs = getOpportunityHubs();
  return allHubs
    .filter((h) => h.slug !== currentSlug)
    .map((h) => ({
      slug: h.slug,
      name: h.name.replace(/\s*2026\s*$/, "").replace(" for Kenyans", "").replace(" in Kenya", "").replace(" & Abroad", ""),
      count: "—",
    }));
}
