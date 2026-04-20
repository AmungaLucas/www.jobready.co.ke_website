"use client";

import { siteConfig } from "@/config/site-config";
import { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useAuth } from "@/lib/useSession";
import Link from "next/link";
import {
  FiMail,
  FiLock,
  FiPhone,
  FiArrowRight,
  FiLoader,
  FiCheck,
  FiAlertCircle,
  FiKey,
} from "react-icons/fi";
import AuthCard from "../_components/AuthCard";
import InputField from "../_components/InputField";
import OtpInput from "../_components/OtpInput";
import SocialLoginButtons from "../_components/SocialLoginButtons";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading, session, refresh } = useAuth();

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

  // Google linking flow
  const [showGoogleLink, setShowGoogleLink] = useState(false);
  const [linkEmail, setLinkEmail] = useState("");
  const [linkPassword, setLinkPassword] = useState("");
  const [linkError, setLinkError] = useState("");
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkSuccess, setLinkSuccess] = useState(false);

  // Email verification for account linking (Scenario 3)
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [emailToVerify, setEmailToVerify] = useState("");
  const [emailVerifyCode, setEmailVerifyCode] = useState("".padEnd(6, ""));
  const [emailVerifySent, setEmailVerifySent] = useState(false);
  const [emailVerifyLoading, setEmailVerifyLoading] = useState(false);
  const [emailVerifyError, setEmailVerifyError] = useState("");
  const [emailVerifyCountdown, setEmailVerifyCountdown] = useState(0);

  // Set password banner (shown after login if user has no password)
  const [showNeedsPassword, setShowNeedsPassword] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  // Callback URL from search params
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const errorParam = searchParams.get("error");
  const linkParam = searchParams.get("link");
  const emailParam = searchParams.get("email");

  // ─── Check for Google linking params on mount ───
  useEffect(() => {
    if (linkParam === "google" && emailParam) {
      setShowGoogleLink(true);
      setLinkEmail(decodeURIComponent(emailParam));
      // Clean URL to remove sensitive params
      window.history.replaceState({}, "", "/login");
    }
  }, [linkParam, emailParam]);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const missing = session?.user?.missingFields;

    // New Google user: no password set → redirect to onboarding (required)
    // This also catches phone-only users who never set a password
    if (missing?.needsPassword && !missing?.needsName && !missing?.needsEmail) {
      // User has name + email but no password → fresh Google sign-up
      router.push("/onboarding");
      return;
    }

    // Incomplete profile from phone OTP (missing name, email, etc.)
    if (justLoggedIn && missing?.needsPassword && (missing?.needsName || missing?.needsEmail)) {
      setShowNeedsPassword(true);
      return;
    }

    // Don't redirect while profile completion form is showing
    // (user is authenticated but hasn't finished filling in their details)
    if (showProfileComplete) return;

    router.push(callbackUrl);
  }, [isAuthenticated, callbackUrl, router, session, justLoggedIn, showProfileComplete]);

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

  // Resend countdown timer (phone OTP)
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  // Email verification countdown timer
  useEffect(() => {
    if (emailVerifyCountdown <= 0) return;
    const timer = setInterval(() => {
      setEmailVerifyCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [emailVerifyCountdown]);

  // ─── Google Account Linking ───
  const handleLinkGoogle = async (e) => {
    e.preventDefault();
    setLinkError("");

    if (!linkPassword) {
      setLinkError("Password is required to verify your identity");
      return;
    }

    setLinkLoading(true);
    try {
      // Step 1: Sign in with credentials to establish a session
      const result = await signIn("credentials", {
        email: linkEmail.trim().toLowerCase(),
        password: linkPassword,
        redirect: false,
      });

      if (result?.error) {
        setLinkError("Invalid password. Please try again.");
        setLinkLoading(false);
        return;
      }

      // Step 2: Link Google account via API
      const res = await fetch("/api/auth/link-google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: linkEmail.trim().toLowerCase(), password: linkPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLinkError(data.error || "Failed to link Google account. Please try again.");
        setLinkLoading(false);
        return;
      }

      // Success!
      setLinkSuccess(true);
      setLinkLoading(false);

      // Refresh session and redirect after a short delay
      await refresh();
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      setLinkError("Something went wrong. Please try again.");
    } finally {
      setLinkLoading(false);
    }
  };

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
        // Handle EMAIL_IN_USE — switch to email verification flow
        if (data.error === "EMAIL_IN_USE" && data.requiresVerification) {
          setEmailToVerify(data.email);
          setShowEmailVerification(true);
          return;
        }
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

      // Profile complete — create a fresh session with updated data
      // and redirect via native form submit (proven reliable redirect).
      if (data.user?.id) {
        // Note: phone-session for profile completion requires a valid session grant token.
        // Since the user is already authenticated (session exists), we use fetch to
        // refresh the session data instead of creating a new one via phone-session.
        await refresh();
        window.location.href = callbackUrl || "/dashboard";
        return;
      }

      // Fallback if no user id returned
      await refresh();
      router.push(callbackUrl);
    } catch (err) {
      setProfileError("Something went wrong. Please try again.");
    } finally {
      setProfileLoading(false);
    }
  };

  // ─── Email Verification for Account Linking (Scenario 3) ───
  const handleSendEmailVerify = async () => {
    setEmailVerifyError("");
    setEmailVerifyLoading(true);
    try {
      const res = await fetch("/api/auth/send-email-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToVerify }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEmailVerifyError(data.error || "Failed to send verification email.");
        return;
      }
      setEmailVerifySent(true);
      setEmailVerifyCountdown(60);
    } catch (err) {
      setEmailVerifyError("Something went wrong. Please try again.");
    } finally {
      setEmailVerifyLoading(false);
    }
  };

  const handleVerifyEmailLink = async (e) => {
    e.preventDefault();
    setEmailVerifyError("");
    const cleanCode = emailVerifyCode.replace(/\s/g, "");
    if (cleanCode.length !== 6) {
      setEmailVerifyError("Please enter the complete 6-digit code");
      return;
    }
    setEmailVerifyLoading(true);
    try {
      const res = await fetch("/api/auth/verify-email-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToVerify, code: cleanCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEmailVerifyError(data.error || "Verification failed. Please try again.");
        return;
      }
      // Accounts merged — the response sets a new session cookie.
      // Navigate to dashboard via full page load.
      window.location.href = callbackUrl || "/dashboard";
    } catch (err) {
      setEmailVerifyError("Something went wrong. Please try again.");
    } finally {
      setEmailVerifyLoading(false);
    }
  };

  const handleBackToProfile = () => {
    setShowEmailVerification(false);
    setEmailVerifySent(false);
    setEmailVerifyCode("".padEnd(6, ""));
    setEmailVerifyError("");
    setEmailVerifyCountdown(0);
  };

  const skipProfileComplete = () => {
    // The session cookie was already set by phone-session (JSON call in
    // handleVerifyOtp).  We just need a full page navigation so the
    // server-side middleware sees the cookie.  refresh() + router.push()
    // is unreliable here — the SWR cache doesn't always pick up cookies
    // set by an external endpoint.
    window.location.href = callbackUrl || "/dashboard";
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
        setJustLoggedIn(true);
        // Refresh session to populate missingFields
        await refresh();
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
        // Create a session FIRST so that complete-profile can authenticate.
        // This fixes the Scenario 2 deadlock where:
        //   verify-otp creates user → complete-profile needs session →
        //   phone-session creates session → but phone-session only called
        //   when isComplete (chicken-and-egg).
        if (data.user && data.sessionGrantToken) {
          try {
            const sessionRes = await fetch("/api/auth/phone-session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: data.user.id, sessionGrantToken: data.sessionGrantToken }),
            });
            if (sessionRes.ok) {
              await refresh();
            }
          } catch (err) {
            // Session creation failed — still show the form;
            // complete-profile will return 401 and the user can retry
            console.warn("[Phone Login] Session creation failed:", err);
          }
        }

        setProfileMissingFields(data.missingFields);
        setProfileLinkedOrders(data.linkedOrders || 0);
        setShowProfileComplete(true);
        return;
      }

      // Profile complete — submit a native form to phone-session.
      // The server sets the cookie AND returns a 307 redirect.
      // The browser follows the redirect natively — zero React interference.
      if (data.user && data.sessionGrantToken) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "/api/auth/phone-session";

        const addField = (name, value) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = name;
          input.value = value;
          form.appendChild(input);
        };

        addField("userId", data.user.id);
        addField("sessionGrantToken", data.sessionGrantToken);
        addField("callbackUrl", callbackUrl || "/dashboard");

        document.body.appendChild(form);
        form.submit();
        return; // browser is navigating away — nothing else to do
      }

      // No user or token returned (unexpected) — show error
      setOtpError("Verification succeeded but no session could be created. Please try again.");
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

  // ─── Google Linking Screen ───
  if (showGoogleLink && !isAuthenticated) {
    return (
      <AuthCard>
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Link Google Account</h1>
          <p className="text-sm text-gray-500">
            An account with{" "}
            <span className="font-semibold text-gray-700">{linkEmail}</span>{" "}
            already exists. Enter your password to link your Google account.
          </p>
        </div>

        {linkError && (
          <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl">
            <div className="flex items-start gap-2">
              <FiAlertCircle className="text-red-500 mt-0.5 shrink-0" size={16} />
              <p className="text-sm text-red-600">{linkError}</p>
            </div>
          </div>
        )}

        {linkSuccess && (
          <div className="mb-5 p-3 bg-green-50 border border-green-100 rounded-xl">
            <div className="flex items-start gap-2">
              <FiCheck className="text-green-500 mt-0.5 shrink-0" size={16} />
              <p className="text-sm text-green-600">
                Google account linked successfully! Redirecting...
              </p>
            </div>
          </div>
        )}

        {!linkSuccess && (
          <form onSubmit={handleLinkGoogle}>
            <InputField
              label="Email Address"
              name="linkEmail"
              type="email"
              value={linkEmail}
              disabled
              leftIcon={<FiMail size={16} />}
              autoComplete="email"
            />

            <InputField
              label="Password"
              name="linkPassword"
              type="password"
              placeholder="Enter your password"
              value={linkPassword}
              onChange={(e) => setLinkPassword(e.target.value)}
              leftIcon={<FiLock size={16} />}
              required
              autoFocus
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
              disabled={linkLoading}
              className="w-full py-3 bg-[#1a56db] hover:bg-[#1e40af] text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {linkLoading ? (
                <>
                  <FiLoader className="animate-spin" size={18} />
                  Linking Account...
                </>
              ) : (
                <>
                  Link Account
                  <FiArrowRight size={16} />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowGoogleLink(false);
                setLinkEmail("");
                setLinkPassword("");
                setLinkError("");
              }}
              className="w-full mt-3 py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel and sign in normally
            </button>
          </form>
        )}
      </AuthCard>
    );
  }

  // ─── Set Password Banner (shown after login) ───
  if (showNeedsPassword && isAuthenticated) {
    return (
      <AuthCard>
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-3">
            <FiKey className="text-amber-500" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back!</h1>
          <p className="text-sm text-gray-500">
            Your account doesn&apos;t have a password set. Set one to sign in with your
            email next time.
          </p>
        </div>

        <div className="mb-5 p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-sm text-blue-700 mb-3">
            <strong>Tip:</strong> Adding a password lets you sign in even when you
            don&apos;t have access to your Google account or phone.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/set-password"
            className="w-full py-3 bg-[#1a56db] hover:bg-[#1e40af] text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <FiKey size={16} />
            Set a Password
          </Link>

          <button
            type="button"
            onClick={() => router.push(callbackUrl)}
            className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Skip for now &rarr;
          </button>
        </div>
      </AuthCard>
    );
  }

  // ─── Email Verification Screen (Scenario 3: split identity merge) ───
  if (showEmailVerification && showProfileComplete) {
    return (
      <AuthCard>
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
            <FiMail className="text-[#1a56db]" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Verify Your Email</h1>
          <p className="text-sm text-gray-500">
            An account with{" "}
            <span className="font-semibold text-gray-700">{emailToVerify}</span>{" "}
            already exists. Verify ownership to link your accounts.
          </p>
        </div>

        {emailVerifyError && (
          <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl">
            <div className="flex items-start gap-2">
              <FiAlertCircle className="text-red-500 mt-0.5 shrink-0" size={16} />
              <p className="text-sm text-red-600">{emailVerifyError}</p>
            </div>
          </div>
        )}

        {!emailVerifySent ? (
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-sm text-amber-700">
                We&apos;ll send a 6-digit verification code to{" "}
                <strong>{emailToVerify}</strong>. Open the email and enter the code below to confirm you own this account.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSendEmailVerify}
              disabled={emailVerifyLoading}
              className="w-full py-3 bg-[#1a56db] hover:bg-[#1e40af] text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {emailVerifyLoading ? (
                <>
                  <FiLoader className="animate-spin" size={18} />
                  Sending...
                </>
              ) : (
                <>
                  Send Verification Code
                  <FiArrowRight size={16} />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleBackToProfile}
              className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              &larr; Back to profile form
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerifyEmailLink}>
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600">
                Enter the 6-digit code sent to{" "}
                <span className="font-semibold text-gray-800">{emailToVerify}</span>
              </p>
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mb-3 block text-center">
                Verification code
              </label>
              <OtpInput
                value={emailVerifyCode}
                onChange={setEmailVerifyCode}
                length={6}
                autoFocus
                error={emailVerifyError}
              />
            </div>

            <button
              type="submit"
              disabled={emailVerifyLoading}
              className="w-full py-3 bg-[#1a56db] hover:bg-[#1e40af] text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {emailVerifyLoading ? (
                <>
                  <FiLoader className="animate-spin" size={18} />
                  Verifying...
                </>
              ) : (
                <>
                  Verify &amp; Link Accounts
                  <FiArrowRight size={16} />
                </>
              )}
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">
                Didn&apos;t receive the code?{" "}
                {emailVerifyCountdown > 0 ? (
                  <span className="text-gray-400">
                    Resend in {emailVerifyCountdown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendEmailVerify}
                    className="text-[#1a56db] hover:underline font-medium"
                  >
                    Resend Code
                  </button>
                )}
              </p>
            </div>

            <div className="text-center mt-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={handleBackToProfile}
                className="text-sm text-gray-500 hover:text-[#1a56db] transition-colors"
              >
                &larr; Back to profile form
              </button>
            </div>
          </form>
        )}
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
              : "Complete your profile to get the most out of " + siteConfig.shortName + "."}
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
                  Optional &mdash; you can always sign in with your phone instead
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
              Skip for now &rarr;
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
        <p className="text-sm text-gray-500">Sign in to your {siteConfig.shortName} account</p>
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

          <SocialLoginButtons mode="login" callbackUrl={callbackUrl} />

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

          <SocialLoginButtons mode="login" callbackUrl={callbackUrl} />

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
