"use client";

import { useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function NewsletterForm({ type = "career_tips" }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type }),
      });

      if (res.ok) {
        setSubscribed(true);
        setEmail("");
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className="text-center py-3">
        <p className="text-sm font-semibold text-emerald-600">
          ✓ You&apos;re subscribed!
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Check your inbox for confirmation.
        </p>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          className="flex-1 min-w-0 px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-sans text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            "Subscribe"
          )}
        </button>
      </form>

      {error && (
        <p className="text-xs text-red-500 mt-1.5">{error}</p>
      )}

      {/* Trust text */}
      <div className="flex items-center justify-center gap-1.5 mt-2.5">
        <ShieldCheck size={13} className="text-emerald-600" />
        <span className="text-[0.72rem] text-gray-400">
          No spam. Unsubscribe anytime.
        </span>
      </div>
    </div>
  );
}
