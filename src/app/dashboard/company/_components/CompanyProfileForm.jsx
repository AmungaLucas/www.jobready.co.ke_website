"use client";

import { useState } from "react";
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

const INITIAL_COMPANY = {
  name: "Safaricom PLC",
  industry: "Telecommunications",
  website: "https://www.safaricom.co.ke",
  foundedYear: "1999",
  companySize: "5000+ employees",
  location: "Nairobi, Kenya",
  address: "Safaricom House, Waiyaki Way, Westlands, Nairobi",
  description:
    "Safaricom is East Africa's leading telecommunications company, providing mobile voice, data, messaging, and financial services to over 40 million subscribers in Kenya. We are the home of M-PESA, the world's most successful mobile money service.\n\nAt Safaricom, we believe in transforming lives through technology. Our vision is to become a purpose-led technology company that connects people to the people, places, and opportunities that matter most. We are committed to driving innovation, empowering communities, and contributing to Kenya's digital transformation.\n\nOur culture is built on innovation, customer-centricity, and a deep commitment to making a positive impact on society. We continuously invest in our people, technology, and infrastructure to deliver exceptional experiences for our customers and stakeholders.",
  linkedin: "https://linkedin.com/company/safaricom",
  twitter: "https://twitter.com/safaricom_care",
  facebook: "https://facebook.com/SafaricomKenya",
  contactName: "Mary Wanjiru",
  contactTitle: "HR Manager",
  contactEmail: "careers@safaricom.co.ke",
  contactPhone: "+254 720 000 000",
};

export default function CompanyProfileForm() {
  const [form, setForm] = useState({ ...INITIAL_COMPANY });
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsSaved(false);
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
              <AvatarFallback className="rounded-xl bg-green-600 text-white text-xl font-bold">
                SC
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{form.name || "Your Company"}</h3>
              <p className="text-sm text-muted-foreground">
                {form.industry || "Industry not set"}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 size-4" />
                  Upload Logo
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
                  <SelectValue />
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
                  <SelectValue />
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
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
