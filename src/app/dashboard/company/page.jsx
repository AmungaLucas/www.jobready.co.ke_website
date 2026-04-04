import { Metadata } from "next";
import CompanyProfileForm from "./_components/CompanyProfileForm";

export const metadata = {
  title: "Company Profile",
  description: "Manage your employer profile and company branding on JobReady Kenya.",
};

export default function CompanyProfilePage() {
  return <CompanyProfileForm />;
}
