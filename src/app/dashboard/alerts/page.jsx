import { siteConfig } from "@/config/site-config";
import { Metadata } from "next";
import AlertsContent from "./_components/AlertsContent";

export const metadata = {
  title: "Job Alerts",
  description: `Create and manage custom job alerts to get notified of new opportunities on ${siteConfig.companyName}.`,
};

export default function AlertsPage() {
  return <AlertsContent />;
}
