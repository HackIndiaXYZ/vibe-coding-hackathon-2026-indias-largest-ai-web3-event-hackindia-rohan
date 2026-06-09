"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  AlertTriangle,
  Clock,
  ChevronRight,
  ArrowRight,
  Loader2,
  Info,
  Shield,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDemoStore } from "@/lib/demo-store";
import { useTheme } from "next-themes";

export default function DocumentsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { documents, activeDocument, setActiveDocument } = useDemoStore();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (documents.length === 0) {
      router.push("/demo");
    }
  }, [documents, router]);

  if (!activeDocument) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const severityColor = (s: string): "destructive" | "secondary" | "outline" => {
    if (s === "high") return "destructive";
    if (s === "medium") return "secondary";
    return "outline";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
            <Button size="sm" onClick={() => router.push("/profile")}>
              Continue
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
          <span className="text-foreground font-medium">1. Document Overview</span>
          <ChevronRight className="h-3 w-3" />
          <span>2. Profile</span>
          <ChevronRight className="h-3 w-3" />
          <span>3. Eligibility</span>
          <ChevronRight className="h-3 w-3" />
          <span>4. Checklist</span>
          <ChevronRight className="h-3 w-3" />
          <span>5. Chat</span>
          <ChevronRight className="h-3 w-3" />
          <span>6. Final</span>
        </div>

        {/* Document tabs */}
        {documents.length > 1 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setActiveDocument(doc)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm whitespace-nowrap transition-all ${
                  activeDocument.id === doc.id
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-muted-foreground/25 text-muted-foreground hover:border-primary/50"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                {doc.title.length > 40 ? doc.title.slice(0, 40) + "..." : doc.title}
              </button>
            ))}
          </div>
        )}

        {/* Main content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="fields">Fields</TabsTrigger>
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
            <TabsTrigger value="risks">Risks</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Document summary card */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{activeDocument.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{activeDocument.issuingAuthority}</p>
                  </div>
                  <Badge variant="secondary" className="capitalize">{activeDocument.documentType}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm leading-relaxed">{activeDocument.summary}</p>
                </div>

                {/* Key info grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {activeDocument.deadline && (
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground mb-1">Deadline</p>
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(activeDocument.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  )}
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground mb-1">Required Fields</p>
                    <p className="text-sm font-medium">{activeDocument.requiredFields.length} fields</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground mb-1">Attachments</p>
                    <p className="text-sm font-medium">{activeDocument.requiredAttachments.length} documents</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground mb-1">Eligibility Criteria</p>
                    <p className="text-sm font-medium">{activeDocument.eligibilityCriteria.length} criteria</p>
                  </div>
                </div>

                {activeDocument.fees && (
                  <div className="rounded-lg bg-info-light dark:bg-info/10 p-3 text-sm">
                    <span className="font-medium">Fee:</span> {activeDocument.fees}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Important dates */}
            {activeDocument.importantDates.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Important Dates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {activeDocument.importantDates.map((date, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                        <span className="text-sm">{date.label}</span>
                        <Badge variant="outline">{date.date}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sections summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Document Sections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeDocument.sections.map((section) => (
                  <div key={section.id} className="rounded-lg border p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{section.title}</span>
                      <div className="flex items-center gap-2">
                        {section.pageNumber && <Badge variant="outline" className="text-xs">Page {section.pageNumber}</Badge>}
                        <button
                          onClick={() => router.push(`/simplify?clause=${encodeURIComponent(section.content)}&title=${encodeURIComponent(activeDocument.title)}`)}
                          className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                          title="Simplify this clause"
                        >
                          <Sparkles className="h-3 w-3" />
                          Simplify
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">{section.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fields Tab */}
          <TabsContent value="fields" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Required Fields ({activeDocument.requiredFields.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {activeDocument.requiredFields.map((field) => (
                    <div key={field.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">{field.name}</p>
                        <p className="text-xs text-muted-foreground">{field.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{field.type}</Badge>
                        {field.required && <Badge className="text-xs">Required</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attachments Tab */}
          <TabsContent value="attachments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Required Documents ({activeDocument.requiredAttachments.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {activeDocument.requiredAttachments.map((att) => (
                    <div key={att.id} className="flex items-start justify-between rounded-lg border p-3 gap-4">
                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{att.name}</p>
                          {att.mandatory && <Badge variant="destructive" className="text-xs">Mandatory</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">{att.description}</p>
                        {att.sectionReference && (
                          <p className="text-xs text-info flex items-center gap-1">
                            <Info className="h-3 w-3" /> {att.sectionReference}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant={severityColor(att.urgency)} className="text-xs">{att.urgency}</Badge>
                        {att.format && <span className="text-xs text-muted-foreground">{att.format}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risks Tab */}
          <TabsContent value="risks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Risk Flags ({activeDocument.risks.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {activeDocument.risks.map((risk) => (
                    <div key={risk.id} className="rounded-lg border p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-warning" />
                          <p className="text-sm font-medium">{risk.title}</p>
                        </div>
                        <Badge variant={severityColor(risk.severity)} className="text-xs">{risk.severity}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground pl-6">{risk.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Signature requirements */}
        {activeDocument.signatureRequirements.length > 0 && (
          <Card className="mt-6">
            <CardContent className="p-4">
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Signature & Format Requirements
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 pl-6 list-disc">
                {activeDocument.signatureRequirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => router.push("/demo")}>
            Back to Upload
          </Button>
          <Button onClick={() => router.push("/profile")}>
            Continue to Profile
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}
