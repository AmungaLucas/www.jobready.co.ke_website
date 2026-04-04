"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  FiMail,
  FiLock,
  FiX,
  FiAlertCircle,
  FiArrowRight,
} from "react-icons/fi";
import Link from "next/link";

function Banner({ icon: Icon, color, title, description, action, onDismiss }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const colorClasses = {
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "text-amber-600",
      title: "text-amber-900",
      desc: "text-amber-700",
      action: "text-amber-800 hover:bg-amber-100",
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "text-blue-600",
      title: "text-blue-900",
      desc: "text-blue-700",
      action: "text-blue-800 hover:bg-blue-100",
    },
  };

  const c = colorClasses[color] || colorClasses.amber;

  return (
    <div className={`${c.bg} ${c.border} border rounded-xl p-3 flex items-start gap-3`}>
      <Icon className={`${c.icon} mt-0.5 flex-shrink-0`} size={16} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${c.title}`}>{title}</p>
        <p className={`text-xs ${c.desc} mt-0.5`}>{description}</p>
        {action && (
          <Link
            href={action.href}
            className={`inline-flex items-center gap-1 text-xs font-medium ${c.action} mt-1.5 px-2 py-1 rounded-lg transition-colors`}
          >
            {action.label}
            <FiArrowRight size={12} />
          </Link>
        )}
      </div>
      <button
        onClick={() => {
          setDismissed(true);
          if (onDismiss) onDismiss();
        }}
        className={`${c.icon} hover:opacity-70 transition-opacity flex-shrink-0 mt-0.5`}
      >
        <FiX size={14} />
      </button>
    </div>
  );
}

export default function DashboardBanners() {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user || user.profileComplete) return null;

  const banners = [];

  // Unverified email banner
  if (!user.emailVerified && user.email && !user.email.startsWith("phone_")) {
    banners.push(
      <Banner
        key="verify-email"
        icon={FiMail}
        color="amber"
        title="Verify your email address"
        description="Please check your inbox for a verification email. This helps secure your account."
        action={{
          href: "/dashboard/settings",
          label: "Account Settings",
        }}
      />
    );
  }

  // Missing password banner (phone/Google users who skipped)
  // We show this if they have a session but might not have a password
  // The actual check is done on the settings page, but we can hint here
  if (user.profileComplete) {
    return null;
  }

  return (
    <div className="space-y-2 mb-4">
      {banners}
      {/* Incomplete profile reminder */}
      {!user.profileComplete && (
        <Banner
          key="complete-profile"
          icon={FiAlertCircle}
          color="blue"
          title="Complete your profile"
          description="Add your details to unlock all features including job applications and order tracking."
          action={{
            href: "/dashboard/settings",
            label: "Update Profile",
          }}
        />
      )}
    </div>
  );
}
