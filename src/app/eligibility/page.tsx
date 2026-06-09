"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ChevronRight,
  Shield,
  Sun,
  Moon,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useDemoStore } from "@/lib/demo-store";
import { useTheme } from "next-themes";

export default function EligibilityPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const {
    activeDocument,
    profile,
    eligibility,
    runEligibility,
    draftAnswers,
    runFieldCompletion,
  } = useDemoStore();

  useEffect(() => {
    if (!profile || !activeDocument) {
      router.push("/demo");
      return;
    }
    if (!eligibility) {
      runEligibility();
    }
    if (draftAnswers.length === 0) {
      runFieldCompletion();
    }
  }, [profile, activeDocument, eligibility, draftAnswers, runEligibility, runFieldCompletion, router]);

  if (!eligibility || !activeDocument) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Evaluating eligibility...</p>
        </div>
      </div>
    );
  }

  const statusIcon = (status: string) => {
    if (status === "pass") return <CheckCircle2 className="h-4 w-4 text-success" />;
    if (status === "fail") return <XCircle className="h-4 w-4 text-destructive" />;
    return <HelpCircle className="h-4 w-4 text-warning" />;
  };

  const statusColor = (status: string): "default" | "destructive" | "secondary" | "outline" => {
    if (status === "pass") return "default";
    if (status === "fail") return "destructive";
    return "secondary";
  };

  const statusBg = (status: string) => {
    if (status === "pass") return "bg-success/10 border-success/20";
    if (status === "fail") return "bg-destructive/10 border-destructive/20";
    return "bg-warning/10 border-warning/20";
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
            <Button size="sm" onClick={() => router.push("/checklist")}>
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
          <span className="text-foreground font-medium">3. Eligibility</span>
          <ChevronRight className="h-3 w-3" />
          <span>4. Checklist</span>
          <ChevronRight className="h-3 w-3" />
          <span>5. Chat</span>
          <ChevronRight className="h-3 w-3" />
          <span>6. Final</span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Eligibility & Field Guidance</h1>
          <p className="text-muted-foreground text-sm">
            Sahayak analyzed <span className="font-medium text-foreground">{activeDocument.title}</span> against your profile.
          </p>
        </div>

        {/* Eligibility Verdict */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Eligibility Verdict
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold ${
                  eligibility.status === "eligible"
                    ? "bg-success/10 text-success"
                    : eligibility.status === "ineligible"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-warning/10 text-warning"
                }`}
              >
                {eligibility.status === "eligible" && <CheckCircle2 className="h-6 w-6" />}
                {eligibility.status === "ineligible" && <XCircle className="h-6 w-6" />}
                {eligibility.status === "uncertain" && <HelpCircle className="h-6 w-6" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={eligibility.status === "eligible" ? "default" : eligibility.status === "ineligible" ? "destructive" : "secondary"} className="capitalize">
                    {eligibility.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(eligibility.confidence * 100)}% confidence
                  </span>
                </div>
                <p className="text-sm">{eligibility.verdict}</p>
              </div>
            </div>
            <Progress value={Math.round(eligibility.confidence * 100)} className="h-2" />
          </CardContent>
        </Card>

        {/* Criteria breakdown */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Criteria Breakdown ({eligibility.criteria.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {eligibility.criteria.map((c, i) => (
              <div key={i} className={`rounded-lg border p-4 space-y-2 ${statusBg(c.passed)}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 flex-1">
                    {statusIcon(c.passed)}
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{c.criterion}</p>
                      <p className="text-sm text-muted-foreground">{c.explanation}</p>
                    </div>
                  </div>
                  <Badge variant={statusColor(c.passed)} className="capitalize text-xs shrink-0">
                    {c.passed}
                  </Badge>
                </div>
                {(c.profileValue || c.requiredValue) && (
                  <div className="pl-6 flex gap-4 text-xs text-muted-foreground">
                    {c.profileValue && <span>Your value: <span className="font-medium text-foreground">{c.profileValue}</span></span>}
                    {c.requiredValue && <span>Required: <span className="font-medium text-foreground">{c.requiredValue}</span></span>}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Field completion preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Field Completion Preview ({draftAnswers.length} fields)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {draftAnswers.slice(0, 8).map((answer) => (
                <div key={answer.fieldId} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{answer.fieldName}</p>
                    {answer.value && (
                      <p className="text-xs text-muted-foreground truncate">{answer.value}</p>
                    )}
                  </div>
                  <Badge
                    variant={
                      answer.confidence === "auto-filled"
                        ? "default"
                        : answer.confidence === "suggested"
                        ? "secondary"
                        : answer.confidence === "needs-review"
                        ? "outline"
                        : "destructive"
                    }
                    className="text-xs shrink-0 ml-2"
                  >
                    {answer.confidence}
                  </Badge>
                </div>
              ))}
              {draftAnswers.length > 8 && (
                <p className="text-xs text-muted-foreground text-center py-2">
                  +{draftAnswers.length - 8} more fields
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => router.push("/profile")}>Back</Button>
          <Button onClick={() => router.push("/checklist")}>
            View Checklist
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}
