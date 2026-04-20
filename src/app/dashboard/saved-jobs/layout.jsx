import { siteConfig } from "@/config/site-config";
export const metadata = {
  title: "Saved Jobs",
  description: `View and manage jobs you've bookmarked for later review on ${siteConfig.companyName}.`,
};

export default function SavedJobsLayout({ children }) {
  return <>{children}</>;
}
