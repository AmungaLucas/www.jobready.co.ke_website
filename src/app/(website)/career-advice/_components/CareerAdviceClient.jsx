"use client";

import { useState } from "react";
import ArticleCard from "@/app/(website)/_components/ArticleCard";
import ArticleCategoryPills from "./ArticleCategoryPills";
import Pagination from "@/app/(website)/_components/Pagination";
import { FiRefreshCw } from "react-icons/fi";

const ARTICLES_PER_PAGE = 9;

export default function CareerAdviceClient({ articles: initialArticles }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered =
    activeCategory === "All"
      ? initialArticles
      : initialArticles.filter((a) => {
          const catSlug = a.category?.slug || "";
          const catName = a.category?.name || "";
          return catName === activeCategory || catSlug === activeCategory;
        });

  const totalPages = Math.ceil(filtered.length / ARTICLES_PER_PAGE);
  const paged = filtered.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  );

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div className="min-w-0">
      <ArticleCategoryPills
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Article Grid */}
      {paged.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {paged.map((article) => (
            <ArticleCard
              key={article.slug}
              title={article.title}
              slug={article.slug}
              excerpt={article.excerpt}
              author={article.author}
              category={article.category?.name || ""}
              readingTime={article.readingTime}
              publishedAt={article.publishedAt}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">No articles found in this category.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Load More */}
      {currentPage < totalPages && (
        <div className="text-center mt-6">
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold border border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
          >
            <FiRefreshCw size={16} />
            Load More Articles
          </button>
        </div>
      )}
    </div>
  );
}
