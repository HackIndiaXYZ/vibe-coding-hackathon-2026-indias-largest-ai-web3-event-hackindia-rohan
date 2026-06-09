"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import localforage from "localforage";
import type {
  ParsedDocument,
  ApplicantProfile,
  EligibilityResult,
  DraftAnswer,
  ChecklistItem,
  ReadinessScore,
  SubmissionPlan,
  ChatMessage,
} from "@/types";
import { evaluateEligibility } from "@/lib/eligibility/engine";
import { generateDraftAnswers } from "@/lib/profile/field-mapper";
import { generateChecklist } from "@/lib/checklist/engine";
import { calculateReadiness } from "@/lib/scoring/engine";

interface DemoStore {
  // State
  documents: ParsedDocument[];
  activeDocument: ParsedDocument | null;
  profile: ApplicantProfile | null;
  eligibility: EligibilityResult | null;
  draftAnswers: DraftAnswer[];
  checklist: ChecklistItem[];
  readiness: ReadinessScore | null;
  submissionPlan: SubmissionPlan | null;
  chatMessages: ChatMessage[];
  isLoading: boolean;
  currentStep: number;
  language: "en" | "hi";

  // Actions
  setDocuments: (docs: ParsedDocument[]) => void;
  setActiveDocument: (doc: ParsedDocument | null) => void;
  setProfile: (profile: ApplicantProfile) => void;
  runEligibility: () => void;
  runFieldCompletion: () => void;
  runChecklist: () => void;
  runScoring: () => void;
  addChatMessage: (msg: ChatMessage) => void;
  setLoading: (loading: boolean) => void;
  setCurrentStep: (step: number) => void;
  setLanguage: (lang: "en" | "hi") => void;
  loadDemo: () => Promise<void>;
}

const DemoStoreContext = createContext<DemoStore | null>(null);

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [documents, setDocumentsState] = useState<ParsedDocument[]>([]);
  const [activeDocument, setActiveDocument] = useState<ParsedDocument | null>(null);
  const [profile, setProfile] = useState<ApplicantProfile | null>(null);
  const [eligibility, setEligibility] = useState<EligibilityResult | null>(null);
  const [draftAnswers, setDraftAnswers] = useState<DraftAnswer[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [readiness, setReadiness] = useState<ReadinessScore | null>(null);
  const [submissionPlan, setSubmissionPlan] = useState<SubmissionPlan | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const docs = await localforage.getItem<ParsedDocument[]>("sahayak-docs");
        const prof = await localforage.getItem<ApplicantProfile>("sahayak-profile");
        const msgs = await localforage.getItem<ChatMessage[]>("sahayak-chat");
        const lang = await localforage.getItem<"en" | "hi">("sahayak-lang");
        if (docs?.length) { setDocumentsState(docs); setActiveDocument(docs[0]); }
        if (prof) setProfile(prof);
        if (msgs?.length) setChatMessages(msgs);
        if (lang) setLanguage(lang);
      } catch { /* ignore */ }
      setHydrated(true);
    };
    load();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localforage.setItem("sahayak-docs", documents);
    localforage.setItem("sahayak-profile", profile);
    localforage.setItem("sahayak-chat", chatMessages);
    localforage.setItem("sahayak-lang", language);
  }, [documents, profile, chatMessages, language, hydrated]);

  const setDocuments = useCallback((docs: ParsedDocument[]) => {
    setDocumentsState(docs);
    if (docs.length > 0) {
      setActiveDocument(docs[0]);
    }
  }, []);

  const runEligibility = useCallback(() => {
    if (activeDocument && profile) {
      const result = evaluateEligibility(activeDocument, profile);
      setEligibility(result);
    }
  }, [activeDocument, profile]);

  const runFieldCompletion = useCallback(() => {
    if (activeDocument && profile) {
      const answers = generateDraftAnswers(activeDocument, profile);
      setDraftAnswers(answers);
    }
  }, [activeDocument, profile]);

  const runChecklist = useCallback(() => {
    if (activeDocument && profile) {
      const items = generateChecklist(activeDocument, profile);
      setChecklist(items);
    }
  }, [activeDocument, profile]);

  const runScoring = useCallback(() => {
    if (activeDocument && profile && eligibility) {
      const score = calculateReadiness(
        activeDocument,
        profile,
        eligibility,
        draftAnswers,
        checklist
      );
      setReadiness(score);

      // Generate submission plan
      const plan: SubmissionPlan = {
        steps: [
          {
            order: 1,
            action: "Review eligibility result",
            description: "Check if you meet all criteria for this application",
            deadline: activeDocument.deadline,
            priority: "critical",
            status: "completed",
          },
          {
            order: 2,
            action: "Gather missing documents",
            description: `Collect ${checklist.filter((c) => c.status === "missing").length} missing documents`,
            deadline: activeDocument.deadline,
            priority: "critical",
            status: "pending",
          },
          {
            order: 3,
            action: "Fill application fields",
            description: `Complete ${draftAnswers.filter((d) => d.confidence === "missing").length} fields that need manual input`,
            deadline: activeDocument.deadline,
            priority: "important",
            status: "pending",
          },
          {
            order: 4,
            action: "Review and verify all answers",
            description: "Check suggested answers marked as 'needs review'",
            deadline: activeDocument.deadline,
            priority: "important",
            status: "pending",
          },
          {
            order: 5,
            action: "Submit application",
            description: "Final submission with all documents and verified data",
            deadline: activeDocument.deadline,
            priority: "critical",
            status: "pending",
          },
        ],
        criticalDeadline: activeDocument.deadline,
        nextBestAction: checklist.filter((c) => c.status === "missing" && c.urgency === "high").length > 0
          ? "Upload missing high-priority documents"
          : "Review and submit application",
      };
      setSubmissionPlan(plan);
    }
  }, [activeDocument, profile, eligibility, draftAnswers, checklist]);

  const addChatMessage = useCallback((msg: ChatMessage) => {
    setChatMessages((prev) => [...prev, msg]);
  }, []);

  const loadDemo = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/demo");
      const data = await res.json();
      setDocumentsState(data.documents);
      setActiveDocument(data.documents[0]);
      setProfile(data.profile);
    } catch (error) {
      console.error("Failed to load demo:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <DemoStoreContext.Provider
      value={{
        documents,
        activeDocument,
        profile,
        eligibility,
        draftAnswers,
        checklist,
        readiness,
        submissionPlan,
        chatMessages,
        isLoading,
        currentStep,
        language,
        setDocuments,
        setActiveDocument,
        setProfile,
        runEligibility,
        runFieldCompletion,
        runChecklist,
        runScoring,
        addChatMessage,
        setLoading: setIsLoading,
        setCurrentStep,
        setLanguage,
        loadDemo,
      }}
    >
      {children}
    </DemoStoreContext.Provider>
  );
}

export function useDemoStore() {
  const context = useContext(DemoStoreContext);
  if (!context) {
    throw new Error("useDemoStore must be used within a DemoStoreProvider");
  }
  return context;
}
