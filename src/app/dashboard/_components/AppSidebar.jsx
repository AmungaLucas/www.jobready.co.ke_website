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
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
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
  ChevronRight,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Navigation definitions (no hardcoded badges)
const JOB_SEEKER_NAV = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "My Applications", href: "/dashboard/applications", icon: FileText, badgeKey: "applications" },
  { title: "Saved Jobs", href: "/dashboard/saved-jobs", icon: Bookmark, badgeKey: "savedJobs" },
  { title: "Job Alerts", href: "/dashboard/alerts", icon: Bell, badgeKey: "alerts" },
  { title: "My CV / Profile", href: "/dashboard/profile", icon: User },
];

const EMPLOYER_NAV = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "My Jobs", href: "/dashboard/jobs", icon: Briefcase, badgeKey: "myJobs" },
  { title: "Post New Job", href: "/dashboard/jobs/new", icon: PlusCircle },
  { title: "Applications", href: "/dashboard/applications", icon: Users, badgeKey: "applications" },
  { title: "Company Profile", href: "/dashboard/company", icon: Building2 },
  { title: "Billing", href: "/dashboard/billing", icon: CreditCard },
];

const SHARED_NAV = [
  { title: "Account Settings", href: "/dashboard/settings", icon: Settings },
];

const DEFAULT_USER = {
  name: "User",
  email: "",
  role: "JOB_SEEKER",
  avatar: null,
  initials: "U",
};

function NavItem({ item, isActive, badgeCount }) {
  const Icon = item.icon;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
        <Link href={item.href}>
          <Icon className="size-4" />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
      {badgeCount > 0 && (
        <SidebarMenuBadge>{badgeCount}</SidebarMenuBadge>
      )}
    </SidebarMenuItem>
  );
}

export default function AppSidebar({ user = DEFAULT_USER, badges }) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const navItems = user.role === "EMPLOYER" ? EMPLOYER_NAV : JOB_SEEKER_NAV;
  const roleLabel = user.role === "EMPLOYER" ? "Employer" : "Job Seeker";

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
                  badgeCount={badges?.[item.badgeKey] || 0}
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
                  badgeCount={0}
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
              <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-semibold">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="size-full rounded-full object-cover"
                  />
                ) : (
                  user.initials || user.name?.charAt(0)?.toUpperCase() || "U"
                )}
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="text-sm font-medium text-sidebar-foreground">
                  {user.name}
                </span>
                <span className="text-xs text-sidebar-muted-foreground">{roleLabel}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Sign Out">
              <a href="/api/auth/signout" className="text-sidebar-muted-foreground hover:text-destructive">
                <LogOut className="size-4" />
                <span>Sign Out</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
