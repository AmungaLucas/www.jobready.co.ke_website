"use client";

import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  User,
  Lock,
  Bell,
  Shield,
  Mail,
  Phone,
  Save,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/useSession";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function SettingsContent() {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account, security, and notification preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="account" className="text-sm gap-2">
            <User className="size-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="password" className="text-sm gap-2">
            <Lock className="size-4" />
            <span className="hidden sm:inline">Password</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-sm gap-2">
            <Bell className="size-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="danger" className="text-sm gap-2">
            <Shield className="size-4" />
            <span className="hidden sm:inline">Danger</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>

        <TabsContent value="password">
          <PasswordSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="danger">
          <DangerZone />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ── Account Settings ──────────────────────────────────
function AccountSettings() {
  const { user, refresh } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState("");

  // Populate form from session user
  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  if (!user) {
    return (
      <Card>
        <CardContent className="py-12 flex items-center justify-center">
          <Loader2 className="animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const handleSave = async () => {
    setError("");
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update name");
        return;
      }
      setIsSaved(true);
      await refresh();
      setTimeout(() => setIsSaved(false), 3000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const hasPassword = user.hasPassword;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
          <CardDescription>
            Update your account details. Your name is visible on applications and your public profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => { setName(e.target.value); setIsSaved(false); }}
              placeholder="Your full name"
            />
          </div>

          <Separator />

          {/* Email — read-only display */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Mail className="size-4 text-muted-foreground" />
                Email Address
              </Label>
              {user.emailVerified ? (
                <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                  Verified
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                  Unverified
                </Badge>
              )}
            </div>
            <Input
              type="email"
              value={user.email || ""}
              disabled
              className="bg-muted/50"
            />
            <p className="text-xs text-muted-foreground">
              Email is managed through your authentication provider.
            </p>
          </div>

          {/* Phone — read-only display */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Phone className="size-4 text-muted-foreground" />
                Phone Number
              </Label>
              {user.phone ? (
                user.phoneVerified ? (
                  <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                    Unverified
                  </Badge>
                )
              ) : (
                <Badge variant="outline" className="text-xs bg-gray-50 text-gray-500 border-gray-200">
                  Not set
                </Badge>
              )}
            </div>
            <Input
              type="tel"
              value={user.phone ? `${user.phone}` : "Not added"}
              disabled
              className="bg-muted/50"
            />
          </div>

          {/* Auth Methods Summary */}
          <Separator />
          <div className="space-y-2">
            <Label className="text-sm font-medium">Sign-in Methods</Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                {hasPassword ? "✓ Email & Password" : "✗ No Password Set"}
              </Badge>
              {user.phone && (
                <Badge variant="secondary" className="text-xs">
                  ✓ Phone OTP
                </Badge>
              )}
              {!user.phone && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  ✗ Phone
                </Badge>
              )}
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : isSaved ? (
                <>
                  <CheckCircle2 className="mr-2 size-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="mr-2 size-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Password Settings ──────────────────────────────────
function PasswordSettings() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setApiError("");
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.currentPassword) newErrors.currentPassword = "Current password is required";
    if (!form.newPassword) newErrors.newPassword = "New password is required";
    if (form.newPassword.length < 8) newErrors.newPassword = "Password must be at least 8 characters";
    if (form.newPassword !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    setApiError("");

    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error || "Failed to change password");
        return;
      }

      setIsSaved(true);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setIsSaved(false), 3000);
    } catch {
      setApiError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Show "set password" if user has no password
  if (user && !user.hasPassword) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Password</CardTitle>
          <CardDescription>
            You haven&apos;t set a password for your account yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-sm text-blue-700 mb-3">
              Setting a password lets you sign in with your email even when you don&apos;t have access to your Google account or phone.
            </p>
            <Button asChild variant="outline">
              <a href="/set-password">Set a Password</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Change Password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure. Use a strong password with at least 8 characters.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrent ? "text" : "password"}
                placeholder="Enter current password"
                value={form.currentPassword}
                onChange={(e) => updateField("currentPassword", e.target.value)}
                className={errors.currentPassword ? "border-destructive pr-9" : "pr-9"}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-xs text-destructive">{errors.currentPassword}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                value={form.newPassword}
                onChange={(e) => updateField("newPassword", e.target.value)}
                className={errors.newPassword ? "border-destructive pr-9" : "pr-9"}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-destructive">{errors.newPassword}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                value={form.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                className={errors.confirmPassword ? "border-destructive pr-9" : "pr-9"}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">{errors.confirmPassword}</p>
            )}
          </div>

          {apiError && (
            <p className="text-sm text-destructive">{apiError}</p>
          )}

          <Separator />

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Updating...
                </>
              ) : isSaved ? (
                <>
                  <CheckCircle2 className="mr-2 size-4" />
                  Updated!
                </>
              ) : (
                <>
                  <Lock className="mr-2 size-4" />
                  Update Password
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// ── Notification Settings ──────────────────────────────
function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    jobAlerts: true,
    applicationUpdates: true,
    newsletter: false,
    employerMessages: true,
    profileViews: false,
    newFeatures: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const toggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    setIsSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: wire to API when notification preferences are stored in DB
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Email Notifications</CardTitle>
        <CardDescription>
          Choose which emails you&apos;d like to receive from JobReady.co.ke
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        {[
          {
            key: "jobAlerts",
            label: "Job Alerts",
            description: "Receive daily or weekly emails when new jobs match your alert criteria",
          },
          {
            key: "applicationUpdates",
            label: "Application Updates",
            description: "Get notified when your application status changes (shortlisted, interview, etc.)",
          },
          {
            key: "employerMessages",
            label: "Employer Messages",
            description: "Receive messages and interview invitations from employers",
          },
          {
            key: "profileViews",
            label: "Profile View Notifications",
            description: "Get notified when an employer views your profile",
          },
          {
            key: "newFeatures",
            label: "Product Updates",
            description: "Learn about new features and improvements on JobReady.co.ke",
          },
          {
            key: "newsletter",
            label: "Career Newsletter",
            description: "Weekly career tips, job market insights, and featured opportunities",
          },
        ].map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/50"
          >
            <div className="flex-1 pr-4">
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
            </div>
            <Switch
              checked={notifications[item.key]}
              onCheckedChange={() => toggle(item.key)}
            />
          </div>
        ))}

        <Separator className="my-4" />

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : isSaved ? (
              <>
                <CheckCircle2 className="mr-2 size-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                Save Preferences
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Danger Zone ────────────────────────────────────────
function DangerZone() {
  const { user } = useAuth();
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    setDeleteError("");
    if (!deletePassword) {
      setDeleteError("Enter your password to confirm");
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch("/api/user/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmPassword: deletePassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setDeleteError(data.error || "Failed to delete account");
        return;
      }

      // Account deleted — sign out
      await signOut({ callbackUrl: "/" });
    } catch {
      setDeleteError("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="text-lg text-destructive flex items-center gap-2">
          <AlertTriangle className="size-5" />
          Danger Zone
        </CardTitle>
        <CardDescription>
          Irreversible and destructive actions. Please proceed with caution.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Deactivate Account */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-lg border p-4">
          <div>
            <h4 className="font-medium text-sm">Deactivate Account</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Temporarily disable your account. You can reactivate it later by signing in.
            </p>
          </div>
          <Button variant="outline" className="shrink-0 text-amber-600 border-amber-300 hover:bg-amber-50" disabled>
            Coming Soon
          </Button>
        </div>

        {/* Delete Account */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <div>
            <h4 className="font-medium text-sm text-destructive">Delete Account</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Permanently delete your account, all your data, applications, and saved jobs. This action cannot be undone.
            </p>
          </div>
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="shrink-0">
                <Trash2 className="mr-2 size-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-destructive">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove all of your data from our servers, including:
                </AlertDialogDescription>
              </AlertDialogHeader>
              <ul className="text-sm text-muted-foreground space-y-1 pl-1">
                <li>• All job applications you&apos;ve submitted</li>
                <li>• Your saved jobs and job alerts</li>
                <li>• Your CV / profile information</li>
                <li>• Your billing and order history</li>
              </ul>

              {!user?.hasPassword ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-700">
                    Your account doesn&apos;t have a password set. Account deletion with no password is not supported yet — please set a password first.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="deletePassword" className="text-sm">
                    Enter your password to confirm
                  </Label>
                  <Input
                    id="deletePassword"
                    type="password"
                    placeholder="Your current password"
                    value={deletePassword}
                    onChange={(e) => { setDeletePassword(e.target.value); setDeleteError(""); }}
                  />
                  {deleteError && (
                    <p className="text-xs text-destructive">{deleteError}</p>
                  )}
                </div>
              )}

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-white hover:bg-destructive/90"
                  onClick={handleDelete}
                  disabled={isDeleting || (!user?.hasPassword)}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Yes, Delete My Account"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
