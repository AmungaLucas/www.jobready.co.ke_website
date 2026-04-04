import { Metadata } from "next";
import PostJobForm from "./_components/PostJobForm";

export const metadata = {
  title: "Post New Job | Dashboard",
};

export default function PostNewJobPage() {
  return <PostJobForm />;
}
