import DashboardOverview from "./_components/DashboardOverview";
import { generateMeta } from "@/lib/seo";

export const metadata = generateMeta({
  title: "Dashboard Overview",
  description: "Your JobReady dashboard — track applications, saved jobs, and profile activity.",
  path: "/dashboard",
});

export default function DashboardPage() {
  return <DashboardOverview />;
}
