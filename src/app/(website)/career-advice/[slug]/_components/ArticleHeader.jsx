import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";

export default function ArticleHeader({ article }) {
  const { title, subtitle, category, author, publishedAt, updatedAt, readingTime, viewsCount } = article;
  const dateStr = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-KE", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";
  const updatedStr = updatedAt
    ? new Date(updatedAt).toLocaleDateString("en-KE", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const authorName = author?.name || "";
  const authorTitle = author?.title || "";
  const authorInitials = author?.initials || (authorName ? authorName.split(" ").map((n) => n[0]).join("").toUpperCase() : "?");

  return (
    <section className="bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white py-9 md:py-11 relative overflow-hidden">
      <div className="absolute -top-1/3 -right-[15%] w-[500px] h-[500px] rounded-full bg-white/5 pointer-events-none" />
      <div className="container relative z-10">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-sm opacity-70 mb-5 flex-wrap">
          <Link href="/" className="hover:text-white transition-colors no-underline text-white/85">Home</Link>
          <FiChevronRight size={14} />
          <Link href="/career-advice" className="hover:text-white transition-colors no-underline text-white/85">Career Advice</Link>
          {category && (
            <>
              <FiChevronRight size={14} />
              <span className="opacity-70">{category}</span>
            </>
          )}
          <FiChevronRight size={14} />
          <span className="opacity-50 line-clamp-1 hidden sm:inline">{title}</span>
        </div>

        {/* Category tag */}
        {category && (
          <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-[0.7rem] font-bold uppercase tracking-wide mb-3 border border-white/20">
            {category}
          </span>
        )}

        {/* Title */}
        <h1 className="text-2xl md:text-[2rem] font-extrabold leading-tight mb-4 tracking-tight max-w-3xl">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-sm md:text-base opacity-80 leading-relaxed max-w-xl mb-5">
            {subtitle}
          </p>
        )}

        {/* Meta */}
        {authorName && (
          <div className="flex items-center gap-5 flex-wrap text-sm">
            {/* Author */}
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center font-bold text-sm text-amber-900 shrink-0 border-2 border-white/30">
                {authorInitials}
              </span>
              <div>
                <p className="font-bold text-sm">{authorName}</p>
                {authorTitle && <p className="text-xs opacity-60">{authorTitle}</p>}
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-7 bg-white/20 hidden sm:block" />

            {/* Stats */}
            <div className="flex items-center gap-4 opacity-75 text-xs">
              {readingTime && <span>{readingTime}</span>}
              {viewsCount && <span>{viewsCount.toLocaleString()} views</span>}
              {dateStr && <span>{dateStr}</span>}
            </div>
          </div>
        )}

        {/* Updated */}
        {updatedStr && (
          <p className="text-xs opacity-40 mt-2 italic">
            Updated {updatedStr}
          </p>
        )}
      </div>
    </section>
  );
}
