import { siteConfig } from "@/config/site-config";
import { Metadata } from "next";
import CompanyProfileForm from "./_components/CompanyProfileForm";

export const metadata = {
  title: "Company Profile",
  description: `Manage your employer profile and company branding on ${siteConfig.companyName}.`,
};

export default function CompanyProfilePage() {
  return <CompanyProfileForm />;
}
