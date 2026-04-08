"use client";

import { useState, useCallback, useRef } from "react";
import {
  FiArrowRight,
  FiLoader,
  FiCheck,
  FiMail,
  FiAlertCircle,
} from "react-icons/fi";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null); // "success" | "error" | "updated" | "already_subscribed" | "reactivated" | null
  const [errorMsg, setErrorMsg] = useState("");
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const abortRef = useRef(null);

  /**
   * Check if email is already subscribed via GET /api/newsletter?email=...
   * Called on blur and also before submit.
   */
  const checkEmailExists = useCallback(async (emailToCheck) => {
    const trimmed = emailToCheck.toLowerCase().trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setAlreadySubscribed(false);
      return null;
    }

    // Cancel any in-flight check
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setChecking(true);
    try {
      const res = await fetch(
        `/api/newsletter?email=${encodeURIComponent(trimmed)}`,
        { signal: abortRef.current.signal }
      );
      if (!res.ok) {
        setAlreadySubscribed(false);
        return null;
      }
      const data = await res.json();
      const isSub = data.subscribed && data.active;
      setAlreadySubscribed(isSub);
      return data;
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("[SubscribeForm] Check failed:", err.message);
      }
      setAlreadySubscribed(false);
      return null;
    } finally {
      setChecking(false);
    }
  }, []);

  const handleBlur = () => {
    if (email.trim()) {
      checkEmailExists(email);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) return;

    // Basic client validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setResult("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    // Pre-submit check — verify subscription status
    const preCheck = await checkEmailExists(trimmed);
    if (preCheck?.subscribed && preCheck?.active) {
      setResult("already_subscribed");
      setEmail("");
      setAlreadySubscribed(false);
      return;
    }

    setLoading(true);
    setResult(null);
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, type: "career_tips" }),
      });

      const data = await res.json();

      if (res.status === 201) {
        // New subscription
        setResult("success");
        setEmail("");
        setAlreadySubscribed(false);
      } else if (res.ok && data.alreadySubscribed) {
        // Already actively subscribed (double-guard)
        setResult("already_subscribed");
        setEmail("");
        setAlreadySubscribed(false);
      } else if (res.ok && data.reactivated) {
        // Previously unsubscribed, now re-activated
        setResult("reactivated");
        setEmail("");
        setAlreadySubscribed(false);
      } else if (res.ok) {
        // Generic 200 (updated)
        setResult("updated");
        setEmail("");
        setAlreadySubscribed(false);
      } else {
        setResult("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setResult("error");
      setErrorMsg("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setErrorMsg("");
    setAlreadySubscribed(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 text-center sticky top-24">
      {result === null ? (
        <>
          {/* Default: Subscribe form */}
          <div className="w-12 h-12 mx-auto rounded-full bg-purple-50 flex items-center justify-center mb-2">
            <FiMail className="w-6 h-6" style={{ color: "#5B21B6" }} />
          </div>
          <h3 className="font-bold text-lg" style={{ color: "#1E293B" }}>
            Never Miss an Opportunity
          </h3>
          <p className="text-gray-500 text-sm mt-1 mb-3">
            Get the latest jobs, scholarships, and career tips delivered to your
            inbox.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  // Clear already-subscribed warning as user types
                  if (alreadySubscribed) setAlreadySubscribed(false);
                }}
                onBlur={handleBlur}
                placeholder="Your email address"
                required
                disabled={loading || checking}
                className={`w-full px-3 py-2 rounded-full border text-sm text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:border-transparent pr-10 transition-colors ${
                  alreadySubscribed
                    ? "border-amber-400 bg-amber-50 focus:ring-amber-400"
                    : "border-gray-300 focus:ring-teal-500"
                }`}
              />
              {/* Spinner inside input while checking */}
              {checking && (
                <FiLoader className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
              )}
            </div>

            {/* Already subscribed warning (real-time, before submit) */}
            {alreadySubscribed && result === null && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-amber-600">
                <FiAlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                This email is already subscribed. Submit to reactivate if needed.
              </div>
            )}

            <button
              type="submit"
              disabled={loading || checking}
              className="w-full bg-[#5B21B6] hover:bg-[#4a1a94] text-white font-semibold py-2 rounded-full transition-colors text-sm cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                <>
                  Subscribe Now
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Client-side validation error */}
          {result === "error" && errorMsg && (
            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-red-500">
              <FiAlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {errorMsg}
            </div>
          )}

          <p className="text-xs text-gray-400 mt-3">
            No spam. Unsubscribe anytime.
          </p>
        </>
      ) : result === "success" ? (
        /* New subscription */
        <div className="py-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-2">
            <FiCheck className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-bold text-lg" style={{ color: "#1E293B" }}>
            You&apos;re Subscribed!
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Welcome aboard! Check your inbox for a confirmation email.
          </p>
          <p className="text-xs text-gray-400 mt-3">
            We&apos;ll send you the latest jobs and career tips.
          </p>
        </div>
      ) : result === "already_subscribed" ? (
        /* Already actively subscribed */
        <div className="py-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 flex items-center justify-center mb-2">
            <FiCheck className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="font-bold text-lg" style={{ color: "#1E293B" }}>
            You&apos;re Already Subscribed!
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            This email is already on our list. You&apos;re all set to receive
            the latest updates.
          </p>
          <p className="text-xs text-gray-400 mt-3">
            No action needed — stay tuned for the next newsletter.
          </p>
        </div>
      ) : result === "reactivated" ? (
        /* Previously unsubscribed, now re-activated */
        <div className="py-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-teal-50 flex items-center justify-center mb-2">
            <FiCheck className="w-6 h-6 text-teal-600" />
          </div>
          <h3 className="font-bold text-lg" style={{ color: "#1E293B" }}>
            Welcome Back!
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Your subscription has been reactivated. We&apos;re glad to have you
            back!
          </p>
          <p className="text-xs text-gray-400 mt-3">
            You&apos;ll start receiving updates again.
          </p>
        </div>
      ) : result === "updated" ? (
        /* Generic re-subscribed / updated */
        <div className="py-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-teal-50 flex items-center justify-center mb-2">
            <FiCheck className="w-6 h-6 text-teal-600" />
          </div>
          <h3 className="font-bold text-lg" style={{ color: "#1E293B" }}>
            Subscription Updated!
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Your preferences have been updated successfully.
          </p>
        </div>
      ) : null}

      {/* Reset button after any result */}
      {result !== null && (
        <button
          onClick={resetForm}
          className="mt-3 text-xs text-gray-400 hover:text-[#5B21B6] transition-colors cursor-pointer"
        >
          Subscribe another email
        </button>
      )}
    </div>
  );
}
