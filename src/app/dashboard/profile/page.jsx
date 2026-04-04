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
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Code2,
  Plus,
  Trash2,
  Camera,
  Upload,
  Save,
  CheckCircle2,
  X,
  FileText,
  Link as LinkIcon,
} from "lucide-react";

// ── Mock Data ──────────────────────────────────────────
const INITIAL_PROFILE = {
  // Personal Info
  firstName: "John",
  lastName: "Kamau",
  email: "john.kamau@email.com",
  phone: "+254 786 090 635",
  location: "Nairobi, Kenya",
  bio: "Experienced software engineer with 5+ years building scalable web applications. Passionate about clean code, user experience, and leveraging technology to solve real problems in the Kenyan market.",
  linkedinUrl: "https://linkedin.com/in/johnkamau",
  portfolioUrl: "https://johnkamau.dev",

  // Education
  education: [
    {
      id: 1,
      institution: "University of Nairobi",
      degree: "Bachelor of Science in Computer Science",
      field: "Computer Science",
      startYear: "2015",
      endYear: "2019",
    },
    {
      id: 2,
      institution: "Strathmore University",
      degree: "Professional Certification",
      field: "Project Management (PMP)",
      startYear: "2021",
      endYear: "2021",
    },
  ],

  // Work Experience
  experience: [
    {
      id: 1,
      company: "TechVentures Kenya",
      position: "Senior Software Engineer",
      startYear: "2022",
      endYear: "Present",
      description: "Leading a team of 5 developers building fintech solutions. Architected microservices handling 50K+ daily transactions.",
    },
    {
      id: 2,
      company: "Andela",
      position: "Software Engineer",
      startYear: "2019",
      endYear: "2022",
      description: "Worked as a full-stack engineer on international client projects. Built REST APIs, React frontends, and deployed cloud infrastructure.",
    },
  ],

  // Skills
  skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "PostgreSQL", "AWS", "Docker", "Git"],
};

const COMPLETION_SECTIONS = [
  { key: "personal", label: "Personal Info", complete: true },
  { key: "education", label: "Education", complete: true },
  { key: "experience", label: "Work Experience", complete: true },
  { key: "skills", label: "Skills & Certifications", complete: true },
];

