"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Sun,
  Moon,
  FileSearch,
  Bot,
  Shield,
  ClipboardList,
  MessageSquare,
  Target,
  Layers,
  Zap,
  Eye,
  Code2,
  Database,
  BrainCircuit,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";

const aiComponents = [
  {
    icon: FileSearch,
    title: "OCR & Text Extraction",
    type: "AI",
    description: "PDF.js extracts text from uploaded documents. For scanned images, OCR fallback processes them into readable text.",
    tech: "pdfjs-dist, image preprocessing",
    color: "text-info",
  },
  {
    icon: BrainCircuit,
    title: "Structured Document Parsing",
    type: "AI",
    description: "NVIDIA NIM (Llama 3.3 70B) analyzes raw document text and extracts structured fields: title, authority, eligibility rules, required documents, risks, and more.",
    tech: "Vercel AI SDK + NVIDIA NIM, Zod schemas",
    color: "text-primary",
  },
  {
    icon: Shield,
    title: "Eligibility Engine",
    type: "Deterministic + AI",
    description: "Combines rule-based matching (income thresholds, age checks, category matching) with AI-assisted interpretation of complex criteria.",
    tech: "TypeScript rule engine, regex matching, AI fallback",
    color: "text-success",
  },
  {
    icon: Layers,
    title: "Field Completion Assistant",
    type: "Deterministic",
    description: "Maps profile data to form fields using intelligent name matching. Each field is labeled with confidence: auto-filled, suggested, missing, or needs-review.",
    tech: "String matching, heuristic mapping",
    color: "text-warning",
  },
  {
    icon: ClipboardList,
    title: "Missing Documents Engine",
    type: "Deterministic",
    description: "Cross-references required attachments against user profile document availability. Generates prioritized checklist with urgency levels.",
    tech: "Profile-document matching, priority scoring",
    color: "text-info",
  },
  {
    icon: MessageSquare,
    title: "Grounded Chat (Ask Sahayak)",
    type: "AI",
    description: "Chat assistant that answers questions using ONLY extracted document data and user profile. Cites specific sections in every answer.",
    tech: "NVIDIA NIM (Llama 3.3 70B), RAG-style context injection",
    color: "text-primary",
  },
  {
    icon: Target,
    title: "Readiness Scoring",
    type: "Deterministic",
    description: "Transparent scoring based on eligibility match, document completeness, field completion, and profile thoroughness. Fully explainable.",
    tech: "Weighted scoring algorithm",
    color: "text-success",
  },
  {
    icon: Bot,
    title: "Submission Planner",
    type: "Deterministic + AI",
    description: "Generates personalized action plans based on missing items, deadlines, and priority analysis.",
    tech: "Priority queue, deadline extraction, action generation",
    color: "text-warning",
  },
  {
    icon: Sparkles,
    title: "Clause Simplifier",
    type: "AI",
    description: "Translates legal/formal clauses into plain language. Accepts any legal text and returns a simplified version with key points and action items.",
    tech: "NVIDIA NIM (Llama 3.3 70B), structured prompt engineering",
    color: "text-warning",
  },
];

export default function WorkflowPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

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
            <Button variant="outline" size="sm" onClick={() => router.push("/demo")}>
              Try Demo
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            For Judges & Reviewers
          </Badge>
          <h1 className="text-3xl font-bold mb-3">AI Workflow Architecture</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sahayak AI is an AI-native application where every core feature is powered by artificial intelligence,
            combined with deterministic logic for reliability and transparency.
          </p>
        </div>

        {/* Architecture overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Why This Is More Than a Chatbot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Structured Extraction", desc: "Not just Q&A. Sahayak parses documents into structured schemas with field types, requirements, and metadata." },
                { title: "Deterministic Logic", desc: "Eligibility, field mapping, and checklist generation use rule engines, not just AI. Transparent and explainable." },
                { title: "Grounded Responses", desc: "Every chat answer is grounded in extracted document data. Citations prove the source. No hallucinations." },
              ].map((item, i) => (
                <div key={i} className="rounded-lg border p-4 space-y-2">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Components */}
        <div className="space-y-4 mb-8">
          {aiComponents.map((comp, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted`}>
                    <comp.icon className={`h-5 w-5 ${comp.color}`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold">{comp.title}</h3>
                      <Badge variant={comp.type === "AI" ? "default" : comp.type.includes("+") ? "secondary" : "outline"} className="text-xs">
                        {comp.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{comp.description}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Code2 className="h-3 w-3" />
                      {comp.tech}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tech Stack */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="h-4 w-4" />
              Technology Stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { category: "Frontend", items: ["Next.js 15 (App Router)", "React 19", "TypeScript", "Tailwind CSS v4", "shadcn/ui"] },
                { category: "AI Integration", items: ["Vercel AI SDK", "NVIDIA NIM (Llama 3.3 70B)", "Structured output (Zod)", "Grounded chat with citations"] },
                { category: "Document Processing", items: ["pdfjs-dist for PDF parsing", "Image upload support", "OCR fallback pipeline", "Document type detection"] },
                { category: "Logic & Scoring", items: ["Deterministic eligibility engine", "Rule-based field mapping", "Priority checklist generation", "Transparent readiness scoring"] },
              ].map((stack, i) => (
                <div key={i} className="rounded-lg border p-4 space-y-2">
                  <p className="text-sm font-medium">{stack.category}</p>
                  <ul className="text-xs text-muted-foreground space-y-0.5">
                    {stack.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-1.5">
                        <Zap className="h-3 w-3 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Flow */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base">Data Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-stretch gap-2">
              {[
                { step: "Upload", desc: "PDF/Image" },
                { step: "Parse", desc: "Text extraction" },
                { step: "Extract", desc: "AI structuring" },
                { step: "Profile", desc: "User data" },
                { step: "Analyze", desc: "Eligibility + fields" },
                { step: "Plan", desc: "Action items" },
              ].map((s, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className="w-full rounded-lg border bg-muted/50 p-3 text-center">
                    <p className="text-sm font-medium">{s.step}</p>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                  {i < 5 && <ArrowRight className="h-4 w-4 text-muted-foreground my-1 rotate-90 md:rotate-0" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button onClick={() => router.push("/demo")} size="lg">
            Try the Demo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}
