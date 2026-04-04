import { Metadata } from "next";
import MyJobsContent from "./_components/MyJobsContent";

export const metadata = {
  title: "My Jobs",
  description: "View, manage, and track the performance of your posted jobs on JobReady Kenya.",
};

export default function MyJobsPage() {
  return <MyJobsContent />;
}
