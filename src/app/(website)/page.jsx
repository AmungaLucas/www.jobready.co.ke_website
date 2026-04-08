import { db } from "@/lib/db";
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

async function fetchHomepageData() {
  try {
    const [
      latestJobs,
      featuredJobs,
      deadlineJobs,
      latestOpportunities,
      topCompanies,
      totalJobs,
      totalCompanies,
    ] = await Promise.all([
      db.job.findMany({
        where: { status: "Published", isActive: true },
        orderBy: { createdAt: "desc" },
        take: 8,
        include: {
          company: {
            select: {
              name: true,
              slug: true,
              logo: true,
              logoColor: true,
              isVerified: true,
            },
          },
        },
      }),
      db.job.findMany({
        where: { status: "Published", isActive: true, isFeatured: true },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          company: {
            select: {
              name: true,
              slug: true,
              logo: true,
              logoColor: true,
              isVerified: true,
            },
          },
        },
      }),
      db.job.findMany({
        where: {
          status: "Published",
          isActive: true,
          applicationDeadline: { gte: new Date() },
        },
        orderBy: { applicationDeadline: "asc" },
        take: 3,
        include: {
          company: { select: { name: true, slug: true } },
        },
      }),
      db.opportunity.findMany({
        where: { status: "Published", isActive: true },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: {
          company: { select: { name: true } },
        },
      }),
      db.company.findMany({
        where: { isActive: true },
        orderBy: { jobCount: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          logoColor: true,
          isVerified: true,
          jobCount: true,
          _count: {
            select: { jobs: { where: { status: "Published", isActive: true } } },
          },
        },
      }),
      db.job.count({ where: { status: "Published", isActive: true } }),
      db.company.count({ where: { isActive: true } }),
    ]);

    return {
      latestJobs: latestJobs || [],
      featuredJobs: featuredJobs || [],
      deadlineJobs: deadlineJobs || [],
      latestOpportunities: latestOpportunities || [],
      topCompanies: topCompanies || [],
      totalJobs: totalJobs || 0,
      totalCompanies: totalCompanies || 0,
    };
  } catch (error) {
    console.error("[Homepage] DB fetch error:", error);
    return {
      latestJobs: [],
      featuredJobs: [],
      deadlineJobs: [],
      latestOpportunities: [],
      topCompanies: [],
      totalJobs: 0,
      totalCompanies: 0,
    };
  }
}

export default async function HomePage() {
  const data = await fetchHomepageData();

  const stats = {
    totalJobs: data.totalJobs || siteConfig.stats.totalJobs,
    totalCompanies: data.totalCompanies || siteConfig.stats.totalCompanies,
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
            <DeadlineStrip jobs={data.deadlineJobs} />
            <JobList jobs={data.latestJobs} />
            <CVServicesCTA />
            <CategoryGrid />
            <OpportunityGrid opportunities={data.latestOpportunities} />
            <ServiceNudge />
          </div>

          <div className="w-full lg:w-80 shrink-0">
            <HomeSidebar
              featuredJobs={data.featuredJobs}
              topCompanies={data.topCompanies}
              deadlineJobs={data.deadlineJobs}
            />
          </div>
        </div>
      </div>

      <WhatsAppFloat />
    </>
  );
}
