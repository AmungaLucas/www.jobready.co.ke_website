import { siteConfig } from "@/config/site-config";
import DashboardShell from "./_components/DashboardShell";

export const metadata = {
  title: {
    template: `%s | ${siteConfig.shortName} Dashboard`,
    default: `Dashboard | ${siteConfig.companyName}`,
  },
  description: `Manage your job applications, saved jobs, profile, and more on ${siteConfig.companyName}.`,
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function DashboardLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>;
}
