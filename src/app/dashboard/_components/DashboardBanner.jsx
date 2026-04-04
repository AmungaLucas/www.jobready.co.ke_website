"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { X, Mail, Lock, Smartphone, AlertCircle } from "lucide-react";

/**
 * DashboardBanner — Shows verification/setup prompts.
 *
 * Displayed when:
 *  - Email not verified → "Please verify your email"
 *  - No password set → "Add a password for easier login"
 *  - Phone not verified → "Verify your phone"
 *
 * Dismissible — stores dismissed state in sessionStorage.
 */
export default function DashboardBanner() {
  const { data: session, status } = useSession();
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    // Check if already dismissed this session
    const dismissedKey = "dashboard-banner-dismissed";
    const wasDismissed = sessionStorage.getItem(dismissedKey);

    if (wasDismissed) {
      setDismissed(true);
      return;
    }

    const user = session?.user;
    if (!user) return;

    // Show banner if any verification is needed
    const needsAttention =
      !user.emailVerified || !user.phoneVerified || !user.phone;

    setVisible(needsAttention);
  }, [status, session]);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("dashboard-banner-dismissed", "true");
  };

  if (status === "loading" || dismissed || !visible) return null;

  const user = session?.user;
  const banners = [];

  // Email not verified
  if (user && !user.emailVerified && user.email) {
    banners.push({
      id: "email-verify",
      icon: Mail,
      color: "bg-amber-50 border-amber-200 text-amber-800",
      iconColor: "text-amber-600",
      message: "Please verify your email address to receive important notifications.",
      action: null, // Could add a "Resend verification" button
    });
  }

  // No phone
  if (user && !user.phone) {
    banners.push({
      id: "add-phone",
      icon: Smartphone,
      color: "bg-blue-50 border-blue-200 text-blue-800",
      iconColor: "text-blue-600",
      message: "Add your phone number for job alerts and easier account recovery.",
      action: { label: "Add Phone", href: "/dashboard/settings" },
    });
  }

  // Phone not verified
  if (user && user.phone && !user.phoneVerified) {
    banners.push({
      id: "phone-verify",
      icon: Smartphone,
      color: "bg-blue-50 border-blue-200 text-blue-800",
      iconColor: "text-blue-600",
      message: "Verify your phone number to enable all features.",
      action: { label: "Verify Phone", href: "/dashboard/settings" },
    });
  }

  // Placeholder email (phone-only user)
  if (user && user.email && user.email.includes("@jobready.co.ke")) {
    banners.push({
      id: "add-email",
      icon: Mail,
      color: "bg-purple-50 border-purple-200 text-purple-800",
      iconColor: "text-purple-600",
      message: "Add a real email address for password recovery and important updates.",
      action: { label: "Add Email", href: "/dashboard/settings" },
    });
  }

  if (banners.length === 0) return null;

  return (
    <div className="space-y-3">
      {banners.map((banner) => {
        const Icon = banner.icon;
        return (
          <div
            key={banner.id}
            className={`flex items-start gap-3 rounded-xl border p-4 ${banner.color}`}
          >
            <Icon className={`size-5 mt-0.5 shrink-0 ${banner.iconColor}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm">{banner.message}</p>
              {banner.action && (
                <a
                  href={banner.action.href}
                  className="text-sm font-medium underline mt-1 inline-block"
                >
                  {banner.action.label}
                </a>
              )}
            </div>
            <button
              onClick={handleDismiss}
              className="shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
              aria-label="Dismiss"
            >
              <X className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
