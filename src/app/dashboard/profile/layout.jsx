import { siteConfig } from "@/config/site-config";
export const metadata = {
  title: "My Profile",
  description: `Manage your professional profile, CV details, skills, and education on ${siteConfig.companyName}.`,
};

export default function ProfileLayout({ children }) {
  return <>{children}</>;
}
