export default function SidebarCard({
  title,
  icon,
  children,
  className = "",
}) {
  // icon can be a React component (passed as reference) or a ReactNode
  const IconElement = typeof icon === "function" ? <span className="text-primary"><icon size={18} /></span> : icon;

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
