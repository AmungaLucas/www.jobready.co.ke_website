"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { FiUser, FiMenu, FiX, FiLogOut, FiChevronDown, FiBell, FiSearch } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { siteConfig } from "@/config/site-config";

const profileDropdownLinks = [
  { label: "My Dashboard", href: "/dashboard", icon: FiUser },
  { label: "My Profile", href: "/dashboard/profile", icon: FiUser },
  { label: "Saved Jobs", href: "/dashboard/saved-jobs", icon: FiUser },
  { label: "Job Alerts", href: "/dashboard/alerts", icon: FiBell },
];

// Initials avatar fallback
function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0][0].toUpperCase();
}

export default function Header() {
  const { data: session, status } = useSession();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const profileRef = useRef(null);

  const isAuthenticated = status === "authenticated";
  const user = session?.user;

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on escape
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setProfileOpen(false);
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleSignOut = async () => {
    setProfileOpen(false);
    setMobileOpen(false);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="sticky top-0 z-50 shadow-md bg-[#FAFAFA] border-b-2 border-[#5B21B6]">
      <div className="flex items-center justify-between py-3 px-6 lg:px-8 max-w-[1280px] mx-auto">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg bg-[#5B21B6]">
            JK
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition text-[#1E293B] hover:text-[#0D9488]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Search */}
          <form action="/search" method="GET" className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              name="q"
              placeholder="Search jobs..."
              className="w-48 lg:w-56 pl-9 pr-3 py-1.5 rounded-full border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-700 placeholder-gray-400"
            />
          </form>
          {/* WhatsApp button */}
          <Link
            href={siteConfig.whatsapp.links.general}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white px-3.5 py-1.5 rounded-full text-sm flex items-center gap-1.5 transition bg-[#10b981] hover:bg-[#059669]"
          >
            <FaWhatsapp className="w-4 h-4" />
            WhatsApp
          </Link>

          {/* Auth: Signed Out */}
          {!isAuthenticated && (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-[#5B21B6] hover:text-[#4a1a94] transition px-3 py-1.5"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-white px-4 py-1.5 rounded-full text-sm font-semibold transition bg-[#5B21B6] hover:bg-[#4a1a94]"
              >
                Create Account
              </Link>
            </>
          )}

          {/* Auth: Signed In — Avatar + Dropdown */}
          {isAuthenticated && (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 focus:outline-none transition hover:opacity-80"
                aria-label="User menu"
                aria-expanded={profileOpen}
              >
                {/* Avatar */}
                {user?.avatar ? (
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#5B21B6]">
                    <Image
                      src={user.avatar}
                      alt={user.name || "User"}
                      width={36}
                      height={36}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#5B21B6] text-white flex items-center justify-center text-sm font-bold border-2 border-[#5B21B6]">
                    {getInitials(user?.name)}
                  </div>
                )}
                <span className="hidden lg:inline text-sm font-medium text-[#1E293B] max-w-[120px] truncate">
                  {user?.name}
                </span>
                <FiChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-60 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  {/* User info */}
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <p className="text-sm font-semibold text-[#1E293B] truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-[#6B7280] truncate">
                      {user?.email}
                    </p>
                  </div>

                  {/* Dropdown links */}
                  <div className="py-1">
                    {profileDropdownLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#1E293B] hover:bg-gray-50 hover:text-[#0D9488] transition"
                        onClick={() => setProfileOpen(false)}
                      >
                        <item.icon className="w-4 h-4 text-gray-400" />
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100" />

                  {/* Sign Out */}
                  <button
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <FiLogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <FiX className="w-7 h-7" />
          ) : (
            <FiMenu className="w-7 h-7" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#5B21B6] bg-[#FAFAFA] py-4 px-4 space-y-3">
          {/* Mobile search */}
          <form action="/search" method="GET" className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              name="q"
              placeholder="Search jobs, companies..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-700 placeholder-gray-400"
            />
          </form>

          {/* Nav links */}
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block text-[#1E293B] hover:text-[#0D9488] transition"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {/* Auth section */}
          <div className="border-t border-[#0D9488] pt-3 mt-2">
            {!isAuthenticated ? (
              <>
                <div className="text-sm font-semibold text-[#1E293B] mb-1">Sign In</div>
                <div className="text-xs mb-3 text-[#6B7280]">
                  Access your account
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center px-4 py-2.5 rounded-full text-sm font-semibold border-2 border-[#5B21B6] text-[#5B21B6] hover:bg-[#5B21B6] hover:text-white transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center px-4 py-2.5 rounded-full text-sm font-semibold bg-[#5B21B6] text-white hover:bg-[#4a1a94] transition"
                  >
                    Create Account
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* User card */}
                <div className="flex items-center gap-3 mb-3">
                  {user?.avatar ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#5B21B6] flex-shrink-0">
                      <Image
                        src={user.avatar}
                        alt={user.name || "User"}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#5B21B6] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {getInitials(user?.name)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#1E293B] truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-[#6B7280] truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* Dashboard links */}
                {profileDropdownLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2.5 py-2 text-sm text-[#1E293B] hover:text-[#0D9488] transition"
                    onClick={() => setMobileOpen(false)}
                  >
                    <item.icon className="w-4 h-4 text-gray-400" />
                    {item.label}
                  </Link>
                ))}

                {/* Sign Out */}
                <button
                  className="flex items-center gap-2.5 py-2 text-sm text-red-600"
                  onClick={handleSignOut}
                >
                  <FiLogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            )}
          </div>

          {/* WhatsApp button */}
          <div className="border-t border-[#0D9488] pt-3 mt-1">
            <Link
              href={siteConfig.whatsapp.links.general}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white px-4 py-2 rounded-full text-sm inline-flex items-center gap-2 transition bg-[#10b981] hover:bg-[#059669] w-full justify-center"
              onClick={() => setMobileOpen(false)}
            >
              <FaWhatsapp />
              Chat on WhatsApp
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
