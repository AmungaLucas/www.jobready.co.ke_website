"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  Bookmark,
  Bell,
  User,
  Briefcase,
  PlusCircle,
  Users,
  Building2,
  CreditCard,
  Settings,
  LogOut,
  Package,
} from "lucide-react";

function getInitials(name) {
  if (!name) return "U";
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

// Job Seeker navigation items
const JOB_SEEKER_NAV = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "My Applications", href: "/dashboard/applications", icon: FileText },
  { title: "Saved Jobs", href: "/dashboard/saved-jobs", icon: Bookmark },
  { title: "Job Alerts", href: "/dashboard/alerts", icon: Bell },
  { title: "My Orders", href: "/dashboard/orders", icon: Package },
  { title: "My CV / Profile", href: "/dashboard/profile", icon: User },
];

// Employer navigation items
const EMPLOYER_NAV = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "My Jobs", href: "/dashboard/jobs", icon: Briefcase },
  { title: "Post New Job", href: "/dashboard/jobs/new", icon: PlusCircle },
  { title: "Applications", href: "/dashboard/applications", icon: Users },
  { title: "Company Profile", href: "/dashboard/company", icon: Building2 },
  { title: "My Orders", href: "/dashboard/orders", icon: Package },
  { title: "Billing", href: "/dashboard/billing", icon: CreditCard },
];

// Shared navigation
const SHARED_NAV = [
  { title: "Account Settings", href: "/dashboard/settings", icon: Settings },
];

function NavItem({ item, isActive }) {
  const Icon = item.icon;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
        <Link href={item.href}>
          <Icon className="size-4 shrink-0" />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export default function AppSidebar({ user, isLoading }) {
  const pathname = usePathname();
  const { state } = useSidebar();

  const displayName = user?.name || "User";
  const displayInitials = getInitials(user?.name);
  const displayAvatar = user?.avatar || null;
  const role = user?.role || "JOB_SEEKER";
  const navItems = role === "EMPLOYER" ? EMPLOYER_NAV : JOB_SEEKER_NAV;
  const roleLabel = role === "EMPLOYER" ? "Employer" : "Job Seeker";

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (err) {
      console.error("[Auth] Sign out error:", err);
      window.location.href = "/";
    }
  };

  return (
    <Sidebar collapsible="offcanvas" variant="sidebar">
      {/* Logo Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-white">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-sidebar-foreground">JobReady</span>
                  <span className="text-xs text-sidebar-muted-foreground">.co.ke</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Main Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Shared / Settings */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SHARED_NAV.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with user info */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-semibold shrink-0">
                {displayInitials}
              </div>
              <div className="flex flex-col gap-0.5 leading-none min-w-0">
                <span className="text-sm font-medium text-sidebar-foreground truncate">
                  {displayName}
                </span>
                <span className="text-xs text-sidebar-muted-foreground truncate">{roleLabel}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Sign Out">
              <button onClick={handleSignOut} className="text-sidebar-muted-foreground hover:text-destructive cursor-pointer">
                <LogOut className="size-4 shrink-0" />
                <span>Sign Out</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
