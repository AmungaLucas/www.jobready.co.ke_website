"use client";

import Image from "next/image";
import { getInitials } from "@/lib/normalize";

/**
 * OptimizedImage — Drop-in replacement for raw <img> tags.
 *
 * WHY THIS EXISTS:
 *   - 35 raw <img> tags across the app meant zero image optimization
 *   - next/image requires hosts in next.config.ts remotePatterns
 *   - This component routes ALL external images through /api/image proxy
 *   - So next/image only ever sees the site's own domain as the source
 *   - Full optimization: WebP/AVIF, responsive srcset, lazy loading, blur
 *
 * USAGE:
 *   <OptimizedImage
 *     src="https://example.com/photo.jpg"
 *     alt="Description"
 *     width={400}
 *     height={300}
 *     className="rounded-xl"
 *     priority          // for above-fold images
 *   />
 *
 *   // For logo/avatar patterns with initials fallback:
 *   <OptimizedImage
 *     src={company.logo}
 *     alt={company.name}
 *     initials={company.name}
 *     initialsColor={company.logoColor}
 *     size="md"          // "sm" | "md" | "lg" | "xl" | "full"
 *     className="rounded-full"
 *   />
 *
 * PROPS:
 *   src         - Image URL (external or local relative path)
 *   alt         - Alt text (required for accessibility)
 *   width       - Width in pixels (for non-fill mode)
 *   height      - Height in pixels (for non-fill mode)
 *   fill        - Use fill mode (parent must be relative positioned)
 *   className   - CSS classes
 *   priority    - Disable lazy loading for above-fold images
 *   quality     - Image quality (1-100, default 80)
 *   sizes       - Responsive sizes hint for srcset
 *   initials    - Name string for generating initials fallback
 *   initialsColor - Background color for initials fallback (hex or gradient)
 *   size        - Preset size: "sm"=24, "md"=40, "lg"=48, "xl"=64, "2xl"=80
 *   rounded     - Quick border radius: "full" | "lg" | "md" | "none"
 *   objectFit   - CSS object-fit: "cover" | "contain" (default "cover")
 *   fallback    - Custom fallback JSX element
 *   unoptimized - Skip next/image optimization (for SVGs, GIFs)
 */

const SIZE_MAP = {
  xs: 20,
  sm: 24,
  md: 40,
  lg: 48,
  xl: 64,
  "2xl": 80,
  "3xl": 96,
};

const ROUNDED_MAP = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

// Custom loader: routes external URLs through our proxy
function imageProxyLoader({ src, width, quality }) {
  // Local/relative paths — serve directly
  if (src.startsWith("/") || src.startsWith("data:")) {
    return `${src}?w=${width}&q=${quality || 80}`;
  }

  // External URLs — route through /api/image proxy
  const params = new URLSearchParams({
    url: src,
    w: String(width),
    q: String(quality || 80),
  });
  return `/api/image?${params.toString()}`;
}

export default function OptimizedImage({
  src,
  alt = "",
  width,
  height,
  fill = false,
  className = "",
  priority = false,
  quality = 80,
  sizes,
  initials,
  initialsColor,
  size,
  rounded,
  objectFit = "cover",
  fallback,
  unoptimized = false,
  style,
  ...props
}) {
  // ─── Logo/Avatar mode: when initials are provided, show fallback if no src ───
  if (initials && !src) {
    const dimension = size ? SIZE_MAP[size] : (width || 40);
    const radius = rounded ? ROUNDED_MAP[rounded] : "rounded-full";
    const bgColor = initialsColor || "#1a56db";

    return (
      <div
        className={`${radius} flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0 ${className}`}
        style={{
          width: dimension,
          height: dimension,
          backgroundColor: bgColor,
          fontSize: dimension * 0.35,
          lineHeight: 1,
          ...style,
        }}
        role="img"
        aria-label={alt}
      >
        {getInitials(initials)}
      </div>
    );
  }

  // ─── Custom fallback mode ───
  if (!src && fallback) {
    return fallback;
  }

  // ─── No image, no fallback, no initials → return null ───
  if (!src) {
    return null;
  }

  // ─── Preset size mode ───
  if (size && !fill && !width && !height) {
    const dimension = SIZE_MAP[size];
    width = dimension;
    height = dimension;
  }

  // ─── Build radius class ───
  const radiusClass = rounded ? ROUNDED_MAP[rounded] : "";

  // ─── SVG handling: skip optimization for SVGs ───
  const isSvg = typeof src === "string" && src.toLowerCase().endsWith(".svg");
  const shouldUnoptimize = unoptimized || isSvg;

  // ─── Sizes prop for responsive images ───
  const sizesProp = sizes || (fill ? "100vw" : undefined);

  return (
    <Image
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      className={`${radiusClass} ${className}`.trim()}
      quality={quality}
      sizes={sizesProp}
      priority={priority}
      loader={imageProxyLoader}
      unoptimized={shouldUnoptimize}
      style={{
        objectFit: fill ? objectFit : undefined,
        ...style,
      }}
      {...props}
    />
  );
}

/**
 * Quick-use avatar component with logo + initials fallback pattern.
 * This is the most common usage across the app (22 of 35 instances).
 *
 * USAGE:
 *   <AvatarImage
 *     src={company.logo}
 *     name={company.name}
 *     color={company.logoColor}
 *     size="md"
 *     className="rounded-xl"
 *   />
 */
export function AvatarImage({
  src,
  name = "",
  color,
  size = "md",
  rounded = "full",
  className = "",
  priority = false,
  style,
}) {
  const dimension = SIZE_MAP[size] || size;
  const radius = ROUNDED_MAP[rounded] || rounded;
  const bgColor = color || "#1a56db";

  if (!src) {
    return (
      <div
        className={`${radius} flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0 ${className}`}
        style={{
          width: dimension,
          height: dimension,
          backgroundColor: bgColor,
          fontSize: dimension * 0.35,
          lineHeight: 1,
          ...style,
        }}
        role="img"
        aria-label={name}
      >
        {getInitials(name)}
      </div>
    );
  }

  const isSvg = src.toLowerCase().endsWith(".svg");

  return (
    <Image
      src={src}
      alt={name}
      width={dimension}
      height={dimension}
      className={`${radius} ${className}`.trim()}
      priority={priority}
      quality={80}
      loader={imageProxyLoader}
      unoptimized={isSvg}
      style={{ objectFit: "cover", ...style }}
    />
  );
}
