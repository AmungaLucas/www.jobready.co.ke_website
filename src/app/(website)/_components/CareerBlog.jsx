import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import SubscribeForm from "./SubscribeForm";
import OptimizedImage from "@/components/OptimizedImage";

/**
 * CareerBlog — Shows the 3 most recent articles from the database.
 *
 * @param {{ articles: Array<{ title: string; slug: string; excerpt?: string; featuredImage?: string; category?: { name: string; color: string } }> }} props
 */
export default function CareerBlog({ articles = [] }) {
  // If no articles from DB, show nothing (don't show hardcoded placeholders)
  if (articles.length === 0) return null;

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Left: Blog cards (3/4) */}
          <div className="md:col-span-3">
            <h2 className="text-xl md:text-2xl font-bold mb-5" style={{ color: "#1E293B" }}>
              Career Advice &amp; News
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {articles.map((article) => (
                <Link
                  key={article.slug || article.title}
                  href={`/career-advice/${article.slug}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {article.featuredImage && (
                    <OptimizedImage
                      src={article.featuredImage}
                      alt={article.title}
                      width={400}
                      height={160}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="p-4">
                    {article.category && (
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mb-2"
                        style={{
                          backgroundColor: `${article.category.color}20`,
                          color: article.category.color,
                        }}
                      >
                        {article.category.name}
                      </span>
                    )}
                    <h3
                      className="font-bold line-clamp-2"
                      style={{ color: "#1E293B", fontSize: "0.95rem" }}
                    >
                      {article.title}
                    </h3>
                    {(article.excerpt || article.description) && (
                      <p className="text-gray-500 text-xs mt-1 line-clamp-3">
                        {article.excerpt || article.description}
                      </p>
                    )}
                    <span className="inline-block mt-3 text-xs font-medium text-teal-600 group-hover:text-purple-700 transition-colors">
                      Read More <FiArrowRight className="w-3 h-3 inline" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-5 text-right">
              <Link
                href="/career-advice"
                className="text-sm font-medium text-teal-600 hover:text-purple-700 transition-colors inline-flex items-center gap-1"
              >
                View all articles <FiArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right: Newsletter subscribe (1/4) */}
          <div>
            <SubscribeForm />
          </div>
        </div>
      </div>
    </section>
  );
}
