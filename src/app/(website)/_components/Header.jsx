"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, LayoutDashboard, User, Bookmark, Bell, LogOut, ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";
import { siteConfig } from "@/config/site-config";
import { useAuth } from "@/lib/useSession";
import MobileNav from "./MobileNav";

/* ── Custom SVG: JobReady logo ── */
const LogoSvg = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#1a56db" />
    <path
      d="M8 16l4 4 12-12"
      stroke="#fff"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ── Custom SVG: WhatsApp icon (chat-bubble style) ── */
const WASvg = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.503 3.94 1.394 5.624L0 24l6.518-1.358A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.82c-1.93 0-3.747-.518-5.307-1.42l-.38-.227-3.938.82.833-3.836-.247-.394A9.773 9.773 0 012.18 12c0-5.422 4.398-9.82 9.82-9.82 5.422 0 9.82 4.398 9.82 9.82 0 5.422-4.398 9.82-9.82 9.82z" />
  </svg>
);

export { LogoSvg, WASvg };

/* ── User Avatar Dropdown ── */
function UserMenu() {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Get user's first initial
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open]);

  const handleSignOut = async () => {
    setOpen(false);
    try {
      await signOut({ callbackUrl: "/" });
    } catch (err) {
      console.error("[Auth] Sign out error:", err);
      window.location.href = "/";
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "My Dashboard", href: "/dashboard" },
    { icon: User, label: "My Profile", href: "/dashboard/profile" },
    { icon: Bookmark, label: "Saved Jobs", href: "/dashboard/saved-jobs" },
    { icon: Bell, label: "Job Alerts", href: "/dashboard/alerts" },
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
        aria-label="User menu"
        aria-expanded={open}
      >
        {/* Avatar circle with initial */}
        <div className="w-8 h-8 rounded-full bg-[#1a56db] flex items-center justify-center text-white text-sm font-semibold shrink-0">
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
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-[200]">
          {/* User info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {user?.email || ""}
            </p>
          </div>

          {/* Menu links */}
          <div className="py-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1a56db] transition-colors no-underline"
              >
                <item.icon size={16} className="text-gray-400" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Divider + Sign out */}
          <div className="border-t border-gray-100 pt-1">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
            >
              <LogOut size={16} className="text-red-400" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Header({ activeNav }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-[100] shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between h-14 md:h-[68px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-extrabold text-primary no-underline hover:opacity-90 transition-opacity md:text-2xl md:text-[1.5rem]">
            <LogoSvg size={32} />
            <span>
              JobReady<span className="text-gray-800">.co.ke</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {siteConfig.nav.map((item) => {
              const isActive = activeNav === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3.5 py-2 rounded-lg text-[0.88rem] font-medium transition-all ${
                    isActive
                      ? "text-primary font-semibold after:absolute after:bottom-[-1px] after:left-3.5 after:right-3.5 after:h-0.5 after:bg-primary after:rounded-full"
                      : "text-gray-600 hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* WhatsApp pill */}
            <a
              href={`${siteConfig.whatsapp.link}?text=Hi%20JobReady%2C%20I%20need%20help`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-[7px] rounded-full text-[0.82rem] font-semibold text-emerald-700 bg-emerald-100 border-[1.5px] border-transparent hover:bg-emerald-200 hover:border-emerald-600 transition-all no-underline"
            >
              <WASvg />
              WhatsApp
            </a>

            {/* User Menu (authenticated) or Sign In (guest) */}
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Link
                href="/login"
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-[7px] rounded-full text-[0.85rem] font-semibold text-gray-600 bg-transparent border border-gray-200 hover:bg-gray-50 hover:text-gray-800 transition-all no-underline"
              >
                Sign In
              </Link>
            )}

            {/* Hamburger */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 hover:border-gray-300 transition-all"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} className="text-gray-700" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
    </>
  );
}
