import { Metadata } from "next";
import AlertsContent from "./_components/AlertsContent";

export const metadata = {
  title: "Job Alerts",
  description: "Create and manage custom job alerts to get notified of new opportunities on JobReady Kenya.",
};

export default function AlertsPage() {
  return <AlertsContent />;
}
