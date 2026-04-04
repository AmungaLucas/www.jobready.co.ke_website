"use client";

import { useSession, SessionProvider } from "next-auth/react";
import { SidebarProvider, SidebarInset, SidebarRail } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import DashboardHeader from "./DashboardHeader";
function DashboardShellInner({ children }) {
  const { data: session, status } = useSession();

  // Build user object from session
  const user = session?.user
    ? {
        name: session.user.name || "User",
        email: session.user.email || "",
        role: session.user.role || "JOB_SEEKER",
        avatar: session.user.image || session.user.avatar || null,
        initials: (session.user.name || "U")
          .split(" ")
          .map((w) => w[0])
          .slice(0, 2)
          .join("")
          .toUpperCase(),
      }
    : null;

  // Show loading while session loads
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <DashboardHeader user={user} />
        <div className="flex flex-1 flex-col">
          <div className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </div>
      </SidebarInset>
      <SidebarRail />
    </SidebarProvider>
  );
}

export default function DashboardShell({ children }) {
  return (
    <SessionProvider>
      <DashboardShellInner>{children}</DashboardShellInner>
    </SessionProvider>
  );
}
