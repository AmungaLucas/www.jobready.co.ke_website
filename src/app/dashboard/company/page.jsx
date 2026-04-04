import { Metadata } from "next";
import CompanyProfileForm from "./_components/CompanyProfileForm";

export const metadata = {
  title: "Company Profile | Dashboard",
};

export default function CompanyProfilePage() {
  return <CompanyProfileForm />;
}
