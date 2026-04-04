import Link from "next/link";
import { formatRelativeDate } from "@/lib/format";

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

const categoryColors = {
  "career-advice": "bg-primary",
  "cv-tips": "bg-secondary",
  "interview": "bg-purple",
  "industry": "bg-accent",
  "government": "bg-red-500",
  "scholarships": "bg-purple",
  default: "bg-primary",
};

const categoryTextColors = {
  "career-advice": "text-primary",
  "cv-tips": "text-secondary",
  "interview": "text-purple",
  "industry": "text-accent",
  "government": "text-red-500",
  "scholarships": "text-purple",
  default: "text-primary",
};

export default function ArticleCard({
  title,
  slug,
  excerpt,
  featuredImage,
  author,
  category,
  readingTime,
  viewsCount,
  publishedAt,
  href,
}) {
  const link = href || slug ? `/career-advice/${slug}` : "#";
  const cat = (category || "default").toLowerCase().replace(/\s+/g, "-");
  const stripColor = categoryColors[cat] || categoryColors.default;
  const catTextColor = categoryTextColors[cat] || categoryTextColors.default;
  const initials = getInitials(author?.name);

  return (
    <Link
      href={link}
      className="block bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md hover:-translate-y-px border-2 border-transparent hover:border-primary/20 cursor-pointer group no-underline"
    >
      {/* Top gradient strip */}
      <div className={`h-1 ${stripColor}`} />

      {/* Content */}
      <div className="p-5 md:p-6">
        {/* Category pill */}
        {category && (
          <p
            className={`text-[0.65rem] font-bold uppercase tracking-wide mb-2 ${catTextColor}`}
          >
            {category}
          </p>
        )}

        {/* Title */}
        <h3 className="text-sm font-bold text-gray-900 leading-tight mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-4">{excerpt}</p>
        )}

        {/* Author row */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          {/* Avatar */}
          {author?.name && (
            <>
              <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[0.6rem] font-bold text-gray-600 shrink-0">
                {initials}
              </span>
              <span className="font-medium text-gray-600">{author.name}</span>
            </>
          )}
          {publishedAt && (
            <>
              <span>·</span>
              <span>{formatRelativeDate(publishedAt)}</span>
            </>
          )}
          {readingTime && (
            <>
              <span>·</span>
              <span>{readingTime}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
