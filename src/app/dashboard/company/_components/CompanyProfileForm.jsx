"use client";

import { useState, useRef, useMemo } from "react";
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
  Instagram,
  Search,
  Target,
  Heart,
  Tags,
} from "lucide-react";
import {
  organizationIndustry,
  organizationLocation,
} from "@/data/org_data";

const COMPANY_SIZES = [
  { value: "STARTUP", label: "Startup (1-10)" },
  { value: "SMALL", label: "Small (11-50)" },
  { value: "MEDIUM", label: "Medium (51-200)" },
  { value: "LARGE", label: "Large (201-1000)" },
  { value: "ENTERPRISE", label: "Enterprise (1000+)" },
];

const INITIAL_COMPANY = {
  name: "Safaricom PLC",
  tagline: "Transforming lives through technology",
  industry: "TELECOMMUNICATIONS",
  email: "info@safaricom.co.ke",
  phone: "+254 720 000 000",
  website: "https://www.safaricom.co.ke",
  companySize: "ENTERPRISE",
  country: "KE",
  region: "Nairobi",
  city: "Westlands",
  location: "Nairobi, Kenya",
  description:
    "Safaricom is East Africa's leading telecommunications company, providing mobile voice, data, messaging, and financial services to over 40 million subscribers in Kenya. We are the home of M-PESA, the world's most successful mobile money service.\n\nAt Safaricom, we believe in transforming lives through technology. Our vision is to become a purpose-led technology company that connects people to the people, places, and opportunities that matter most. We are committed to driving innovation, empowering communities, and contributing to Kenya's digital transformation.\n\nOur culture is built on innovation, customer-centricity, and a deep commitment to making a positive impact on society. We continuously invest in our people, technology, and infrastructure to deliver exceptional experiences for our customers and stakeholders.",
  missionStatement:
    "To transform lives by connecting people to the people, places, and opportunities that matter most.",
  values:
    "Innovation, Customer-Centricity, Integrity, Excellence, Collaboration, and Social Impact.",
  linkedin: "https://linkedin.com/company/safaricom",
  twitter: "https://twitter.com/safaricom_care",
  facebook: "https://facebook.com/SafaricomKenya",
  instagram: "https://instagram.com/safaricom",
  tiktok: "https://tiktok.com/@safaricom",
  contactName: "Mary Wanjiru",
  contactTitle: "HR Manager",
  contactEmail: "careers@safaricom.co.ke",
  contactPhone: "+254 720 000 000",
  logo: "",
  metaTitle: "Safaricom PLC - Careers | JobReady.co.ke",
  metaDescription:
    "Join Safaricom PLC, East Africa's leading telecommunications company. Explore job opportunities and build your career with us.",
};

export default function CompanyProfileForm() {
  const [form, setForm] = useState({ ...INITIAL_COMPANY });
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Derive regions from selected country
  const selectedCountry = useMemo(() => {
    return organizationLocation.find((loc) => loc.code === form.country) || null;
  }, [form.country]);

  const regions = selectedCountry ? selectedCountry.regions : [];

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleCountryChange = (countryCode) => {
    // Reset region when country changes
    setForm((prev) => ({
      ...prev,
      country: countryCode,
      region: "",
    }));
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
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Company Profile</h1>
          <p className="text-muted-foreground">
            Manage your company information visible to job seekers
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
              Save Changes
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
                {form.industry
                  ? organizationIndustry.find((i) => i.value === form.industry)?.label || form.industry
                  : "Industry not set"}
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
          <div className="grid gap-4 sm:grid-cols-1">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select
                value={form.industry}
                onValueChange={(v) => updateField("industry", v)}
              >
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {organizationIndustry.map((ind) => (
                    <SelectItem key={ind.value} value={ind.value}>
                      {ind.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline" className="flex items-center gap-2">
              <Tags className="size-4 text-muted-foreground" />
              Tagline
            </Label>
            <Input
              id="tagline"
              placeholder="A short, memorable phrase about your company"
              value={form.tagline}
              onChange={(e) => updateField("tagline", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              A brief tagline that captures your company&apos;s essence (max 120 characters).
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyEmail" className="flex items-center gap-2">
                <Mail className="size-4 text-muted-foreground" />
                Company Email
              </Label>
              <Input
                id="companyEmail"
                type="email"
                placeholder="info@company.com"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyPhone" className="flex items-center gap-2">
                <Phone className="size-4 text-muted-foreground" />
                Company Phone
              </Label>
              <Input
                id="companyPhone"
                placeholder="+254 700 000 000"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              placeholder="https://www.example.com"
              value={form.website}
              onChange={(e) => updateField("website", e.target.value)}
            />
          </div>

          <Separator />

          {/* Location Section */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2 text-base font-medium">
              <MapPin className="size-5 text-primary" />
              Location
            </Label>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
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
                <Label htmlFor="region">Region / County</Label>
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
                          : "Select a country first"
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

            <div className="grid gap-4 sm:grid-cols-1">
              <div className="space-y-2">
                <Label htmlFor="city">City / Town</Label>
                <Input
                  id="city"
                  placeholder="e.g., Westlands"
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                />
              </div>
            </div>
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

      {/* Mission & Values */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="size-5 text-primary" />
            Mission &amp; Values
          </CardTitle>
          <CardDescription>
            Define what drives your organization and the principles you stand for
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="missionStatement" className="flex items-center gap-2">
              <Target className="size-4 text-muted-foreground" />
              Mission Statement
            </Label>
            <Textarea
              id="missionStatement"
              placeholder="What is your company's mission? Why does your organization exist?"
              rows={4}
              value={form.missionStatement}
              onChange={(e) => updateField("missionStatement", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              A clear mission statement helps candidates understand your company&apos;s purpose.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="values" className="flex items-center gap-2">
              <Heart className="size-4 text-muted-foreground" />
              Core Values
            </Label>
            <Textarea
              id="values"
              placeholder="List your company's core values, e.g., Innovation, Integrity, Excellence..."
              rows={3}
              value={form.values}
              onChange={(e) => updateField("values", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Separate values with commas or list them on new lines.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="size-5 text-primary" />
            Social Media &amp; Online Presence
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

            <div className="space-y-2">
              <Label htmlFor="instagram" className="flex items-center gap-2">
                <Instagram className="size-4 text-pink-600" />
                Instagram
              </Label>
              <Input
                id="instagram"
                placeholder="https://instagram.com/yourcompany"
                value={form.instagram}
                onChange={(e) => updateField("instagram", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tiktok" className="flex items-center gap-2">
                <svg
                  className="size-4 text-black dark:text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V12.6a8.28 8.28 0 005.58 2.16V11.3a4.83 4.83 0 01-3.77-1.78V6.69h3.77z" />
                </svg>
                TikTok
              </Label>
              <Input
                id="tiktok"
                placeholder="https://tiktok.com/@yourcompany"
                value={form.tiktok}
                onChange={(e) => updateField("tiktok", e.target.value)}
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

      {/* SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="size-5 text-primary" />
            SEO Settings
          </CardTitle>
          <CardDescription>
            Optimize your company profile for search engines
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              placeholder="Company Name - Careers | JobReady.co.ke"
              value={form.metaTitle}
              onChange={(e) => updateField("metaTitle", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Recommended: 50-60 characters. This appears in search engine results.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              placeholder="A brief description of your company for search engine results..."
              rows={3}
              value={form.metaDescription}
              onChange={(e) => updateField("metaDescription", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Recommended: 150-160 characters. This appears below the title in search results.
            </p>
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
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
