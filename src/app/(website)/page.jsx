import { generateMeta, generateWebSiteJsonLd } from "@/lib/seo";
import { siteConfig } from "@/config/site-config";
import Script from "next/script";
import HomeHero from "./_components/HomeHero";
import TrustedByBar from "./_components/TrustedByBar";
import DeadlineStrip from "./_components/DeadlineStrip";
import JobList from "./_components/JobList";
import CVServicesCTA from "./_components/CVServicesCTA";
import CategoryGrid from "./_components/CategoryGrid";
import OpportunityGrid from "./_components/OpportunityGrid";
import ServiceNudge from "./_components/ServiceNudge";
import HomeSidebar from "./_components/HomeSidebar";
import WhatsAppFloat from "./_components/WhatsAppFloat";

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
      <TrustedByBar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0 space-y-8">
            <DeadlineStrip jobs={[]} />
            <JobList jobs={[]} />
            <CVServicesCTA />
            <CategoryGrid />
            <OpportunityGrid opportunities={[]} />
            <ServiceNudge />
          </div>

          <div className="w-full lg:w-80 shrink-0">
            <HomeSidebar
              featuredJobs={[]}
              topCompanies={[]}
              deadlineJobs={[]}
            />
          </div>
        </div>
      </div>

      <WhatsAppFloat />
    </>
  );
}
