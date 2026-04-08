"use client";

import { useState } from "react";
import { FiArrowRight, FiLoader, FiCheck, FiMail, FiAlertCircle } from "react-icons/fi";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // "success" | "error" | "updated" | null
  const [errorMsg, setErrorMsg] = useState("");

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

      if (res.ok) {
        // 201 = new subscription, 200 = updated/re-subscribed
        setResult(data.subscription && res.status === 201 ? "success" : "updated");
        setEmail("");
      } else if (res.status === 409) {
        setResult("updated");
        setEmail("");
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
            Get the latest jobs, scholarships, and career tips delivered to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              disabled={loading}
              className="w-full px-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={loading}
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

          <p className="text-xs text-gray-400 mt-3">No spam. Unsubscribe anytime.</p>
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
      ) : result === "updated" ? (
        /* Re-subscribed / updated */
        <div className="py-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-teal-50 flex items-center justify-center mb-2">
            <FiCheck className="w-6 h-6 text-teal-600" />
          </div>
          <h3 className="font-bold text-lg" style={{ color: "#1E293B" }}>
            Subscription Updated!
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            You&apos;re already on our list. We&apos;ve reactivated your subscription.
          </p>
        </div>
      ) : null}

      {/* Reset button after success */}
      {(result === "success" || result === "updated") && (
        <button
          onClick={() => setResult(null)}
          className="mt-3 text-xs text-gray-400 hover:text-[#5B21B6] transition-colors cursor-pointer"
        >
          Subscribe another email
        </button>
      )}
    </div>
  );
}
