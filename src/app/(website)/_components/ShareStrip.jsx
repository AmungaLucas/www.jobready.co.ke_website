"use client";

import { useState } from "react";
import { FiLink, FiCheck } from "react-icons/fi";
import { FaWhatsapp, FaXTwitter } from "react-icons/fa6";

export default function ShareStrip({ title, url }) {
  const [copied, setCopied] = useState(false);

  const pageUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const shareText = `${title} — ${pageUrl}`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(pageUrl)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = pageUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <h4 className="font-semibold text-gray-800 text-sm">SHARE THIS JOB</h4>
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded-md text-xs flex items-center gap-1.5 transition cursor-pointer"
        >
          {copied ? <FiCheck className="w-3.5 h-3.5 text-green-600" /> : <FiLink className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Copy Link"}
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-1.5 transition"
        >
          <FaWhatsapp className="w-3.5 h-3.5" />
          WhatsApp
        </a>
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black hover:bg-gray-800 text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-1.5 transition"
        >
          <FaXTwitter className="w-3.5 h-3.5" />
          X Share
        </a>
      </div>
    </div>
  );
}
