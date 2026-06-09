import { z } from "zod";

// ── Document Upload ──
export const UploadedDocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["pdf", "image", "doc"]),
  size: z.number(),
  uploadedAt: z.string(),
  rawText: z.string().optional(),
  pageCount: z.number().optional(),
});

export type UploadedDocument = z.infer<typeof UploadedDocumentSchema>;

// ── Document Sections ──
export const DocumentSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  pageNumber: z.number().optional(),
});

export type DocumentSection = z.infer<typeof DocumentSectionSchema>;

// ── Required Field ──
export const RequiredFieldSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.enum(["text", "number", "date", "select", "file", "checkbox"]),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
  example: z.string().optional(),
});

export type RequiredField = z.infer<typeof RequiredFieldSchema>;

// ── Required Attachment ──
export const RequiredAttachmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  format: z.string().optional(),
  maxSize: z.string().optional(),
  mandatory: z.boolean(),
  urgency: z.enum(["high", "medium", "low"]),
  sectionReference: z.string().optional(),
});

export type RequiredAttachment = z.infer<typeof RequiredAttachmentSchema>;

// ── Parsed Document ──
export const ParsedDocumentSchema = z.object({
  id: z.string(),
  title: z.string(),
  issuingAuthority: z.string(),
  category: z.string(),
  purpose: z.string(),
  deadline: z.string().nullable().optional(),
  importantDates: z.array(z.object({ label: z.string(), date: z.string() })),
  eligibilityCriteria: z.array(z.string()),
  restrictions: z.array(z.string()),
  requiredFields: z.array(RequiredFieldSchema),
  requiredAttachments: z.array(RequiredAttachmentSchema),
  fees: z.string().nullable().optional(),
  signatureRequirements: z.array(z.string()),
  sections: z.array(DocumentSectionSchema),
  rawText: z.string(),
  summary: z.string(),
  risks: z.array(z.object({ id: z.string().optional(), title: z.string(), description: z.string(), severity: z.enum(["high", "medium", "low"]) })),
  documentType: z.enum(["scholarship", "reimbursement", "admission", "government", "other"]),
});

export type ParsedDocument = z.infer<typeof ParsedDocumentSchema>;

// ── Applicant Profile ──
export const ApplicantProfileSchema = z.object({
  id: z.string(),
  personal: z.object({
    firstName: z.string(),
    lastName: z.string(),
    dateOfBirth: z.string(),
    gender: z.string(),
    nationality: z.string(),
    category: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
  }),
  education: z.object({
    level: z.string(),
    institution: z.string(),
    course: z.string(),
    year: z.string(),
    percentage: z.string(),
    rollNumber: z.string().optional(),
  }),
  financial: z.object({
    familyIncome: z.string(),
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    ifscCode: z.string().optional(),
  }),
  documents: z.object({
    aadhaar: z.boolean(),
    panCard: z.boolean(),
    incomeCertificate: z.boolean(),
    casteCertificate: z.boolean(),
    marksheet: z.boolean(),
    admissionLetter: z.boolean(),
    bankPassbook: z.boolean(),
    photograph: z.boolean(),
    signature: z.boolean(),
  }),
  notes: z.string().optional(),
});

export type ApplicantProfile = z.infer<typeof ApplicantProfileSchema>;

// ── Eligibility Rule ──
export const EligibilityRuleSchema = z.object({
  id: z.string(),
  criterion: z.string(),
  profileField: z.string(),
  operator: z.enum(["equals", "contains", "greaterThan", "lessThan", "exists", "in"]),
  expectedValue: z.any(),
  weight: z.number().min(0).max(1),
});

export type EligibilityRule = z.infer<typeof EligibilityRuleSchema>;

// ── Eligibility Result ──
export const EligibilityResultSchema = z.object({
  status: z.enum(["eligible", "ineligible", "uncertain"]),
  confidence: z.number().min(0).max(1),
  verdict: z.string(),
  criteria: z.array(z.object({
    criterion: z.string(),
    passed: z.enum(["pass", "fail", "uncertain"]),
    explanation: z.string(),
    profileValue: z.string().optional(),
    requiredValue: z.string().optional(),
  })),
});

export type EligibilityResult = z.infer<typeof EligibilityResultSchema>;

// ── Draft Answer ──
export const DraftAnswerSchema = z.object({
  fieldId: z.string(),
  fieldName: z.string(),
  value: z.string(),
  confidence: z.enum(["auto-filled", "suggested", "missing", "needs-review"]),
  source: z.string().optional(),
  reasoning: z.string().optional(),
});

export type DraftAnswer = z.infer<typeof DraftAnswerSchema>;

// ── Checklist Item ──
export const ChecklistItemSchema = z.object({
  id: z.string(),
  documentName: z.string(),
  description: z.string(),
  status: z.enum(["available", "missing", "unknown"]),
  reason: z.string(),
  format: z.string().optional(),
  urgency: z.enum(["high", "medium", "low"]),
  sectionReference: z.string().optional(),
  actionLink: z.string().optional(),
});

export type ChecklistItem = z.infer<typeof ChecklistItemSchema>;

// ── Risk Flag ──
export const RiskFlagSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  severity: z.enum(["high", "medium", "low"]),
  mitigation: z.string(),
});

export type RiskFlag = z.infer<typeof RiskFlagSchema>;

// ── Submission Plan ──
export const SubmissionPlanSchema = z.object({
  steps: z.array(z.object({
    order: z.number(),
    action: z.string(),
    description: z.string(),
    deadline: z.string().nullable().optional(),
    priority: z.enum(["critical", "important", "optional"]),
    status: z.enum(["pending", "in-progress", "completed"]),
  })),
  criticalDeadline: z.string().nullable().optional(),
  nextBestAction: z.string(),
});

export type SubmissionPlan = z.infer<typeof SubmissionPlanSchema>;

// ── Readiness Score ──
export const ReadinessScoreSchema = z.object({
  overall: z.number().min(0).max(100),
  eligibility: z.number().min(0).max(100),
  documents: z.number().min(0).max(100),
  fields: z.number().min(0).max(100),
  completeness: z.number().min(0).max(100),
  breakdown: z.array(z.object({
    category: z.string(),
    score: z.number().min(0).max(100),
    details: z.string(),
  })),
});

export type ReadinessScore = z.infer<typeof ReadinessScoreSchema>;

// ── Chat Citation ──
export const ChatCitationSchema = z.object({
  text: z.string(),
  source: z.string(),
  section: z.string().optional(),
  pageNumber: z.number().optional(),
});

export type ChatCitation = z.infer<typeof ChatCitationSchema>;

// ── Chat Message ──
export const ChatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  citations: z.array(ChatCitationSchema).optional(),
  timestamp: z.string(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

// ── Demo State ──
export const DemoStateSchema = z.object({
  documents: z.array(ParsedDocumentSchema),
  profile: ApplicantProfileSchema,
  activeDocumentId: z.string().nullable(),
});

export type DemoState = z.infer<typeof DemoStateSchema>;
