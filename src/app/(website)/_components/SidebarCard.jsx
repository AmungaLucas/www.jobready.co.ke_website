export default function SidebarCard({
  title,
  icon,
  children,
  className = "",
}) {
  // icon can be:
  //   - a React component (function or ForwardRef object like lucide-react icons)
  //   - a pre-rendered React element (JSX)
  //   - null/undefined (no icon)
  let IconElement = icon;
  if (icon && typeof icon === "object" && icon.$$typeof) {
    // React element — wrap it
    IconElement = <span className="text-primary">{icon}</span>;
  } else if (typeof icon === "function") {
    // Component reference — render it
    IconElement = <span className="text-primary"><icon size={18} /></span>;
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 mb-7 ${className}`}>
      {title && (
        <h3 className="text-sm font-bold text-gray-900 mb-4 pb-3.5 border-b-2 border-gray-100 flex items-center gap-2">
          {IconElement}
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
