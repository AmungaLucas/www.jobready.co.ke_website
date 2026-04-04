"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiCheck, FiAlertCircle, FiLoader, FiArrowRight } from "react-icons/fi";
import AuthCard from "../_components/AuthCard";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [fetching, setFetching] = useState(!!token && token.length >= 32);
  const [result, setResult] = useState(
    !token || token.length < 32
      ? { success: false, message: "Invalid verification link. No token provided." }
      : null
  );

  useEffect(() => {
    if (!fetching) return;

    let cancelled = false;

    const verifyEmail = async () => {
      try {
        // Simulated verification for development
        // TODO: Replace with actual API call when backend endpoint is ready:
        // const res = await fetch("/api/auth/verify-email", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ token }),
        // });
        // const data = await res.json();
        // if (!res.ok) {
        //   if (!cancelled) { setFetching(false); setResult({ success: false, message: data.error || "Email verification failed." }); }
        //   return;
        // }
        // if (!cancelled) { setFetching(false); setResult({ success: true }); }

        await new Promise((resolve) => setTimeout(resolve, 1500));
        if (!cancelled) {
          setFetching(false);
          setResult({ success: true });
        }
      } catch (err) {
        if (!cancelled) {
          setFetching(false);
          setResult({ success: false, message: "Something went wrong. Please try again." });
        }
      }
    };

    verifyEmail();
    return () => {
      cancelled = true;
    };
  }, [fetching, token]);

  if (fetching) {
    return (
      <AuthCard>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative mb-4">
            <div className="w-16 h-16 rounded-full border-4 border-[#1a56db]/20 flex items-center justify-center">
              <FiLoader className="animate-spin text-[#1a56db]" size={28} />
            </div>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Verifying your email...
          </h2>
          <p className="text-sm text-gray-500 text-center">
            Please wait while we verify your email address.
          </p>
        </div>
      </AuthCard>
    );
  }

  if (result?.success) {
    return (
      <AuthCard>
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <FiCheck className="text-green-500" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Email verified!
          </h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Your email address has been successfully verified. You can now sign
            in and access all features of your account.
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

  return (
    <AuthCard>
      <div className="text-center py-4">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <FiAlertCircle className="text-red-500" size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Verification failed
        </h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          {result?.message || "The verification link is invalid or has expired."}
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

export default function VerifyEmailPage() {
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
      <VerifyEmailContent />
    </Suspense>
  );
}
