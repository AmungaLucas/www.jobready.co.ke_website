import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import SubscribeForm from "./SubscribeForm";

const placeholderArticles = [
  {
    title: "How to Write a CV That Gets Interviews – Expert Tips for 2026",
    excerpt:
      "Learn the secrets of ATS-friendly CVs, formatting tricks, and how to stand out from hundreds of applicants with a professional document.",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=200&fit=crop",
    href: "/career-advice",
  },
  {
    title: "Top 10 Interview Questions in Kenya 2026",
    excerpt:
      "Prepare with confidence — most asked questions by Kenyan employers and how to answer them effectively to land the job.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=200&fit=crop",
    href: "/career-advice",
  },
  {
    title: "Government Internships – Application Guide",
    excerpt:
      "Step-by-step guide to landing internships in national and county governments — deadlines, requirements, and insider tips.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop",
    href: "/career-advice",
  },
];

export default function CareerBlog({ articles }) {
  const displayArticles = (articles && articles.length > 0 ? articles : placeholderArticles).map((a) => ({
    title: a.title,
    excerpt: a.excerpt || "",
    image: a.featuredImage || a.image || "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=200&fit=crop",
    href: a.slug ? `/career-advice/${a.slug}` : "/career-advice",
    readingTime: a.readingTime || null,
    author: a.author?.name || null,
    publishedAt: a.publishedAt || null,
  }));

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
              {displayArticles.map((article) => (
                <div
                  key={article.title}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3
                      className="font-bold line-clamp-2"
                      style={{ color: "#1E293B", fontSize: "0.95rem" }}
                    >
                      {article.title}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1 line-clamp-3">
                      {article.excerpt}
                    </p>
                    {article.readingTime && (
                      <p className="text-gray-400 text-xs mt-1">{article.readingTime}</p>
                    )}
                    <Link
                      href={article.href}
                      className="inline-block mt-3 text-xs font-medium text-teal-600 hover:text-purple-700 transition-colors"
                    >
                      Read More <FiArrowRight className="w-3 h-3 inline" />
                    </Link>
                  </div>
                </div>
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
