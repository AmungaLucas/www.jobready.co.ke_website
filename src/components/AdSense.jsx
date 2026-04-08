"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site-config";

/**
 * Google AdSense auto-ads script — consent-gated
 *
 * Only loads after user consents to "advertising" cookies.
 * Uses siteConfig.adsense.clientId (ca-pub-XXXXXXXXXXXXXXXX).
 * Loads adsbygoogle.js with crossOrigin="anonymous" for CORS safety.
 */
export default function AdSense() {
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

  // Don't render until consent is explicitly granted
  if (consent === null || !consent) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsense.clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
