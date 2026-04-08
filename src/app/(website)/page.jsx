import { db } from "@/lib/db";
import { generateMeta, generateWebSiteJsonLd } from "@/lib/seo";
import { siteConfig } from "@/config/site-config";
import Script from "next/script";
import HomeHero from "./_components/HomeHero";
import DeadlineStrip from "./_components/DeadlineStrip";
import FeaturedJobs from "./_components/FeaturedJobs";
import JobList from "./_components/JobList";
import TrendingNow from "./_components/TrendingNow";
import CategoryGrid from "./_components/CategoryGrid";
import GovVacancies from "./_components/GovVacancies";
import EntryInternLocation from "./_components/EntryInternLocation";
import OpportunityGrid from "./_components/OpportunityGrid";
import UniCvBursaries from "./_components/UniCvBursaries";
import CareerBlog from "./_components/CareerBlog";
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
      trendingJobs,
      entryLevelJobs,
      internshipJobs,
      allGovJobs,
      latestOpportunities,
      universityOpps,
      bursaryOpps,
      locationCounts,
      totalJobs,
      totalCompanies,
    ] = await Promise.all([
      // Latest 10 published jobs (for job list)
      db.job.findMany({
        where: { status: "Published", isActive: true },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          company: {
            select: { name: true, slug: true, logo: true, logoColor: true, isVerified: true },
          },
        },
      }),
      // Featured jobs (isFeatured: true)
      db.job.findMany({
        where: { status: "Published", isActive: true, isFeatured: true },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          company: {
            select: { name: true, slug: true, logo: true, logoColor: true, isVerified: true },
          },
        },
      }),
      // Deadline jobs (urgent — closing within 7 days)
      db.job.findMany({
        where: {
          status: "Published",
          isActive: true,
          applicationDeadline: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        },
        orderBy: { applicationDeadline: "asc" },
        take: 5,
        include: { company: { select: { name: true, slug: true } } },
      }),
      // Trending jobs (sorted by viewCount)
      db.job.findMany({
        where: { status: "Published", isActive: true },
        orderBy: { viewCount: "desc" },
        take: 5,
        include: { company: { select: { name: true, slug: true } } },
      }),
      // Entry level jobs
      db.job.findMany({
        where: { status: "Published", isActive: true, experienceLevel: "Entry" },
        orderBy: { createdAt: "desc" },
        take: 4,
        include: { company: { select: { name: true, slug: true } } },
      }),
      // Internship jobs
      db.job.findMany({
        where: { status: "Published", isActive: true, employmentType: "Internship" },
        orderBy: { createdAt: "desc" },
        take: 4,
        include: { company: { select: { name: true, slug: true } } },
      }),
      // All government jobs (we'll split county/national in component)
      db.job.findMany({
        where: { status: "Published", isActive: true, categories: { path: "$", array_contains: "GOVERNMENT_PUBLIC_SECTOR" } },
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { company: { select: { name: true, slug: true } } },
      }).catch(() => {
        // Fallback if JSON filter fails: fetch and filter in-memory
        return db.job.findMany({
          where: { status: "Published", isActive: true },
          orderBy: { createdAt: "desc" },
          take: 50,
          include: { company: { select: { name: true, slug: true } } },
        }).then((jobs) => {
          return jobs.filter((job) => {
            const cats = typeof job.categories === "string" ? JSON.parse(job.categories) : job.categories;
            return Array.isArray(cats) && cats.includes("GOVERNMENT_PUBLIC_SECTOR");
          }).slice(0, 8);
        });
      }),
      // Latest opportunities
      db.opportunity.findMany({
        where: { status: "Published", isActive: true },
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { company: { select: { name: true } } },
      }),
      // University opportunities
      db.opportunity.findMany({
        where: { status: "Published", isActive: true },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
      // Bursary/Scholarship opportunities
      db.opportunity.findMany({
        where: {
          status: "Published",
          isActive: true,
          opportunityType: { in: ["BURSARY", "SCHOLARSHIP"] },
        },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
      // Location counts
      db.job.groupBy({
        by: ["city"],
        where: { status: "Published", isActive: true, city: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 6,
      }),
      // Counts
      db.job.count({ where: { status: "Published", isActive: true } }),
      db.company.count({ where: { isActive: true } }),
    ]);

    return {
      latestJobs: latestJobs || [],
      featuredJobs: featuredJobs || [],
      deadlineJobs: deadlineJobs || [],
      trendingJobs: trendingJobs || [],
      entryLevelJobs: entryLevelJobs || [],
      internshipJobs: internshipJobs || [],
      govJobs: allGovJobs || [],
      opportunities: latestOpportunities || [],
      universityOpps: universityOpps || [],
      bursaryOpps: bursaryOpps || [],
      locationCounts: locationCounts || [],
      totalJobs: totalJobs || 0,
      totalCompanies: totalCompanies || 0,
    };
  } catch (error) {
    console.error("[Homepage] DB fetch error:", error);
    return {
      latestJobs: [],
      featuredJobs: [],
      deadlineJobs: [],
      trendingJobs: [],
      entryLevelJobs: [],
      internshipJobs: [],
      govJobs: [],
      opportunities: [],
      universityOpps: [],
      bursaryOpps: [],
      locationCounts: [],
      totalJobs: 0,
      totalCompanies: 0,
    };
  }
}

export default async function HomePage() {
  const data = await fetchHomepageData();
  const jsonLd = generateWebSiteJsonLd();

  // Split gov jobs: county = those with "County" in location/title, national = rest
  const countyJobs = data.govJobs.filter(
    (j) =>
      (j.location && j.location.toLowerCase().includes("county")) ||
      (j.title && j.title.toLowerCase().includes("county"))
  );
  const nationalJobs = data.govJobs.filter(
    (j) =>
      !(j.location && j.location.toLowerCase().includes("county")) &&
      !(j.title && j.title.toLowerCase().includes("county"))
  );

  // Pad if needed to get 4 each
  const padCounty = countyJobs.length < 4 ? [...countyJobs, ...nationalJobs.slice(0, 4 - countyJobs.length)] : countyJobs;
  const padNational = nationalJobs.length < 4 ? [...nationalJobs, ...countyJobs.slice(0, 4 - nationalJobs.length)] : nationalJobs;

  return (
    <>
      <Script
        id="homepage-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HomeHero />
      <DeadlineStrip jobs={data.deadlineJobs} />
      <FeaturedJobs featuredJobs={data.featuredJobs} />

      {/* Latest Jobs + Trending — 2 column */}
      <section className="py-8 md:py-12">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <JobList jobs={data.latestJobs} />
            <TrendingNow jobs={data.trendingJobs} />
          </div>
        </div>
      </section>

      <CategoryGrid />
      <GovVacancies
        countyJobs={padCounty.slice(0, 4)}
        nationalJobs={padNational.slice(0, 4)}
      />
      <EntryInternLocation
        entryJobs={data.entryLevelJobs}
        internJobs={data.internshipJobs}
        locationCounts={data.locationCounts}
      />
      <OpportunityGrid />
      <UniCvBursaries
        universityOpps={data.universityOpps}
        bursaryOpps={data.bursaryOpps}
      />
      <CareerBlog />
      <WhatsAppFloat />
    </>
  );
}
