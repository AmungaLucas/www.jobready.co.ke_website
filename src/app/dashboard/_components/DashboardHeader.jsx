"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { signOut } from "next-auth/react";
import { User, Settings, LogOut } from "lucide-react";

// Map dashboard paths to breadcrumb labels
const BREADCRUMB_MAP = {
  "/dashboard": "Overview",
  "/dashboard/applications": "My Applications",
  "/dashboard/saved-jobs": "Saved Jobs",
  "/dashboard/alerts": "Job Alerts",
  "/dashboard/profile": "My CV / Profile",
  "/dashboard/jobs": "My Jobs",
  "/dashboard/jobs/new": "Post New Job",
  "/dashboard/company": "Company Profile",
  "/dashboard/billing": "Billing",
  "/dashboard/orders": "My Orders",
  "/dashboard/settings": "Account Settings",
};

function buildBreadcrumbs(pathname) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return [];

  const crumbs = [{ label: "Dashboard", href: "/dashboard" }];

  if (segments.length > 1) {
    const exactLabel = BREADCRUMB_MAP[pathname];
    if (exactLabel) {
      crumbs.push({ label: exactLabel, href: pathname });
    } else {
      let currentPath = "";
      for (let i = 1; i < segments.length; i++) {
        currentPath += `/${segments[i]}`;
        const label = BREADCRUMB_MAP[currentPath] || segments[i].replace(/-/g, " ");
        crumbs.push({ label, href: currentPath });
      }
    }
  }

  return crumbs;
}

function getInitials(name) {
  if (!name) return "U";
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function DashboardHeader({ user, isLoading }) {
  const pathname = usePathname();
  const { openMobile, setOpenMobile } = useSidebar();
  const crumbs = buildBreadcrumbs(pathname);

  const currentPageLabel = crumbs.length > 0 ? crumbs[crumbs.length - 1].label : "Dashboard";

  const displayName = user?.name || "User";
  const displayEmail = user?.email || "";
  const displayInitials = getInitials(user?.name);
  const displayAvatar = user?.avatar || null;
  const roleLabel = user?.role === "EMPLOYER" ? "Employer" : "Job Seeker";

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (err) {
      console.error("[Auth] Sign out error:", err);
      window.location.href = "/";
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-white px-4 md:px-6">
      {/* Left side: Sidebar trigger + breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <SidebarTrigger className="-ml-1 shrink-0" onClick={() => setOpenMobile(!openMobile)} />
        <Separator orientation="vertical" className="h-5" />
        <Breadcrumb className="hidden sm:flex">
          <BreadcrumbList>
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1;

              return (
                <span key={crumb.href} className="contents">
                  {index > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={crumb.href}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </span>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
        {/* Mobile page title */}
        <span className="text-sm font-medium sm:hidden">{currentPageLabel}</span>
      </div>

      {/* Right side: User dropdown */}
      <div className="ml-auto shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-8 w-8">
                {displayAvatar && <AvatarImage src={displayAvatar} alt={displayName} />}
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {displayInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{displayName}</p>
                <p className="text-xs leading-none text-muted-foreground">{displayEmail}</p>
                <p className="text-xs mt-1">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {roleLabel}
                  </span>
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">
                  <User className="mr-2 size-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 size-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleSignOut}>
              <LogOut className="mr-2 size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
