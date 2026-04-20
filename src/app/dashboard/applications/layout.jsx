import { siteConfig } from "@/config/site-config";
export const metadata = {
  title: "My Applications",
  description: `Track and manage your job applications on ${siteConfig.companyName}.`,
};

export default function ApplicationsLayout({ children }) {
  return <>{children}</>;
}
