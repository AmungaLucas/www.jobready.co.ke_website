import { siteConfig } from "@/config/site-config";
import { Metadata } from "next";
import PostJobForm from "./_components/PostJobForm";

export const metadata = {
  title: "Post New Job",
  description: `Create and publish a new job listing on ${siteConfig.companyName} to reach thousands of job seekers.`,
};

export default function PostNewJobPage() {
  return <PostJobForm />;
}
