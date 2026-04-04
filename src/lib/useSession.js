"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useMemo } from "react";

/**
 * Custom auth hook wrapping NextAuth's useSession.
 * Provides convenient boolean flags and auth action helpers.
 *
 * Usage:
 *   const { user, isAuthenticated, isLoading, isJobSeeker, login, logout } = useAuth();
 */
export function useAuth() {
  const { data: session, status, update } = useSession();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const isUnauthenticated = status === "unauthenticated";

  const user = useMemo(() => {
    if (!session?.user) return null;
    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      phone: session.user.phone,
      avatar: session.user.avatar,
      role: session.user.role || "JOB_SEEKER",
      emailVerified: session.user.emailVerified || false,
      phoneVerified: session.user.phoneVerified || false,
      profileComplete: session.user.profileComplete || false,
    };
  }, [session]);

  const isJobSeeker = isAuthenticated && !!user;

  return {
    // State
    user,
    session,
    isLoading,
    isAuthenticated,
    isUnauthenticated,
    isJobSeeker,

    // Actions
    login: async (credentials) => {
      return signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });
    },

    loginWithRedirect: async (credentials) => {
      return signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        callbackUrl: credentials.callbackUrl || "/dashboard",
      });
    },

    logout: async (options) => {
      return signOut({
        redirect: options?.redirect !== false,
        callbackUrl: options?.callbackUrl || "/login",
      });
    },

    // Refresh session data from server
    refresh: async () => {
      return update();
    },
  };
}
