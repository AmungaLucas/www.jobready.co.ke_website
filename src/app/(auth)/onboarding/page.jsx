"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useSession";
import {
  FiLock,
  FiPhone,
  FiArrowRight,
  FiArrowLeft,
  FiLoader,
  FiCheck,
  FiShield,
  FiAlertCircle,
} from "react-icons/fi";
import AuthCard from "../_components/AuthCard";
import InputField from "../_components/InputField";
import PasswordStrength from "../_components/PasswordStrength";

/**
 * Onboarding page — shown to new Google/phone-only users who haven't set a password.
 *
 * Step 1 (required): Set a password
 * Step 2 (optional): Add a phone number
 *
 * This page is auth-protected. The login page redirects here when
 * session.user.missingFields.needsPassword is true and the user
 * already has a name + email (i.e., fresh Google sign-up).
 */
export default function OnboardingPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, session, refresh } = useAuth();

  const [step, setStep] = useState("password"); // "password" | "phone" | "done"
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Phone OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  // Resend countdown timer
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    router.push("/login");
    return null;
  }

  // If user already has a password, they don't need onboarding
  if (!authLoading && isAuthenticated && !session?.user?.missingFields?.needsPassword) {
    router.push("/dashboard");
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

  const user = session?.user;

  // ─── Step 1: Set Password ───
  const handleSetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Password is required");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to set password. Please try again.");
        return;
      }

      // Password set successfully → move to phone step
      setStep("phone");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 2: Phone OTP ───
  const handleSendOtp = async () => {
    setPhoneError("");
    setOtpError("");

    if (!phone.trim()) {
      setPhoneError("Phone number is required");
      return;
    }

    const rawPhone = phone.trim();
    if (!/^7\d{8}$/.test(rawPhone)) {
      setPhoneError("Enter a valid 9-digit number (e.g. 706922979)");
      return;
    }

    setPhoneLoading(true);
    try {
      const fullPhone = `254${rawPhone}`;
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPhoneError(data.error || "Failed to send OTP. Please try again.");
        return;
      }

      setOtpSent(true);
      setResendCountdown(60);
    } catch (err) {
      setPhoneError("Failed to send OTP. Please check your connection.");
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError("");

    const cleanOtp = otpDigits.join("");
    if (cleanOtp.length !== 6) {
      setOtpError("Please enter the complete 6-digit code");
      return;
    }

    setVerifyLoading(true);
    try {
      const fullPhone = `254${phone.trim()}`;
      const res = await fetch("/api/auth/complete-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone, otp: cleanOtp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setOtpError(data.error || "Verification failed. Please try again.");
        return;
      }

      // Phone added → onboarding complete
      await refresh();
      setStep("done");
    } catch (err) {
      setOtpError("Verification failed. Please check your connection.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleSkipPhone = async () => {
    await refresh();
    setStep("done");
  };

  // ─── Success Screen ───
  if (step === "done") {
    return (
      <AuthCard>
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <FiCheck className="text-green-500" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            You&apos;re all set!
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Your account is ready. You can now sign in with your email and
            password, or use Google.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-3 bg-[#1a56db] hover:bg-[#1e40af] text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            Go to Dashboard
            <FiArrowRight size={16} />
          </button>
        </div>
      </AuthCard>
    );
  }

  // ─── Step 2: Add Phone ───
  if (step === "phone") {
    return (
      <AuthCard>
        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <FiCheck className="text-white" size={14} />
            </div>
            <span className="text-xs text-green-600 font-medium">Password</span>
          </div>
          <div className="flex-1 h-px bg-gray-200" />
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-[#1a56db] flex items-center justify-center">
              <span className="text-white text-xs font-bold">2</span>
            </div>
            <span className="text-xs text-[#1a56db] font-medium">Phone</span>
          </div>
          <div className="flex-1 h-px bg-gray-200" />
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-xs font-bold">3</span>
            </div>
            <span className="text-xs text-gray-400 font-medium">Done</span>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
            <FiPhone className="text-[#1a56db]" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Add your phone number
          </h1>
          <p className="text-sm text-gray-500">
            Optional — but recommended for account security and order updates.
          </p>
        </div>

        {phoneError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-sm text-red-600">{phoneError}</p>
          </div>
        )}

        {otpError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-sm text-red-600">{otpError}</p>
          </div>
        )}

        {!otpSent ? (
          <>
            <div className="mb-5">
              <label
                htmlFor="onboarding-phone"
                className="text-sm font-medium text-gray-700 mb-1.5 block"
              >
                Phone Number <span className="text-gray-400">(optional)</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500 text-sm font-medium">
                  +254
                </span>
                <input
                  id="onboarding-phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="7XXXXXXXX"
                  value={phone}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, "");
                    if (val.startsWith("0")) val = val.substring(1);
                    setPhone(val.slice(0, 9));
                  }}
                  maxLength={10}
                  className="w-full pl-14 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db] text-gray-800"
                />
              </div>
            </div>

            {phone.trim() && /^7\d{8}$/.test(phone.trim()) && (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={phoneLoading}
                className="w-full py-3 bg-[#1a56db] hover:bg-[#1e40af] text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {phoneLoading ? (
                  <>
                    <FiLoader className="animate-spin" size={18} />
                    Sending...
                  </>
                ) : (
                  "Send Verification Code"
                )}
              </button>
            )}

            <button
              type="button"
              onClick={handleSkipPhone}
              className="w-full mt-3 py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Skip for now &rarr;
            </button>
          </>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600">
                We sent a 6-digit code to{" "}
                <span className="font-semibold text-gray-800">+254 {phone}</span>
              </p>
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mb-3 block text-center">
                Enter verification code
              </label>
              <div className="flex justify-center gap-2">
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 1);
                      const newDigits = [...otpDigits];
                      newDigits[i] = val;
                      setOtpDigits(newDigits);
                      // Auto-focus next input
                      if (val && i < 5) {
                        const next = e.target.nextElementSibling;
                        if (next) next.focus();
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                      if (pasted.length === 0) return;
                      const newDigits = [...otpDigits];
                      for (let j = 0; j < 6; j++) {
                        newDigits[j] = pasted[j] || "";
                      }
                      setOtpDigits(newDigits);
                      // Focus the next empty slot (or last field)
                      const focusIdx = Math.min(pasted.length, 5);
                      const inputs = e.currentTarget.parentElement.querySelectorAll("input");
                      if (inputs[focusIdx]) inputs[focusIdx].focus();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otpDigits[i] && i > 0) {
                        const prev = e.target.previousElementSibling;
                        if (prev) prev.focus();
                      }
                    }}
                    className="w-11 h-12 text-center text-lg font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
                    autoFocus={i === 0}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={verifyLoading}
              className="w-full py-3 bg-[#1a56db] hover:bg-[#1e40af] text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verifyLoading ? (
                <>
                  <FiLoader className="animate-spin" size={18} />
                  Verifying...
                </>
              ) : (
                <>
                  Verify & Continue
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
                    onClick={handleSendOtp}
                    className="text-[#1a56db] hover:underline font-medium"
                  >
                    Resend OTP
                  </button>
                )}
              </p>
            </div>

            {/* Back + Skip actions */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setOtpDigits(Array(6).fill(""));
                  setOtpError("");
                }}
                className="text-sm text-gray-500 hover:text-[#1a56db] transition-colors flex items-center gap-1"
              >
                <FiArrowLeft size={14} />
                Change number
              </button>
              <button
                type="button"
                onClick={handleSkipPhone}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Skip for now &rarr;
              </button>
            </div>
          </form>
        )}
      </AuthCard>
    );
  }

  // ─── Step 1: Set Password (default view) ───
  return (
    <AuthCard>
      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-[#1a56db] flex items-center justify-center">
            <span className="text-white text-xs font-bold">1</span>
          </div>
          <span className="text-xs text-[#1a56db] font-medium">Password</span>
        </div>
        <div className="flex-1 h-px bg-gray-200" />
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-xs font-bold">2</span>
          </div>
          <span className="text-xs text-gray-400 font-medium">Phone</span>
        </div>
        <div className="flex-1 h-px bg-gray-200" />
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-xs font-bold">3</span>
          </div>
          <span className="text-xs text-gray-400 font-medium">Done</span>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
          <FiShield className="text-[#1a56db]" size={28} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Create a password
        </h1>
        <p className="text-sm text-gray-500">
          Set a password so you can sign in with your email anytime — even without
          Google.
        </p>
      </div>

      {/* Show user info */}
      <div className="mb-5 p-3 bg-gray-50 border border-gray-100 rounded-xl">
        <div className="flex items-center gap-3">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt=""
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#1a56db] flex items-center justify-center text-white font-semibold text-sm">
              {(user?.name || "?")[0].toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl">
          <div className="flex items-start gap-2">
            <FiAlertCircle className="text-red-500 mt-0.5 shrink-0" size={16} />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSetPassword}>
        <InputField
          label="Password"
          name="onboardingPassword"
          type="password"
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<FiLock size={16} />}
          required
          autoFocus
          autoComplete="new-password"
        />

        <PasswordStrength password={password} />

        <div className="mt-4">
          <InputField
            label="Confirm Password"
            name="onboardingConfirmPassword"
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
              Continue
              <FiArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    </AuthCard>
  );
}
