"use client";

import { useState, useMemo } from "react";
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
  Tag,
  Globe,
  X,
} from "lucide-react";
import {
  jobCategory,
  experienceLevel,
  organizationLocation,
  currencies,
} from "@/data/org_data";

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

// ── Local constants ────────────────────────────────────
const WORK_MODE = [
  { value: "ON_SITE", label: "On-site" },
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
];

const SOURCE_OPTIONS = [
  { value: "DIRECT", label: "Direct Post" },
  { value: "SCRAPED", label: "Scraped" },
  { value: "PARTNER", label: "Partner" },
  { value: "EMPLOYER_SUBMITTED", label: "Employer Submitted" },
];

const APPLICATION_METHODS = [
  { value: "email", label: "Email Applications" },
  { value: "external", label: "External Link" },
  { value: "inapp", label: "In-App Applications" },
];

const INITIAL_FORM = {
  title: "",
  category: "",
  subcategory: "",
  type: "",
  experienceLevel: "",
  country: "",
  region: "",
  location: "",
  workMode: "",
  salaryCurrency: "KES",
  salaryMin: "",
  salaryMax: "",
  showSalary: true,
  source: "DIRECT",
  tags: [],
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
  const [tagInput, setTagInput] = useState("");

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

  // Derived data for cascading selects
  const selectedCategory = useMemo(
    () => jobCategory.find((c) => c.value === form.category),
    [form.category]
  );

  const subcategories = useMemo(
    () => selectedCategory?.subcategories ?? [],
    [selectedCategory]
  );

  const selectedCountry = useMemo(
    () => organizationLocation.find((c) => c.code === form.country),
    [form.country]
  );

  const regions = useMemo(
    () => selectedCountry?.regions ?? [],
    [selectedCountry]
  );

  // Computed currency label for salary section
  const selectedCurrency = useMemo(
    () => currencies.find((c) => c.value === form.salaryCurrency),
    [form.salaryCurrency]
  );

  const currencyLabel = selectedCurrency
    ? selectedCurrency.label.split(" - ")[0]
    : "KES";

  // Handlers for cascading resets
  const handleCategoryChange = (value) => {
    setForm((prev) => ({
      ...prev,
      category: value,
      subcategory: "",
    }));
    if (errors.category) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.category;
        return next;
      });
    }
  };

  const handleCountryChange = (value) => {
    setForm((prev) => ({
      ...prev,
      country: value,
      region: "",
    }));
  };

  // Tag handlers
  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!form.tags.includes(newTag)) {
        setForm((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Job title is required";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.type) newErrors.type = "Employment type is required";
    if (!form.experienceLevel)
      newErrors.experienceLevel = "Experience level is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.description.trim())
      newErrors.description = "Job description is required";
    if (!form.deadline) newErrors.deadline = "Application deadline is required";
    if (form.applicationMethod === "email" && !form.contactEmail.trim()) {
      newErrors.contactEmail =
        "Contact email is required for email applications";
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
              <h2 className="text-2xl font-bold tracking-tight">
                Job Published!
              </h2>
              <p className="text-muted-foreground mt-2 max-w-sm">
                Your job posting &quot;{form.title}&quot; is now live and
                visible to thousands of job seekers across Kenya.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button asChild>
                  <Link href="/dashboard/jobs">
                    <Briefcase className="mr-2 size-4" />
                    View My Jobs
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                >
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
            <h1 className="text-2xl font-bold tracking-tight">
              Post New Job
            </h1>
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

            {/* Category */}
            <div className="grid gap-4 sm:grid-cols-1">
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger
                    id="category"
                    className={
                      errors.category ? "border-destructive" : ""
                    }
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobCategory.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-xs text-destructive">
                    {errors.category}
                  </p>
                )}
              </div>
            </div>

            {/* Subcategory (only shown when category is selected) */}
            {subcategories.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <Select
                  value={form.subcategory}
                  onValueChange={(v) => updateField("subcategory", v)}
                >
                  <SelectTrigger id="subcategory">
                    <SelectValue placeholder="Select subcategory (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories.map((sub) => (
                      <SelectItem key={sub.value} value={sub.value}>
                        {sub.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Experience Level + Work Mode */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="experienceLevel">
                  Experience Level <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.experienceLevel}
                  onValueChange={(v) => updateField("experienceLevel", v)}
                >
                  <SelectTrigger
                    id="experienceLevel"
                    className={
                      errors.experienceLevel ? "border-destructive" : ""
                    }
                  >
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevel.map((l) => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.experienceLevel && (
                  <p className="text-xs text-destructive">
                    {errors.experienceLevel}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="workMode">Work Mode</Label>
                <Select
                  value={form.workMode}
                  onValueChange={(v) => updateField("workMode", v)}
                >
                  <SelectTrigger id="workMode">
                    <SelectValue placeholder="Select work mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORK_MODE.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Country + Region */}
            <div className="space-y-2">
              <Label className="font-medium flex items-center gap-2">
                <Globe className="size-4 text-muted-foreground" />
                Location
              </Label>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm text-muted-foreground">
                    Country
                  </Label>
                  <Select
                    value={form.country}
                    onValueChange={handleCountryChange}
                  >
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizationLocation.map((loc) => (
                        <SelectItem key={loc.code} value={loc.code}>
                          {loc.flag} {loc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region" className="text-sm text-muted-foreground">
                    Region / County
                  </Label>
                  <Select
                    value={form.region}
                    onValueChange={(v) => updateField("region", v)}
                    disabled={!form.country}
                  >
                    <SelectTrigger id="region">
                      <SelectValue
                        placeholder={
                          form.country
                            ? "Select region"
                            : "Select country first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Free-text location */}
              <div className="space-y-2">
                <Label htmlFor="location">
                  Specific Location <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., Westlands, Nairobi"
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  className={errors.location ? "border-destructive" : ""}
                />
                {errors.location && (
                  <p className="text-xs text-destructive">
                    {errors.location}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {/* Salary Range */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-medium flex items-center gap-2">
                  <DollarSign className="size-4 text-muted-foreground" />
                  Salary Range ({currencyLabel})
                </Label>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="showSalary"
                    className="text-sm text-muted-foreground"
                  >
                    Show salary
                  </Label>
                  <Switch
                    id="showSalary"
                    checked={form.showSalary}
                    onCheckedChange={(v) => updateField("showSalary", v)}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label
                    htmlFor="salaryCurrency"
                    className="text-sm text-muted-foreground"
                  >
                    Currency
                  </Label>
                  <Select
                    value={form.salaryCurrency}
                    onValueChange={(v) => updateField("salaryCurrency", v)}
                  >
                    <SelectTrigger id="salaryCurrency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Minimum
                  </Label>
                  <Input
                    placeholder="Min salary"
                    type="number"
                    value={form.salaryMin}
                    onChange={(e) => updateField("salaryMin", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Maximum
                  </Label>
                  <Input
                    placeholder="Max salary"
                    type="number"
                    value={form.salaryMax}
                    onChange={(e) => updateField("salaryMax", e.target.value)}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Leave empty if salary is negotiable. Enter monthly amounts.
              </p>
            </div>

            <Separator />

            {/* Source */}
            <div className="space-y-2">
              <Label htmlFor="source" className="font-medium">
                Source
              </Label>
              <Select
                value={form.source}
                onValueChange={(v) => updateField("source", v)}
              >
                <SelectTrigger id="source">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SOURCE_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Tags Input */}
            <div className="space-y-2">
              <Label className="font-medium flex items-center gap-2">
                <Tag className="size-4 text-muted-foreground" />
                Tags
              </Label>
              <Input
                id="tagInput"
                placeholder="Type a tag and press Enter to add"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
              />
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1 px-2.5 py-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5 transition-colors"
                        aria-label={`Remove tag ${tag}`}
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Press Enter to add a tag. Tags help job seekers find your
                listing more easily.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Description */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              Description &amp; Requirements
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
                <p className="text-xs text-destructive">
                  {errors.description}
                </p>
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
              Deadline &amp; Settings
            </CardTitle>
            <CardDescription>
              Configure application settings and publishing options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="deadline">
                  Application Deadline{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={(e) => updateField("deadline", e.target.value)}
                  className={errors.deadline ? "border-destructive" : ""}
                />
                {errors.deadline && (
                  <p className="text-xs text-destructive">
                    {errors.deadline}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxApplicants">
                  Max Applicants (Optional)
                </Label>
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
                    Promote your job for KSh 2,000 — appears at the top of
                    search results and gets 3x more views
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
                  <Label
                    htmlFor="applicationMethod"
                    className="text-sm text-muted-foreground"
                  >
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
                    <Label
                      htmlFor="contactEmail"
                      className="text-sm text-muted-foreground"
                    >
                      Contact Email{" "}
                      {form.applicationMethod === "email" && (
                        <span className="text-destructive">*</span>
                      )}
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
                      onChange={(e) =>
                        updateField("contactEmail", e.target.value)
                      }
                      className={
                        errors.contactEmail ? "border-destructive" : ""
                      }
                    />
                    {errors.contactEmail && (
                      <p className="text-xs text-destructive">
                        {errors.contactEmail}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="contactPhone"
                      className="text-sm text-muted-foreground"
                    >
                      Contact Phone (Optional)
                    </Label>
                    <Input
                      id="contactPhone"
                      placeholder="+254 700 000 000"
                      value={form.contactPhone}
                      onChange={(e) =>
                        updateField("contactPhone", e.target.value)
                      }
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
