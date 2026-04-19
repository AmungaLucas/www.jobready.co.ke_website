import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate, formatReadingTime } from "@/lib/format";
import { generateMeta, generateArticleJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";

// ─── Client Components ──────────────────────────────────
import OptimizedImage from "@/components/OptimizedImage";
import AdPlaceholder from "../../_components/AdPlaceholder";
import ShareStrip from "../../_components/ShareStrip";
import SubscribeForm from "../../_components/SubscribeForm";

// ─── Static Generation ───────────────────────────────────
// Pre-render published article pages at build time for faster TTFB.
// ISR (revalidate) ensures new articles appear within 1 hour.
export async function generateStaticParams() {
  try {
    const articles = await db.blogArticle.findMany({
      where: { isPublished: true, publishedAt: { not: null } },
      select: { slug: true },
      take: 500,
    });
    return articles.map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

// Revalidate pre-rendered pages every hour so new articles appear
export const revalidate = 3600;

// ─── Data Fetching ──────────────────────────────────────
async function getArticle(slug) {
  try {
    const article = await db.blogArticle.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            slug: true,
            title: true,
            bio: true,
            avatar: true,
            linkedinUrl: true,
            twitterUrl: true,
            articleCount: true,
          },
        },
        category: {
          select: { name: true, slug: true, color: true },
        },
        tags: {
          include: {
            tag: { select: { name: true, slug: true } },
          },
        },
      },
    });

    if (!article || !article.isPublished) return null;

    // Fire-and-forget viewCount increment
    db.blogArticle.update({
      where: { id: article.id },
      data: { viewsCount: { increment: 1 } },
    }).catch(() => {});

    // Fetch related articles (same category, top 5)
    const relatedArticles = await db.blogArticle.findMany({
      where: {
        id: { not: article.id },
        categoryId: article.categoryId,
        isPublished: true,
        publishedAt: { not: null },
      },
      orderBy: { publishedAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
        category: { select: { name: true, slug: true, color: true } },
      },
    });

    return { article, relatedArticles };
  } catch (error) {
    console.error("[getArticle] DB error for slug:", slug, error.message);
    return null;
  }
}

// ─── Metadata ───────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const article = await db.blogArticle.findUnique({
      where: { slug },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } },
      },
    });

    if (!article || !article.isPublished) {
      return { title: "Article Not Found | JobReady Kenya" };
    }

    return generateMeta({
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt || `Read "${article.title}" on JobReady Kenya.`,
      path: `/career-advice/${slug}`,
      ogType: "article",
      ogImage: article.ogImage || article.featuredImage || undefined,
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt?.toISOString(),
    });
  } catch {
    return { title: "Article Not Found | JobReady Kenya" };
  }
}

