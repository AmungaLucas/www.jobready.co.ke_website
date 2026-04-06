"use client";

import { useEffect, useState, useRef } from "react";

/**
 * AdSense Ad Slot — consent-gated
 *
 * Renders actual <ins class="adsbygoogle"> ad units when the user has
 * consented to "advertising" cookies. Shows a placeholder when no consent.
 *
 * Supported positions: "leaderboard", "inline", "sidebar"
 */

const adSlotConfig = {
  leaderboard: {
    format: "horizontal",
    slot: "1234567890",
    wrapperClass: "w-full py-3",
    style: { display: "block" },
  },
  inline: {
    format: "fluid",
    slot: "1234567891",
    wrapperClass: "w-full py-3 my-6",
    style: { display: "block" },
  },
  sidebar: {
    format: "vertical",
    slot: "1234567892",
    wrapperClass: "w-full py-4 mb-4",
    style: { display: "block" },
  },
};

const positionLabels = {
  leaderboard: "Advertisement — Leaderboard",
  inline: "Advertisement — Inline",
  sidebar: "Advertisement — Sidebar",
};

export default function AdSlot({ position = "sidebar" }) {
  const pushed = useRef(false);
  const config = adSlotConfig[position] || adSlotConfig.sidebar;
  const label = positionLabels[position] || "Advertisement";

  const [consent, setConsent] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem("cookie_consent");
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.preferences?.advertising ?? false;
      }
    } catch {
      // localStorage not available
    }
    return null;
  });

  useEffect(() => {
    // Listen for consent changes from CookieConsent component
    const handler = (e) => {
      setConsent(e.detail?.preferences?.advertising ?? false);
    };
    window.addEventListener("cookieConsentChange", handler);
    return () => window.removeEventListener("cookieConsentChange", handler);
  }, []);

  // Push the ad to adsbygoogle after the ins element is mounted and consent is given
  useEffect(() => {
    if (consent && !pushed.current) {
      pushed.current = true;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // AdSense not loaded yet or blocked
      }
    }
  }, [consent]);

  // No consent — show placeholder
  if (consent === null || !consent) {
    return (
      <div
        className={`bg-gray-100 border border-dashed border-gray-300 text-center text-xs text-gray-400 tracking-wider uppercase rounded-lg ${config.wrapperClass}`}
      >
        {label}
      </div>
    );
  }

  // Consent given — render actual AdSense ad unit
  return (
    <div className={config.wrapperClass}>
      <ins
        className="adsbygoogle"
        style={config.style}
        data-ad-client="ca-pub-8031704055036556"
        data-ad-slot={config.slot}
        data-ad-format={config.format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
