"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  Save,
  Upload,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Users,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const INDUSTRIES = [
  "Telecommunications",
  "Banking & Financial Services",
  "Technology",
  "Healthcare",
  "Education",
  "Government",
  "NGO / Non-Profit",
  "Manufacturing",
  "Retail & E-Commerce",
  "Media & Entertainment",
  "Agriculture",
  "Energy & Utilities",
  "Logistics & Transport",
  "Consulting",
  "Real Estate",
  "Tourism & Hospitality",
  "Legal Services",
  "Creative & Design",
  "Other",
];

const COMPANY_SIZES = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "501-1000 employees",
  "1001-5000 employees",
  "5000+ employees",
];

const EMPTY_FORM = {
  name: "",
  industry: "",
  website: "",
  foundedYear: "",
  companySize: "",
  location: "",
  address: "",
  description: "",
  linkedin: "",
  twitter: "",
  facebook: "",
  contactName: "",
  contactTitle: "",
  contactEmail: "",
  contactPhone: "",
  logo: "",
};

/** Map API company fields to form field names */
function companyToForm(company) {
  return {
    name: company.name || "",
    industry: company.industry || "",
    website: company.website || "",
    foundedYear: company.foundedYear ? String(company.foundedYear) : "",
    companySize: company.employeeSize || "",
    location: company.city || "",
    address: company.address || "",
    description: company.description || "",
    linkedin: company.linkedinUrl || "",
    twitter: company.twitterUrl || "",
    facebook: company.facebookUrl || "",
    contactName: "",
    contactTitle: "",
    contactEmail: "",
    contactPhone: "",
    logo: company.logo || "",
  };
}

/** Map form field names to API company fields */
function formToCompany(form) {
  return {
    name: form.name || null,
    industry: form.industry || null,
    website: form.website || null,
    foundedYear: form.foundedYear || null,
    companySize: form.companySize || null,
    location: form.location || null,
    address: form.address || null,
    description: form.description || null,
    linkedinUrl: form.linkedin || null,
    twitterUrl: form.twitter || null,
    facebookUrl: form.facebook || null,
  };
}

