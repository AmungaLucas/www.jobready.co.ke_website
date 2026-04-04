"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

const MDXEditor = dynamic(
  () => import("@mdxeditor/editor").then((mod) => mod.MDXEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-48 border rounded-md bg-gray-50 animate-pulse" />
    ),
  }
);
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
  Briefcase,
  PlusCircle,
  ArrowLeft,
  Eye,
  Send,
  Save,
  Star,
  CheckCircle2,
  DollarSign,
  Clock,
  MapPin,
  Sparkles,
} from "lucide-react";

// ── RichTextEditor wrapper ──────────────────────────────
function RichTextEditor({ value, onChange, placeholder, error }) {
  return (
    <div
      className={`border rounded-md overflow-hidden ${
        error ? "border-destructive" : ""
      }`}
    >
      <MDXEditor
        markdown={value || ""}
        onChange={(md) => onChange(md.markdown)}
        placeholder={placeholder}
        plugins={[
          toolbarPlugin(),
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
        ]}
        contentEditableClassName="prose prose-sm max-w-none min-h-[160px] focus:outline-none p-3"
        className="min-h-[200px]"
      />
    </div>
  );
}

// ── Options ──────────────────────────────────────────
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

const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Temporary",
];

const EXPERIENCE_LEVELS = [
  "Entry Level",
  "Mid Level",
  "Senior Level",
  "Manager / Director",
  "Executive",
];

const APPLICATION_METHODS = [
  { value: "email", label: "Email Applications" },
  { value: "external", label: "External Link" },
  { value: "inapp", label: "In-App Applications" },
];

const INITIAL_FORM = {
  title: "",
  category: "",
  type: "",
  experienceLevel: "",
  location: "",
  isRemote: false,
  salaryMin: "",
  salaryMax: "",
  showSalary: true,
  description: "",
  requirements: "",
  responsibilities: "",
  deadline: "",
  maxApplicants: "",
  isFeatured: false,
  applicationMethod: "inapp",
  contactEmail: "",
  contactPhone: "",
};

