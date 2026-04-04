import Link from "next/link";
import { FiStar } from "react-icons/fi";

export default function FeaturedArticle({ article }) {
  if (!article) return null;

  const { slug, title, excerpt, category, author, publishedAt, readingTime } = article;

  const initials = author?.name
    ? author.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  const dateStr = new Date(publishedAt).toLocaleDateString("en-KE", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="my-7">
      <Link
        href={`/career-advice/${slug}`}
        className="block bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 rounded-2xl p-8 md:p-10 relative overflow-hidden text-white hover:shadow-xl transition-shadow no-underline group"
      >
        {/* Decorative circles */}
        <div className="absolute -top-1/4 -right-1/4 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          {/* Featured tag */}
          <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-[0.7rem] font-bold uppercase tracking-wide mb-4 border border-white/25">
            <FiStar size={12} />
            Featured
          </span>

          {/* Category */}
          <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full text-[0.7rem] font-bold uppercase tracking-wide mb-4 border border-white/25 ml-2">
            {category}
          </span>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-extrabold leading-tight mb-3 tracking-tight group-hover:text-blue-100 transition-colors">
            {title}
          </h2>

          {/* Excerpt */}
          <p className="text-sm md:text-base opacity-85 leading-relaxed mb-5 max-w-xl">
            {excerpt}
          </p>

          {/* Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Author */}
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center font-bold text-sm text-amber-900 shrink-0">
                {initials}
              </span>
              <div>
                <p className="text-sm font-semibold">{author?.name}</p>
                <p className="text-xs opacity-70">{dateStr}</p>
              </div>
            </div>

            {/* Read button */}
            <span className="inline-flex items-center gap-2 bg-white text-blue-700 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-blue-50 transition-colors sm:ml-auto">
              Read Article
              <FiStar size={14} className="hidden sm:block" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
