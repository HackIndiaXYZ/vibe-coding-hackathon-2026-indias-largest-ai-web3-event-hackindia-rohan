"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ChevronRight,
  Sun,
  Moon,
  FileWarning,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDemoStore } from "@/lib/demo-store";
import { useTheme } from "next-themes";

export default function ChecklistPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const {
    activeDocument,
    profile,
    checklist,
    runChecklist,
    runScoring,
  } = useDemoStore();

  useEffect(() => {
    if (!profile || !activeDocument) {
      router.push("/demo");
      return;
    }
    if (checklist.length === 0) {
      runChecklist();
    }
  }, [profile, activeDocument, checklist, runChecklist, router]);

  if (!activeDocument || checklist.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Building your checklist...</p>
        </div>
      </div>
    );
  }

  const missingCount = checklist.filter((i) => i.status === "missing").length;
  const availableCount = checklist.filter((i) => i.status === "available").length;
  const unknownCount = checklist.filter((i) => i.status === "unknown").length;

  const statusIcon = (status: string) => {
    if (status === "available") return <CheckCircle2 className="h-4 w-4 text-success shrink-0" />;
    if (status === "missing") return <AlertCircle className="h-4 w-4 text-destructive shrink-0" />;
    return <HelpCircle className="h-4 w-4 text-warning shrink-0" />;
  };

  const urgencyBadge = (urgency: string) => {
    if (urgency === "high") return <Badge variant="destructive" className="text-xs">High Priority</Badge>;
    if (urgency === "medium") return <Badge variant="secondary" className="text-xs">Medium</Badge>;
    return <Badge variant="outline" className="text-xs">Low</Badge>;
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
            <Button size="sm" onClick={() => { runScoring(); router.push("/chat"); }}>
              Continue
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
          <span className="text-primary cursor-pointer" onClick={() => router.push("/documents")}>1. Documents</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary cursor-pointer" onClick={() => router.push("/profile")}>2. Profile</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary cursor-pointer" onClick={() => router.push("/eligibility")}>3. Eligibility</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">4. Checklist</span>
          <ChevronRight className="h-3 w-3" />
          <span>5. Chat</span>
          <ChevronRight className="h-3 w-3" />
          <span>6. Final</span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Document Checklist</h1>
          <p className="text-muted-foreground text-sm">
            Missing documents for <span className="font-medium text-foreground">{activeDocument.title}</span>
          </p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className={missingCount > 0 ? "border-destructive/50" : ""}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-destructive">{missingCount}</p>
              <p className="text-xs text-muted-foreground">Missing</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-success">{availableCount}</p>
              <p className="text-xs text-muted-foreground">Available</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-warning">{unknownCount}</p>
              <p className="text-xs text-muted-foreground">Unknown</p>
            </CardContent>
          </Card>
        </div>

        {/* Missing documents (highlighted) */}
        {missingCount > 0 && (
          <Card className="mb-6 border-destructive/30">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-destructive">
                <FileWarning className="h-4 w-4" />
                Missing Documents ({missingCount})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {checklist
                .filter((i) => i.status === "missing")
                .map((item) => (
                  <div key={item.id} className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {statusIcon(item.status)}
                        <span className="text-sm font-medium">{item.documentName}</span>
                      </div>
                      {urgencyBadge(item.urgency)}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <p className="text-xs text-destructive">{item.reason}</p>
                    {item.format && (
                      <p className="text-xs text-muted-foreground">Format: {item.format}</p>
                    )}
                  </div>
                ))}
            </CardContent>
          </Card>
        )}

        {/* Available documents */}
        {availableCount > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-success">
                <CheckCircle2 className="h-4 w-4" />
                Available Documents ({availableCount})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {checklist
                .filter((i) => i.status === "available")
                .map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      {statusIcon(item.status)}
                      <span className="text-sm">{item.documentName}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">Ready</Badge>
                  </div>
                ))}
            </CardContent>
          </Card>
        )}

        {/* Unknown documents */}
        {unknownCount > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-warning">
                <HelpCircle className="h-4 w-4" />
                Needs Verification ({unknownCount})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {checklist
                .filter((i) => i.status === "unknown")
                .map((item) => (
                  <div key={item.id} className="flex items-start justify-between rounded-lg border p-3 gap-2">
                    <div className="flex items-center gap-2">
                      {statusIcon(item.status)}
                      <div>
                        <span className="text-sm font-medium">{item.documentName}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.reason}</p>
                      </div>
                    </div>
                    {urgencyBadge(item.urgency)}
                  </div>
                ))}
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => router.push("/eligibility")}>Back</Button>
          <Button onClick={() => { runScoring(); router.push("/chat"); }}>
            Ask Sahayak
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}
