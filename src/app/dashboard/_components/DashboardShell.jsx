"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import DashboardHeader from "./DashboardHeader";
import DashboardBanner from "./DashboardBanner";
import { useAuth } from "@/lib/useSession";

export default function DashboardShell({ children }) {
  const { user, isLoading } = useAuth();

  return (
    <SidebarProvider>
      <AppSidebar user={user} isLoading={isLoading} />
      <SidebarInset>
        <DashboardHeader user={user} isLoading={isLoading} />
        <div className="flex flex-1 flex-col">
          <div className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="mb-6">
              <DashboardBanner />
            </div>
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