export default function PostJobForm() {
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
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
    if (!form.title.trim()) newErrors.title = "Job title is required";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.type) newErrors.type = "Employment type is required";
    if (!form.experienceLevel) newErrors.experienceLevel = "Experience level is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.description.trim()) newErrors.description = "Job description is required";
    if (!form.deadline) newErrors.deadline = "Application deadline is required";
    if (form.applicationMethod === "email" && !form.contactEmail.trim()) {
      newErrors.contactEmail = "Contact email is required for email applications";
    }
    if (form.applicationMethod === "external" && !form.contactEmail.trim()) {
      newErrors.contactEmail = "External URL is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsPublished(true);
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
  };

  if (isPublished) {
    return (
      <div className="space-y-6">
        <div className="mx-auto max-w-lg">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-emerald-100 p-4 mb-4">
                <CheckCircle2 className="size-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Job Published!</h2>
              <p className="text-muted-foreground mt-2 max-w-sm">
                Your job posting &quot;{form.title}&quot; is now live and visible to
                thousands of job seekers across Kenya.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button asChild>
                  <Link href="/dashboard/jobs">
                    <Briefcase className="mr-2 size-4" />
                    View My Jobs
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link
                    href="/dashboard/jobs/new"
                    onClick={() => {
                      setIsPublished(false);
                      setForm({ ...INITIAL_FORM });
                    }}
                  >
                    <PlusCircle className="mr-2 size-4" />
                    Post Another Job
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/jobs">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Post New Job</h1>
            <p className="text-muted-foreground">
              Create a new job listing to attract qualified candidates
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Job Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Briefcase className="size-5 text-primary" />
              Job Details
            </CardTitle>
            <CardDescription>
              Basic information about the position
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Job Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., Senior Software Engineer"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title}</p>
              )}
            </div>

            {/* Category + Type */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => updateField("category", v)}
                >
                  <SelectTrigger id="category" className={errors.category ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-xs text-destructive">{errors.category}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">
                  Employment Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => updateField("type", v)}
                >
                  <SelectTrigger id="type" className={errors.type ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-xs text-destructive">{errors.type}</p>
                )}
              </div>
            </div>

            {/* Experience Level + Location */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="experienceLevel">
                  Experience Level <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.experienceLevel}
                  onValueChange={(v) => updateField("experienceLevel", v)}
                >
                  <SelectTrigger id="experienceLevel" className={errors.experienceLevel ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_LEVELS.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.experienceLevel && (
                  <p className="text-xs text-destructive">{errors.experienceLevel}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">
                  Location <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., Nairobi, Kenya"
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  className={errors.location ? "border-destructive" : ""}
                />
                {errors.location && (
                  <p className="text-xs text-destructive">{errors.location}</p>
                )}
              </div>
            </div>

            {/* Remote toggle */}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <MapPin className="size-4 text-primary" />
                </div>
                <div>
                  <Label htmlFor="isRemote" className="font-medium">
                    Remote Work
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Allow candidates to work remotely
                  </p>
                </div>
              </div>
              <Switch
                id="isRemote"
                checked={form.isRemote}
                onCheckedChange={(v) => updateField("isRemote", v)}
              />
            </div>

            <Separator />

            {/* Salary Range */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-medium flex items-center gap-2">
                  <DollarSign className="size-4 text-muted-foreground" />
                  Salary Range (KSh)
                </Label>
                <div className="flex items-center gap-2">
                  <Label htmlFor="showSalary" className="text-sm text-muted-foreground">
                    Show salary
                  </Label>
                  <Switch
                    id="showSalary"
                    checked={form.showSalary}
                    onCheckedChange={(v) => updateField("showSalary", v)}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  placeholder="Minimum salary"
                  type="number"
                  value={form.salaryMin}
                  onChange={(e) => updateField("salaryMin", e.target.value)}
                />
                <Input
                  placeholder="Maximum salary"
                  type="number"
                  value={form.salaryMax}
                  onChange={(e) => updateField("salaryMax", e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Leave empty if salary is negotiable. Enter monthly amounts in KSh (e.g., 150000).
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Description */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              Description & Requirements
            </CardTitle>
            <CardDescription>
              Provide detailed information about the role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">
                Job Description <span className="text-destructive">*</span>
              </Label>
              <RichTextEditor
                value={form.description}
                onChange={(md) => updateField("description", md)}
                placeholder="Describe the role, responsibilities, and what the ideal candidate will do..."
                error={errors.description}
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
              <RichTextEditor
                value={form.requirements}
                onChange={(md) => updateField("requirements", md)}
                placeholder="List the required qualifications, skills, and experience..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsibilities">Responsibilities</Label>
              <RichTextEditor
                value={form.responsibilities}
                onChange={(md) => updateField("responsibilities", md)}
                placeholder="List the key responsibilities and day-to-day tasks..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Deadline & Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="size-5 text-primary" />
              Deadline & Settings
            </CardTitle>
            <CardDescription>
              Configure application settings and publishing options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="deadline">
                  Application Deadline <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={(e) => updateField("deadline", e.target.value)}
                  className={errors.deadline ? "border-destructive" : ""}
                />
                {errors.deadline && (
                  <p className="text-xs text-destructive">{errors.deadline}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxApplicants">Max Applicants (Optional)</Label>
                <Input
                  id="maxApplicants"
                  placeholder="e.g., 50"
                  type="number"
                  value={form.maxApplicants}
                  onChange={(e) => updateField("maxApplicants", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty for unlimited applications
                </p>
              </div>
            </div>

            <Separator />

            {/* Featured Listing */}
            <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-amber-100 p-2">
                  <Star className="size-4 text-amber-600" />
                </div>
                <div>
                  <Label htmlFor="isFeatured" className="font-medium">
                    Featured Listing
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Promote your job for KSh 2,000 — appears at the top of search results and gets 3x more views
                  </p>
                </div>
              </div>
              <Switch
                id="isFeatured"
                checked={form.isFeatured}
                onCheckedChange={(v) => updateField("isFeatured", v)}
              />
            </div>

            <Separator />

            {/* How to Apply */}
            <div className="space-y-3">
              <Label className="font-medium">How to Apply</Label>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="applicationMethod" className="text-sm text-muted-foreground">
                    Application Method
                  </Label>
                  <Select
                    value={form.applicationMethod}
                    onValueChange={(v) => updateField("applicationMethod", v)}
                  >
                    <SelectTrigger id="applicationMethod">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {APPLICATION_METHODS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail" className="text-sm text-muted-foreground">
                      Contact Email {form.applicationMethod === "email" && <span className="text-destructive">*</span>}
                    </Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder={
                        form.applicationMethod === "external"
                          ? "External application URL"
                          : "careers@company.com"
                      }
                      value={form.contactEmail}
                      onChange={(e) => updateField("contactEmail", e.target.value)}
                      className={errors.contactEmail ? "border-destructive" : ""}
                    />
                    {errors.contactEmail && (
                      <p className="text-xs text-destructive">{errors.contactEmail}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone" className="text-sm text-muted-foreground">
                      Contact Phone (Optional)
                    </Label>
                    <Input
                      id="contactPhone"
                      placeholder="+254 700 000 000"
                      value={form.contactPhone}
                      onChange={(e) => updateField("contactPhone", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:items-center">
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
          >
            <Save className="mr-2 size-4" />
            Save as Draft
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
          >
            <Eye className="mr-2 size-4" />
            Preview
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Publishing...
              </>
            ) : (
              <>
                <Send className="mr-2 size-4" />
                Publish Job
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
