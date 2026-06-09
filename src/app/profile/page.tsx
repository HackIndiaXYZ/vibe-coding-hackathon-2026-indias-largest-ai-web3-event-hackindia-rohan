"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  ArrowRight,
  ChevronRight,
  Sun,
  Moon,
  GraduationCap,
  Wallet,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useDemoStore } from "@/lib/demo-store";
import { useTheme } from "next-themes";
import type { ApplicantProfile } from "@/types";

export default function ProfilePage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { profile, setProfile, documents } = useDemoStore();
  const [form, setForm] = useState<ApplicantProfile>(
    profile || {
      id: "profile-new",
      personal: {
        firstName: "", lastName: "", dateOfBirth: "", gender: "", nationality: "Indian",
        category: "", email: "", phone: "", address: "", city: "", state: "", pincode: "",
      },
      education: { level: "", institution: "", course: "", year: "", percentage: "", rollNumber: "" },
      financial: { familyIncome: "", bankName: "", accountNumber: "", ifscCode: "" },
      documents: {
        aadhaar: false, panCard: false, incomeCertificate: false, casteCertificate: false,
        marksheet: false, admissionLetter: false, bankPassbook: false, photograph: false, signature: false,
      },
      notes: "",
    }
  );

  useEffect(() => {
    if (documents.length === 0 && !profile) {
      router.push("/demo");
    }
  }, [documents, profile, router]);

  const updatePersonal = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
  };
  const updateEducation = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, education: { ...prev.education, [field]: value } }));
  };
  const updateFinancial = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, financial: { ...prev.financial, [field]: value } }));
  };
  const updateDocuments = (field: string, value: boolean) => {
    setForm((prev) => ({ ...prev, documents: { ...prev.documents, [field]: value } }));
  };

  const handleSave = () => {
    setProfile(form);
    router.push("/eligibility");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">S</div>
            <span className="text-lg font-semibold">Sahayak AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save & Continue
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
          <span className="text-primary cursor-pointer" onClick={() => router.push("/documents")}>1. Document Overview</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">2. Profile</span>
          <ChevronRight className="h-3 w-3" />
          <span>3. Eligibility</span>
          <ChevronRight className="h-3 w-3" />
          <span>4. Checklist</span>
          <ChevronRight className="h-3 w-3" />
          <span>5. Chat</span>
          <ChevronRight className="h-3 w-3" />
          <span>6. Final</span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Applicant Profile</h1>
          <p className="text-muted-foreground text-sm">
            Fill in your details once. Sahayak will use this to auto-fill forms, check eligibility, and generate your checklist.
          </p>
        </div>

        <div className="space-y-6">
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={form.personal.firstName} onChange={(e) => updatePersonal("firstName", e.target.value)} placeholder="Enter first name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={form.personal.lastName} onChange={(e) => updatePersonal("lastName", e.target.value)} placeholder="Enter last name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" value={form.personal.dateOfBirth} onChange={(e) => updatePersonal("dateOfBirth", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="gender">Gender</Label>
                <Input id="gender" value={form.personal.gender} onChange={(e) => updatePersonal("gender", e.target.value)} placeholder="Male / Female / Other" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="category">Category (SC/ST/OBC/GEN/EWS)</Label>
                <Input id="category" value={form.personal.category} onChange={(e) => updatePersonal("category", e.target.value)} placeholder="e.g., SC, OBC-NCL, GEN" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.personal.email} onChange={(e) => updatePersonal("email", e.target.value)} placeholder="email@example.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={form.personal.phone} onChange={(e) => updatePersonal("phone", e.target.value)} placeholder="+91 98765 43210" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="state">State</Label>
                <Input id="state" value={form.personal.state} onChange={(e) => updatePersonal("state", e.target.value)} placeholder="e.g., Rajasthan" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={form.personal.city} onChange={(e) => updatePersonal("city", e.target.value)} placeholder="e.g., Jaipur" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pincode">Pincode</Label>
                <Input id="pincode" value={form.personal.pincode} onChange={(e) => updatePersonal("pincode", e.target.value)} placeholder="e.g., 302001" />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" value={form.personal.address} onChange={(e) => updatePersonal("address", e.target.value)} placeholder="Full address" rows={2} />
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="level">Education Level</Label>
                <Input id="level" value={form.education.level} onChange={(e) => updateEducation("level", e.target.value)} placeholder="e.g., 12th Pass, B.Tech 3rd Year" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="institution">Institution</Label>
                <Input id="institution" value={form.education.institution} onChange={(e) => updateEducation("institution", e.target.value)} placeholder="College/University name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="course">Course / Branch</Label>
                <Input id="course" value={form.education.course} onChange={(e) => updateEducation("course", e.target.value)} placeholder="e.g., B.Tech Computer Science" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="year">Year of Study / Passing</Label>
                <Input id="year" value={form.education.year} onChange={(e) => updateEducation("year", e.target.value)} placeholder="e.g., 2025" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="percentage">Percentage / CGPA</Label>
                <Input id="percentage" value={form.education.percentage} onChange={(e) => updateEducation("percentage", e.target.value)} placeholder="e.g., 82" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input id="rollNumber" value={form.education.rollNumber || ""} onChange={(e) => updateEducation("rollNumber", e.target.value)} placeholder="Optional" />
              </div>
            </CardContent>
          </Card>

          {/* Financial */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Financial & Bank Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="income">Annual Family Income (Rs.)</Label>
                <Input id="income" value={form.financial.familyIncome} onChange={(e) => updateFinancial("familyIncome", e.target.value)} placeholder="e.g., 1,80,000" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input id="bankName" value={form.financial.bankName || ""} onChange={(e) => updateFinancial("bankName", e.target.value)} placeholder="e.g., SBI" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input id="accountNumber" value={form.financial.accountNumber || ""} onChange={(e) => updateFinancial("accountNumber", e.target.value)} placeholder="Bank account number" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ifscCode">IFSC Code</Label>
                <Input id="ifscCode" value={form.financial.ifscCode || ""} onChange={(e) => updateFinancial("ifscCode", e.target.value)} placeholder="e.g., SBIN0001234" />
              </div>
            </CardContent>
          </Card>

          {/* Documents Available */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                Documents Available
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-3">
              {Object.entries(form.documents).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between rounded-lg border p-3">
                  <Label className="text-sm capitalize cursor-pointer">
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                  </Label>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => updateDocuments(key, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={form.notes || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional context about your application..."
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => router.push("/documents")}>Back</Button>
          <Button onClick={handleSave}>
            Save & Check Eligibility
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}
