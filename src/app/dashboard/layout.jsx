import DashboardShell from "./_components/DashboardShell";

export const metadata = {
  title: {
    template: "%s | JobReady Dashboard",
    default: "Dashboard | JobReady Kenya",
  },
  description: "Manage your job applications, saved jobs, profile, and more on JobReady Kenya.",
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
