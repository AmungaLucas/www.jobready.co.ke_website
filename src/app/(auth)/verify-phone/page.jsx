"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FiPhone,
  FiArrowRight,
  FiLoader,
  FiCheck,
} from "react-icons/fi";
import AuthCard from "../_components/AuthCard";
import OtpInput from "../_components/OtpInput";

function VerifyPhoneContent() {
  const searchParams = useSearchParams();
  const phoneParam = searchParams.get("phone");

  const [phone] = useState(phoneParam || "");
  const [otp, setOtp] = useState("".padEnd(6, ""));
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);

  // Countdown timer
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setOtpError("");

    const cleanOtp = otp.replace(/\s/g, "");
    if (cleanOtp.length !== 6) {
      setOtpError("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp: cleanOtp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setOtpError(data.error || "Verification failed. Please try again.");
        return;
      }

      setSuccess(true);
    } catch (err) {
      setOtpError("Verification failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = useCallback(async () => {
    if (resendCountdown > 0) return;
    setOtpError("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      if (res.ok) {
        setResendCountdown(60);
        setOtp("".padEnd(6, ""));
      }
    } catch (err) {
      // Silently fail
    }
  }, [resendCountdown, phone]);

  // Format phone for display
  const displayPhone = phone
    ? phone.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3")
    : "Not provided";

  if (success) {
    return (
      <AuthCard>
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <FiCheck className="text-green-500" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Phone verified!
          </h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Your phone number has been successfully verified. You can now sign
            in to your account.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#1a56db] hover:bg-[#1e40af] text-white rounded-xl font-semibold text-sm transition-colors no-underline"
          >
            Continue to Sign In
            <FiArrowRight size={16} />
          </Link>
        </div>
      </AuthCard>
    );
  }

  if (!phone) {
    return (
      <AuthCard>
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <FiPhone className="text-amber-500" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            No phone number provided
          </h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Please sign in first, then verify your phone number from your
            account settings.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#1a56db] hover:bg-[#1e40af] text-white rounded-xl font-semibold text-sm transition-colors no-underline"
          >
            Go to Sign In
            <FiArrowRight size={16} />
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      {/* Back link */}
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1a56db] transition-colors mb-6 no-underline"
      >
        ← Back to Sign In
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Verify your phone number
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Enter the 6-digit verification code sent to:
        </p>
      </div>

      {/* Phone display */}
      <div className="flex items-center gap-2 mb-6 p-3 bg-gray-50 rounded-xl">
        <FiPhone className="text-[#1a56db]" size={18} />
        <span className="text-sm font-semibold text-gray-800">
          +{displayPhone}
        </span>
      </div>

      <form onSubmit={handleVerify}>
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 mb-3 block text-center">
            Enter verification code
          </label>
          <OtpInput
            value={otp}
            onChange={setOtp}
            length={6}
            autoFocus
            error={otpError}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#1a56db] hover:bg-[#1e40af] text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin" size={18} />
              Verifying...
            </>
          ) : (
            <>
              Verify
              <FiArrowRight size={16} />
            </>
          )}
        </button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            Didn&apos;t receive the code?{" "}
            {resendCountdown > 0 ? (
              <span className="text-gray-400">
                Resend in {resendCountdown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-[#1a56db] hover:underline font-medium"
              >
                Resend OTP
              </button>
            )}
          </p>
        </div>
      </form>
    </AuthCard>
  );
}

export default function VerifyPhonePage() {
  return (
    <Suspense
      fallback={
        <AuthCard>
          <div className="flex flex-col items-center justify-center py-12">
            <FiLoader className="animate-spin text-[#1a56db] mb-3" size={28} />
            <p className="text-sm text-gray-500">Loading...</p>
          </div>
        </AuthCard>
      }
    >
      <VerifyPhoneContent />
    </Suspense>
  );
}
