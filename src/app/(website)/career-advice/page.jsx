import { db } from "@/lib/db";
import { generateMeta, generateBreadcrumbJsonLd } from "@/lib/seo";
import FeaturedArticle from "./_components/FeaturedArticle";
import CareerAdviceClient from "./_components/CareerAdviceClient";
import PopularArticles from "./_components/PopularArticles";
import CVReviewCTA from "@/app/(website)/_components/CVReviewCTA";
import NewsletterForm from "@/app/(website)/_components/NewsletterForm";
import AdSlot from "@/app/(website)/_components/AdSlot";
import SidebarCard from "@/app/(website)/_components/SidebarCard";
import Link from "next/link";
import { FiChevronRight, FiFileText } from "react-icons/fi";

export const dynamic = "force-dynamic";

export const metadata = generateMeta({
  title: "Career Advice & Job Search Tips for Kenyan Job Seekers",
  description:
    "Expert career advice for Kenyan job seekers. CV writing tips, interview preparation, job search strategies, and career growth guides. Updated weekly by career coaches.",
  path: "/career-advice",
});

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Career Advice", href: "/career-advice" },
];

const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);

const blogJsonLd = {
  "@context": "https://schema.org/",
  "@type": "Blog",
  name: "JobReady Career Advice",
  url: "https://jobready.co.ke/career-advice",
  description:
    "Expert career advice for Kenyan job seekers. CV writing tips, interview preparation, job search strategies, and career growth guides.",
  publisher: {
    "@type": "Organization",
    name: "JobReady Kenya",
    url: "https://jobready.co.ke",
  },
};

// Static sidebar categories
const sidebarCategories = [
  { name: "CV Writing Tips", slug: "cv-tips", count: "—" },
  { name: "Interview Preparation", slug: "interview", count: "—" },
  { name: "Job Search Strategies", slug: "job-search", count: "—" },
  { name: "Career Growth", slug: "career-growth", count: "—" },
  { name: "Government Jobs", slug: "government", count: "—" },
  { name: "Salary & Negotiation", slug: "salary", count: "—" },
  { name: "Scholarships", slug: "industry", count: "—" },
];

// Static popular tags
const popularTags = [
  "CV Writing",
  "Job Search",
  "ATS",
  "Kenya Jobs",
  "Interview",
  "Career Advice",
  "Safaricom",
  "Government",
  "Salary",
  "Graduate",
  "LinkedIn",
  "Cover Letter",
  "Remote Work",
  "Internship",
  "Scholarships",
];

export default async function CareerAdvicePage() {
  // Fetch articles directly from database
  let articles = [];
  try {
    articles = await db.blogArticle.findMany({
      where: {
        isPublished: true,
        publishedAt: { not: null, lte: new Date() },
      },
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
      take: 20,
      include: {
        author: { select: { name: true } },
        category: { select: { name: true, slug: true, color: true } },
      },
    });
  } catch (error) {
    console.error("Failed to fetch articles:", error);
  }

  const featured = articles.find((a) => a.isFeatured) || articles[0] || null;
  const regularArticles = articles.filter((a) => !a.isFeatured);

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white py-14 md:py-20 relative overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-1/3 -left-1/6 w-96 h-96 rounded-full bg-white/[0.03] pointer-events-none" />
        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold mb-4 border border-white/20">
              <FiFileText size={14} />
              Career Advice &amp; Job Search Tips
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 tracking-tight">
              Career Advice for Kenyan Job Seekers
            </h1>
            <p className="text-base opacity-85 leading-relaxed max-w-xl mx-auto">
              Expert tips on CV writing, interview preparation, job search strategies,
              and career growth. Updated weekly by our team of career coaches.
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-5 text-sm opacity-70">
              <Link href="/" className="hover:text-white transition-colors no-underline text-white/85">
                Home
              </Link>
              <FiChevronRight size={14} />
              <span>Career Advice</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <div className="container">
        <FeaturedArticle article={featured} />
      </div>

      {/* Main Content + Sidebar Layout */}
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 pt-8 pb-16">
          {/* Main Column */}
          <CareerAdviceClient articles={regularArticles} />

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-[84px]">
              <CVReviewCTA />
              <AdSlot position="sidebar" />
              <PopularArticles />
              <SidebarCard title="Newsletter" icon={FiFileText}>
                <p className="text-sm text-gray-500 mb-3">
                  Get weekly career tips and job alerts delivered to your inbox.
                </p>
                <NewsletterForm type="career_tips" />
              </SidebarCard>
              <SidebarCard title="Categories">
                <ul className="list-none">
                  {sidebarCategories.map((cat) => (
                    <li key={cat.slug} className="mb-0.5">
                      <Link
                        href={`/career-advice?category=${cat.slug}`}
                        className="flex justify-between items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all no-underline"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </SidebarCard>
              <SidebarCard title="Popular Tags">
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-full text-xs font-medium text-gray-600 bg-gray-100 hover:bg-blue-100 hover:text-blue-600 transition-all cursor-pointer border border-transparent hover:border-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </SidebarCard>
              <AdSlot position="sidebar" />
            </div>
          </aside>
        </div>
      </div>

      {/* Full-width ad */}
      <div className="container">
        <AdSlot position="leaderboard" />
      </div>
    </>
  );
}
