"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiLock, FiArrowLeft, FiLoader, FiCheck, FiAlertCircle } from "react-icons/fi";
import AuthCard from "../_components/AuthCard";
import InputField from "../_components/InputField";
import PasswordStrength from "../_components/PasswordStrength";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenChecked, setTokenChecked] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  // Check if token exists on mount
  useEffect(() => {
    if (!token || token.length < 32) {
      setTokenValid(false);
      setServerError(
        "Invalid or missing reset token. Please request a new password reset link."
      );
    }
    setTokenChecked(true);
  }, [token]);

  const validate = () => {
    const errs = {};

    if (!newPassword) {
      errs.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      errs.newPassword = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      errs.confirmPassword = "Please confirm your new password";
    } else if (newPassword !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Failed to reset password. Please try again.");
        return;
      }

      setSuccess(true);
    } catch (err) {
      setServerError("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (!tokenChecked) {
    return (
      <AuthCard>
        <div className="flex flex-col items-center justify-center py-12">
          <FiLoader className="animate-spin text-[#1a56db] mb-3" size={28} />
          <p className="text-sm text-gray-500">Verifying your reset link...</p>
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
            Password reset successfully!
          </h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Your password has been updated. You can now sign in with your new
            password.
          </p>
          <Link
            href="/login?reset=true"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#1a56db] hover:bg-[#1e40af] text-white rounded-xl font-semibold text-sm transition-colors no-underline"
          >
            Continue to Sign In
          </Link>
        </div>
      ) : !tokenValid ? (
        /* ─── Invalid Token ─── */
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle className="text-red-500" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Invalid reset link
          </h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#1a56db] hover:bg-[#1e40af] text-white rounded-xl font-semibold text-sm transition-colors no-underline"
          >
            Request New Link
          </Link>
        </div>
      ) : (
        /* ─── Form ─── */
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Set new password
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Enter your new password below. Make sure it&apos;s at least 8
              characters and includes a mix of letters and numbers.
            </p>
          </div>

          {serverError && (
            <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-sm text-red-600">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <InputField
                label="New Password"
                name="newPassword"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                error={errors.newPassword}
                leftIcon={<FiLock size={16} />}
                required
                autoComplete="new-password"
              />
              <PasswordStrength password={newPassword} />
            </div>

            <InputField
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              leftIcon={<FiLock size={16} />}
              required
              autoComplete="new-password"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1a56db] hover:bg-[#1e40af] text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" size={18} />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </>
      )}
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
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
      <ResetPasswordForm />
    </Suspense>
  );
}
