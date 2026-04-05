"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useSession";
import { FiLock, FiArrowRight, FiLoader, FiCheck, FiAlertCircle } from "react-icons/fi";
import AuthCard from "../_components/AuthCard";
import InputField from "../_components/InputField";
import PasswordStrength from "../_components/PasswordStrength";

export default function SetPasswordPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    router.push("/login");
    return null;
  }

  // Loading state
  if (authLoading) {
    return (
      <AuthCard>
        <div className="flex flex-col items-center justify-center py-12">
          <FiLoader className="animate-spin text-[#1a56db] mb-3" size={28} />
          <p className="text-sm text-gray-500">Checking your session...</p>
        </div>
      </AuthCard>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!newPassword) {
      setError("Password is required");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to set password. Please try again.");
        return;
      }

      setSuccess(true);

      // Redirect after short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthCard>
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <FiCheck className="text-green-500" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Set!</h1>
          <p className="text-sm text-gray-500">
            Your password has been set successfully. You can now sign in with your email
            and password.
          </p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
          <FiLock className="text-[#1a56db]" size={28} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Set a Password</h1>
        <p className="text-sm text-gray-500">
          Create a password so you can sign in with your email next time.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl">
          <div className="flex items-start gap-2">
            <FiAlertCircle className="text-red-500 mt-0.5 shrink-0" size={16} />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <InputField
          label="New Password"
          name="newPassword"
          type="password"
          placeholder="Min. 8 characters"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          leftIcon={<FiLock size={16} />}
          required
          autoFocus
          autoComplete="new-password"
        />

        <PasswordStrength password={newPassword} />

        <div className="mt-4">
          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            leftIcon={<FiLock size={16} />}
            required
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-3 bg-[#1a56db] hover:bg-[#1e40af] text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin" size={18} />
              Setting Password...
            </>
          ) : (
            <>
              Set Password
              <FiArrowRight size={16} />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="w-full mt-3 py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Skip for now &rarr;
        </button>
      </form>
    </AuthCard>
  );
}
