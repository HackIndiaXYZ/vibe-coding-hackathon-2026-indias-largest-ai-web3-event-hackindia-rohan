"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  FileText,
  ClipboardList,
  MessageSquareText,
  Shield,
  Sparkles,
  Sun,
  Moon,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "next-themes";

const steps = [
  {
    step: "01",
    title: "Upload Document",
    description: "Drop a PDF, scanned image, or document pack.",
  },
  {
    step: "02",
    title: "AI Parses Everything",
    description: "Fields, deadlines, eligibility, risks, and attachments extracted.",
  },
  {
    step: "03",
    title: "Add Your Profile",
    description: "Fill your details once. Reusable across any form.",
  },
  {
    step: "04",
    title: "Get Your Action Plan",
    description: "Eligibility verdict, missing docs checklist, and submission timeline.",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
              S
            </div>
            <span className="text-lg font-semibold">Sahayak AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push("/workflow")}>
              AI Workflow
            </Button>
            <Button size="sm" onClick={() => router.push("/demo")}>
              Try Demo <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section — left-aligned */}
        <section className="border-b">
          <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
            <div className="max-w-2xl space-y-6">
              <Badge variant="secondary" className="text-xs font-medium w-fit">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Copilot for Forms & Paperwork
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Turn confusing forms into{" "}
                <span className="text-primary">clear action plans</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Sahayak AI transforms scholarship forms, admission applications,
                reimbursement claims, and government documents into a plain-language
                checklist, guided flow, and ready-to-submit package.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-3 pt-2">
                <Button size="lg" onClick={() => router.push("/demo")}>
                  Try Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => router.push("/workflow")}>
                  See AI Workflow
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities — asymmetric 2-col top, full-width callout, 2-col bottom */}
        <section className="border-b py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 space-y-6">
            {/* Top row: 2 cards side by side */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm bg-muted/30">
                <CardContent className="p-6 space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Understand Any Form</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Upload any scholarship, admission, reimbursement, or government form.
                    Sahayak extracts every field, requirement, deadline, and clause in plain language.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm bg-muted/30">
                <CardContent className="p-6 space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                    <ClipboardList className="h-5 w-5 text-success" />
                  </div>
                  <h3 className="font-semibold text-lg">Auto-build Your Checklist</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Instantly know which documents you have, which are missing, and what to gather
                    first. Prioritized by urgency with clear reasons.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Full-width callout — Simplify Any Clause */}
            <Card className="border-0 shadow-sm bg-primary/5">
              <CardContent className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Sparkles className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-xl">Simplify Any Clause</h3>
                    <p className="text-muted-foreground leading-relaxed max-w-2xl">
                      Paste any legal or formal clause and get an instant plain-language rewrite
                      with key points and action items. No more guessing what the fine print means.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    onClick={() => router.push("/simplify")}
                  >
                    Try It <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Bottom row: 2 cards side by side */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm bg-muted/30">
                <CardContent className="p-6 space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                    <MessageSquareText className="h-5 w-5 text-info" />
                  </div>
                  <h3 className="font-semibold text-lg">Ask & Auto-fill</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Ask grounded questions about any clause or requirement. Draft answers from
                    your profile with confidence labels. Never guess again.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm bg-muted/30">
                <CardContent className="p-6 space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                    <Shield className="h-5 w-5 text-warning" />
                  </div>
                  <h3 className="font-semibold text-lg">Grounded, Not Guessed</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Every answer cites the specific document section it comes from.
                    No hallucinations. No fabrications. You stay in control.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works — left-aligned, horizontal steps */}
        <section className="border-b py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-12">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-8">
              {steps.map((step, i) => (
                <div key={i} className="relative space-y-3">
                  <div className="text-xs font-mono text-muted-foreground tracking-wider">
                    {step.step}
                  </div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-3 -right-4 w-4 h-px bg-border" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-10">
              <Button variant="outline" onClick={() => router.push("/demo")}>
                Get Started <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Use Cases — 2+1 asymmetric */}
        <section className="border-b py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-12">
              Built for real paperwork
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Scholarship Forms",
                  desc: "Post-matric, merit-based, and need-based scholarships from government and private bodies.",
                  items: ["Eligibility check", "Document checklist", "Deadline tracking"],
                },
                {
                  title: "Medical Reimbursement",
                  desc: "Employee health claims, insurance forms, and hospital reimbursement packs.",
                  items: ["Policy explanation", "Receipt validation", "Claim drafting"],
                },
                {
                  title: "College Admissions",
                  desc: "Application forms, counselling registration, and document verification.",
                  items: ["Requirement analysis", "Profile matching", "Submission plan"],
                },
              ].map((useCase, i) => (
                <Card key={i} className="border shadow-sm">
                  <CardContent className="p-6 space-y-3">
                    <h3 className="font-semibold">{useCase.title}</h3>
                    <p className="text-sm text-muted-foreground">{useCase.desc}</p>
                    <ul className="space-y-1.5 pt-1">
                      {useCase.items.map((item, j) => (
                        <li
                          key={j}
                          className="text-sm text-muted-foreground flex items-center gap-2"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Trust — left-aligned */}
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="max-w-2xl space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Grounded in your documents, not AI guesses
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Every answer, checklist item, and draft response is grounded in the
                actual document text and your profile. Sahayak cites sources, admits
                uncertainty, and never fabricates official requirements. You stay in
                control.
              </p>
              <div className="pt-2">
                <Button size="lg" onClick={() => router.push("/demo")}>
                  Try Sahayak AI <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-4 text-sm text-muted-foreground">
          Built for HackIndia 2026. Powered by Next.js and NVIDIA NIM.
        </div>
      </footer>
    </div>
  );
}
