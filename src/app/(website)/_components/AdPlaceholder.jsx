"use client";

import { useEffect, useRef } from "react";
import { siteConfig } from "@/config/site-config";

/**
 * AdSense Ad Unit — renders a real Google AdSense ad slot.
 * Falls back to a styled placeholder if ad consent hasn't been given
 * or if the ad fails to load.
 */
export default function AdPlaceholder({ height = "250px", label = "Advertisement", adSlot }) {
  const adRef = useRef(null);
  const adClient = siteConfig.adsense.clientId;

  useEffect(() => {
    try {
      // Check if user has given ad consent
      const stored = localStorage.getItem("cookie_consent");
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (!parsed.preferences?.advertising) return;

      // Push ad to adsbygoogle queue
      if (adRef.current && adClient) {
        const ins = document.createElement("ins");
        ins.className = "adsbygoogle";
        ins.style.display = "block";
        ins.style.minHeight = height;
        ins.setAttribute("data-ad-client", adClient);
        if (adSlot) {
          ins.setAttribute("data-ad-slot", adSlot);
        }
        ins.setAttribute("data-ad-format", "auto");
        ins.setAttribute("data-full-width-responsive", "true");
        adRef.current.innerHTML = "";
        adRef.current.appendChild(ins);
        
        try {
          (adsbygoogle = window.adsbygoogle || []).push({});
        } catch {
          // Ad push failed — placeholder already shown
        }
      }
    } catch {
      // Consent check failed
    }
  }, [adClient, adSlot, height]);

  return (
    <div className="rounded-lg overflow-hidden bg-gray-50 border border-dashed border-gray-200" style={{ minHeight: height }}>
      <div ref={adRef} className="flex flex-col items-center justify-center text-center" style={{ minHeight: height }}>
        <span className="text-gray-300 text-2xl mb-1">Ad</span>
        <p className="text-gray-300 text-xs font-medium">{label}</p>
      </div>
    </div>
  );
}
