"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronRight,
  Sun,
  Moon,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Target,
  FileText,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useDemoStore } from "@/lib/demo-store";
import { useTheme } from "next-themes";

export default function FinalPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const {
    activeDocument,
    profile,
    eligibility,
    draftAnswers,
    checklist,
    readiness,
    submissionPlan,
    runScoring,
    runChecklist,
    runEligibility,
    runFieldCompletion,
  } = useDemoStore();

  useEffect(() => {
    if (!profile || !activeDocument) {
      router.push("/demo");
      return;
    }
    if (!eligibility) runEligibility();
    if (draftAnswers.length === 0) runFieldCompletion();
    if (checklist.length === 0) runChecklist();
    if (!readiness) runScoring();
  }, [profile, activeDocument, eligibility, draftAnswers, checklist, readiness, runEligibility, runFieldCompletion, runChecklist, runScoring, router]);

  if (!readiness || !activeDocument) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">Generating your final pack...</p>
        </div>
      </div>
    );
  }

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 50) return "text-warning";
    return "text-destructive";
  };

  const missingFields = draftAnswers.filter((a) => a.confidence === "missing");
  const missingDocs = checklist.filter((c) => c.status === "missing");

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
          <span className="text-primary cursor-pointer" onClick={() => router.push("/checklist")}>4. Checklist</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary cursor-pointer" onClick={() => router.push("/chat")}>5. Chat</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">6. Final Pack</span>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Submission Readiness</h1>
          <p className="text-muted-foreground text-sm">
            Final review for <span className="font-medium text-foreground">{activeDocument.title}</span>
          </p>
        </div>

        {/* Overall Score */}
        <Card className="mb-6 overflow-hidden">
          <CardContent className="p-8 text-center space-y-4">
            <div className={`text-6xl font-bold ${scoreColor(readiness.overall)}`}>
              {readiness.overall}%
            </div>
            <p className="text-lg font-medium">Overall Readiness Score</p>
            <Progress value={readiness.overall} className="h-3 max-w-md mx-auto" />
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              {readiness.overall >= 80
                ? "You are well-prepared to submit this application."
                : readiness.overall >= 50
                ? "You are partially ready. Address the items below to improve."
                : "Several items need attention before you can submit."}
            </p>
          </CardContent>
        </Card>

        {/* Score breakdown */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {readiness.breakdown.map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.category}</span>
                  <span className={`text-sm font-bold ${scoreColor(item.score)}`}>{item.score}%</span>
                </div>
                <Progress value={item.score} className="h-2" />
                <p className="text-xs text-muted-foreground">{item.details}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Completed fields */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Completed Fields ({draftAnswers.filter((a) => a.confidence === "auto-filled" || a.confidence === "suggested").length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-60 overflow-y-auto">
              {draftAnswers
                .filter((a) => a.confidence === "auto-filled" || a.confidence === "suggested")
                .slice(0, 10)
                .map((a) => (
                  <div key={a.fieldId} className="flex items-center justify-between rounded border p-2 text-sm">
                    <span className="truncate">{a.fieldName}</span>
                    <Badge variant={a.confidence === "auto-filled" ? "default" : "secondary"} className="text-xs shrink-0">
                      {a.confidence}
                    </Badge>
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Missing fields */}
          <Card className={missingFields.length > 0 ? "border-warning/50" : ""}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Missing Fields ({missingFields.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-60 overflow-y-auto">
              {missingFields.length === 0 ? (
                <p className="text-sm text-muted-foreground">All fields have data. Great!</p>
              ) : (
                missingFields.map((a) => (
                  <div key={a.fieldId} className="flex items-center justify-between rounded border border-warning/30 p-2 text-sm">
                    <span className="truncate">{a.fieldName}</span>
                    <Badge variant="outline" className="text-xs shrink-0">Needs input</Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Missing documents */}
        {missingDocs.length > 0 && (
          <Card className="mb-6 border-destructive/30">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-destructive">
                <FileText className="h-4 w-4" />
                Missing Documents ({missingDocs.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {missingDocs.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded border border-destructive/20 p-3">
                  <div>
                    <span className="text-sm font-medium">{item.documentName}</span>
                    <p className="text-xs text-muted-foreground">{item.reason}</p>
                  </div>
                  <Badge variant="destructive" className="text-xs">{item.urgency}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Risk flags */}
        {activeDocument.risks.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Risk Flags
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {activeDocument.risks.map((risk) => (
                <div key={risk.id} className="rounded border p-3 text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{risk.title}</span>
                    <Badge variant={risk.severity === "high" ? "destructive" : "secondary"} className="text-xs">{risk.severity}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{risk.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Submission plan */}
        {submissionPlan && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4" />
                Submission Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {submissionPlan.steps.map((step) => (
                <div key={step.order} className="flex items-start gap-3">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    step.status === "completed" ? "bg-success text-white" : "bg-muted text-muted-foreground"
                  }`}>
                    {step.order}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{step.action}</span>
                      <Badge variant={step.priority === "critical" ? "destructive" : step.priority === "important" ? "secondary" : "outline"} className="text-xs">
                        {step.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                    {step.deadline && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" /> Deadline: {step.deadline}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {submissionPlan.criticalDeadline && (
                <div className="mt-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm">
                  <span className="font-medium text-destructive">Critical Deadline: </span>
                  <span>{submissionPlan.criticalDeadline}</span>
                </div>
              )}
              <div className="rounded-lg bg-primary/10 border border-primary/20 p-3 text-sm">
                <span className="font-medium">Next Best Action: </span>
                <span>{submissionPlan.nextBestAction}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Before/After */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-center mb-4">Before & After Sahayak AI</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 space-y-2">
                <p className="text-sm font-medium text-destructive">Before</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>&bull; Confusing PDF with legal language</li>
                  <li>&bull; No idea which documents are needed</li>
                  <li>&bull; Uncertain about eligibility</li>
                  <li>&bull; Manual field-by-field filling</li>
                  <li>&bull; Risk of missing deadlines</li>
                </ul>
              </div>
              <div className="rounded-lg border border-success/20 bg-success/5 p-4 space-y-2">
                <p className="text-sm font-medium text-success">After Sahayak AI</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>&bull; Plain language explanation</li>
                  <li>&bull; Prioritized document checklist</li>
                  <li>&bull; Clear eligibility verdict with reasoning</li>
                  <li>&bull; Auto-drafted answers with confidence labels</li>
                  <li>&bull; Deadline-aware submission plan</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/chat")}>Back to Chat</Button>
          <Button onClick={() => router.push("/workflow")}>
            View AI Workflow
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}
