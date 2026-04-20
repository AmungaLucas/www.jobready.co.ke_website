"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/useSession";
import { siteConfig } from "@/config/site-config";
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowRight,
  FiLoader,
  FiCheck,
} from "react-icons/fi";
import AuthCard from "../_components/AuthCard";
import InputField from "../_components/InputField";
import PasswordStrength from "../_components/PasswordStrength";
import SocialLoginButtons from "../_components/SocialLoginButtons";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Errors
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  // Loading
  const [loading, setLoading] = useState(false);

  // Success
  const [success, setSuccess] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // Check for success message from redirect
  const successParam = searchParams.get("registered");
  useEffect(() => {
    if (successParam === "true") {
      setSuccess(true);
    }
  }, [successParam]);

  const validate = () => {
    const errs = {};

    // Name
    if (!name.trim()) {
      errs.name = "Full name is required";
    } else if (name.trim().length < 2) {
      errs.name = "Name must be at least 2 characters";
    }

    // Email
    if (!email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Please enter a valid email address";
    }

    // Phone (optional)
    if (phone.trim()) {
      const rawPhone = phone.trim();
      if (!/^7\d{8}$/.test(rawPhone)) {
        errs.phone = "Enter a valid number (e.g. 7XXXXXXXX)";
      }
    }

    // Password
    if (!password) {
      errs.password = "Password is required";
    } else if (password.length < 8) {
      errs.password = "Password must be at least 8 characters";
    }

    // Confirm password
    if (!confirmPassword) {
      errs.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    // Terms
    if (!agreedToTerms) {
      errs.terms = "You must agree to the Terms of Service";
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
      const fullPhone = phone.trim() ? `254${phone.trim()}` : null;

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: fullPhone,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Registration failed. Please try again.");
        return;
      }

      // Success — redirect to login with success message
      router.push("/login?registered=true");
    } catch (err) {
      setServerError("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
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

  // ─── Success state ───
  if (success) {
    return (
      <AuthCard>
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <FiCheck className="text-green-500" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Account created successfully!
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Your account has been created. You can now sign in with your email
            and password.
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
      {/* Heading */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Create your account
        </h1>
        <p className="text-sm text-gray-500">
          Join thousands of Kenyan job seekers on {siteConfig.shortName}
        </p>
      </div>

      {/* Server error */}
      {serverError && (
        <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-sm text-red-600">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <InputField
          label="Full Name"
          name="name"
          type="text"
          placeholder="e.g. John Kamau"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          leftIcon={<FiUser size={16} />}
          required
          autoComplete="name"
        />

        <InputField
          label="Email Address"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          leftIcon={<FiMail size={16} />}
          required
          autoComplete="email"
        />

        {/* Phone with +254 prefix */}
        <div className="mb-5">
          <label
            htmlFor="reg-phone"
            className="text-sm font-medium text-gray-700 mb-1.5 block"
          >
            Phone Number{" "}
            <span className="text-xs text-gray-400 font-normal">
              (optional)
            </span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500 text-sm font-medium">
              +254
            </span>
            <input
              id="reg-phone"
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
              className={`w-full pl-14 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db] text-gray-800 ${
                errors.phone ? "border-red-300" : "border-gray-200"
              }`}
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
          )}
          {!errors.phone && (
            <p className="text-xs text-gray-400 mt-1">
              Used for job alerts and verification
            </p>
          )}
        </div>

        {/* Password with strength indicator */}
        <div className="mb-5">
          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            leftIcon={<FiLock size={16} />}
            required
            autoComplete="new-password"
          />
          <PasswordStrength password={password} />
        </div>

        <InputField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          leftIcon={<FiLock size={16} />}
          required
          autoComplete="new-password"
        />

        {/* Terms checkbox */}
        <div className="mb-6">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-colors ${
                  agreedToTerms
                    ? "bg-[#1a56db] border-[#1a56db]"
                    : errors.terms
                    ? "border-red-300"
                    : "border-gray-300 group-hover:border-gray-400"
                }`}
              >
                {agreedToTerms && (
                  <FiCheck className="text-white" size={12} strokeWidth={3} />
                )}
              </div>
            </div>
            <span className="text-sm text-gray-600 leading-relaxed">
              I agree to the{" "}
              <a
                href="/terms"
                className="text-[#1a56db] hover:underline font-medium"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="text-[#1a56db] hover:underline font-medium"
              >
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.terms && (
            <p className="text-xs text-red-500 mt-1 ml-8">{errors.terms}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#1a56db] hover:bg-[#1e40af] text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin" size={18} />
              Creating Account...
            </>
          ) : (
            <>
              Create Account
              <FiArrowRight size={16} />
            </>
          )}
        </button>

        <SocialLoginButtons mode="register" />

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#1a56db] hover:underline font-medium"
          >
            Sign In
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}

export default function RegisterPage() {
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
      <RegisterForm />
    </Suspense>
  );
}