// ─── Page Component ─────────────────────────────────────
export default async function ArticleDetailPage({ params }) {
  const { slug } = await params;
  const data = await getArticle(slug);

  if (!data) notFound();

  const { article, relatedArticles } = data;
  const author = article.author;
  const category = article.category;
  const tags = article.tags.map((t) => t.tag);

  // Breadcrumb: Home > Career Advice > {Category} > {Title}
  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Career Advice", href: "/career-advice" },
  ];
  if (category) {
    breadcrumbItems.push({
      name: category.name,
      href: `/career-advice?category=${encodeURIComponent(category.slug)}`,
    });
  }
  breadcrumbItems.push({ name: article.title, href: `/career-advice/${slug}` });

  // JSON-LD
  const articleJsonLd = generateArticleJsonLd(article);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbItems);

  // Reading time display
  const readingTimeDisplay = formatReadingTime(article.wordCount);

  return (
    <main className="py-8 md:py-12 bg-gray-50">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* ═══ LEFT COLUMN (2/3) ═══ */}
          <article className="lg:col-span-2">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-4 flex flex-wrap items-center gap-1">
              {breadcrumbItems.map((item, i) => (
                <span key={item.href}>
                  {i > 0 && <span className="text-gray-300 mx-1">/</span>}
                  {i === breadcrumbItems.length - 1 ? (
                    <span className="text-gray-700 font-medium truncate max-w-[200px] sm:max-w-none inline-block align-bottom">
                      {item.name}
                    </span>
                  ) : (
                    <Link href={item.href} className="hover:text-teal-600 transition-colors">
                      {item.name}
                    </Link>
                  )}
                </span>
              ))}
            </nav>

            {/* ─── Article Header ─── */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              {/* Category Badge */}
              {category && (
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full inline-block mb-3"
                  style={{
                    backgroundColor: category.color ? `${category.color}20` : "#F0FDFA",
                    color: category.color || "#0F766E",
                  }}
                >
                  {category.name}
                </span>
              )}

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {article.title}
              </h1>

              {/* Author & Meta Row */}
              <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                {/* Author Avatar + Name */}
                {author && (
                  <div className="flex items-center gap-2">
                    <OptimizedImage
                      src={author.avatar}
                      alt={author.name}
                      width={36}
                      height={36}
                      initials={author.name}
                      initialsColor="#0d9488"
                      className="rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{author.name}</p>
                      {author.title && (
                        <p className="text-xs text-gray-400">{author.title}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Date & Reading Time */}
                <div className="text-xs text-gray-400 flex items-center gap-2 ml-auto">
                  {article.publishedAt && (
                    <span>{formatDate(article.publishedAt)}</span>
                  )}
                  <span className="text-gray-300">|</span>
                  <span>{readingTimeDisplay}</span>
                </div>
              </div>
            </div>

            {/* ─── Featured Image ─── */}
            {article.featuredImage && (
              <div className="rounded-xl overflow-hidden mb-6 bg-white shadow-sm relative">
                <OptimizedImage
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 667px"
                  priority
                />
                <div className="h-[420px]" />
              </div>
            )}

            {/* ─── Article Content ─── */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              {/* Render content — treat as HTML if it contains tags, otherwise render as formatted paragraphs */}
              {article.content ? (
                /<[a-z][\s\S]*>/i.test(article.content) ? (
                  <div
                    className="prose prose-sm md:prose-base max-w-none text-gray-700 prose-headings:text-gray-900 prose-a:text-teal-600"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                ) : (
                  <div className="prose prose-sm md:prose-base max-w-none text-gray-700">
                    {article.content.split(/\n{2,}/).filter(Boolean).map((para, i) => {
                      const trimmed = para.trim();
                      // Detect headings
                      const isHeading =
                        trimmed.length < 80 &&
                        !trimmed.endsWith(".") &&
                        !trimmed.endsWith(",") &&
                        (/^[A-Z][A-Za-z\s&:]+$/.test(trimmed) || trimmed.endsWith(":"));

                      if (isHeading) {
                        return (
                          <h3 key={i} className="font-semibold text-gray-800 mt-5 mb-2">
                            {trimmed.replace(/:$/, "")}
                          </h3>
                        );
                      }

                      // Detect list items
                      if (/^[-•*]\s/.test(trimmed)) {
                        return (
                          <li key={i} className="ml-5 list-disc text-gray-700">
                            {trimmed.replace(/^[-•*]\s*/, "")}
                          </li>
                        );
                      }

                      return (
                        <p key={i} className="mb-3 leading-relaxed">{trimmed}</p>
                      );
                    })}
                  </div>
                )
              ) : (
                <p className="text-gray-400">No content available.</p>
              )}
            </div>

            {/* ─── Tags ─── */}
            {tags.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Link
                      key={tag.slug}
                      href={`/career-advice?tag=${encodeURIComponent(tag.slug)}`}
                      className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-teal-50 hover:text-teal-700 transition-colors"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ─── Share Strip ─── */}
            <ShareStrip title={article.title} type="article" />
          </article>

          {/* ═══ RIGHT SIDEBAR (1/3) ═══ */}
          <aside className="space-y-6">
            {/* Author Bio Card */}
            {author && (
              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-center gap-3 mb-3">
                  <OptimizedImage
                    src={author.avatar}
                    alt={author.name}
                    width={48}
                    height={48}
                    initials={author.name}
                    initialsColor="#0d9488"
                    className="rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">{author.name}</h3>
                    {author.title && (
                      <p className="text-xs text-gray-500">{author.title}</p>
                    )}
                  </div>
                </div>
                {author.bio && (
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">{author.bio}</p>
                )}
                <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                  <span>{author.articleCount} articles</span>
                  {author.totalViews > 0 && (
                    <>
                      <span>&middot;</span>
                      <span>{author.totalViews.toLocaleString()} total views</span>
                    </>
                  )}
                </div>
                {/* Social links */}
                <div className="flex gap-2 mt-3">
                  {author.linkedinUrl && (
                    <a
                      href={author.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors"
                      aria-label={`${author.name} on LinkedIn`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  )}
                  {author.twitterUrl && (
                    <a
                      href={author.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors"
                      aria-label={`${author.name} on X`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Ad */}
            <AdPlaceholder height="250px" />

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-5">
                <h3 className="font-bold text-gray-900 mb-4">Related Articles</h3>
                <ul className="space-y-4 max-h-96 overflow-y-auto">
                  {relatedArticles.map((related) => (
                    <li key={related.id}>
                      <Link
                        href={`/career-advice/${related.slug}`}
                        className="group flex gap-3"
                      >
                        {related.featuredImage && (
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
                            <OptimizedImage
                              src={related.featuredImage}
                              alt={related.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-medium text-gray-700 group-hover:text-teal-600 transition-colors line-clamp-2 leading-snug">
                            {related.title}
                          </h4>
                          {related.publishedAt && (
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDate(related.publishedAt)}
                            </p>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Subscribe */}
            <SubscribeForm />

            {/* Ad */}
            <AdPlaceholder height="200px" label="Sponsored" />
          </aside>
        </div>
      </div>
    </main>
  );
}
