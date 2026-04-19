import { Suspense } from "react";
import { db } from "@/lib/db";
import { generateMeta, generateWebSiteJsonLd } from "@/lib/seo";
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
import {
  HeroSkeleton,
  DeadlineStripSkeleton,
  JobListSkeleton,
  TrendingSkeleton,
  CategoryGridSkeleton,
  JobCardSkeleton,
} from "./_components/Skeletons";

// Revalidate every 60 seconds (ISR) — serves cached page instantly,
// regenerates in background. Job board data changes a few times/day.
export const revalidate = 60;

export async function generateMetadata() {
  return generateMeta({
    title: "Kenya's #1 Job Board — Jobs, Internships & Scholarships",
    description:
      "Find 2,500+ jobs, internships, scholarships & career opportunities in Kenya. Updated daily. Free CV writing services from KSh 500.",
    path: "/",
  });
}

// ─── Data Fetching ──────────────────────────────────────────
// Split into 2 batches: above-fold (hero/deadline/featured) and
// below-fold (everything else). The below-fold batch is loaded
// inside a Suspense boundary so the above-fold content streams first.

async function fetchAboveFoldData() {
  try {
    const [featuredJobs, deadlineJobs, totalJobs, totalCompanies] = await Promise.all([
      // Featured jobs
      db.job.findMany({
        where: { status: "PUBLISHED", isActive: true, isFeatured: true },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          company: {
            select: { name: true, slug: true, logo: true, logoColor: true, isVerified: true },
          },
        },
      }),
      // Deadline jobs (closing within 7 days)
      db.job.findMany({
        where: {
          status: "PUBLISHED",
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
      // Counts for hero stats
      db.job.count({ where: { status: "PUBLISHED", isActive: true } }),
      db.company.count({ where: { isActive: true } }),
    ]);

    return {
      featuredJobs: featuredJobs || [],
      deadlineJobs: deadlineJobs || [],
      totalJobs: totalJobs || 0,
      totalCompanies: totalCompanies || 0,
    };
  } catch (error) {
    console.error("[Homepage AboveFold] DB fetch error:", error);
    return {
      featuredJobs: [],
      deadlineJobs: [],
      totalJobs: 0,
      totalCompanies: 0,
    };
  }
}

async function fetchBelowFoldData() {
  try {
    const [
      latestJobs,
      trendingJobs,
      entryLevelJobs,
      internshipJobs,
      govJobs,
      opportunityTypeCounts,
      universityOpps,
      bursaryOpps,
      locationCounts,
      topCompanies,
      blogArticles,
    ] = await Promise.all([
      // Latest 10 published jobs
      db.job.findMany({
        where: { status: "PUBLISHED", isActive: true },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          company: {
            select: { name: true, slug: true, logo: true, logoColor: true, isVerified: true },
          },
        },
      }),
      // Trending jobs (sorted by viewCount)
      db.job.findMany({
        where: { status: "PUBLISHED", isActive: true },
        orderBy: { viewCount: "desc" },
        take: 5,
        include: { company: { select: { name: true, slug: true } } },
      }),
      // Entry level jobs
      db.job.findMany({
        where: { status: "PUBLISHED", isActive: true, experienceLevel: "ENTRY_LEVEL" },
        orderBy: { createdAt: "desc" },
        take: 4,
        include: { company: { select: { name: true, slug: true } } },
      }),
      // Internship jobs
      db.job.findMany({
        where: { status: "PUBLISHED", isActive: true, employmentType: "INTERNSHIP" },
        orderBy: { createdAt: "desc" },
        take: 4,
        include: { company: { select: { name: true, slug: true } } },
      }),
      // Government jobs (limit to 8, no fallback fetch)
      db.job.findMany({
        where: {
          status: "PUBLISHED",
          isActive: true,
          categories: { path: "$", array_contains: "GOVERNMENT_PUBLIC_SECTOR" },
        },
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { company: { select: { name: true, slug: true } } },
      }).catch(() => []),
      // Opportunity type counts
      db.opportunity.groupBy({
        by: ["opportunityType"],
        where: { status: "PUBLISHED", isActive: true },
        _count: { id: true },
      }),
      // University opportunities
      db.opportunity.findMany({
        where: {
          status: "PUBLISHED",
          isActive: true,
          opportunityType: { in: ["UNIVERSITY_ADMISSION", "SCHOLARSHIP", "EXCHANGE"] },
        },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
      // Bursary/Scholarship opportunities
      db.opportunity.findMany({
        where: {
          status: "PUBLISHED",
          isActive: true,
          opportunityType: { in: ["BURSARY", "SCHOLARSHIP"] },
        },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
      // Location counts
      db.job.groupBy({
        by: ["county"],
        where: { status: "PUBLISHED", isActive: true, county: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 6,
      }),
      // Top companies (sorted by active job count)
      db.company.findMany({
        where: { isActive: true, jobs: { some: { status: "PUBLISHED", isActive: true } } },
        take: 8,
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          logoColor: true,
          industry: true,
          isVerified: true,
          _count: { select: { jobs: { where: { status: "PUBLISHED", isActive: true } } } },
        },
        orderBy: { jobs: { _count: "desc" } },
      }),
      // Blog articles for CareerBlog
      db.blogArticle.findMany({
        where: { isPublished: true, publishedAt: { not: null } },
        orderBy: { publishedAt: "desc" },
        take: 3,
        select: {
          slug: true,
          title: true,
          excerpt: true,
          featuredImage: true,
          category: { select: { name: true, color: true } },
        },
      }),
    ]);

    return {
      latestJobs: latestJobs || [],
      trendingJobs: trendingJobs || [],
      entryLevelJobs: entryLevelJobs || [],
      internshipJobs: internshipJobs || [],
      govJobs: govJobs || [],
      opportunityTypeCounts: opportunityTypeCounts || [],
      universityOpps: universityOpps || [],
      bursaryOpps: bursaryOpps || [],
      locationCounts: locationCounts || [],
      topCompanies: topCompanies || [],
      blogArticles: blogArticles || [],
    };
  } catch (error) {
    console.error("[Homepage BelowFold] DB fetch error:", error);
    return {
      latestJobs: [],
      trendingJobs: [],
      entryLevelJobs: [],
      internshipJobs: [],
      govJobs: [],
      opportunityTypeCounts: [],
      universityOpps: [],
      bursaryOpps: [],
      locationCounts: [],
      topCompanies: [],
      blogArticles: [],
    };
  }
}

// ─── Skeleton for below-fold sections ────────────────────────
function BelowFoldSkeleton() {
  return (
    <>
      {/* Job list + Trending */}
      <section className="py-8 md:py-12">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <JobListSkeleton />
            <TrendingSkeleton />
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section className="py-4">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-4" />
          <CategoryGridSkeleton />
        </div>
      </section>

      {/* Gov vacancies */}
      <section className="py-8">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="h-7 w-56 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <JobCardSkeleton key={i} />)}
            </div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <JobCardSkeleton key={i} />)}
            </div>
          </div>
        </div>
      </section>

      {/* Opportunity + Uni/CV/Bursaries */}
      <section className="py-8">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
                <div className="h-5 w-20 bg-gray-200 rounded mb-2" />
                <div className="h-8 w-12 bg-teal-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career blog skeleton */}
      <section className="py-8">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="w-full h-40 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  <div className="h-3 w-full bg-gray-100 rounded" />
                  <div className="h-3 w-2/3 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ─── Below-fold content component ────────────────────────────
async function BelowFoldContent() {
  const data = await fetchBelowFoldData();

  // Split gov jobs: county vs national
  const countyJobs = data.govJobs.filter(
    (j) =>
      (j.county && j.county.toLowerCase().includes("county")) ||
      (j.title && j.title.toLowerCase().includes("county"))
  );
  const nationalJobs = data.govJobs.filter(
    (j) =>
      !(j.county && j.county.toLowerCase().includes("county")) &&
      !(j.title && j.title.toLowerCase().includes("county"))
  );
  const padCounty = countyJobs.length < 4 ? [...countyJobs, ...nationalJobs.slice(0, 4 - countyJobs.length)] : countyJobs;
  const padNational = nationalJobs.length < 4 ? [...nationalJobs, ...countyJobs.slice(0, 4 - nationalJobs.length)] : nationalJobs;

  return (
    <>
      {/* Latest Jobs + Trending */}
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
      <OpportunityGrid typeCounts={Object.fromEntries((data.opportunityTypeCounts || []).map(r => [r.opportunityType, r._count.id]))} />
      <UniCvBursaries
        universityOpps={data.universityOpps}
        bursaryOpps={data.bursaryOpps}
      />
      <CareerBlog articles={data.blogArticles} />
    </>
  );
}

// ─── Page Component ──────────────────────────────────────────
export default async function HomePage() {
  const aboveFold = await fetchAboveFoldData();
  const jsonLd = generateWebSiteJsonLd();

  return (
    <>
      <Script
        id="homepage-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Above the fold — streams immediately */}
      <HomeHero />
      <DeadlineStrip jobs={aboveFold.deadlineJobs} />
      <FeaturedJobs featuredJobs={aboveFold.featuredJobs} />

      {/* Below the fold — streams in with skeleton placeholder */}
      <Suspense fallback={<BelowFoldSkeleton />}>
        <BelowFoldContent />
      </Suspense>

      <WhatsAppFloat />
    </>
  );
}
