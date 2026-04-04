"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Bell,
  PlusCircle,
  Search,
  MapPin,
  Clock,
  Trash2,
  Mail,
  Tag,
  X,
  BellRing,
  BellOff,
} from "lucide-react";
import { formatDate } from "@/lib/format";

// ── Mock Data ──────────────────────────────────────────
const INITIAL_ALERTS = [
  {
    id: 1,
    keyword: "Software Engineer",
    location: "Nairobi, Kenya",
    category: "Technology",
    frequency: "DAILY",
    isActive: true,
    createdAt: "2026-03-01",
    lastTriggered: "2026-03-28",
    jobsFound: 12,
  },
  {
    id: 2,
    keyword: "Data Analyst",
    location: "",
    category: "Finance & Accounting",
    frequency: "WEEKLY",
    isActive: true,
    createdAt: "2026-02-20",
    lastTriggered: "2026-03-24",
    jobsFound: 8,
  },
  {
    id: 3,
    keyword: "Product Manager",
    location: "Kenya",
    category: "",
    frequency: "DAILY",
    isActive: false,
    createdAt: "2026-01-15",
    lastTriggered: "2026-03-10",
    jobsFound: 3,
  },
];

const CATEGORIES = [
  "Technology",
  "Finance & Accounting",
  "Engineering",
  "Healthcare",
  "Education",
  "Marketing",
  "Government",
  "NGO",
  "HR",
  "Creative Design",
  "Legal",
  "Logistics",
  "Customer Service",
  "Consulting",
];

export default function AlertsContent() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAlert, setNewAlert] = useState({
    keyword: "",
    location: "",
    category: "",
    frequency: "DAILY",
  });

  const toggleAlert = (id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
  };

  const deleteAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleCreateAlert = () => {
    if (!newAlert.keyword.trim()) return;
    const alert = {
      id: Date.now(),
      ...newAlert,
      isActive: true,
      createdAt: new Date().toISOString().split("T")[0],
      lastTriggered: null,
      jobsFound: 0,
    };
    setAlerts((prev) => [...prev, alert]);
    setNewAlert({ keyword: "", location: "", category: "", frequency: "DAILY" });
    setDialogOpen(false);
  };

  const activeAlerts = alerts.filter((a) => a.isActive);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Job Alerts</h1>
          <p className="text-muted-foreground">
            Get notified when new jobs matching your criteria are posted
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 size-4" />
              Create New Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Create Job Alert</DialogTitle>
              <DialogDescription>
                Set up alerts to receive notifications when new jobs match your preferences.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="alertKeyword">
                  Keywords <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="alertKeyword"
                    placeholder="e.g., Software Engineer, Accounting, Project Manager"
                    className="pl-9"
                    value={newAlert.keyword}
                    onChange={(e) =>
                      setNewAlert((prev) => ({ ...prev, keyword: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alertLocation" className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-muted-foreground" />
                  Location (Optional)
                </Label>
                <Input
                  id="alertLocation"
                  placeholder="e.g., Nairobi, Mombasa, or leave empty for all"
                  value={newAlert.location}
                  onChange={(e) =>
                    setNewAlert((prev) => ({ ...prev, location: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alertCategory" className="flex items-center gap-1.5">
                  <Tag className="size-3.5 text-muted-foreground" />
                  Category (Optional)
                </Label>
                <Select
                  value={newAlert.category}
                  onValueChange={(v) =>
                    setNewAlert((prev) => ({ ...prev, category: v }))
                  }
                >
                  <SelectTrigger id="alertCategory">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alertFrequency" className="flex items-center gap-1.5">
                  <Clock className="size-3.5 text-muted-foreground" />
                  Frequency
                </Label>
                <Select
                  value={newAlert.frequency}
                  onValueChange={(v) =>
                    setNewAlert((prev) => ({ ...prev, frequency: v }))
                  }
                >
                  <SelectTrigger id="alertFrequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DAILY">Daily</SelectItem>
                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAlert} disabled={!newAlert.keyword.trim()}>
                <Bell className="mr-2 size-4" />
                Create Alert
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <BellRing className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeAlerts.length}</p>
                <p className="text-xs text-muted-foreground">Active Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-secondary/10 p-2.5">
                <Mail className="size-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {alerts.reduce((sum, a) => sum + a.jobsFound, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Jobs Found</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-100 p-2.5">
                <BellOff className="size-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {alerts.filter((a) => !a.isActive).length}
                </p>
                <p className="text-xs text-muted-foreground">Paused Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      {alerts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Bell className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No job alerts yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Create a job alert to get notified when new jobs matching your criteria are posted. Never miss an opportunity again!
            </p>
            <Button className="mt-4" onClick={() => setDialogOpen(true)}>
              <PlusCircle className="mr-2 size-4" />
              Create Your First Alert
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Card
              key={alert.id}
              className={!alert.isActive ? "opacity-60" : ""}
            >
              <CardContent className="p-4 md:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Left: Alert details */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div
                      className={`mt-0.5 rounded-lg p-2 shrink-0 ${
                        alert.isActive
                          ? "bg-primary/10"
                          : "bg-muted"
                      }`}
                    >
                      {alert.isActive ? (
                        <Bell className="size-4 text-primary" />
                      ) : (
                        <BellOff className="size-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm">
                          &quot;{alert.keyword}&quot;
                        </h3>
                        <Badge
                          variant="outline"
                          className="text-xs"
                        >
                          {alert.frequency}
                        </Badge>
                        {!alert.isActive && (
                          <Badge variant="secondary" className="text-xs">
                            Paused
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        {alert.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3" />
                            {alert.location}
                          </span>
                        )}
                        {alert.category && (
                          <span className="flex items-center gap-1">
                            <Tag className="size-3" />
                            {alert.category}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Mail className="size-3" />
                          {alert.jobsFound} jobs found
                        </span>
                        {alert.lastTriggered && (
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            Last: {formatDate(alert.lastTriggered)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Toggle + Delete */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={alert.isActive}
                        onCheckedChange={() => toggleAlert(alert.id)}
                      />
                      <span className="text-xs text-muted-foreground hidden sm:inline">
                        {alert.isActive ? "On" : "Off"}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteAlert(alert.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Note */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Mail className="size-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                How Job Alerts Work
              </p>
              <p className="text-xs text-blue-800 mt-1">
                We&apos;ll send you an email notification whenever a new job matching your keywords
                and filters is posted. You can create up to 10 alerts and manage them anytime from
                this page. Daily alerts are sent at 8:00 AM EAT, weekly alerts on Mondays.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
