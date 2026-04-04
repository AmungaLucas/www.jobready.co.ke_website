"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiArrowRight,
  FiLoader,
  FiX,
  FiCheck,
  FiShield,
  FiEye,
} from "react-icons/fi";
import OtpInput from "@/app/(auth)/_components/OtpInput";

export default function CompleteProfileModal({ onComplete }) {
  const { data: session, update: updateSession } = useSession();

  const [missingFields, setMissingFields] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Phone OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("".padEnd(6, ""));
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [phoneOtpError, setPhoneOtpError] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("form"); // "form" | "phone-verify"

  // Determine missing fields from session
  useEffect(() => {
    if (session?.user) {
      const user = session.user;
      const missing = {};

      // Check if name is placeholder
      const isPlaceholderName =
        !user.name ||
        user.name === "Phone User" ||
        user.name.trim().length < 2;
      if (isPlaceholderName) missing.name = true;

      // Check if email is placeholder
      const isPlaceholderEmailVal =
        !user.email ||
        user.email.startsWith("phone_") ||
        user.email.includes("@phone.jobready.co.ke");
      if (isPlaceholderEmailVal) missing.email = true;

      // Check if phone is missing
      if (!user.phone) missing.phone = true;

      setMissingFields(missing);

      // Pre-fill what we have
      if (!missing.name && user.name) setName(user.name);
      if (
        !missing.email &&
        user.email &&
        !user.email.startsWith("phone_")
      )
        setEmail(user.email);
      if (!missing.phone && user.phone)
        setPhone(user.phone.replace(/^254/, ""));
    }
  }, [session]);

  // Resend countdown
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => setResendCountdown((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const handleSendOtp = useCallback(async () => {
    if (!phone || phone.length !== 9) return;
    setPhoneOtpError("");
    setOtpLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `254${phone}` }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPhoneOtpError(data.error || "Failed to send OTP");
        return;
      }
      setOtpSent(true);
      setStep("phone-verify");
      setResendCountdown(60);
    } catch {
      setPhoneOtpError("Failed to send OTP. Check your connection.");
    } finally {
      setOtpLoading(false);
    }
  }, [phone]);

  const handleVerifyOtp = async () => {
    const cleanOtp = otp.replace(/\s/g, "");
    if (cleanOtp.length !== 6) {
      setPhoneOtpError("Enter the complete 6-digit code");
      return;
    }
    setOtpLoading(true);
    setPhoneOtpError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `254${phone}`, otp: cleanOtp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPhoneOtpError(data.error || "Verification failed");
        return;
      }
      setOtpVerified(true);
      setStep("form");
    } catch {
      setPhoneOtpError("Verification failed. Check your connection.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (skipPassword = false) => {
    setError("");
    const payload = {};

    if (missingFields.name && name.trim().length < 2) {
      setError("Please enter your full name");
      return;
    }
    if (missingFields.name) payload.name = name.trim();

    if (missingFields.email) {
      if (
        !email.trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      ) {
        setError("Please enter a valid email address");
        return;
      }
      payload.email = email.trim().toLowerCase();
    }

    if (missingFields.phone && !otpVerified) {
      setError("Please verify your phone number");
      return;
    }
    if (missingFields.phone) {
      payload.phone = `254${phone}`;
    }

    if (!skipPassword && password.length >= 8) {
      payload.password = password;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update profile");
        return;
      }

      // Refresh session
      await updateSession({ profileComplete: data.profileComplete });

      if (onComplete) {
        onComplete();
      }
    } catch {
      setError("Something went wrong. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Don't render if profile is complete
  if (session?.user?.profileComplete) return null;

  // Don't render if no missing fields detected (edge case)
  if (Object.keys(missingFields).length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 px-6 py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <FiShield className="text-white" size={32} />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">
            Complete Your Profile
          </h2>
          <p className="text-sm text-blue-100">
            We need a few more details to get you started
          </p>
        </div>

        {/* Form */}
        <div className="px-6 py-6">
          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {step === "form" ? (
            <div className="space-y-4">
              {/* Name field */}
              {missingFields.name && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                      <FiUser size={16} />
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. John Kamau"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Email field */}
              {missingFields.email && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                      <FiMail size={16} />
                    </span>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Phone field */}
              {missingFields.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  {!otpVerified ? (
                    <div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500 text-sm font-medium">
                          +254
                        </span>
                        <input
                          type="tel"
                          inputMode="numeric"
                          placeholder="7XXXXXXXX"
                          value={phone}
                          onChange={(e) =>
                            setPhone(
                              e.target.value.replace(/\D/g, "").slice(0, 9)
                            )
                          }
                          maxLength={9}
                          className="w-full pl-14 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>
                      {phoneOtpError && (
                        <p className="text-xs text-red-500 mt-1">
                          {phoneOtpError}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpLoading || phone.length !== 9}
                        className="mt-2 w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {otpLoading ? (
                          <FiLoader className="animate-spin" size={16} />
                        ) : (
                          <FiPhone size={16} />
                        )}
                        {otpSent && !otpVerified
                          ? "Resend OTP"
                          : "Verify Phone Number"}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-xl">
                      <FiCheck className="text-green-600" size={18} />
                      <span className="text-sm text-green-700 font-medium">
                        +254 {phone} verified
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400 text-center mb-2">
                  Optional — Set a password for easier login
                </p>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                    <FiLock size={16} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password (min 8 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <FiX size={16} />
                    ) : (
                      <FiEye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={() => handleSubmit(false)}
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin" size={18} /> Saving...
                  </>
                ) : (
                  <>
                    Complete Profile <FiArrowRight size={16} />
                  </>
                )}
              </button>

              {/* Skip password */}
              <button
                onClick={() => handleSubmit(true)}
                disabled={loading}
                className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
              >
                Skip — set password later
              </button>
            </div>
          ) : (
            /* Phone OTP verification step */
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Enter the code sent to{" "}
                <span className="font-semibold">+254 {phone}</span>
              </p>
              <OtpInput
                value={otp}
                onChange={setOtp}
                length={6}
                autoFocus
                error={phoneOtpError}
              />
              {phoneOtpError && (
                <p className="text-xs text-red-500 mt-2">{phoneOtpError}</p>
              )}
              <button
                onClick={handleVerifyOtp}
                disabled={otpLoading}
                className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {otpLoading ? (
                  <>
                    <FiLoader className="animate-spin" size={18} /> Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </button>
              <div className="mt-3">
                {resendCountdown > 0 ? (
                  <span className="text-xs text-gray-400">
                    Resend in {resendCountdown}s
                  </span>
                ) : (
                  <button
                    onClick={handleSendOtp}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  setStep("form");
                  setOtpSent(false);
                  setOtp("".padEnd(6, ""));
                }}
                className="mt-2 text-xs text-gray-500 hover:text-gray-700"
              >
                Back to profile form
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
