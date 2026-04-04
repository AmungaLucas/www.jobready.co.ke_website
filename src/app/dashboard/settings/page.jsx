import { Metadata } from "next";
import SettingsContent from "./_components/SettingsContent";

export const metadata = {
  title: "Settings | Dashboard",
};

export default function SettingsPage() {
  return <SettingsContent />;
}
