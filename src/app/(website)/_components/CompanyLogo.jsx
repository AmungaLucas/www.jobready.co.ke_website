import Link from "next/link";

const sizeMap = {
  sm: { wrapper: "w-9 h-9", text: "text-xs" },
  md: { wrapper: "w-11 h-11", text: "text-sm" },
  lg: { wrapper: "w-[52px] h-[52px]", text: "text-base" },
};

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function CompanyLogo({
  name,
  logo,
  logoColor,
  size = "md",
  href,
  className = "",
}) {
  const { wrapper, text } = sizeMap[size] || sizeMap.md;
  const initials = getInitials(name);

  const logoEl = logo ? (
    <img
      src={logo}
      alt={`${name} logo`}
      className={`${wrapper} rounded-lg object-cover flex-shrink-0 ${className}`}
    />
  ) : (
    <div
      className={`${wrapper} rounded-lg flex items-center justify-center flex-shrink-0 font-bold ${text} text-white ${className}`}
      style={
        logoColor
          ? { background: `linear-gradient(135deg, ${logoColor}, ${logoColor}dd)` }
          : { background: "linear-gradient(135deg, #1a56db, #1e40af)" }
      }
    >
      {initials}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="flex-shrink-0">
        {logoEl}
      </Link>
    );
  }

  return logoEl;
}
