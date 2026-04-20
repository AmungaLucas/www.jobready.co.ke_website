"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FiChevronRight, FiFileText } from "react-icons/fi";

/**
 * Reusable layout for legal/TOS pages.
 * Auto-generates a sticky table of contents from h2 headings.
 *
 * @param {Object} props
 * @param {string} props.title       - Page title (shown in breadcrumbs)
 * @param {string} props.lastUpdated - e.g. "April 2026"
 * @param {React.ReactNode} props.children - Page content (with h2 headings that have id attrs)
 */
export default function LegalLayout({ title, lastUpdated, children }) {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState("");
  const contentRef = useRef(null);

  // Extract h2 headings from children on mount
  useEffect(() => {
    if (!contentRef.current) return;
    const h2s = contentRef.current.querySelectorAll("h2[id]");
    setHeadings(
      Array.from(h2s).map((h2) => ({
        id: h2.id,
        text: h2.textContent,
      }))
    );
  }, [children]);

  // Scroll spy: highlight the active heading
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible heading
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm mb-8">
        <Link
          href="/"
          className="text-gray-400 hover:text-gray-600 transition-colors no-underline"
        >
          Home
        </Link>
        <FiChevronRight size={14} className="text-gray-300" />
        <span className="text-gray-700 font-medium">{title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 lg:gap-12">
        {/* Sidebar — Table of Contents */}
        <aside className="hidden lg:block">
          <div>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                On This Page
              </h3>
              <ul className="space-y-1">
                {headings.map(({ id, text }) => (
                  <li key={id}>
                    <button
                      onClick={() => scrollToSection(id)}
                      className={`w-full text-left text-[0.82rem] leading-snug px-2.5 py-2 rounded-lg transition-all no-underline cursor-pointer border-0 bg-transparent ${
                        activeId === id
                          ? "text-[#1a56db] font-semibold bg-blue-50"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div ref={contentRef}>
          <div className="mb-2 flex items-center gap-2">
            <FiFileText size={20} className="text-[#1a56db]" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {title}
            </h1>
          </div>
          <p className="text-sm text-gray-400 mb-8">Last updated: {lastUpdated}</p>

          <div className="legal-content max-w-[800px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
