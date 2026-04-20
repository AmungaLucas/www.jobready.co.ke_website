import DashboardOverview from "./_components/DashboardOverview";
import { generateMeta } from "@/lib/seo";
import { siteConfig } from "@/config/site-config";

export const metadata = generateMeta({
  title: "Dashboard Overview",
  description: `Your ${siteConfig.companyName} dashboard — track applications, saved jobs, and profile activity.`,
  path: "/dashboard",
});

export default function DashboardPage() {
  return <DashboardOverview />;
}
