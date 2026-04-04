"use client";

import { SidebarProvider, SidebarInset, SidebarRail } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import DashboardHeader from "./DashboardHeader";

export default function DashboardShell({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
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
