"use client";

import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { siteConfig } from "@/config/site-config";
import { X, Mail, Smartphone } from "lucide-react";

/**
 * DashboardBanner — Shows verification/setup prompts.
 *
 * Displayed when:
 *  - Email not verified (real email) → "Please verify your email" → #email
 *  - Placeholder email (phone-only user) → "Add a real email" → profile page
 *  - No phone → "Add your phone number" → #phone
 *  - Phone not verified → "Verify your phone" → #phone
 *
 * Action buttons navigate to /dashboard/settings#email or #phone
 * which auto-scrolls to the relevant section and opens the flow.
 *
 * Dismissible — stores dismissed state in sessionStorage.
 */
export default function DashboardBanner() {
  const { data: session, status } = useSession();
  const [dismissed, setDismissed] = useState(false);

  const user = session?.user;

  const visible = useMemo(() => {
    if (status === "loading" || dismissed || !user) return false;
    return (
      !user.emailVerified ||
      !user.phone ||
      (user.phone && !user.phoneVerified) ||
      user.email?.includes(`@${siteConfig.emailDomain}`)
    );
  }, [status, dismissed, user]);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("dashboard-banner-dismissed", "true");
  };

  if (!visible) return null;

  const banners = [];

  // Email not verified (real email, not placeholder)
  if (user && !user.emailVerified && user.email && !user.email.includes(`@${siteConfig.emailDomain}`) && !user.email.startsWith("phone_")) {
    banners.push({
      id: "email-verify",
      icon: Mail,
      color: "bg-amber-50 border-amber-200 text-amber-800",
      iconColor: "text-amber-600",
      message: "Please verify your email address to receive important notifications.",
      action: { label: "Verify Email", href: "/dashboard/settings#email" },
    });
  }

  // Placeholder email (phone-only user)
  if (user && user.email && (user.email.startsWith("phone_") || user.email.includes(`@${siteConfig.emailDomain}`))) {
    banners.push({
      id: "add-email",
      icon: Mail,
      color: "bg-purple-50 border-purple-200 text-purple-800",
      iconColor: "text-purple-600",
      message: "Add a real email address for password recovery and important updates.",
      action: { label: "Add Email", href: "/dashboard/settings#email" },
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
      action: { label: "Add Phone", href: "/dashboard/settings#phone" },
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
      action: { label: "Verify Phone", href: "/dashboard/settings#phone" },
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
