import { Metadata } from "next";
import SettingsContent from "./_components/SettingsContent";

export const metadata = {
  title: "Settings",
  description: "Manage your account settings, security preferences, and notifications on JobReady Kenya.",
};

export default function SettingsPage() {
  return <SettingsContent />;
}
