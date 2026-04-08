import { generateMeta, generateWebSiteJsonLd } from "@/lib/seo";
import { siteConfig } from "@/config/site-config";

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
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Minimal test - no DB queries */}
      <section className="bg-purple-800 text-white py-20 text-center">
        <h1 className="text-4xl font-bold">
          Find Your Next Opportunity <span className="text-teal-300">in Kenya</span>
        </h1>
        <p className="mt-4 text-purple-200">
          {stats.totalJobs.toLocaleString()}+ jobs &middot; {stats.totalCompanies.toLocaleString()}+ companies
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Homepage Test</h2>
        <p className="text-gray-600">
          If you can see this, the server components render correctly without DB queries.
          The error is caused by the database queries or data rendering.
        </p>
      </div>
    </>
  );
}
