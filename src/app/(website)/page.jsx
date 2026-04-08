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

export default async function HomePage() {
  // Fetch data in parallel
  const [
    latestJobs,
    featuredJobs,
    deadlineJobs,
    latestOpportunities,
    topCompanies,
    totalJobs,
    totalCompanies,
  ] = await Promise.all([
    // Latest published jobs
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

    // Featured jobs
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

    // Jobs with nearest deadlines
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

    // Latest opportunities
    db.opportunity.findMany({
      where: { status: "Published", isActive: true },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: {
        company: { select: { name: true } },
      },
    }),

    // Top companies
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

    // Total job count
    db.job.count({ where: { status: "Published", isActive: true } }),

    // Total company count
    db.company.count({ where: { isActive: true } }),
  ]).catch(() => {
    // Fallback for database errors — return empty data
    return [[], [], [], [], [], 0, 0];
  });

  const stats = {
    totalJobs: totalJobs || siteConfig.stats.totalJobs,
    totalCompanies: totalCompanies || siteConfig.stats.totalCompanies,
    monthlyVisitors: siteConfig.stats.monthlyVisitors,
  };

  const jsonLd = generateWebSiteJsonLd();

  return (
    <>
      {/* JSON-LD */}
      <Script
        id="homepage-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <HomeHero stats={stats} />

      {/* Trusted By */}
      <TrustedByBar />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="flex-1 min-w-0 space-y-8">
            <DeadlineStrip jobs={deadlineJobs} />
            <JobList jobs={latestJobs} />
            <CVServicesCTA />
            <CategoryGrid />
            <OpportunityGrid opportunities={latestOpportunities} />
            <ServiceNudge />
          </div>

          {/* Right Column — Sidebar */}
          <div className="w-full lg:w-80 shrink-0">
            <HomeSidebar
              featuredJobs={featuredJobs}
              topCompanies={topCompanies}
              deadlineJobs={deadlineJobs}
            />
          </div>
        </div>
      </div>

      {/* WhatsApp Float */}
      <WhatsAppFloat />
    </>
  );
}
