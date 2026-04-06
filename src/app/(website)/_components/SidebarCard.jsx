export default function SidebarCard({
  title,
  icon,
  children,
  className = "",
}) {
  // icon can be:
  //   - A React component: function, or ForwardRef/ExoticComponent object (e.g. lucide-react icons)
  //   - A pre-rendered React element (JSX like <SomeIcon />)
  //   - null/undefined (no icon)
  let IconElement = icon;

  if (icon == null) {
    IconElement = null;
  } else if (typeof icon === "function") {
    // Plain function component — render it
    IconElement = <span className="text-primary"><icon size={18} /></span>;
  } else if (typeof icon === "object" && icon.$$typeof) {
    // Could be a React element OR a ForwardRef/ExoticComponent
    // React elements have .props, component references don't
    if (icon.props) {
      // It's an already-rendered React element — wrap it
      IconElement = <span className="text-primary">{icon}</span>;
    } else {
      // It's a ForwardRef / ExoticComponent (like lucide-react icons) — render it
      IconElement = <span className="text-primary"><icon size={18} /></span>;
    }
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
