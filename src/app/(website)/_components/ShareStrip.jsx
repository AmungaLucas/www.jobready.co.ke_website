"use client";

import { useState } from "react";
import { FiLink, FiCheck, FiMail } from "react-icons/fi";
import { FaWhatsapp, FaXTwitter, FaFacebookF, FaLinkedinIn } from "react-icons/fa6";

// ─── Label mapping per content type ──────────────────────
const TYPE_LABELS = {
  job: "SHARE THIS JOB",
  opportunity: "SHARE THIS OPPORTUNITY",
  article: "SHARE THIS ARTICLE",
  company: "SHARE THIS COMPANY",
};

// ─── Specific opportunity type overrides ─────────────────
const OPP_TYPE_LABELS = {
  SCHOLARSHIP: "SHARE THIS SCHOLARSHIP",
  BURSARY: "SHARE THIS BURSARY",
  UNIVERSITY_ADMISSION: "SHARE THIS ADMISSION",
  INTERNSHIP: "SHARE THIS INTERNSHIP",
  SPONSORSHIP: "SHARE THIS SPONSORSHIP",
  FELLOWSHIP: "SHARE THIS FELLOWSHIP",
  GRANT: "SHARE THIS GRANT",
  FUNDING: "SHARE THIS FUNDING",
  MENTORSHIP: "SHARE THIS MENTORSHIP",
  BOOTCAMP: "SHARE THIS BOOTCAMP",
  CERTIFICATION: "SHARE THIS CERTIFICATION",
  CONFERENCE: "SHARE THIS CONFERENCE",
  COMPETITION: "SHARE THIS COMPETITION",
  VOLUNTEER: "SHARE THIS VOLUNTEER",
  APPRENTICESHIP: "SHARE THIS APPRENTICESHIP",
  TRAINING: "SHARE THIS TRAINING",
  WORKSHOP: "SHARE THIS WORKSHOP",
  EXCHANGE: "SHARE THIS EXCHANGE",
  RESEARCH: "SHARE THIS RESEARCH",
  RESIDENCY: "SHARE THIS RESIDENCY",
  INCUBATOR: "SHARE THIS INCUBATOR",
  ACCELERATOR: "SHARE THIS ACCELERATOR",
  AWARD: "SHARE THIS AWARD",
};

export default function ShareStrip({ title, url, type = "job", opportunityType }) {
  const [copied, setCopied] = useState(false);

  const pageUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const shareText = title ? `${title} — ${pageUrl}` : pageUrl;

  // Determine label
  const label = type === "opportunity" && opportunityType && OPP_TYPE_LABELS[opportunityType]
    ? OPP_TYPE_LABELS[opportunityType]
    : TYPE_LABELS[type] || TYPE_LABELS.job;

  // Share URLs
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title || "")}&url=${encodeURIComponent(pageUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(title || "Check this out")}&body=${encodeURIComponent(shareText)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
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
    <div className="mb-6 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <h4 className="font-bold text-gray-800 text-sm mb-3 tracking-wide">{label}</h4>
      <div className="flex flex-wrap gap-2">
        {/* Copy Link */}
        <button
          onClick={handleCopy}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer border border-gray-200"
        >
          {copied ? <FiCheck className="w-3.5 h-3.5 text-green-600" /> : <FiLink className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Copy Link"}
        </button>

        {/* WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
        >
          <FaWhatsapp className="w-3.5 h-3.5" />
          WhatsApp
        </a>

        {/* X / Twitter */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black hover:bg-gray-800 text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
        >
          <FaXTwitter className="w-3.5 h-3.5" />
          X
        </a>

        {/* Facebook */}
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
        >
          <FaFacebookF className="w-3.5 h-3.5" />
          Facebook
        </a>

        {/* LinkedIn */}
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
        >
          <FaLinkedinIn className="w-3.5 h-3.5" />
          LinkedIn
        </a>

        {/* Email */}
        <a
          href={emailUrl}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition border border-gray-200"
        >
          <FiMail className="w-3.5 h-3.5" />
          Email
        </a>
      </div>
    </div>
  );
}
