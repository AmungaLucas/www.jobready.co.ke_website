"use client";

import { siteConfig } from "@/config/site-config";

export default function AdPlaceholder({ height = "250px", label = "Advertisement" }) {
  return (
    <div
      className="ad-placeholder rounded-lg flex flex-col items-center justify-center text-center bg-gray-50 border border-dashed border-gray-300"
      style={{ height }}
    >
      <span className="text-gray-400 text-2xl mb-1">Ad</span>
      <p className="text-gray-400 text-xs font-medium">{label}</p>
      <p className="text-gray-300 text-[10px]">300 × 250</p>
    </div>
  );
}
