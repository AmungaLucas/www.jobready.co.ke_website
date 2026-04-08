"use client";

import { useEffect, useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/useSession";

/**
 * ProtectedRoute — wraps children requiring authentication.
 * - If not authenticated and not loading → redirects to /login?callbackUrl=...
 * - If loading → shows full-page spinner
 * - If authenticated → renders children
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const callbackUrl = encodeURIComponent(pathname);
      router.replace(`/login?callbackUrl=${callbackUrl}`);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  // Loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="w-10 h-10 border-3 border-gray-200 border-t-[#1a56db] rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading your session...</p>
        </div>
      </div>
    );
  }

  // Not authenticated — render nothing while redirect happens
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-gray-200 border-t-[#1a56db] rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Authenticated — render children
  return children;
}
