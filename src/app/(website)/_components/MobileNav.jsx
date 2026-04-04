"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Briefcase, Clock, Building2, PenLine, FileText, Users, Landmark, GraduationCap, LayoutDashboard, User, Bookmark, Bell, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { siteConfig } from "@/config/site-config";
import { useAuth } from "@/lib/useSession";
import { LogoSvg, WASvg } from "./Header";

/* Icon map for mobile nav extras */
const iconMap = {
  Users,
  Landmark,
  GraduationCap,
};

/* Icon map for main nav items */
const navIconMap = {
  Jobs: Briefcase,
  Opportunities: Clock,
  Companies: Building2,
  "Career Advice": PenLine,
  "CV Services": FileText,
};

export default function MobileNav({ isOpen, onClose }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isOpen) return null;

  const handleSignOut = async () => {
    onClose();
    await signOut({ redirect: false });
    router.push("/");
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div
      className="fixed inset-0 z-[400] bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white p-6 max-w-[320px] h-full overflow-y-auto shadow-lg">
        <div className="min-h-[calc(100vh-3rem)] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-[1.3rem] font-extrabold text-white no-underline"
            onClick={onClose}
          >
            <LogoSvg size={26} />
            <span>
              JobReady<span className="text-gray-800">.co.ke</span>
            </span>
          </Link>
          <button
            className="w-9 h-9 border border-gray-200 rounded-full bg-white flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all cursor-pointer"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        {/* Authenticated user info */}
        {isAuthenticated && (
          <>
            <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-gray-50">
              <div className="w-10 h-10 rounded-full bg-[#1a56db] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || ""}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  initial
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || ""}
                </p>
              </div>
            </div>

            {/* Dashboard links */}
            <ul className="list-none mb-2">
              {[
                { icon: LayoutDashboard, label: "My Dashboard", href: "/dashboard" },
                { icon: User, label: "My Profile", href: "/dashboard/profile" },
                { icon: Bookmark, label: "Saved Jobs", href: "/dashboard/saved-jobs" },
                { icon: Bell, label: "Job Alerts", href: "/dashboard/alerts" },
              ].map((item) => (
                <li key={item.href} className="mb-1">
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-[0.95rem] font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-all no-underline"
                    onClick={onClose}
                  >
                    <item.icon size={18} className="text-primary shrink-0" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="h-px bg-gray-100 my-4" />
          </>
        )}

        {/* Nav links */}
        <ul className="list-none">
          {siteConfig.nav.map((item) => {
            const Icon = navIconMap[item.label] || Briefcase;
            return (
              <li key={item.href} className="mb-1">
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-[0.95rem] font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-all no-underline"
                  onClick={onClose}
                >
                  <Icon size={18} className="text-gray-400 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}

          {/* Extra links */}
          {siteConfig.mobileNavExtras.map((item) => {
            const Icon = iconMap[item.icon] || Briefcase;
            return (
              <li key={item.href} className="mb-1">
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-[0.95rem] font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-all no-underline"
                  onClick={onClose}
                >
                  <Icon size={18} className="text-gray-400 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Divider */}
        <div className="h-px bg-gray-100 my-5" />

        {/* CTA buttons */}
        <div className="flex flex-col gap-3 mt-2">
          <Link
            href="/cv-services"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-full text-[0.9rem] font-semibold text-white bg-primary hover:bg-primary-dark transition-all no-underline"
            onClick={onClose}
          >
            Get Your CV Done
          </Link>
          <a
            href={siteConfig.whatsapp.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-full text-[0.9rem] font-semibold text-white bg-secondary hover:bg-secondary-dark transition-all no-underline"
            onClick={onClose}
          >
            <WASvg size={16} />
            Chat on WhatsApp
          </a>

          {isAuthenticated ? (
            <button
              onClick={handleSignOut}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-full text-[0.9rem] font-semibold text-red-600 bg-transparent border border-red-200 hover:bg-red-50 transition-all cursor-pointer"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-full text-[0.9rem] font-semibold text-primary bg-transparent border border-primary hover:bg-primary hover:text-white transition-all no-underline"
              onClick={onClose}
            >
              Sign In
            </Link>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
