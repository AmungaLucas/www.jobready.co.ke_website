import { Metadata } from "next";
import MyJobsContent from "./_components/MyJobsContent";

export const metadata = {
  title: "My Jobs | Dashboard",
};

export default function MyJobsPage() {
  return <MyJobsContent />;
}
