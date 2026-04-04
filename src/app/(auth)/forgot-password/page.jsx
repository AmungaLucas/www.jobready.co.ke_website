"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMail, FiArrowLeft, FiLoader, FiCheck } from "react-icons/fi";
import AuthCard from "../_components/AuthCard";
import InputField from "../_components/InputField";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setServerError("");

    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Failed to send reset link. Please try again.");
        return;
      }

      // Always show success (even if user doesn't exist — prevents email enumeration)
      setSuccess(true);
    } catch (err) {
      setServerError("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      {/* Back link */}
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1a56db] transition-colors mb-6 no-underline"
      >
        <FiArrowLeft size={16} />
        Back to Sign In
      </Link>

      {success ? (
        /* ─── Success State ─── */
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <FiCheck className="text-green-500" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Check your email
          </h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            We&apos;ve sent a password reset link to{" "}
            <span className="font-semibold text-gray-700">{email}</span>. The
            link will expire in 1 hour.
          </p>
          <p className="text-xs text-gray-400 mb-6">
            Didn&apos;t receive the email? Check your spam folder or{" "}
            <button
              type="button"
              onClick={() => {
                setSuccess(false);
                setEmail("");
              }}
              className="text-[#1a56db] hover:underline font-medium"
            >
              try again
            </button>
            .
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#1a56db] hover:bg-[#1e40af] text-white rounded-xl font-semibold text-sm transition-colors no-underline"
          >
            Back to Sign In
          </Link>
        </div>
      ) : (
        /* ─── Form State ─── */
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Reset your password
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>
          </div>

          {serverError && (
            <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-sm text-red-600">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              leftIcon={<FiMail size={16} />}
              required
              autoComplete="email"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1a56db] hover:bg-[#1e40af] text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" size={18} />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        </>
      )}
    </AuthCard>
  );
}
