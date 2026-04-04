const variantStyles = {
  default: "bg-gray-100 text-gray-600",
  primary: "bg-primary-light text-primary",
  success: "bg-emerald-100 text-emerald-700",
  danger: "bg-red-100 text-red-600",
  warning: "bg-amber-100 text-amber-900",
  purple: "bg-purple-light text-purple",
};

const sizeStyles = {
  sm: "text-[0.65rem]",
  md: "text-xs",
  lg: "text-sm",
};

export default function Badge({
  children,
  variant = "default",
  size = "sm",
  className = "",
}) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full font-bold ${variantStyles[variant] || variantStyles.default} ${sizeStyles[size] || sizeStyles.sm} ${className}`}
    >
      {children}
    </span>
  );
}
