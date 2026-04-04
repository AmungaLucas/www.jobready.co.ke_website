import Link from "next/link";

export default function CategoryCard({
  name,
  count,
  icon: Icon,
  href,
  color = "#1a56db",
}) {
  return (
    <Link
      href={href || "#"}
      className="block bg-white rounded-xl shadow-sm overflow-hidden text-center cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 border-2 border-transparent hover:border-primary/20 p-6 md:p-7 no-underline"
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3.5 text-white"
        style={{ backgroundColor: color }}
      >
        {Icon && <Icon size={22} />}
      </div>

      {/* Name */}
      <p className="text-sm font-bold text-gray-800 mb-1">{name}</p>

      {/* Count */}
      <p className="text-xs text-gray-400">
        {typeof count === "number" ? `${count} jobs` : count}
      </p>
    </Link>
  );
}
