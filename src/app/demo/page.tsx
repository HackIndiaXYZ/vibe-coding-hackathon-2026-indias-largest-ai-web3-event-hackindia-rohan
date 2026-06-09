"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileText,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon,
  Zap,
  X,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useDemoStore } from "@/lib/demo-store";
import { useTheme } from "next-themes";

export default function DemoPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const {
    setDocuments,
    loadDemo,
    isLoading,
    setLoading,
  } = useDemoStore();

  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      setUploadedFiles((prev) => [...prev, ...acceptedFiles]);
    },
    []
  );

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    multiple: true,
  });

  const handleParseUpload = async () => {
    if (uploadedFiles.length === 0) return;
    setLoading(true);
    setUploadProgress("Extracting text from documents...");
    setError(null);

    try {
      const formData = new FormData();
      uploadedFiles.forEach((file) => formData.append("files", file));

      setUploadProgress("AI is parsing your documents...");
      const res = await fetch("/api/parse", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to parse documents");
      }

      setUploadProgress("Documents parsed successfully!");
      setDocuments(data.documents);

      // Auto-navigate after brief delay
      setTimeout(() => router.push("/documents"), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse documents");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadDemo = async () => {
    setLoading(true);
    try {
      await loadDemo();
      router.push("/documents");
    } catch {
      setError("Failed to load demo data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
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
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        {/* Page header */}
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-4">
            Document Intake
          </Badge>
          <h1 className="text-3xl font-bold mb-3">Upload your documents</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Drop your forms, applications, or document packs. Sahayak will parse, extract,
            and organize everything for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                  ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}
                `}
              >
                <input {...getInputProps()} />
                <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">
                  {isDragActive ? "Drop files here..." : "Drag & drop files here"}
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, PNG, JPG up to 10MB each
                </p>
              </div>

              {/* Uploaded files list */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Uploaded files:</p>
                  {uploadedFiles.map((file, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-2.5">
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate max-w-[200px]">{file.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {(file.size / 1024).toFixed(0)} KB
                        </Badge>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(i);
                        }}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg p-3">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {uploadProgress && !error && (
                <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 rounded-lg p-3">
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                  <span>{uploadProgress}</span>
                </div>
              )}

              <Button
                onClick={handleParseUpload}
                disabled={uploadedFiles.length === 0 || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Parsing...
                  </>
                ) : (
                  <>
                    Parse Documents
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Demo mode section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Try Demo Mode</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Explore Sahayak with pre-loaded sample documents and a seeded applicant profile.
                No setup required.
              </p>

              <div className="space-y-2">
                {[
                  {
                    title: "Post-Matric Scholarship for SC/ST",
                    type: "Scholarship",
                    authority: "Ministry of Social Justice",
                    match: "Eligible",
                  },
                  {
                    title: "Medical Reimbursement Claim",
                    type: "Reimbursement",
                    authority: "ABC Technologies HR",
                    match: "Partially eligible",
                  },
                  {
                    title: "B.Tech Admission Application",
                    type: "Admission",
                    authority: "NIT Admissions Office",
                    match: "Needs review",
                  },
                ].map((doc, i) => (
                  <div key={i} className="rounded-lg border p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{doc.title}</span>
                      <Badge variant="secondary" className="text-xs">
                        {doc.type}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{doc.authority}</span>
                      <span
                        className={
                          doc.match === "Eligible"
                            ? "text-success"
                            : doc.match === "Partially eligible"
                            ? "text-warning"
                            : "text-info"
                        }
                      >
                        {doc.match}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium">Demo Profile</p>
                <div className="rounded-lg bg-muted/50 p-3 text-sm space-y-1">
                  <p><span className="text-muted-foreground">Name:</span> Priya Sharma</p>
                  <p><span className="text-muted-foreground">Category:</span> SC</p>
                  <p><span className="text-muted-foreground">Education:</span> 12th Pass (82%)</p>
                  <p><span className="text-muted-foreground">Income:</span> Rs.1,80,000/year</p>
                </div>
              </div>

              <Button
                onClick={handleLoadDemo}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading demo...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Load Demo & Start
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                <CheckCircle2 className="inline h-3 w-3 mr-1" />
                Works instantly, no API key needed for demo mode
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
