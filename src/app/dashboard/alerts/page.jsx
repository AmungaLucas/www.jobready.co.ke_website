import { Metadata } from "next";
import AlertsContent from "./_components/AlertsContent";

export const metadata = {
  title: "Job Alerts | Dashboard",
};

export default function AlertsPage() {
  return <AlertsContent />;
}
