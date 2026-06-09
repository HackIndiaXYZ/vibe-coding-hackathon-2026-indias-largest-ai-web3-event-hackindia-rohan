"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sun,
  Moon,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  Loader2,
  Lightbulb,
  ClipboardList,
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "next-themes";
import { useClauseSimplifier } from "@/hooks/useClauseSimplifier";
import { useDemoStore } from "@/lib/demo-store";

const SAMPLE_CLAUSES = [
  "The candidate must be a domicile of the state for a minimum period of 5 years preceding the date of application and must produce a domicile certificate issued by the competent authority.",
  "The scholarship shall be terminated forthwith if the holder fails to maintain a minimum of 75% attendance in any academic session or is found to have indulged in any activity prejudicial to the interests of the institution.",
  "All documents submitted must be self-attested. Original documents shall be produced at the time of interview for verification. Failure to produce originals will result in automatic disqualification.",
];

export default function SimplifyPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useDemoStore();
  const { result, isSimplifying, error, simplify, reset } = useClauseSimplifier();
  const [input, setInput] = useState("");
  const [title, setTitle] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSimplify = () => {
    if (!input.trim()) return;
    simplify(input.trim(), title.trim() || "Document", language);
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.simplified);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <Button
              variant={language === "hi" ? "default" : "ghost"}
              size="sm"
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            >
              {language === "en" ? "HI" : "EN"}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push("/demo")}>
              Try Full Demo
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-3">Clause Simplifier</Badge>
          <h1 className="text-3xl font-bold mb-2">Plain Language, Not Legal Language</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Paste any legal or formal clause from a document, and Sahayak AI will rewrite it in simple, clear language.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Input */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Paste a clause
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Document title (optional)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Scholarship Terms & Conditions"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Legal clause text</label>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste the legal or formal clause here..."
                  className="min-h-[200px] resize-y"
                />
              </div>
              <Button
                onClick={handleSimplify}
                disabled={!input.trim() || isSimplifying}
                className="w-full"
              >
                {isSimplifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Simplifying...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Simplify This Clause
                  </>
                )}
              </Button>

              {/* Sample clauses */}
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground">Try a sample:</p>
                {SAMPLE_CLAUSES.map((clause, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(clause)}
                    className="block w-full text-left text-xs text-muted-foreground rounded border p-2 hover:border-primary/50 hover:text-foreground transition-all truncate"
                  >
                    {clause.slice(0, 100)}...
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Output */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Simplified Version
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {isSimplifying && (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin mb-3" />
                  <p className="text-sm">Translating to plain language...</p>
                </div>
              )}

              {!result && !isSimplifying && !error && (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Sparkles className="h-8 w-8 mb-3 opacity-50" />
                  <p className="text-sm text-center">Paste a clause on the left and click simplify to see the plain-language version here.</p>
                </div>
              )}

              {result && (
                <>
                  <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 space-y-2">
                    <p className="text-sm leading-relaxed">{result.simplified}</p>
                  </div>

                  <Button variant="outline" size="sm" onClick={handleCopy} className="w-full">
                    {copied ? (
                      <><Check className="mr-2 h-3 w-3" /> Copied</>
                    ) : (
                      <><Copy className="mr-2 h-3 w-3" /> Copy Simplified Version</>
                    )}
                  </Button>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                        <ListChecks className="h-3 w-3" /> Key Points
                      </p>
                      <ul className="space-y-1">
                        {result.keyPoints.map((point, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {result.actionItems.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                          <ClipboardList className="h-3 w-3" /> Action Items
                        </p>
                        <ul className="space-y-1">
                          {result.actionItems.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <span className="h-1.5 w-1.5 rounded-full bg-warning shrink-0 mt-1.5" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <Button variant="ghost" size="sm" onClick={reset} className="w-full">
                    Simplify Another Clause
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Why this matters */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-center mb-4">Why Clause Simplification Matters</h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">70%</p>
                <p className="text-sm text-muted-foreground">of Indians struggle with English legal documents</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">45%</p>
                <p className="text-sm text-muted-foreground">of scholarship applications are rejected due to form errors</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">2x</p>
                <p className="text-sm text-muted-foreground">more submissions succeed with plain-language guidance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