// ── Loading Skeleton ──────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header skeleton */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-muted rounded" />
          <div className="h-4 w-72 bg-muted rounded" />
        </div>
        <div className="h-10 w-32 bg-muted rounded-md" />
      </div>

      {/* Logo card skeleton */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="size-20 rounded-xl bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-40 bg-muted rounded" />
              <div className="h-4 w-28 bg-muted rounded" />
              <div className="h-4 w-48 bg-muted rounded mt-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Details skeleton */}
      <Card>
        <CardHeader>
          <div className="h-5 w-36 bg-muted rounded mb-2" />
          <div className="h-4 w-56 bg-muted rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="h-4 w-28 bg-muted rounded" />
              <div className="h-10 w-full bg-muted rounded-md" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-10 w-full bg-muted rounded-md" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-10 w-full bg-muted rounded-md" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-28 bg-muted rounded" />
              <div className="h-10 w-full bg-muted rounded-md" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="h-4 w-28 bg-muted rounded" />
              <div className="h-10 w-full bg-muted rounded-md" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-10 w-full bg-muted rounded-md" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-28 bg-muted rounded" />
            <div className="h-10 w-full bg-muted rounded-md" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-44 bg-muted rounded" />
            <div className="h-32 w-full bg-muted rounded-md" />
          </div>
        </CardContent>
      </Card>

      {/* Social Links skeleton */}
      <Card>
        <CardHeader>
          <div className="h-5 w-52 bg-muted rounded mb-2" />
          <div className="h-4 w-44 bg-muted rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-10 w-full bg-muted rounded-md" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-10 w-full bg-muted rounded-md" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-10 w-full bg-muted rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Person skeleton */}
      <Card>
        <CardHeader>
          <div className="h-5 w-32 bg-muted rounded mb-2" />
          <div className="h-4 w-56 bg-muted rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="h-4 w-28 bg-muted rounded" />
              <div className="h-10 w-full bg-muted rounded-md" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-10 w-full bg-muted rounded-md" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="h-4 w-28 bg-muted rounded" />
              <div className="h-10 w-full bg-muted rounded-md" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-28 bg-muted rounded" />
              <div className="h-10 w-full bg-muted rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Error State ──────────────────────────────────────
function ErrorState({ message, onRetry }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-destructive/10 p-4 mb-4">
          <AlertCircle className="size-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold">Failed to load company profile</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          {message || "Something went wrong. Please try again."}
        </p>
        <Button onClick={onRetry} variant="outline" className="mt-4">
          <RefreshCw className="mr-2 size-4" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
}

// ── Component ────────────────────────────────────────
export default function CompanyProfileForm() {
  const { data: session, status } = useSession();
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch company profile on mount when authenticated
  useEffect(() => {
    async function fetchCompany() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/company/profile");

        if (!res.ok) {
          if (res.status === 401) {
            setError("Please sign in to manage your company profile.");
            return;
          }
          throw new Error("Failed to load company profile");
        }

        const data = await res.json();

        if (data.company) {
          setCompany(data.company);
          setForm(companyToForm(data.company));
        }
        // If company is null, form stays as EMPTY_FORM (create mode)
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchCompany();
    } else if (status === "unauthenticated") {
      setLoading(false);
      setError("Please sign in to manage your company profile.");
    }
  }, [status]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type", {
        description: "Only JPEG, PNG, GIF, WebP, and SVG are allowed.",
      });
      return;
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error("File too large", {
        description: "Maximum file size is 2MB.",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("logo", file);

      const res = await fetch("/api/company/logo", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setForm((prev) => ({ ...prev, logo: data.logo }));
      toast.success("Logo uploaded", {
        description: "Your company logo has been updated successfully.",
      });
    } catch (error) {
      toast.error("Upload failed", {
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsUploading(false);
      // Reset file input so the same file can be re-selected
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSave = async () => {
    if (!form.name || form.name.trim().length === 0) {
      toast.error("Validation error", {
        description: "Company name is required.",
      });
      return;
    }

    setIsSaving(true);
    setIsSaved(false);

    try {
      const payload = formToCompany(form);

      const res = await fetch("/api/company/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save company profile");
      }

      // Update local state with the response
      if (data.company) {
        setCompany(data.company);
        setForm(companyToForm(data.company));
      }

      setIsSaved(true);
      toast.success("Profile saved", {
        description: data.message || "Your company profile has been saved successfully.",
      });

      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      toast.error("Save failed", {
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Session loading
  if (status === "loading") return <LoadingSkeleton />;

  // Unauthenticated or fetch error
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Company Profile</h1>
          <p className="text-muted-foreground">
            Manage your company information visible to job seekers
          </p>
        </div>
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  // Data loading
  if (loading) return <LoadingSkeleton />;

  const isEditMode = !!company;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Company Profile</h1>
          <p className="text-muted-foreground">
            {isEditMode
              ? "Manage your company information visible to job seekers"
              : "Create your company profile to get started"}
          </p>
        </div>
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
              {isEditMode ? "Save Changes" : "Create Profile"}
            </>
          )}
        </Button>
      </div>

      {/* Company Logo Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <Avatar className="size-20 rounded-xl">
              {form.logo ? (
                <img
                  src={form.logo}
                  alt={form.name}
                  className="object-cover size-full rounded-xl"
                />
              ) : (
                <AvatarFallback className="rounded-xl bg-green-600 text-white text-xl font-bold">
                  {form.name
                    ? form.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                    : "SC"}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{form.name || "Your Company"}</h3>
              <p className="text-sm text-muted-foreground">
                {form.industry || "Industry not set"}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 size-4" />
                      Upload Logo
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG or SVG. Max 2MB. Recommended: 400x400px
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Details — Two Column */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="size-5 text-primary" />
            Company Details
          </CardTitle>
          <CardDescription>
            Basic information about your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select
                value={form.industry}
                onValueChange={(v) => updateField("industry", v)}
              >
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="https://www.example.com"
                value={form.website}
                onChange={(e) => updateField("website", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="foundedYear">Founded Year</Label>
              <Input
                id="foundedYear"
                placeholder="e.g., 2010"
                value={form.foundedYear}
                onChange={(e) => updateField("foundedYear", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companySize">Company Size</Label>
              <Select
                value={form.companySize}
                onValueChange={(v) => updateField("companySize", v)}
              >
                <SelectTrigger id="companySize">
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  {COMPANY_SIZES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Nairobi, Kenya"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Full Address</Label>
            <Input
              id="address"
              placeholder="Street address, city, country"
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Company Description</Label>
            <Textarea
              id="description"
              placeholder="Tell job seekers about your company culture, mission, and what makes you a great employer..."
              rows={8}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              A compelling description helps attract top talent. Minimum 100 characters recommended.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="size-5 text-primary" />
            Social Media & Online Presence
          </CardTitle>
          <CardDescription>
            Connect your social profiles to build trust
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="flex items-center gap-2">
                <Linkedin className="size-4 text-blue-600" />
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                placeholder="https://linkedin.com/company/yourcompany"
                value={form.linkedin}
                onChange={(e) => updateField("linkedin", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter" className="flex items-center gap-2">
                <Twitter className="size-4 text-sky-500" />
                Twitter / X
              </Label>
              <Input
                id="twitter"
                placeholder="https://twitter.com/yourcompany"
                value={form.twitter}
                onChange={(e) => updateField("twitter", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="facebook" className="flex items-center gap-2">
                <Facebook className="size-4 text-blue-700" />
                Facebook
              </Label>
              <Input
                id="facebook"
                placeholder="https://facebook.com/yourcompany"
                value={form.facebook}
                onChange={(e) => updateField("facebook", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Person */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="size-5 text-primary" />
            Contact Person
          </CardTitle>
          <CardDescription>
            Primary contact for job applicants and inquiries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name</Label>
              <Input
                id="contactName"
                placeholder="Full name"
                value={form.contactName}
                onChange={(e) => updateField("contactName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactTitle">Job Title</Label>
              <Input
                id="contactTitle"
                placeholder="e.g., HR Manager"
                value={form.contactTitle}
                onChange={(e) => updateField("contactTitle", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactEmail" className="flex items-center gap-2">
                <Mail className="size-4 text-muted-foreground" />
                Contact Email
              </Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="careers@company.com"
                value={form.contactEmail}
                onChange={(e) => updateField("contactEmail", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone" className="flex items-center gap-2">
                <Phone className="size-4 text-muted-foreground" />
                Contact Phone
              </Label>
              <Input
                id="contactPhone"
                placeholder="+254 700 000 000"
                value={form.contactPhone}
                onChange={(e) => updateField("contactPhone", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} size="lg">
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
              {isEditMode ? "Save Changes" : "Create Profile"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
