"use client";

import { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";
import { siteConfig } from "@/config/site-config";
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineBookmark,
} from "react-icons/hi2";

export default function JobToolsBar({ job }) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `${job.title} at ${job.company?.name} — ${window.location.href}`
  )}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `${job.title} at ${job.company?.name}`
  )}&url=${encodeURIComponent(window.location.href)}`;

  return (
    <div className="flex items-center gap-3 py-4 px-5 bg-white rounded-xl shadow-sm flex-wrap mt-6">
      {/* Share group */}
      <div className="flex gap-1.5 flex-wrap items-center">
        {/* Copy Link */}
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-full text-[0.8rem] font-semibold text-gray-600 bg-white cursor-pointer hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 transition-all font-sans"
        >
          {copied ? (
            <>
              <FiCheck className="w-3.5 h-3.5 text-emerald-500" />
              Copied
            </>
          ) : (
            <>
              <FiCopy className="w-3.5 h-3.5" />
              Copy Link
            </>
          )}
        </button>

        {/* WhatsApp Share */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#25D366] rounded-full text-[0.8rem] font-semibold text-[#059669] bg-[#d1fae5] cursor-pointer hover:bg-[#a7f3d0] hover:border-[#059669] transition-all no-underline font-sans"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.503 3.94 1.394 5.624L0 24l6.518-1.358A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.82c-1.93 0-3.747-.518-5.307-1.42l-.38-.227-3.938.82.833-3.836-.247-.394A9.773 9.773 0 012.18 12c0-5.422 4.398-9.82 9.82-9.82 5.422 0 9.82 4.398 9.82 9.82 0 5.422-4.398 9.82-9.82 9.82z" />
          </svg>
          WhatsApp
        </a>

        {/* Twitter Share */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-full text-[0.8rem] font-semibold text-gray-600 bg-white cursor-pointer hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 transition-all no-underline font-sans"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Share
        </a>
      </div>

      {/* Separator */}
      <div className="w-px h-6 bg-gray-200 hidden sm:block" />

      {/* Save */}
      <button
        onClick={() => setSaved(!saved)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-[0.8rem] font-semibold cursor-pointer transition-all font-sans ${
          saved
            ? "border-amber-400 text-amber-600 bg-amber-50"
            : "border-gray-200 text-gray-600 bg-white hover:border-gray-300 hover:bg-gray-50"
        }`}
      >
        <HiOutlineBookmark className="w-3.5 h-3.5" />
        {saved ? "Saved" : "Save"}
      </button>
    </div>
  );
}
