"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

/**
 * Google Analytics (gtag.js) — consent-gated
 *
 * Only loads after user consents to "analytics" cookies.
 * Uses NEXT_PUBLIC_GA_ID env variable for the Measurement ID (G-XXXXXXXXXX).
 * If no GA_ID is set, renders nothing.
 */
export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  const [consent, setConsent] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem("cookie_consent");
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.preferences?.analytics ?? false;
      }
    } catch {
      // localStorage not available
    }
    return null;
  });

  useEffect(() => {
    // Listen for consent changes from CookieConsent component
    const handler = (e) => {
      setConsent(e.detail?.preferences?.analytics ?? false);
    };
    window.addEventListener("cookieConsentChange", handler);
    return () => window.removeEventListener("cookieConsentChange", handler);
  }, []);

  // No GA configured — render nothing
  if (!gaId) return null;

  // Don't render until consent is explicitly granted
  if (consent === null || !consent) return null;

  return (
    <>
      {/* gtag.js library */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      {/* gtag configuration */}
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
            cookie_flags: 'SameSite=None;Secure'
          });
        `}
      </Script>
    </>
  );
}
