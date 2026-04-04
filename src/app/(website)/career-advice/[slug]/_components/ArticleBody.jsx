"use client";

import Link from "next/link";

export default function ArticleBody({ htmlContent, tableOfContents }) {
  return (
    <>
      {/* Table of Contents */}
      {tableOfContents && tableOfContents.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-7">
          <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <svg className="w-[18px] h-[18px] text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 10h16M4 14h10M4 18h7" />
            </svg>
            Table of Contents
          </h4>
          <ol className="list-none pl-0">
            {tableOfContents.map((item, idx) => (
              <li key={item.id} className="mb-1">
                <a
                  href={`#${item.id}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all no-underline"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(item.id);
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                >
                  <span className="font-bold text-blue-600 text-xs min-w-[20px]">
                    {idx + 1}.
                  </span>
                  {item.title}
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Article Content */}
      <div
        className="prose-content text-[0.95rem] leading-relaxed text-gray-700"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </>
  );
}
