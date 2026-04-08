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
import { Textarea } from "@/components/ui/textarea";
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
  Sparkles,
  Calendar,
  Building2,
  Link as LinkIcon,
  FileText,
  Tag,
  Heart,
  Users,
  Globe,
} from "lucide-react";

import {
  jobCategory,
  opportunityType,
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

// ── Source options ──────────────────────────────────────
const SOURCE_OPTIONS = [
  { value: "DIRECT", label: "Direct Submission" },
  { value: "SCRAPED", label: "Scraped" },
  { value: "PARTNER", label: "Partner Submission" },
  { value: "EMPLOYER_SUBMITTED", label: "Employer Submitted" },
];

// ── Initial form state ─────────────────────────────────
const INITIAL_FORM = {
  title: "",
  slug: "",
  companyId: "",
  opportunityType: "",
  category: "",
  source: "DIRECT",
  deadline: "",
  startDate: "",
  endDate: "",
  externalApplyUrl: "",
  applicationInstructions: "",
  description: "",
  requirements: "",
  fundingAmount: "",
  currency: "",
  isFullyFunded: false,
  isFeatured: false,
  isActive: true,
};

export default function PostOpportunityForm() {
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [errors, setErrors] = useState({});

  // ── Slug generation ──────────────────────────────────
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const updateField = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Auto-generate slug when title changes
      if (field === "title") {
        next.slug = generateSlug(value);
      }
      return next;
    });
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // ── Validation ───────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Opportunity title is required";
    if (!form.opportunityType)
      newErrors.opportunityType = "Opportunity type is required";
    if (!form.deadline) newErrors.deadline = "Application deadline is required";
    if (!form.description.trim())
      newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Handlers ─────────────────────────────────────────
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

  // ── Published success screen ─────────────────────────
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
                Opportunity Published!
              </h2>
              <p className="text-muted-foreground mt-2 max-w-sm">
                Your opportunity &quot;{form.title}&quot; is now live and visible
                to thousands of seekers across Kenya and beyond.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button asChild>
                  <Link href="/dashboard/opportunities">
                    <Briefcase className="mr-2 size-4" />
                    View Opportunities
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                >
                  <Link
                    href="/dashboard/opportunities/new"
                    onClick={() => {
                      setIsPublished(false);
                      setForm({ ...INITIAL_FORM });
                    }}
                  >
                    <PlusCircle className="mr-2 size-4" />
                    Post Another Opportunity
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
            <Link href="/dashboard/opportunities">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Post New Opportunity
            </h1>
            <p className="text-muted-foreground">
              Create a scholarship, grant, fellowship, or other opportunity
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ──────────────────────────────────────────────── */}
        {/* Section 1: Basic Info */}
        {/* ──────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Briefcase className="size-5 text-primary" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Core details about the opportunity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Opportunity Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., Aga Khan Foundation Scholarship 2026"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title}</p>
              )}
            </div>

            {/* Slug (auto-generated) */}
            <div className="space-y-2">
              <Label htmlFor="slug" className="flex items-center gap-1.5">
                <LinkIcon className="size-3.5 text-muted-foreground" />
                URL Slug
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  /opportunities/
                </span>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  placeholder="auto-generated-from-title"
                  className="font-mono text-sm"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Auto-generated from title. You can edit it manually.
              </p>
            </div>

            {/* Company */}
            <div className="space-y-2">
              <Label htmlFor="companyId" className="flex items-center gap-1.5">
                <Building2 className="size-3.5 text-muted-foreground" />
                Company <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.companyId}
                onValueChange={(v) => updateField("companyId", v)}
              >
                <SelectTrigger id="companyId" className={errors.companyId ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {/* Company options would be fetched from API in production */}
                  <SelectItem value="create-new">+ Create New Company</SelectItem>
                </SelectContent>
              </Select>
              {errors.companyId && (
                <p className="text-xs text-destructive">{errors.companyId}</p>
              )}
            </div>

            {/* Opportunity Type */}
            <div className="grid gap-4 sm:grid-cols-1">
              <div className="space-y-2">
                <Label htmlFor="opportunityType">
                  Opportunity Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.opportunityType}
                  onValueChange={(v) => updateField("opportunityType", v)}
                >
                  <SelectTrigger
                    id="opportunityType"
                    className={
                      errors.opportunityType ? "border-destructive" : ""
                    }
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {opportunityType.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.opportunityType && (
                  <p className="text-xs text-destructive">
                    {errors.opportunityType}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {/* Category + Source */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category" className="flex items-center gap-1.5">
                  <Tag className="size-3.5 text-muted-foreground" />
                  Category
                </Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => updateField("category", v)}
                >
                  <SelectTrigger id="category">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="source" className="flex items-center gap-1.5">
                  <FileText className="size-3.5 text-muted-foreground" />
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
            </div>
          </CardContent>
        </Card>

        {/* ──────────────────────────────────────────────── */}
        {/* Section 2: Dates */}
        {/* ──────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="size-5 text-primary" />
              Important Dates
            </CardTitle>
            <CardDescription>
              Set deadlines and key dates for the opportunity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Deadline */}
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

            {/* Start + End dates */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => updateField("startDate", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  When the opportunity begins
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => updateField("endDate", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  When the opportunity concludes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ──────────────────────────────────────────────── */}
        {/* Section 3: Application */}
        {/* ──────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <LinkIcon className="size-5 text-primary" />
              Application Details
            </CardTitle>
            <CardDescription>
              How applicants can apply and what they need to know
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* External Apply URL */}
            <div className="space-y-2">
              <Label htmlFor="externalApplyUrl" className="flex items-center gap-1.5">
                <Globe className="size-3.5 text-muted-foreground" />
                External Apply URL
              </Label>
              <Input
                id="externalApplyUrl"
                type="url"
                placeholder="https://example.com/apply"
                value={form.externalApplyUrl}
                onChange={(e) => updateField("externalApplyUrl", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Link to the external application page (if applicable)
              </p>
            </div>

            {/* Application Instructions */}
            <div className="space-y-2">
              <Label htmlFor="applicationInstructions">
                Application Instructions
              </Label>
              <Textarea
                id="applicationInstructions"
                placeholder="Provide instructions on how to apply, required documents, etc."
                value={form.applicationInstructions}
                onChange={(e) =>
                  updateField("applicationInstructions", e.target.value)
                }
                rows={4}
                className="resize-y"
              />
            </div>
          </CardContent>
        </Card>

        {/* ──────────────────────────────────────────────── */}
        {/* Section 4: Content */}
        {/* ──────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              Content & Details
            </CardTitle>
            <CardDescription>
              Provide detailed information about the opportunity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <RichTextEditor
                value={form.description}
                onChange={(md) => updateField("description", md)}
                placeholder="Describe the opportunity in detail — what it offers, who it's for, benefits, and key highlights..."
                error={errors.description}
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description}</p>
              )}
            </div>

            {/* Requirements / Eligibility */}
            <div className="space-y-2">
              <Label htmlFor="requirements">
                Requirements &amp; Eligibility
              </Label>
              <RichTextEditor
                value={form.requirements}
                onChange={(md) => updateField("requirements", md)}
                placeholder="List the eligibility criteria, required qualifications, and any prerequisites..."
              />
            </div>
          </CardContent>
        </Card>

        {/* ──────────────────────────────────────────────── */}
        {/* Section 5: Financials */}
        {/* ──────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="size-5 text-primary" />
              Financial Information
            </CardTitle>
            <CardDescription>
              Funding details and financial benefits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Fully Funded toggle */}
            <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-100 p-2">
                  <Heart className="size-4 text-emerald-600" />
                </div>
                <div>
                  <Label htmlFor="isFullyFunded" className="font-medium">
                    Fully Funded Opportunity
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    All expenses covered — tuition, travel, living costs, etc.
                  </p>
                </div>
              </div>
              <Switch
                id="isFullyFunded"
                checked={form.isFullyFunded}
                onCheckedChange={(v) => updateField("isFullyFunded", v)}
              />
            </div>

            {/* Funding Amount + Currency */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="fundingAmount">
                  Funding Amount / Value
                </Label>
                <Input
                  id="fundingAmount"
                  placeholder="e.g., KES 500,000 / Full tuition / USD 10,000"
                  value={form.fundingAmount}
                  onChange={(e) => updateField("fundingAmount", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  You can enter free text like &quot;Full tuition&quot; or a
                  specific amount
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={form.currency}
                  onValueChange={(v) => updateField("currency", v)}
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Currency" />
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
            </div>
          </CardContent>
        </Card>

        {/* ──────────────────────────────────────────────── */}
        {/* Section 6: Visibility */}
        {/* ──────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="size-5 text-primary" />
              Visibility &amp; Publishing
            </CardTitle>
            <CardDescription>
              Control how this opportunity appears to seekers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Featured */}
            <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-amber-100 p-2">
                  <Star className="size-4 text-amber-600" />
                </div>
                <div>
                  <Label htmlFor="isFeatured" className="font-medium">
                    Featured Opportunity
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Promote this opportunity — appears at the top of listings
                    and gets more views
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

            {/* Active */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Users className="size-4 text-primary" />
                </div>
                <div>
                  <Label htmlFor="isActive" className="font-medium">
                    Active
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Make this opportunity visible to seekers when published
                  </p>
                </div>
              </div>
              <Switch
                id="isActive"
                checked={form.isActive}
                onCheckedChange={(v) => updateField("isActive", v)}
              />
            </div>
          </CardContent>
        </Card>

        {/* ──────────────────────────────────────────────── */}
        {/* Action Buttons */}
        {/* ──────────────────────────────────────────────── */}
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
                Publish Opportunity
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
