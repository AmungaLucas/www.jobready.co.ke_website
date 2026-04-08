"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FiUser, FiMenu, FiX } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { siteConfig } from "@/config/site-config";

const profileDropdownLinks = [
  { label: "My Dashboard", href: "/dashboard" },
  { label: "My Profile", href: "/dashboard/profile" },
  { label: "Saved Jobs", href: "/dashboard/saved-jobs" },
  { label: "Job Alerts", href: "/dashboard/alerts" },
];

export default function Header() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const profileRef = useRef(null);

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

  // Close mobile menu on route change / escape
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

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
        <div className="hidden md:flex items-center space-x-4">
          {/* WhatsApp button */}
          <Link
            href={siteConfig.whatsapp.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white px-4 py-1.5 rounded-full text-sm flex items-center gap-2 transition bg-[#10b981] hover:bg-[#059669]"
          >
            <FaWhatsapp />
            WhatsApp
          </Link>

          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="focus:outline-none text-[#5B21B6] hover:text-[#4a1a94] transition"
              aria-label="User menu"
              aria-expanded={profileOpen}
            >
              <FiUser className="w-6 h-6" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#0D9488] rounded-lg shadow-lg z-50">
                {/* User info / Sign In */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <Link
                    href="/login"
                    className="block text-sm font-semibold text-[#1E293B] hover:text-[#0D9488] transition"
                    onClick={() => setProfileOpen(false)}
                  >
                    Sign In
                  </Link>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Access your account
                  </p>
                </div>

                {/* Dropdown links */}
                {profileDropdownLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 text-sm text-[#1E293B] hover:bg-gray-50 hover:text-[#0D9488] transition"
                    onClick={() => setProfileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Divider */}
                <div className="border-t border-gray-100" />

                {/* Sign Out */}
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition"
                  onClick={() => setProfileOpen(false)}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
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

          {/* User section */}
          <div className="border-t border-[#0D9488] pt-2 mt-2">
            <div className="text-sm font-semibold text-[#1E293B]">Sign In</div>
            <div className="text-xs mb-2 text-[#6B7280]">
              Access your account
            </div>
            {profileDropdownLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-1 text-[#1E293B] hover:text-[#0D9488] transition"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <button
              className="block py-1 text-red-600"
              onClick={() => setMobileOpen(false)}
            >
              Sign Out
            </button>
          </div>

          {/* WhatsApp button */}
          <div className="border-t border-[#0D9488] pt-2 mt-2">
            <Link
              href={siteConfig.whatsapp.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white px-4 py-1.5 rounded-full text-sm inline-flex items-center gap-2 transition bg-[#10b981] hover:bg-[#059669]"
              onClick={() => setMobileOpen(false)}
            >
              <FaWhatsapp />
              WhatsApp
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
