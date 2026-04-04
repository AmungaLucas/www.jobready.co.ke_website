import Link from "next/link";
import { generateMeta, generateArticleJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import ArticleHeader from "./_components/ArticleHeader";
import ArticleBody from "./_components/ArticleBody";
import ArticleSidebar from "./_components/ArticleSidebar";
import AuthorBio from "./_components/AuthorBio";
import ArticleTags from "./_components/ArticleTags";
import ShareButtons from "./_components/ShareButtons";
import { article as mockArticle, relatedArticles } from "./_components/mock-data";
import { getArticleHtml } from "./_components/article-content";
import { FiClock, FiEye, FiArrowRight } from "react-icons/fi";

// Mock slug lookup — in production this would be a DB query
const allArticles = {
  "how-to-write-cv-kenya-2026": mockArticle,
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = allArticles[slug];

  if (!article) {
    return generateMeta({ title: "Article Not Found" });
  }

  return generateMeta({
    title: article.title,
    description: article.subtitle,
    path: `/career-advice/${article.slug}`,
    ogType: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
  });
}

export default async function BlogArticlePage({ params }) {
  const { slug } = await params;
  const article = allArticles[slug] || mockArticle; // fallback to mock
  const articleHtml = getArticleHtml();

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Career Advice", href: "/career-advice" },
    { name: article.category, href: `/career-advice?category=${article.categorySlug}` },
    { name: article.title },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);
  const articleJsonLd = generateArticleJsonLd({
    ...article,
    canonicalUrl: `https://jobready.co.ke/career-advice/${article.slug}`,
    featuredImage: "https://jobready.co.ke/images/blog/cv-writing-kenya-2026.jpg",
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    author: {
      name: article.author.name,
      linkedinUrl: article.author.linkedin,
      title: article.author.title,
    },
    category: { name: article.category },
  });

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Header */}
      <ArticleHeader article={article} />

      {/* Article Layout */}
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 py-10 md:py-14">
          {/* Main Content */}
          <div className="min-w-0 max-w-full">
            <div className="bg-white rounded-2xl shadow-sm p-7 md:p-10 min-w-0 overflow-hidden">
              {/* Share Buttons */}
              <ShareButtons article={article} />

              {/* Article Body */}
              <ArticleBody
                htmlContent={articleHtml}
                tableOfContents={article.tableOfContents}
              />
            </div>

            {/* Tags */}
            <ArticleTags tags={article.tags} />

            {/* Reactions */}
            <div className="bg-white rounded-2xl shadow-sm p-5 mt-4 flex items-center gap-4 flex-wrap">
              <span className="text-sm font-semibold text-gray-600">Was this helpful?</span>
              {[
                { id: "helpful", emoji: "👍", label: "Helpful", count: 42 },
                { id: "love", emoji: "❤️", label: "Love it", count: 18 },
                { id: "insightful", emoji: "💡", label: "Insightful", count: 29 },
                { id: "mindblowing", emoji: "🤯", label: "Mind-blowing", count: 7 },
              ].map((r) => (
                <button
                  key={r.id}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 transition-all cursor-pointer"
                >
                  <span className="text-base">{r.emoji}</span>
                  <span className="text-xs font-semibold">{r.count}</span>
                </button>
              ))}
            </div>

            {/* Author Bio */}
            <AuthorBio author={article.author} />
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block min-w-0">
            <ArticleSidebar article={article} />
          </aside>
        </div>
      </div>

      {/* Related Articles */}
      <div className="container mb-10">
        <h2 className="text-lg font-extrabold text-gray-900 mb-5 flex items-center gap-2">
          <FiArrowRight size={20} className="text-blue-600" />
          Related Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {relatedArticles.map((rel) => (
            <Link
              key={rel.slug}
              href={`/career-advice/${rel.slug}`}
              className="block bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md hover:-translate-y-px border-2 border-transparent hover:border-blue-200 no-underline group"
            >
              <div className={`h-2 ${rel.gradient}`} />
              <div className="p-5">
                <span className={`inline-block px-2.5 py-1 rounded-full text-[0.65rem] font-bold mb-2.5 ${rel.pillColor}`}>
                  {rel.category}
                </span>
                <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {rel.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <FiClock size={13} />
                    {rel.readingTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiEye size={13} />
                    {rel.viewsCount.toLocaleString()} views
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
