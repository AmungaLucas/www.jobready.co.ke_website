import { Suspense } from "react";
import Script from "next/script";
import { generateMeta, generateCollectionPageJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import JobsContent from "./_components/JobsContent";

export const metadata = generateMeta({
  title: "Jobs in Kenya — Browse All Open Positions",
  description:
    "Browse 2,500+ jobs in Kenya across all industries. Full-time, part-time, internships & remote positions. Updated daily on JobReady.co.ke.",
  path: "/jobs",
});

const collectionJsonLd = generateCollectionPageJsonLd({
  name: "Jobs in Kenya",
  description: "Browse 2,500+ jobs in Kenya across all industries. Updated daily.",
  url: "/jobs",
  totalItems: 2500,
});

const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: "Home", href: "/" },
  { name: "Jobs", href: "/jobs" },
]);

export default function JobsPage() {
  return (
    <>
      <Script
        id="jobs-collection-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <Script
        id="jobs-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Suspense fallback={<div className="min-h-screen" />}>
        <JobsContent />
      </Suspense>
    </>
  );
}
