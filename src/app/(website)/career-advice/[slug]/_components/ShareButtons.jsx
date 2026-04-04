"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site-config";
import {
  FiTwitter,
  FiLinkedin,
  FiFacebook,
  FiLink,
  FiCheck,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function ShareButtons({ article }) {
  const [copied, setCopied] = useState(false);
  const slug = article?.slug || "";
  const title = article?.title || "";
  const url = `${siteConfig.url}/career-advice/${slug}`;
  const text = encodeURIComponent(title);

  const shareLinks = [
    {
      label: "Twitter",
      icon: FiTwitter,
      href: `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`,
      hoverClass: "hover:border-sky-400 hover:text-sky-500 hover:bg-sky-50",
    },
    {
      label: "Facebook",
      icon: FiFacebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      hoverClass: "hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50",
    },
    {
      label: "LinkedIn",
      icon: FiLinkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      hoverClass: "hover:border-blue-700 hover:text-blue-800 hover:bg-blue-50",
    },
    {
      label: "WhatsApp",
      icon: FaWhatsapp,
      href: `https://api.whatsapp.com/send?text=${text}%20${encodeURIComponent(url)}`,
      hoverClass: "hover:border-green-500 hover:text-green-600 hover:bg-green-50",
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="flex justify-between items-center pb-5 border-b border-gray-100 mb-6">
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-semibold text-gray-500 mr-1">Share:</span>
        {shareLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 transition-all ${link.hoverClass}`}
            aria-label={`Share on ${link.label}`}
          >
            <link.icon size={15} />
          </a>
        ))}
        <button
          onClick={handleCopy}
          className={`w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center transition-all cursor-pointer ${
            copied
              ? "border-emerald-400 text-emerald-600 bg-emerald-50"
              : "text-gray-500 hover:border-gray-400 hover:text-gray-600 hover:bg-gray-100"
          }`}
          aria-label="Copy link"
        >
          {copied ? <FiCheck size={15} /> : <FiLink size={15} />}
        </button>
      </div>
    </div>
  );
}
