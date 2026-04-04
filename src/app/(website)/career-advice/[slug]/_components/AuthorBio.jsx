"use client";

import { useState } from "react";
import { FiTwitter, FiLinkedin } from "react-icons/fi";

export default function AuthorBio({ author }) {
  const [following, setFollowing] = useState(false);

  const authorName = author?.name || "";
  const authorTitle = author?.title || "";
  const authorBio = author?.bio || "";
  const authorInitials = author?.initials || (authorName ? authorName.split(" ").map((n) => n[0]).join("").toUpperCase() : "?");
  const authorLinkedin = author?.linkedin || "";
  const authorTwitter = author?.twitter || "";
  const articleCount = author?.articles || 0;
  const coached = author?.coached || "0";
  const views = author?.views || "0";

  if (!authorName) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mt-5 flex gap-5 items-start">
      {/* Avatar */}
      <span className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center font-extrabold text-xl text-amber-900 shrink-0">
        {authorInitials}
      </span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-bold text-gray-900 mb-0.5">
          {authorName}
        </h3>
        {authorTitle && (
          <p className="text-sm text-blue-600 font-semibold mb-2">
            {authorTitle}
          </p>
        )}
        {authorBio && (
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            {authorBio}
          </p>
        )}

        {/* Stats */}
        <div className="flex gap-4 mb-3">
          <span className="text-xs text-gray-500">
            <strong className="text-gray-700 font-bold">{articleCount}</strong> articles
          </span>
          <span className="text-xs text-gray-500">
            <strong className="text-gray-700 font-bold">{coached}</strong> coached
          </span>
          <span className="text-xs text-gray-500">
            <strong className="text-gray-700 font-bold">{views}</strong> views
          </span>
        </div>

        {/* Social & Follow */}
        <div className="flex items-center gap-2">
          {authorLinkedin && (
            <a
              href={authorLinkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-all"
              aria-label="LinkedIn"
            >
              <FiLinkedin size={14} />
            </a>
          )}
          {authorTwitter && (
            <a
              href={authorTwitter}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-sky-400 hover:text-sky-500 hover:bg-sky-50 transition-all"
              aria-label="Twitter"
            >
              <FiTwitter size={14} />
            </a>
          )}
          <button
            onClick={() => setFollowing((p) => !p)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              following
                ? "bg-blue-600 text-white"
                : "border border-blue-600 text-blue-600 bg-white hover:bg-blue-600 hover:text-white"
            }`}
          >
            {following ? "Following" : "Follow"}
          </button>
        </div>
      </div>
    </div>
  );
}
