"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";
import { siteConfig } from "@/config/site-config";

export default function CVWritingCTA() {
  const [spotsLeft, setSpotsLeft] = useState(50);

  useEffect(() => {
    // Scarcity: randomize spots between 8-20 on mount (resets each visit)
    const stored = sessionStorage.getItem("cv_spots");
    if (stored) {
      setSpotsLeft(parseInt(stored, 10));
    } else {
      const spots = Math.floor(Math.random() * 13) + 8;
      setSpotsLeft(spots);
      sessionStorage.setItem("cv_spots", spots.toString());
    }
  }, []);

  return (
    <div className="bg-gradient-to-r from-purple-50 to-teal-50 p-5 rounded-xl border border-teal-200 text-center shadow-md">
      <span className="text-3xl">📝</span>
      <h3 className="font-bold text-lg mt-1 text-gray-900">
        ⚠️ Only 50 Free CV Reviews Left Today
      </h3>
      <p className="text-sm text-gray-600 my-2">
        Get your CV reviewed by experts — free. Stand out and land your dream job.
      </p>
      <p className="text-sm text-red-600 font-semibold mb-2">
        ⏳ {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} remaining
      </p>
      <a
        href={siteConfig.whatsapp.links.freeCvReview}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-full transition-colors text-sm"
      >
        <FaWhatsapp className="w-4 h-4" />
        Get Free Review
      </a>
      <div className="mt-2">
        <Link href="/cv-services" className="text-xs text-purple-700 hover:underline">
          Or view our CV writing services →
        </Link>
      </div>
    </div>
  );
}
