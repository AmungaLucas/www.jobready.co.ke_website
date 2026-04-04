import SidebarCard from "../../_components/SidebarCard";
import NewsletterForm from "../../_components/NewsletterForm";
import AdSlot from "../../_components/AdSlot";

export default function TrendingSearches() {
  return (
    <>
      <AdSlot position="sidebar" />
      <SidebarCard title="Job Alerts">
        <p className="text-xs text-gray-500 mb-3 leading-relaxed">
          Get matching jobs delivered to your inbox daily. Never miss an opportunity.
        </p>
        <NewsletterForm type="job_alerts" />
      </SidebarCard>
    </>
  );
}
