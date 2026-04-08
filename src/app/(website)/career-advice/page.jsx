import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate, formatReadingTime } from "@/lib/format";
import { generateMeta, generateCollectionPageJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";

// ─── Client Components ──────────────────────────────────
import SubscribeForm from "../_components/SubscribeForm";
import AdPlaceholder from "../_components/AdPlaceholder";

// ─── Constants ──────────────────────────────────────────
const PER_PAGE = 12;

// ─── Data Fetching ──────────────────────────────────────
async function getArticles(page = 1) {
  try {
    const skip = (page - 1) * PER_PAGE;

    const [articles, total] = await Promise.all([
      db.blogArticle.findMany({
        where: { isPublished: true, publishedAt: { not: null } },
        orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
        skip,
        take: PER_PAGE,
        include: {
          author: { select: { name: true, slug: true, avatar: true, title: true } },
          category: { select: { name: true, slug: true, color: true } },
        },
      }),
      db.blogArticle.count({
        where: { isPublished: true, publishedAt: { not: null } },
      }),
    ]);

    const popularArticles = await db.blogArticle.findMany({
      where: { isPublished: true, publishedAt: { not: null } },
      orderBy: { viewsCount: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        featuredImage: true,
        viewsCount: true,
        publishedAt: true,
        category: { select: { name: true, slug: true, color: true } },
      },
    });

    return { articles, total, popularArticles };
  } catch (error) {
    console.error("[getArticles] DB error:", error.message);
    return { articles: [], total: 0, popularArticles: [] };
  }
}

// ─── Metadata ───────────────────────────────────────────
export async function generateMetadata() {
  return generateMeta({
    title: "Career Advice & Job Search Tips",
    description:
      "Expert career advice, CV writing tips, interview preparation guides, and job search strategies for Kenyan job seekers. Stay ahead with JobReady Kenya.",
    path: "/career-advice",
  });
}

// ─── Page Component ─────────────────────────────────────
export default async function CareerAdviceListingPage({ searchParams }) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page, 10) || 1);
  const { articles, total, popularArticles } = await getArticles(currentPage);

  const totalPages = Math.ceil(total / PER_PAGE);

  // Separate featured article (first featured) from the rest
  const featuredArticle = articles.find((a) => a.isFeatured);
  const gridArticles = featuredArticle
    ? articles.filter((a) => a.id !== featuredArticle.id)
    : articles;

  // Breadcrumb
  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Career Advice", href: "/career-advice" },
  ];
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbItems);

  // Collection JSON-LD
  const collectionJsonLd = generateCollectionPageJsonLd({
    name: "Career Advice & Job Search Tips",
    description: "Expert career advice and job search tips for Kenyan job seekers.",
    url: "/career-advice",
    totalItems: total,
  });

  // Pagination helper
  function buildPageUrl(pageNum) {
    return pageNum === 1 ? "/career-advice" : `/career-advice?page=${pageNum}`;
  }

  return (
    <main className="py-8 md:py-12 bg-gray-50">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4 flex flex-wrap items-center gap-1">
          {breadcrumbItems.map((item, i) => (
            <span key={item.href}>
              {i > 0 && <span className="text-gray-300 mx-1">/</span>}
              {i === breadcrumbItems.length - 1 ? (
                <span className="text-gray-700 font-medium">{item.name}</span>
              ) : (
                <Link href={item.href} className="hover:text-teal-600 transition-colors">
                  {item.name}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Career Advice &amp; News
          </h1>
          <p className="text-gray-500 mt-1">
            {total} {total === 1 ? "article" : "articles"} to help you land your dream job
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* ═══ MAIN CONTENT (3/4) ═══ */}
          <div className="lg:col-span-3">
            {/* ─── Featured Article Hero ─── */}
            {featuredArticle && currentPage === 1 && (
              <Link
                href={`/career-advice/${featuredArticle.slug}`}
                className="block bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow mb-8"
              >
                <div className="grid md:grid-cols-2">
                  {featuredArticle.featuredImage && (
                    <div className="aspect-video md:aspect-auto md:h-full overflow-hidden">
                      <img
                        src={featuredArticle.featuredImage}
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col justify-center">
                    {featuredArticle.category && (
                      <span
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full inline-block w-fit mb-3"
                        style={{
                          backgroundColor: featuredArticle.category.color
                            ? `${featuredArticle.category.color}20`
                            : "#F0FDFA",
                          color: featuredArticle.category.color || "#0F766E",
                        }}
                      >
                        {featuredArticle.category.name}
                      </span>
                    )}
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-3">
                      {featuredArticle.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      {featuredArticle.author && (
                        <span className="font-medium text-gray-600">
                          {featuredArticle.author.name}
                        </span>
                      )}
                      {featuredArticle.publishedAt && (
                        <>
                          <span className="text-gray-300">|</span>
                          <span>{formatDate(featuredArticle.publishedAt)}</span>
                        </>
                      )}
                      <span className="text-gray-300">|</span>
                      <span>{formatReadingTime(featuredArticle.wordCount)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* ─── Article Grid ─── */}
            {gridArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {gridArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/career-advice/${article.slug}`}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    {article.featuredImage && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={article.featuredImage}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      {article.category && (
                        <span
                          className="text-xs font-semibold px-2.5 py-0.5 rounded-full inline-block mb-2"
                          style={{
                            backgroundColor: article.category.color
                              ? `${article.category.color}20`
                              : "#F0FDFA",
                            color: article.category.color || "#0F766E",
                          }}
                        >
                          {article.category.name}
                        </span>
                      )}
                      <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-teal-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-3">
                        {article.author && (
                          <span className="font-medium text-gray-600">
                            {article.author.name}
                          </span>
                        )}
                        {article.publishedAt && (
                          <>
                            <span className="text-gray-300">&middot;</span>
                            <span>{formatDate(article.publishedAt)}</span>
                          </>
                        )}
                        <span className="text-gray-300">&middot;</span>
                        <span>{formatReadingTime(article.wordCount)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <p className="text-gray-400 text-lg">No articles published yet.</p>
                <p className="text-gray-400 text-sm mt-1">Check back soon for career advice and tips.</p>
              </div>
            )}

            {/* ─── Pagination ─── */}
            {totalPages > 1 && (
              <nav className="flex items-center justify-center gap-2 mt-8" aria-label="Pagination">
                {/* Previous */}
                {currentPage > 1 ? (
                  <Link
                    href={buildPageUrl(currentPage - 1)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-100 rounded-lg cursor-not-allowed">
                    Previous
                  </span>
                )}

                {/* Page Numbers */}
                {(() => {
                  const pages = [];
                  const start = Math.max(1, currentPage - 2);
                  const end = Math.min(totalPages, currentPage + 2);

                  if (start > 1) {
                    pages.push(
                      <Link key={1} href={buildPageUrl(1)} className="px-3 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                        1
                      </Link>
                    );
                    if (start > 2) {
                      pages.push(
                        <span key="ellipsis-start" className="px-2 text-gray-300">
                          ...
                        </span>
                      );
                    }
                  }

                  for (let i = start; i <= end; i++) {
                    pages.push(
                      i === currentPage ? (
                        <span
                          key={i}
                          className="px-3 py-2 text-sm font-bold text-white bg-teal-600 rounded-lg"
                          aria-current="page"
                        >
                          {i}
                        </span>
                      ) : (
                        <Link
                          key={i}
                          href={buildPageUrl(i)}
                          className="px-3 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          {i}
                        </Link>
                      )
                    );
                  }

                  if (end < totalPages) {
                    if (end < totalPages - 1) {
                      pages.push(
                        <span key="ellipsis-end" className="px-2 text-gray-300">
                          ...
                        </span>
                      );
                    }
                    pages.push(
                      <Link
                        key={totalPages}
                        href={buildPageUrl(totalPages)}
                        className="px-3 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        {totalPages}
                      </Link>
                    );
                  }

                  return pages;
                })()}

                {/* Next */}
                {currentPage < totalPages ? (
                  <Link
                    href={buildPageUrl(currentPage + 1)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </Link>
                ) : (
                  <span className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-100 rounded-lg cursor-not-allowed">
                    Next
                  </span>
                )}
              </nav>
            )}
          </div>

          {/* ═══ RIGHT SIDEBAR (1/4) ═══ */}
          <aside className="space-y-6">
            {/* Subscribe */}
            <SubscribeForm />

            {/* Ad */}
            <AdPlaceholder height="250px" />

            {/* Popular Articles */}
            {popularArticles.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-5">
                <h3 className="font-bold text-gray-900 mb-4">Popular Articles</h3>
                <ul className="space-y-4">
                  {popularArticles.map((article, i) => (
                    <li key={article.id} className="flex gap-3">
                      <span className="text-2xl font-bold text-gray-200 leading-none flex-shrink-0 w-6">
                        {i + 1}
                      </span>
                      <Link
                        href={`/career-advice/${article.slug}`}
                        className="group flex-1 min-w-0"
                      >
                        <h4 className="text-sm font-medium text-gray-700 group-hover:text-teal-600 transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                          <span>{formatDate(article.publishedAt)}</span>
                          <span>&middot;</span>
                          <span>{article.viewsCount.toLocaleString()} views</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ad */}
            <AdPlaceholder height="200px" label="Sponsored" />
          </aside>
        </div>
      </div>
    </main>
  );
}
