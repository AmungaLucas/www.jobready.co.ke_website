"use client";

import { useState } from "react";

export default function ArticleSidebar({ article }) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="sticky top-[84px]">
      {/* CV Review CTA */}
      <div className="bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-400 rounded-xl p-5 mb-5 text-center">
        <h3 className="text-base font-bold text-amber-900 mb-2">
          Need a Professional CV?
        </h3>
        <p className="text-sm text-amber-900/80 mb-4 leading-relaxed">
          Stand out from hundreds of applicants with an expert-crafted CV.
        </p>
        <a
          href="/cv-services"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-amber-900 text-white text-sm font-bold hover:bg-amber-800 transition-colors no-underline"
        >
          Get Your CV Done — KSh 500
        </a>
        <div className="flex items-center justify-center gap-2 mt-3">
          <span className="text-xs text-amber-600 line-through opacity-70">From KSh 800</span>
          <span className="text-sm font-extrabold text-amber-900">Now KSh 500</span>
        </div>
      </div>

      {/* Ad */}
      <div className="w-full py-8 mb-5 bg-gray-100 border border-dashed border-gray-300 text-center text-xs text-gray-400 tracking-wider uppercase rounded-lg">
        Advertisement — Sidebar
      </div>

      {/* Bookmark */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-5">
        <button
          onClick={() => setSaved((p) => !p)}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
            saved
              ? "border border-amber-400 bg-amber-50 text-amber-700"
              : "border border-gray-200 bg-white text-gray-600 hover:border-amber-300 hover:text-amber-600"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill={saved ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            className="w-4 h-4"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
          {saved ? "Saved" : "Save Article"}
        </button>
      </div>
    </div>
  );
}
