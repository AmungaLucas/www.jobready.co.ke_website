import { siteConfig } from "@/config/site-config";
import { Metadata } from "next";
import SettingsContent from "./_components/SettingsContent";

export const metadata = {
  title: "Settings",
  description: `Manage your account settings, security preferences, and notifications on ${siteConfig.companyName}.`,
};

export default function SettingsPage() {
  return <SettingsContent />;
}