// ── Component ──────────────────────────────────────────
export default function ProfilePage() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [activeTab, setActiveTab] = useState("personal");
  const [newSkill, setNewSkill] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const completedSections = COMPLETION_SECTIONS.filter((s) => s.complete).length;
  const completeness = Math.round((completedSections / COMPLETION_SECTIONS.length) * 100);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !profile.skills.includes(trimmed)) {
      setProfile((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleRemoveEducation = (id) => {
    setProfile((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
  };

  const handleRemoveExperience = (id) => {
    setProfile((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My CV / Profile</h1>
          <p className="text-muted-foreground">
            Manage your professional profile and CV details
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="gap-2"
        >
          {saved ? (
            <>
              <CheckCircle2 className="size-4" />
              Saved!
            </>
          ) : isSaving ? (
            <>
              <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Saving...
            </>
          ) : (
            <>
              <Save className="size-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Profile Completeness */}
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold">Profile Completeness</h3>
              <p className="text-xs text-muted-foreground">
                A complete profile increases your chances of getting noticed by employers
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Progress value={completeness} className="w-32 h-2" />
              <span className="text-sm font-semibold text-primary">{completeness}%</span>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-4">
            {COMPLETION_SECTIONS.map((section) => (
              <div key={section.key} className="flex items-center gap-1.5 text-xs">
                {section.complete ? (
                  <CheckCircle2 className="size-3.5 text-secondary" />
                ) : (
                  <div className="size-3.5 rounded-full border-2 border-muted" />
                )}
                <span className={section.complete ? "text-muted-foreground" : "font-medium"}>
                  {section.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Avatar Section */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold">
                {profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}
              </div>
              <button className="absolute -bottom-1 -right-1 rounded-full bg-primary text-white p-1.5 shadow-sm hover:bg-primary-dark transition-colors">
                <Camera className="size-3.5" />
              </button>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">
                {profile.firstName} {profile.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" className="text-xs h-8 gap-1">
                  <Upload className="size-3" />
                  Upload Photo
                </Button>
                <Button variant="ghost" size="sm" className="text-xs h-8 text-destructive hover:text-destructive">
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto gap-1 bg-muted/50 p-1">
          <TabsTrigger value="personal" className="text-sm">Personal Info</TabsTrigger>
          <TabsTrigger value="education" className="text-sm">Education</TabsTrigger>
          <TabsTrigger value="experience" className="text-sm">Work Experience</TabsTrigger>
          <TabsTrigger value="skills" className="text-sm">Skills</TabsTrigger>
        </TabsList>

        {/* Personal Info Tab */}
        <TabsContent value="personal" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
              <CardDescription>
                Basic details that appear on your CV and profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-1.5">
                    <Mail className="size-3.5" /> Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-1.5">
                    <Phone className="size-3.5" /> Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-1.5">
                  <MapPin className="size-3.5" /> Location
                </Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="flex items-center gap-1.5">
                  <FileText className="size-3.5" /> Professional Summary
                </Label>
                <Textarea
                  id="bio"
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                  placeholder="Write a brief professional summary..."
                />
                <p className="text-xs text-muted-foreground">
                  {profile.bio.length}/500 characters
                </p>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="flex items-center gap-1.5">
                    <LinkIcon className="size-3.5" /> LinkedIn URL
                  </Label>
                  <Input
                    id="linkedin"
                    value={profile.linkedinUrl}
                    onChange={(e) => setProfile((p) => ({ ...p, linkedinUrl: e.target.value }))}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolio" className="flex items-center gap-1.5">
                    <LinkIcon className="size-3.5" /> Portfolio URL
                  </Label>
                  <Input
                    id="portfolio"
                    value={profile.portfolioUrl}
                    onChange={(e) => setProfile((p) => ({ ...p, portfolioUrl: e.target.value }))}
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Education</CardTitle>
                  <CardDescription>Your academic qualifications</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-1">
                  <Plus className="size-4" />
                  Add Education
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.education.length === 0 ? (
                <div className="text-center py-8">
                  <GraduationCap className="size-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No education added yet. Add your qualifications to strengthen your profile.
                  </p>
                </div>
              ) : (
                profile.education.map((edu) => (
                  <div
                    key={edu.id}
                    className="relative rounded-lg border p-4 hover:bg-muted/30 transition-colors"
                  >
                    <button
                      onClick={() => handleRemoveEducation(edu.id)}
                      className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="size-4" />
                    </button>
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2 mt-0.5">
                        <GraduationCap className="size-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm">{edu.degree}</h4>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        {edu.field && (
                          <p className="text-xs text-muted-foreground mt-0.5">{edu.field}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {edu.startYear} — {edu.endYear}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Work Experience Tab */}
        <TabsContent value="experience" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Work Experience</CardTitle>
                  <CardDescription>Your professional work history</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-1">
                  <Plus className="size-4" />
                  Add Experience
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.experience.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="size-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No work experience added yet. Add your employment history to showcase your skills.
                  </p>
                </div>
              ) : (
                profile.experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="relative rounded-lg border p-4 hover:bg-muted/30 transition-colors"
                  >
                    <button
                      onClick={() => handleRemoveExperience(exp.id)}
                      className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="size-4" />
                    </button>
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-secondary/10 p-2 mt-0.5">
                        <Briefcase className="size-4 text-secondary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm">{exp.position}</h4>
                        <p className="text-sm text-muted-foreground">{exp.company}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {exp.startYear} — {exp.endYear}
                        </p>
                        {exp.description && (
                          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Skills & Certifications</CardTitle>
              <CardDescription>
                Add your technical and professional skills
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Skill */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                    placeholder="Add a skill (e.g., JavaScript, Python...)"
                    className="pl-9"
                  />
                </div>
                <Button onClick={handleAddSkill} variant="outline" className="shrink-0">
                  <Plus className="size-4 mr-1" />
                  Add
                </Button>
              </div>

              {/* Skills Grid */}
              {profile.skills.length === 0 ? (
                <div className="text-center py-8">
                  <Code2 className="size-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No skills added yet. Add your skills to help employers find you.
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="px-3 py-1.5 text-sm gap-1.5 cursor-default"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-destructive transition-colors"
                        title={`Remove ${skill}`}
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <Separator />

              {/* Suggested Skills */}
              <div>
                <h4 className="text-sm font-medium mb-2">Suggested Skills</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Click to add skills relevant to your profile
                </p>
                <div className="flex flex-wrap gap-2">
                  {["REST APIs", "Agile/Scrum", "GraphQL", "Kubernetes", "CI/CD", "MongoDB"]
                    .filter((s) => !profile.skills.includes(s))
                    .map((skill) => (
                      <button
                        key={skill}
                        onClick={() =>
                          setProfile((prev) => ({
                            ...prev,
                            skills: [...prev.skills, skill],
                          }))
                        }
                        className="inline-flex items-center gap-1 rounded-full border border-dashed border-muted-foreground/30 px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors"
                      >
                        <Plus className="size-3" />
                        {skill}
                      </button>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
