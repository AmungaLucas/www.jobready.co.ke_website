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
} from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

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

      {/* OTP Verification Modal Overlay */}
      <PhoneVerificationDialog />

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

        {/* ── Account Tab ────────────────────────────── */}
        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>

        {/* ── Password Tab ────────────────────────────── */}
        <TabsContent value="password">
          <PasswordSettings />
        </TabsContent>

        {/* ── Notifications Tab ──────────────────────── */}
        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        {/* ── Danger Zone Tab ─────────────────────────── */}
        <TabsContent value="danger">
          <DangerZone />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ── Phone Verification Dialog (global state) ─────────
let globalPhoneVerify = { open: false, phone: "", onVerified: null };
export function triggerPhoneVerification(phone, onVerified) {
  globalPhoneVerify = { open: true, phone, onVerified };
  window.dispatchEvent(new CustomEvent("phone-verify-change"));
}

function PhoneVerificationDialog() {
  const [state, setState] = useState({ open: false, phone: "" });
  const [otp, setOtp] = useState("".padEnd(6, ""));
  const [step, setStep] = useState("idle"); // idle | sending | sent | verifying | done | error
  const [errorMsg, setErrorMsg] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [onVerified, setOnVerified] = useState(null);

  useEffect(() => {
    const handler = () => {
      setState({ ...globalPhoneVerify });
      setOnVerified(() => globalPhoneVerify.onVerified);
      if (globalPhoneVerify.open) {
        setStep("idle");
        setOtp("".padEnd(6, ""));
        setErrorMsg("");
        setCountdown(0);
      }
    };
    window.addEventListener("phone-verify-change", handler);
    return () => window.removeEventListener("phone-verify-change", handler);
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const handleSendOtp = async () => {
    if (!state.phone) return;
    const normalized = state.phone.replace(/[\s\-\+]/g, "");
    const finalPhone = normalized.startsWith("0")
      ? "254" + normalized.substring(1)
      : normalized;

    setStep("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: finalPhone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to send OTP");
        setStep("idle");
        return;
      }
      setStep("sent");
      setCountdown(60);
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStep("idle");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const cleanOtp = otp.replace(/\s/g, "");
    if (cleanOtp.length !== 6) {
      setErrorMsg("Enter the complete 6-digit code");
      return;
    }
    const normalized = state.phone.replace(/[\s\-\+]/g, "");
    const finalPhone = normalized.startsWith("0")
      ? "254" + normalized.substring(1)
      : normalized;

    setStep("verifying");
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: finalPhone, otp: cleanOtp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Verification failed");
        setStep("sent");
        return;
      }
      setStep("done");
      toast.success("Phone number verified successfully!");
      if (onVerified) onVerified();
      setTimeout(() => {
        globalPhoneVerify = { open: false, phone: "", onVerified: null };
        window.dispatchEvent(new CustomEvent("phone-verify-change"));
      }, 1500);
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStep("sent");
    }
  };

  const handleClose = () => {
    globalPhoneVerify = { open: false, phone: "", onVerified: null };
    window.dispatchEvent(new CustomEvent("phone-verify-change"));
  };

  if (!state.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        {step === "done" ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-emerald-500" size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Phone Verified!</h3>
            <p className="text-sm text-gray-500">Your phone number has been successfully verified.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Verify Phone Number</h3>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>

            {step === "idle" && (
              <div>
                <p className="text-sm text-gray-500 mb-4">
                  We&apos;ll send a 6-digit code to <span className="font-semibold text-gray-800">+{state.phone}</span>
                </p>
                <Button onClick={handleSendOtp} className="w-full" disabled={step === "sending"}>
                  {step === "sending" ? "Sending..." : "Send Verification Code"}
                </Button>
              </div>
            )}

            {(step === "sent" || step === "verifying") && (
              <form onSubmit={handleVerify}>
                <p className="text-sm text-gray-500 mb-4">
                  Enter the code sent to <span className="font-semibold text-gray-800">+{state.phone}</span>
                </p>
                <div className="mb-4">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6).padEnd(6, " "))}
                    className="w-full text-center text-2xl tracking-[0.5em] font-mono border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
                    autoFocus
                  />
                </div>
                <Button type="submit" className="w-full" disabled={step === "verifying"}>
                  {step === "verifying" ? "Verifying..." : "Verify Code"}
                </Button>
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-500">
                    Didn&apos;t get it?{" "}
                    {countdown > 0 ? (
                      <span className="text-gray-400">Resend in {countdown}s</span>
                    ) : (
                      <button type="button" onClick={handleSendOtp} className="text-[#1a56db] hover:underline font-medium">
                        Resend Code
                      </button>
                    )}
                  </p>
                </div>
              </form>
            )}

            {errorMsg && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-sm text-red-600">{errorMsg}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Account Settings ──────────────────────────────────
function AccountSettings() {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const res = await fetch("/api/user/profile");
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        const u = data.user;
        setUser(u);
        const parts = (u.name || "").split(" ");
        const firstName = parts[0] || "";
        const lastName = parts.slice(1).join(" ") || "";
        setForm({
          firstName,
          lastName,
          email: u.email || "",
          phone: u.phone || "",
        });
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const normalizedPhone = form.phone.replace(/[\s\-\+]/g, "");
      const finalPhone = normalizedPhone
        ? (normalizedPhone.startsWith("0") ? "254" + normalizedPhone.substring(1) : normalizedPhone)
        : null;

      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`.trim(),
          bio: user?.bio,
          phone: finalPhone,
        }),
      });
      if (!res.ok) throw new Error("Failed to save profile");
      const data = await res.json();
      setUser(data.user);
      setIsSaved(true);
      toast.success("Profile updated successfully");
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      toast.error(err.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
          <CardDescription>
            Update your account details. Your name is visible on applications and your public profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                <div className="h-9 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
          <Separator />
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-28 animate-pulse rounded bg-muted" />
              <div className="h-9 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Personal Information</CardTitle>
        <CardDescription>
          Update your account details. Your name is visible on applications and your public profile.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
            />
          </div>
        </div>

        <Separator />

        {/* Email */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="size-4 text-muted-foreground" />
              Email Address
            </Label>
            <Badge variant="outline" className={user?.emailVerified ? "text-xs bg-emerald-50 text-emerald-700 border-emerald-200" : "text-xs bg-amber-50 text-amber-700 border-amber-200"}>
              {user?.emailVerified ? "Verified" : "Unverified"}
            </Badge>
          </div>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Changing your email will require re-verification. A confirmation link will be sent to your new address.
          </p>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="size-4 text-muted-foreground" />
              Phone Number
            </Label>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={user?.phoneVerified ? "text-xs bg-emerald-50 text-emerald-700 border-emerald-200" : "text-xs bg-amber-50 text-amber-700 border-amber-200"}>
                {user?.phoneVerified ? "Verified" : "Unverified"}
              </Badge>
              {form.phone && !user?.phoneVerified && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => {
                    const normalized = form.phone.replace(/[\s\-\+]/g, "");
                    if (/^(254|0)\d{9}$/.test(normalized)) {
                      const finalPhone = normalized.startsWith("0") ? "254" + normalized.substring(1) : normalized;
                      triggerPhoneVerification(finalPhone, () => {
                        setUser((prev) => prev ? { ...prev, phoneVerified: true } : prev);
                      });
                    } else {
                      toast.error("Enter a valid Kenyan phone number first (e.g. 2547XXXXXXXX)");
                    }
                  }}
                >
                  Verify
                </Button>
              )}
            </div>
          </div>
          <Input
            id="phone"
            placeholder="+254 7XX XXX XXX"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Enter your Kenyan phone number. Click &quot;Verify&quot; to confirm ownership via SMS.
          </p>
        </div>

        <Separator />

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
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
  );
}

// ── Password Settings ──────────────────────────────────
function PasswordSettings() {
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

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSaving(false);
    setIsSaved(true);
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setIsSaved(false), 3000);
  };

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

          <Separator />

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
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
                <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
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
          <Button variant="outline" className="shrink-0 text-amber-600 border-amber-300 hover:bg-amber-50">
            Deactivate
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
          <AlertDialog>
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
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90">
                  Yes, Delete My Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
