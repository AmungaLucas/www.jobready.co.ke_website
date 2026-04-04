"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Building2,
  MapPin,
  Calendar,
  Clock,
  ExternalLink,
  Filter,
  Search,
  Briefcase,
  ArrowUpDown,
} from "lucide-react";
import { formatDate } from "@/lib/format";

// ── Mock Data ──────────────────────────────────────────
const MOCK_APPLICATIONS = [
  {
    id: 1,
    jobTitle: "Senior Software Engineer",
    company: "Safaricom PLC",
    companyLogo: null,
    companyInitials: "SC",
    companyColor: "bg-green-600",
    location: "Nairobi, Kenya",
    type: "Full-Time",
    appliedDate: "2026-03-28",
    status: "SHORTLISTED",
    salary: "KSh 180K - 250K",
  },
  {
    id: 2,
    jobTitle: "Data Analyst",
    company: "Equity Bank",
    companyLogo: null,
    companyInitials: "EB",
    companyColor: "bg-yellow-600",
    location: "Nairobi, Kenya",
    type: "Full-Time",
    appliedDate: "2026-03-25",
    status: "INTERVIEW",
    salary: "KSh 120K - 160K",
  },
  {
    id: 3,
    jobTitle: "Product Manager",
    company: "KCB Group",
    companyLogo: null,
    companyInitials: "KC",
    companyColor: "bg-blue-600",
    location: "Nairobi, Kenya",
    type: "Full-Time",
    appliedDate: "2026-03-20",
    status: "APPLIED",
    salary: "KSh 200K - 300K",
  },
  {
    id: 4,
    jobTitle: "Marketing Communications Manager",
    company: "Airtel Kenya",
    companyLogo: null,
    companyInitials: "AK",
    companyColor: "bg-red-600",
    location: "Nairobi, Kenya",
    type: "Full-Time",
    appliedDate: "2026-03-15",
    status: "REJECTED",
    salary: "KSh 150K - 200K",
  },
  {
    id: 5,
    jobTitle: "Frontend Developer",
    company: "KPMG East Africa",
    companyLogo: null,
    companyInitials: "KP",
    companyColor: "bg-indigo-600",
    location: "Nairobi, Kenya",
    type: "Contract",
    appliedDate: "2026-03-10",
    status: "APPLIED",
    salary: "KSh 140K - 180K",
  },
  {
    id: 6,
    jobTitle: "IT Support Specialist",
    company: "Kenya Airways",
    companyLogo: null,
    companyInitials: "KA",
    companyColor: "bg-red-700",
    location: "Nairobi, Kenya",
    type: "Full-Time",
    appliedDate: "2026-03-05",
    status: "SHORTLISTED",
    salary: "KSh 80K - 120K",
  },
  {
    id: 7,
    jobTitle: "Finance Graduate Trainee",
    company: "PwC Kenya",
    companyLogo: null,
    companyInitials: "PW",
    companyColor: "bg-amber-700",
    location: "Nairobi, Kenya",
    type: "Full-Time",
    appliedDate: "2026-02-28",
    status: "APPLIED",
    salary: null,
  },
  {
    id: 8,
    jobTitle: "Cybersecurity Analyst",
    company: "NCBA Group",
    companyLogo: null,
    companyInitials: "NC",
    companyColor: "bg-orange-600",
    location: "Nairobi, Kenya",
    type: "Full-Time",
    appliedDate: "2026-02-20",
    status: "REJECTED",
    salary: "KSh 160K - 220K",
  },
];

// Status badge config
const STATUS_CONFIG = {
  APPLIED: {
    label: "Applied",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  SHORTLISTED: {
    label: "Shortlisted",
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },
  INTERVIEW: {
    label: "Interview",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  OFFERED: {
    label: "Offered",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

// ── Component ──────────────────────────────────────────
export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredApps =
    activeTab === "all"
      ? MOCK_APPLICATIONS
      : MOCK_APPLICATIONS.filter((app) => app.status === activeTab);

  const statusCounts = MOCK_APPLICATIONS.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Applications</h1>
          <p className="text-muted-foreground">
            Track and manage your job applications
          </p>
        </div>
        <Badge variant="outline" className="w-fit text-sm">
          {MOCK_APPLICATIONS.length} Total Applications
        </Badge>
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto gap-1 bg-muted/50 p-1">
          <TabsTrigger value="all" className="text-sm">
            All ({MOCK_APPLICATIONS.length})
          </TabsTrigger>
          <TabsTrigger value="APPLIED" className="text-sm">
            Applied ({statusCounts["APPLIED"] || 0})
          </TabsTrigger>
          <TabsTrigger value="SHORTLISTED" className="text-sm">
            Shortlisted ({statusCounts["SHORTLISTED"] || 0})
          </TabsTrigger>
          <TabsTrigger value="INTERVIEW" className="text-sm">
            Interview ({statusCounts["INTERVIEW"] || 0})
          </TabsTrigger>
          <TabsTrigger value="REJECTED" className="text-sm">
            Rejected ({statusCounts["REJECTED"] || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredApps.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {filteredApps.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ApplicationCard({ application }) {
  const statusConfig = STATUS_CONFIG[application.status] || STATUS_CONFIG.APPLIED;

  return (
    <Card className="py-0 gap-0">
      <CardContent className="p-4 md:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* Left: Company logo + details */}
          <div className="flex gap-3 min-w-0">
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-lg text-white text-xs font-bold ${application.companyColor}`}
            >
              {application.companyInitials}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm truncate">{application.jobTitle}</h3>
              <p className="text-sm text-muted-foreground">{application.company}</p>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3" />
                  {application.location}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="size-3" />
                  {application.type}
                </span>
                {application.salary && (
                  <span>{application.salary}</span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Status + date + action */}
          <div className="flex flex-row items-center gap-3 sm:flex-col sm:items-end shrink-0">
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusConfig.className}`}
            >
              {statusConfig.label}
            </span>
            <p className="text-xs text-muted-foreground">
              Applied {formatDate(application.appliedDate)}
            </p>
            <Button variant="ghost" size="sm" className="text-xs h-7">
              <ExternalLink className="size-3 mr-1" />
              View Job
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <FileText className="size-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No applications found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          {`You haven't applied to any jobs in this category yet. Start exploring opportunities on our job board.`}
        </p>
        <Button asChild className="mt-4">
          <Link href="/jobs">Browse Jobs</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
