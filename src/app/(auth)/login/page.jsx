"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useAuth } from "@/lib/useSession";
import Link from "next/link";
import { FiMail, FiLock, FiPhone, FiArrowRight, FiLoader, FiCheck } from "react-icons/fi";
import AuthCard from "../_components/AuthCard";
import InputField from "../_components/InputField";
import OtpInput from "../_components/OtpInput";
import SocialLoginButtons from "../_components/SocialLoginButtons";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading, refresh } = useAuth();

  // Tabs
  const [activeTab, setActiveTab] = useState("email");

  // Email form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Phone form
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otp, setOtp] = useState("".padEnd(6, ""));
  const [otpError, setOtpError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Profile completion (after phone OTP or Google auth)
  const [showProfileComplete, setShowProfileComplete] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [profileConfirmPassword, setProfileConfirmPassword] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMissingFields, setProfileMissingFields] = useState(null);
  const [profileLinkedOrders, setProfileLinkedOrders] = useState(0);

  // Callback URL from search params
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const errorParam = searchParams.get("error");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(callbackUrl);
    }
  }, [isAuthenticated, callbackUrl, router]);

  // Show error from URL params (e.g., OAuth errors)
  useEffect(() => {
    if (errorParam) {
      const errorMessages = {
        CredentialsSignin: "Invalid email or password. Please try again.",
        OAuthAccountNotLinked:
          "This email is already linked to another account. Please sign in with your password.",
        SessionRequired: "Please sign in to continue.",
        default: "An error occurred during sign in. Please try again.",
      };
      setLoginError(errorMessages[errorParam] || errorMessages.default);
    }
  }, [errorParam]);

  // Resend countdown timer
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  // ─── Profile Completion ───
  const handleProfileComplete = async (e) => {
    e.preventDefault();
    setProfileError("");

    // Validate
    if (profileMissingFields?.needsName && !profileName.trim()) {
      setProfileError("Name is required");
      return;
    }
    if (profileMissingFields?.needsEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileEmail.trim())) {
      setProfileError("A valid email address is required");
      return;
    }
    if (profileMissingFields?.needsPassword) {
      if (!profilePassword || profilePassword.length < 8) {
        setProfileError("Password must be at least 8 characters");
        return;
      }
      if (profilePassword !== profileConfirmPassword) {
        setProfileError("Passwords do not match");
        return;
      }
    }

    setProfileLoading(true);
    try {
      const payload = {};
      if (profileMissingFields?.needsName) payload.name = profileName.trim();
      if (profileMissingFields?.needsEmail) payload.email = profileEmail.trim();
      if (profileMissingFields?.needsPassword) payload.password = profilePassword;

      const res = await fetch("/api/auth/complete-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setProfileError(data.error || "Failed to update profile. Please try again.");
        return;
      }

      // Check if still missing fields
      if (data.missingFields && !data.missingFields.isComplete) {
        setProfileMissingFields(data.missingFields);
        if (data.linkedOrders > 0) {
          setProfileLinkedOrders((prev) => prev + data.linkedOrders);
        }
        // Update which fields are still missing
        if (!data.missingFields.needsName) setProfileName("");
        if (!data.missingFields.needsEmail) setProfileEmail("");
        if (!data.missingFields.needsPassword) {
          setProfilePassword("");
          setProfileConfirmPassword("");
        }
        return;
      }

      // Profile complete — refresh session and redirect
      await refresh();
      router.push(callbackUrl);
    } catch (err) {
      setProfileError("Something went wrong. Please try again.");
    } finally {
      setProfileLoading(false);
    }
  };

  const skipProfileComplete = () => {
    refresh();
    router.push(callbackUrl);
  };

  // ─── Email Login ───
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setLoginError("");

    let valid = true;

    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Please enter a valid email address");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    }

    if (!valid) return;

    setLoginLoading(true);
    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setLoginError("Invalid email or password. Please try again.");
      } else {
        router.push(callbackUrl);
      }
    } catch (err) {
      setLoginError("Something went wrong. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  // ─── Phone OTP ───
  const handleSendOtp = useCallback(async () => {
    setPhoneError("");
    setOtpError("");
    setLoginError("");

    if (!phone.trim()) {
      setPhoneError("Phone number is required");
      return;
    }

    const rawPhone = phone.trim();
    if (!/^7\d{8}$/.test(rawPhone)) {
      setPhoneError("Enter a valid 9-digit number (e.g. 706922979)");
      return;
    }

    setOtpLoading(true);
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
      setOtpLoading(false);
    }
  }, [phone]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError("");
    setLoginError("");

    const cleanOtp = otp.replace(/\s/g, "");
    if (cleanOtp.length !== 6) {
      setOtpError("Please enter the complete 6-digit code");
      return;
    }

    setVerifyLoading(true);
    try {
      const fullPhone = `254${phone.trim()}`;
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: fullPhone,
          otp: cleanOtp,
          name: profileName || undefined,
          email: profileEmail || undefined,
          password: profilePassword || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setOtpError(data.error || "Verification failed. Please try again.");
        return;
      }

      // Check if profile is incomplete
      if (data.missingFields && !data.missingFields.isComplete) {
        setProfileMissingFields(data.missingFields);
        setProfileLinkedOrders(data.linkedOrders || 0);
        setShowProfileComplete(true);
        return;
      }

      // Profile complete — sign in via NextAuth credentials
      // Since phone users may not have a password, use a special approach
      // We call signIn with the user's email to establish a session
      if (data.user) {
        // For phone-only users, we need to establish a session
        // Use a server-side approach: sign in with the phone auth
        const signInRes = await fetch("/api/auth/phone-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: data.user.id }),
        });

        if (signInRes.ok) {
          router.push(callbackUrl);
        } else {
          // Fallback: try to sign in
          router.push(callbackUrl);
        }
      } else {
        router.push(callbackUrl);
      }
    } catch (err) {
      setOtpError("Verification failed. Please check your connection.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (resendCountdown > 0) return;
    handleSendOtp();
  };

  // ─── Loading state ───
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

  // ─── Profile Completion Screen ───
  if (showProfileComplete && profileMissingFields) {
    const showAnyField = profileMissingFields.needsName || profileMissingFields.needsEmail || profileMissingFields.needsPassword;

    return (
      <AuthCard>
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
            <FiCheck className="text-green-500" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Almost there!</h1>
          <p className="text-sm text-gray-500">
            {profileLinkedOrders > 0
              ? `We linked ${profileLinkedOrders} order(s) to your account. Complete your profile below.`
              : "Complete your profile to get the most out of JobReady."}
          </p>
        </div>

        {profileError && (
          <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-sm text-red-600">{profileError}</p>
          </div>
        )}

        {showAnyField ? (
          <form onSubmit={handleProfileComplete}>
            {profileMissingFields.needsName && (
              <InputField
                label="Full Name"
                name="profileName"
                type="text"
                placeholder="e.g. John Kamau"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                leftIcon={<FiMail size={16} />}
                required
                autoComplete="name"
              />
            )}

            {profileMissingFields.needsEmail && (
              <InputField
                label="Email Address"
                name="profileEmail"
                type="email"
                placeholder="you@example.com"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                leftIcon={<FiMail size={16} />}
                required
                autoComplete="email"
              />
            )}

            {profileMissingFields.needsPassword && (
              <>
                <InputField
                  label="Set a Password"
                  name="profilePassword"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={profilePassword}
                  onChange={(e) => setProfilePassword(e.target.value)}
                  leftIcon={<FiLock size={16} />}
                  required
                  autoComplete="new-password"
                />
                <InputField
                  label="Confirm Password"
                  name="profileConfirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={profileConfirmPassword}
                  onChange={(e) => setProfileConfirmPassword(e.target.value)}
                  leftIcon={<FiLock size={16} />}
                  required
                  autoComplete="new-password"
                />
                <p className="text-xs text-gray-400 mb-4">
                  Optional — you can always sign in with your phone instead
                </p>
              </>
            )}

            <button
              type="submit"
              disabled={profileLoading}
              className="w-full py-3 bg-[#1a56db] hover:bg-[#1e40af] text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {profileLoading ? (
                <>
                  <FiLoader className="animate-spin" size={18} />
                  Saving...
                </>
              ) : (
                <>
                  Complete Profile
                  <FiArrowRight size={16} />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={skipProfileComplete}
              className="w-full mt-3 py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Skip for now →
            </button>
          </form>
        ) : (
          <div className="text-center">
            <button
              onClick={() => router.push(callbackUrl)}
              className="w-full py-3 bg-[#1a56db] hover:bg-[#1e40af] text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              Continue to Dashboard
              <FiArrowRight size={16} />
            </button>
          </div>
        )}
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      {/* Heading */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500">Sign in to your JobReady account</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab("email")}
          className={`flex-1 py-2.5 text-sm font-medium text-center transition-colors relative ${
            activeTab === "email"
              ? "text-[#1a56db]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Email
          {activeTab === "email" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a56db] rounded-full" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("phone")}
          className={`flex-1 py-2.5 text-sm font-medium text-center transition-colors relative ${
            activeTab === "phone"
              ? "text-[#1a56db]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Phone
          {activeTab === "phone" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a56db] rounded-full" />
          )}
        </button>
      </div>

      {/* General error */}
      {loginError && (
        <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-sm text-red-600">{loginError}</p>
        </div>
      )}

      {/* ─── Email Tab ─── */}
      {activeTab === "email" && (
        <form onSubmit={handleEmailLogin}>
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

          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
            leftIcon={<FiLock size={16} />}
            required
            autoComplete="current-password"
          />

          <div className="flex items-center justify-end mb-6">
            <Link
              href="/forgot-password"
              className="text-sm text-[#1a56db] hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full py-3 bg-[#1a56db] hover:bg-[#1e40af] text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginLoading ? (
              <>
                <FiLoader className="animate-spin" size={18} />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <FiArrowRight size={16} />
              </>
            )}
          </button>

          <SocialLoginButtons mode="login" />

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-[#1a56db] hover:underline font-medium"
            >
              Sign Up
            </Link>
          </p>
        </form>
      )}

      {/* ─── Phone Tab ─── */}
      {activeTab === "phone" && (
        <form onSubmit={handleVerifyOtp}>
          {!otpSent ? (
            <>
              {/* Phone input with +254 prefix */}
              <div className="mb-5">
                <label
                  htmlFor="phone-input"
                  className="text-sm font-medium text-gray-700 mb-1.5 block"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500 text-sm font-medium">
                    +254
                  </span>
                  <input
                    id="phone-input"
                    type="tel"
                    inputMode="numeric"
                    placeholder="7XXXXXXXX or 07XXXXXXXX"
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
                {phoneError && (
                  <p className="text-xs text-red-500 mt-1">{phoneError}</p>
                )}
                {!phoneError && (
                  <p className="text-xs text-gray-400 mt-1">
                    We&apos;ll send a verification code to your phone
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpLoading}
                className="w-full py-3 bg-[#1a56db] hover:bg-[#1e40af] text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {otpLoading ? (
                  <>
                    <FiLoader className="animate-spin" size={18} />
                    Sending...
                  </>
                ) : (
                  <>
                    Send OTP
                    <FiArrowRight size={16} />
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600">
                  We sent a 6-digit code to{" "}
                  <span className="font-semibold text-gray-800">
                    +254 {phone}
                  </span>
                </p>
              </div>

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
                    Verify &amp; Sign In
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
            </>
          )}

          {/* Back to phone number */}
          {otpSent && (
            <div className="text-center mt-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setOtp("".padEnd(6, ""));
                  setOtpError("");
                }}
                className="text-sm text-gray-500 hover:text-[#1a56db] transition-colors"
              >
                Use a different phone number
              </button>
            </div>
          )}

          <SocialLoginButtons mode="login" />

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-[#1a56db] hover:underline font-medium"
            >
              Sign Up
            </Link>
          </p>
        </form>
      )}
    </AuthCard>
  );
}

export default function LoginPage() {
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
      <LoginForm />
    </Suspense>
  );
}
