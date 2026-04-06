"use client";

import { useState, useEffect, useRef } from "react";
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
  Send,
  Plus,
  Pencil,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/useSession";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function SettingsContent() {
  const [activeTab, setActiveTab] = useState("account");

  // Handle hash-based navigation (e.g. #phone, #email from banner)
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === "phone" || hash === "email" || hash === "account") {
      setActiveTab("account");
      // Scroll to the relevant section after a brief delay for render
      setTimeout(() => {
        const el = document.getElementById(`settings-${hash}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, []);

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
  const emailSectionRef = useRef(null);
  const phoneSectionRef = useRef(null);
  const hashProcessed = useRef(false);

  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState("");

  // Email verification state
  const [emailStep, setEmailStep] = useState("idle"); // idle | sending | sent | verifying | verified | error
  const [emailCode, setEmailCode] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSentTime, setEmailSentTime] = useState(null);

  // Phone add/verify state
  const [phoneStep, setPhoneStep] = useState("idle"); // idle | entering | sending | sent | verifying | verified | error
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [phoneSentTime, setPhoneSentTime] = useState(null);

  // Populate form from session user
  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  // Handle hash navigation — only run once (not on every session poll)
  useEffect(() => {
    if (!user || hashProcessed.current) return;
    const hash = window.location.hash.replace("#", "");
    if (hash === "phone" && phoneSectionRef.current) {
      hashProcessed.current = true;
      setTimeout(() => phoneSectionRef.current.scrollIntoView({ behavior: "smooth", block: "center" }), 200);
      setPhoneStep("entering");
    }
    if (hash === "email" && emailSectionRef.current) {
      hashProcessed.current = true;
      setTimeout(() => emailSectionRef.current.scrollIntoView({ behavior: "smooth", block: "center" }), 200);
    }
  }, [user]);

  // Countdown timer helper
  const [countdown, setCountdown] = useState(0);
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Start countdown when code sent
  useEffect(() => {
    if (emailStep === "sent" && emailSentTime) {
      setCountdown(60);
    }
  }, [emailStep, emailSentTime]);

  useEffect(() => {
    if (phoneStep === "sent" && phoneSentTime) {
      setCountdown(60);
    }
  }, [phoneStep, phoneSentTime]);

  if (!user) {
    return (
      <Card>
        <CardContent className="py-12 flex items-center justify-center">
          <Loader2 className="animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const isPlaceholder = user.email?.startsWith("phone_") || user.email?.includes("@jobready.co.ke");

  // ── Name save ──
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

  // ── Email verification ──
  const handleSendEmailCode = async () => {
    setEmailError("");
    setEmailStep("sending");

    try {
      const res = await fetch("/api/user/send-verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (!res.ok) {
        setEmailError(data.error || "Failed to send verification code");
        setEmailStep("error");
        return;
      }

      setEmailStep("sent");
      setEmailSentTime(Date.now());
      setEmailCode("");
    } catch {
      setEmailError("Something went wrong. Please try again.");
      setEmailStep("error");
    }
  };

  const handleVerifyEmailCode = async () => {
    if (!/^\d{6}$/.test(emailCode)) {
      setEmailError("Enter a valid 6-digit code");
      return;
    }

    setEmailError("");
    setEmailStep("verifying");

    try {
      const res = await fetch("/api/user/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: emailCode }),
      });
      const data = await res.json();

      if (!res.ok) {
        setEmailError(data.error || "Verification failed");
        setEmailStep("error");
        return;
      }

      setEmailStep("verified");
      await refresh();
    } catch {
      setEmailError("Something went wrong. Please try again.");
      setEmailStep("error");
    }
  };

  // ── Phone add/verify ──
  const handleSendPhoneOtp = async () => {
    setPhoneError("");

    if (!user.phone) {
      // Need phone input first
      if (!phoneInput.trim()) {
        setPhoneError("Enter a phone number first");
        return;
      }
    }

    const phone = phoneInput.trim() || user.phone;
    setPhoneStep("sending");

    try {
      const res = await fetch("/api/user/send-verify-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();

      if (!res.ok) {
        setPhoneError(data.error || "Failed to send OTP");
        setPhoneStep("error");
        return;
      }

      setPhoneStep("sent");
      setPhoneSentTime(Date.now());
      setPhoneCode("");
    } catch {
      setPhoneError("Something went wrong. Please try again.");
      setPhoneStep("error");
    }
  };

  const handleVerifyPhoneOtp = async () => {
    if (!/^\d{6}$/.test(phoneCode)) {
      setPhoneError("Enter a valid 6-digit code");
      return;
    }

    setPhoneError("");
    setPhoneStep("verifying");

    const phone = phoneInput.trim() || user.phone;

    try {
      const res = await fetch("/api/user/verify-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp: phoneCode }),
      });
      const data = await res.json();

      if (!res.ok) {
        setPhoneError(data.error || "Verification failed");
        setPhoneStep("error");
        return;
      }

      setPhoneStep("verified");
      await refresh();
    } catch {
      setPhoneError("Something went wrong. Please try again.");
      setPhoneStep("error");
    }
  };

  const hasPassword = user.hasPassword;

  return (
    <div className="space-y-4">
      {/* ── Name Card ── */}
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

      {/* ── Email Card ── */}
      <Card id="settings-email" ref={emailSectionRef}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="size-5 text-muted-foreground" />
            Email Address
          </CardTitle>
          <CardDescription>
            {isPlaceholder
              ? "Add a real email address for password recovery and important updates."
              : "Your email address for account notifications and recovery."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* ── Placeholder email — needs real email ── */}
          {isPlaceholder && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
              <div className="flex items-start gap-3">
                <Mail className="size-5 text-purple-600 mt-0.5 shrink-0" />
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-sm font-medium text-purple-800">
                      Add a real email address
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      Your current email is a placeholder. Add your real email to enable password recovery and receive notifications.
                    </p>
                  </div>
                  <div className="text-xs text-purple-700 bg-purple-100 px-3 py-1.5 rounded-lg font-mono">
                    {user.email}
                  </div>
                  <p className="text-xs text-purple-600">
                    To add a real email, go to your{" "}
                    <a
                      href="/dashboard/profile"
                      className="underline font-medium hover:text-purple-800"
                    >
                      Profile page
                    </a>{" "}
                    and update your email — or sign in with Google to link your Gmail account.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Real email, not verified ── */}
          {!isPlaceholder && !user.emailVerified && (
            <div className="space-y-3">
              {/* Email + Send Code inline */}
              {(emailStep === "idle" || emailStep === "sending" || emailStep === "error") && (
                <div className="space-y-1.5">
                  <Label>Email Address</Label>
                  <div className="flex gap-2">
                    <Input
                      value={user.email || ""}
                      disabled
                      className="bg-muted/50 text-sm flex-1"
                    />
                    <Button
                      onClick={handleSendEmailCode}
                      disabled={emailStep === "sending"}
                    >
                      {emailStep === "sending" ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      ) : (
                        <Send className="mr-2 size-4" />
                      )}
                      Send Code
                    </Button>
                  </div>
                  {emailError && (
                    <p className="text-xs text-destructive">{emailError}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Click &quot;Send Code&quot; to receive a 6-digit verification code at this address.
                  </p>
                </div>
              )}

              {/* Step: code sent — show code input */}
              {emailStep === "sent" && (
                <div className="space-y-3 p-3 bg-muted/30 rounded-xl border">
                  <p className="text-sm">
                    A 6-digit code was sent to{" "}
                    <span className="font-medium">{user.email}</span>
                  </p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="000000"
                      value={emailCode}
                      onChange={(e) => {
                        setEmailCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                        setEmailError("");
                      }}
                      className="w-36 text-center text-lg tracking-widest font-mono"
                      maxLength={6}
                      autoFocus
                    />
                    <Button
                      onClick={handleVerifyEmailCode}
                      disabled={emailCode.length !== 6 || emailStep === "verifying"}
                    >
                      {emailStep === "verifying" ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      ) : (
                        <ShieldCheck className="mr-2 size-4" />
                      )}
                      Verify
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    {emailError && (
                      <p className="text-xs text-destructive">{emailError}</p>
                    )}
                    <div className="ml-auto">
                      {countdown > 0 ? (
                        <span className="text-xs text-muted-foreground">
                          Resend in {countdown}s
                        </span>
                      ) : (
                        <button
                          onClick={handleSendEmailCode}
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          <RefreshCw className="size-3" />
                          Resend code
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step: verifying */}
              {emailStep === "verifying" && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Verifying...
                </div>
              )}

              {/* Step: verified */}
              {emailStep === "verified" && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
                  <CheckCircle2 className="size-4" />
                  Email verified successfully!
                </div>
              )}
            </div>
          )}

          {/* ── Real email, verified ── */}
          {!isPlaceholder && user.emailVerified && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Verified Email</Label>
                <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                  <CheckCircle2 className="size-3 mr-1" />
                  Verified
                </Badge>
              </div>
              <Input
                value={user.email || ""}
                disabled
                className="bg-muted/50"
              />
              <p className="text-xs text-muted-foreground">
                Your email is verified and receiving notifications.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Phone Card ── */}
      <Card id="settings-phone" ref={phoneSectionRef}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Phone className="size-5 text-muted-foreground" />
            Phone Number
          </CardTitle>
          <CardDescription>
            {user.phone
              ? "Your phone number for job alerts and account recovery."
              : "Add a phone number for job alerts and easier account recovery."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* ── No phone — show add flow ── */}
          {!user.phone && (
            <div className="space-y-3">
              {/* Info banner */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
                <Phone className="size-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Add your phone number
                  </p>
                  <p className="text-xs text-blue-600 mt-0.5">
                    Used for job alerts, SMS notifications, and phone-based sign-in.
                  </p>
                </div>
              </div>

              {/* Phone input */}
              {phoneStep === "idle" || phoneStep === "error" || phoneStep === "entering" ? (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone-input">Phone Number</Label>
                    <div className="flex gap-2">
                      <Input
                        id="phone-input"
                        type="tel"
                        placeholder="07XXXXXXXX"
                        value={phoneInput}
                        onChange={(e) => {
                          setPhoneInput(e.target.value);
                          setPhoneError("");
                        }}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSendPhoneOtp}
                        disabled={!phoneInput.trim() || phoneStep === "sending"}
                      >
                        {phoneStep === "sending" ? (
                          <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : (
                          <Send className="mr-2 size-4" />
                        )}
                        Send OTP
                      </Button>
                    </div>
                    {phoneError && (
                      <p className="text-xs text-destructive">{phoneError}</p>
                    )}
                  </div>
                </div>
              ) : null}

              {/* Step: OTP sent — show code input */}
              {phoneStep === "sent" && (
                <div className="space-y-3 p-3 bg-muted/30 rounded-xl border">
                  <p className="text-sm">
                    A 6-digit OTP was sent to{" "}
                    <span className="font-medium">{phoneInput.trim()}</span>
                  </p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="000000"
                      value={phoneCode}
                      onChange={(e) => {
                        setPhoneCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                        setPhoneError("");
                      }}
                      className="w-36 text-center text-lg tracking-widest font-mono"
                      maxLength={6}
                    />
                    <Button
                      onClick={handleVerifyPhoneOtp}
                      disabled={phoneCode.length !== 6 || phoneStep === "verifying"}
                    >
                      {phoneStep === "verifying" ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      ) : (
                        <ShieldCheck className="mr-2 size-4" />
                      )}
                      Verify
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    {phoneError && (
                      <p className="text-xs text-destructive">{phoneError}</p>
                    )}
                    <div className="ml-auto flex items-center gap-3">
                      <button
                        onClick={() => { setPhoneStep("entering"); setPhoneCode(""); }}
                        className="text-xs text-muted-foreground hover:underline"
                      >
                        Change number
                      </button>
                      {countdown > 0 ? (
                        <span className="text-xs text-muted-foreground">
                          Resend in {countdown}s
                        </span>
                      ) : (
                        <button
                          onClick={handleSendPhoneOtp}
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          <RefreshCw className="size-3" />
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step: verifying */}
              {phoneStep === "verifying" && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Verifying...
                </div>
              )}

              {/* Step: verified */}
              {phoneStep === "verified" && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
                  <CheckCircle2 className="size-4" />
                  Phone number added and verified successfully!
                </div>
              )}
            </div>
          )}

          {/* ── Has phone, not verified ── */}
          {user.phone && !user.phoneVerified && (
            <div className="space-y-3">
              {/* Warning banner */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <AlertTriangle className="size-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    Phone not verified
                  </p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    Verify your phone number to enable SMS alerts and phone-based sign-in.
                  </p>
                </div>
              </div>

              {/* Current phone display */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Current Phone</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={user.phone || ""}
                    disabled
                    className="bg-muted/50 text-sm"
                  />
                  <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200 shrink-0">
                    Unverified
                  </Badge>
                </div>
              </div>

              {/* Step: idle — show send OTP button */}
              {phoneStep === "idle" && (
                <Button
                  onClick={handleSendPhoneOtp}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Send className="mr-2 size-4" />
                  Send Verification OTP
                </Button>
              )}

              {/* Step: sending */}
              {phoneStep === "sending" && (
                <Button disabled className="w-full sm:w-auto">
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Sending...
                </Button>
              )}

              {/* Step: OTP sent */}
              {(phoneStep === "sent" || phoneStep === "error") && (
                <div className="space-y-3 p-3 bg-muted/30 rounded-xl border">
                  <p className="text-sm">
                    A 6-digit OTP was sent to{" "}
                    <span className="font-medium">{user.phone}</span>
                  </p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="000000"
                      value={phoneCode}
                      onChange={(e) => {
                        setPhoneCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                        setPhoneError("");
                      }}
                      className="w-36 text-center text-lg tracking-widest font-mono"
                      maxLength={6}
                    />
                    <Button
                      onClick={handleVerifyPhoneOtp}
                      disabled={phoneCode.length !== 6 || phoneStep === "verifying"}
                    >
                      {phoneStep === "verifying" ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      ) : (
                        <ShieldCheck className="mr-2 size-4" />
                      )}
                      Verify
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    {phoneError && (
                      <p className="text-xs text-destructive">{phoneError}</p>
                    )}
                    <div className="ml-auto">
                      {countdown > 0 ? (
                        <span className="text-xs text-muted-foreground">
                          Resend in {countdown}s
                        </span>
                      ) : (
                        <button
                          onClick={handleSendPhoneOtp}
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          <RefreshCw className="size-3" />
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step: verifying */}
              {phoneStep === "verifying" && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Verifying...
                </div>
              )}

              {/* Step: verified */}
              {phoneStep === "verified" && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
                  <CheckCircle2 className="size-4" />
                  Phone number verified successfully!
                </div>
              )}
            </div>
          )}

          {/* ── Has phone, verified ── */}
          {user.phone && user.phoneVerified && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Verified Phone</Label>
                <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                  <CheckCircle2 className="size-3 mr-1" />
                  Verified
                </Badge>
              </div>
              <Input
                value={user.phone || ""}
                disabled
                className="bg-muted/50"
              />
              <p className="text-xs text-muted-foreground">
                Your phone number is verified and can be used for SMS alerts and phone sign-in.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Auth Methods Summary ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sign-in Methods</CardTitle>
          <CardDescription>
            Ways you can sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              {hasPassword ? "✓ Email & Password" : "✗ No Password Set"}
            </Badge>
            {user.phone && user.phoneVerified ? (
              <Badge variant="secondary" className="text-xs">
                ✓ Phone OTP
              </Badge>
            ) : user.phone ? (
              <Badge variant="outline" className="text-xs text-amber-600">
                ⚠ Phone (unverified)
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                ✗ Phone
              </Badge>
            )}
            {user.googleId && (
              <Badge variant="secondary" className="text-xs">
                ✓ Google
              </Badge>
            )}
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
