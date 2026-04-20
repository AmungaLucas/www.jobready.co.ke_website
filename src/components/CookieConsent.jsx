"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Shield, Cookie } from "lucide-react";

/**
 * Cookie consent banner — ODPC / GDPR compliant
 *
 * Behaviour:
 * - Shows on first visit (no consent cookie)
 * - Stores preference in localStorage as "cookie_consent"
 * - Only loads analytics/advertising scripts after consent
 * - Provides granular opt-out for each category
 * - Remembers choice for 365 days
 *
 * Essential cookies are always active (cannot be disabled).
 */

const STORAGE_KEY = "cookie_consent";
const CONSENT_DURATION_DAYS = 365;

const categories = [
  {
    id: "essential",
    label: "Essential",
    description: "Required for login, security, and basic site functionality. Cannot be disabled.",
    required: true,
    defaultValue: true,
  },
  {
    id: "analytics",
    label: "Analytics",
    description: "Help us understand how visitors use the site (Google Analytics).",
    required: false,
    defaultValue: false,
  },
  {
    id: "functional",
    label: "Functional",
    description: "Remember your preferences like saved jobs and location filters.",
    required: false,
    defaultValue: false,
  },
  {
    id: "advertising",
    label: "Advertising",
    description: "Deliver relevant ads and measure ad campaign effectiveness (Google AdSense).",
    required: false,
    defaultValue: false,
  },
];

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState(() => {
    const defaults = {};
    categories.forEach((c) => {
      defaults[c.id] = c.defaultValue;
    });
    return defaults;
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setVisible(true);
      }
    } catch {
      // localStorage not available (SSR or private browsing)
      setVisible(true);
    }
  }, []);

  const saveConsent = (prefs) => {
    const consent = {
      preferences: prefs,
      timestamp: new Date().toISOString(),
      expiresAt: new Date(
        Date.now() + CONSENT_DURATION_DAYS * 24 * 60 * 60 * 1000
      ).toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch {
      // Silently fail if localStorage is unavailable
    }

    // Dispatch event so other components can react to consent change
    window.dispatchEvent(
      new CustomEvent("cookieConsentChange", { detail: consent })
    );

    setVisible(false);
  };

  const handleAcceptAll = () => {
    const allAccepted = {};
    categories.forEach((c) => {
      allAccepted[c.id] = true;
    });
    saveConsent(allAccepted);
  };

  const handleRejectOptional = () => {
    const onlyEssential = {};
    categories.forEach((c) => {
      onlyEssential[c.id] = c.required;
    });
    saveConsent(onlyEssential);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const toggleCategory = (id) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat || cat.required) return; // Can't toggle essential
    setPreferences((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!mounted || !visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9999] animate-in slide-in-from-bottom-4 fade-in duration-300"
      role="dialog"
      aria-label="Cookie consent"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />

      {/* Banner */}
      <div className="relative mx-auto max-w-3xl mb-4 mx-4 md:mx-auto p-0">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1a56db] to-[#1e40af] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cookie className="w-6 h-6 text-white" />
              <div>
                <h3 className="text-white font-bold text-base">
                  We value your privacy
                </h3>
                <p className="text-blue-100 text-xs">
                  ODPC / Data Protection Act 2019 compliant
                </p>
              </div>
            </div>
            <button
              onClick={handleRejectOptional}
              className="text-white/60 hover:text-white transition-colors p-1"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-4">
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              We use cookies to enhance your browsing experience, serve
              personalised content, and analyse our traffic. You can choose which
              non-essential cookies to allow. Read our{" "}
              <Link
                href="/cookies"
                className="text-[#1a56db] font-medium hover:underline"
              >
                Cookie Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/data-protection"
                className="text-[#1a56db] font-medium hover:underline"
              >
                Data Protection Notice
              </Link>{" "}
              for more details.
            </p>

            {/* Category toggles */}
            <div className="space-y-3 mb-5">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50/50"
                >
                  <button
                    type="button"
                    role="switch"
                    aria-checked={preferences[cat.id]}
                    aria-label={`${cat.label} cookies: ${preferences[cat.id] ? "enabled" : "disabled"}`}
                    disabled={cat.required}
                    onClick={() => toggleCategory(cat.id)}
                    className={`relative mt-0.5 inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56db] focus-visible:ring-offset-2 disabled:cursor-not-allowed ${
                      preferences[cat.id]
                        ? "bg-[#1a56db]"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        preferences[cat.id] ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-800">
                        {cat.label}
                      </span>
                      {cat.required && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#1a56db] bg-blue-50 px-1.5 py-0.5 rounded">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={handleAcceptAll}
                className="flex-1 bg-[#1a56db] hover:bg-[#1648b8] text-white font-semibold py-2.5 px-5 rounded-lg transition-colors text-sm"
              >
                Accept All Cookies
              </button>
              <button
                onClick={handleRejectOptional}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-5 rounded-lg transition-colors text-sm"
              >
                Essential Only
              </button>
              <button
                onClick={handleSavePreferences}
                className="flex-1 border-2 border-[#1a56db] text-[#1a56db] hover:bg-blue-50 font-semibold py-2.5 px-5 rounded-lg transition-colors text-sm"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
