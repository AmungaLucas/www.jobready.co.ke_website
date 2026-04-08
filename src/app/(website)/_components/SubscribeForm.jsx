"use client";

import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-xl shadow-md p-5 text-center sticky top-24">
        <div className="text-3xl mb-2">✅</div>
        <h3 className="font-bold text-lg" style={{ color: "#1E293B" }}>
          You&apos;re Subscribed!
        </h3>
        <p className="text-gray-500 text-sm mt-1">
          We&apos;ll send you the latest jobs and career tips.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-5 text-center sticky top-24">
      <div className="w-12 h-12 mx-auto rounded-full bg-purple-50 flex items-center justify-center mb-2">
        <span className="text-2xl">✉️</span>
      </div>
      <h3 className="font-bold text-lg" style={{ color: "#1E293B" }}>
        Never Miss an Opportunity
      </h3>
      <p className="text-gray-500 text-sm mt-1 mb-3">
        Get the latest jobs, scholarships, and career tips delivered straight to your inbox.
      </p>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          className="w-full px-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-gray-800"
        />
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-full transition-colors text-sm cursor-pointer"
        >
          Subscribe Now
        </button>
      </form>
      <p className="text-xs text-gray-400 mt-3">No spam. Unsubscribe anytime.</p>
    </div>
  );
}
