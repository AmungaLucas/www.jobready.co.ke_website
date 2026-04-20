import PostOpportunityForm from "./_components/PostOpportunityForm";
import { siteConfig } from "@/config/site-config";

export const metadata = {
  title: `Post New Opportunity | ${siteConfig.shortName}`,
};

export default function PostOpportunityPage() {
  return <PostOpportunityForm />;
}
