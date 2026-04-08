import { generateMeta, generateWebSiteJsonLd } from "@/lib/seo";
import { siteConfig } from "@/config/site-config";
import Script from "next/script";
import HomeHero from "./_components/HomeHero";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return generateMeta({
    title: "Kenya's #1 Job Board — Jobs, Internships & Scholarships",
    description:
      "Find 2,500+ jobs, internships, scholarships & career opportunities in Kenya. Updated daily. Free CV writing services from KSh 500.",
    path: "/",
  });
}

export default async function HomePage() {
  const stats = {
    totalJobs: siteConfig.stats.totalJobs,
    totalCompanies: siteConfig.stats.totalCompanies,
    monthlyVisitors: siteConfig.stats.monthlyVisitors,
  };

  const jsonLd = generateWebSiteJsonLd();

  return (
    <>
      <Script
        id="homepage-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeHero stats={stats} />
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Testing: Only Hero</h2>
      </div>
    </>
  );
}
