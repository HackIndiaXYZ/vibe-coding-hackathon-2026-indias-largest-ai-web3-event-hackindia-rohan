import type { ParsedDocument, ApplicantProfile, EligibilityResult, ChatMessage } from "@/types";

export function buildDocumentParsingPrompt(rawText: string, fileName: string): string {
  return `Analyze the following document and extract ALL structured information.

DOCUMENT NAME: ${fileName}

DOCUMENT TEXT:
${rawText}

Extract the following in JSON format:
{
  "title": "Document title",
  "issuingAuthority": "Who issued this document",
  "category": "scholarship|reimbursement|admission|government|other",
  "purpose": "What this document is for",
  "deadline": "Deadline if mentioned, null if not",
  "importantDates": [{"label": "Event", "date": "Date"}],
  "eligibilityCriteria": ["List of eligibility requirements"],
  "restrictions": ["Any restrictions or disqualifiers"],
  "requiredFields": [{"name": "Field name", "description": "What to fill", "type": "text|number|date|select|file|checkbox", "required": true}],
  "requiredAttachments": [{"name": "Document name", "description": "Why needed", "format": "Format", "mandatory": true, "urgency": "high|medium|low"}],
  "fees": "Fee information if any, null if none",
  "signatureRequirements": ["Signature/stamp requirements"],
  "sections": [{"title": "Section name", "content": "Section content"}],
  "risks": [{"title": "Risk name", "description": "Details", "severity": "high|medium|low"}],
  "summary": "Plain language summary of what this document requires"
}

Be thorough. Extract every field, requirement, and detail from the document.`;
}

export function buildEligibilityPrompt(
  document: ParsedDocument,
  profile: ApplicantProfile
): string {
  const criteria = document.eligibilityCriteria.join("\n- ");
  return `Determine eligibility based on the following:

DOCUMENT: ${document.title}
ISSUING AUTHORITY: ${document.issuingAuthority}

ELIGIBILITY CRITERIA:
- ${criteria}

APPLICANT PROFILE:
- Name: ${profile.personal.firstName} ${profile.personal.lastName}
- Age: ${profile.personal.dateOfBirth}
- Category: ${profile.personal.category}
- Education: ${profile.education.level} - ${profile.education.course} from ${profile.education.institution}
- Percentage: ${profile.education.percentage}%
- Family Income: ₹${profile.financial.familyIncome}
- State: ${profile.personal.state}
- City: ${profile.personal.city}

Analyze each criterion and return JSON:
{
  "status": "eligible|ineligible|uncertain",
  "confidence": 0.0-1.0,
  "verdict": "Simple explanation of eligibility",
  "criteria": [
    {
      "criterion": "Criterion text",
      "passed": "pass|fail|uncertain",
      "explanation": "Why it passed or failed",
      "profileValue": "What the profile shows",
      "requiredValue": "What the document requires"
    }
  ]
}

Be strict but fair. If information is missing, mark as "uncertain" not "fail".`;
}

export function buildFieldCompletionPrompt(
  document: ParsedDocument,
  profile: ApplicantProfile
): string {
  const fields = document.requiredFields
    .map((f) => `- ${f.name}: ${f.description} (${f.type}${f.required ? ", required" : ""})`)
    .join("\n");

  return `Draft answers for each form field using the applicant's profile.

DOCUMENT: ${document.title}
REQUIRED FIELDS:
${fields}

APPLICANT PROFILE:
${JSON.stringify(profile, null, 2)}

For each field, return JSON:
{
  "answers": [
    {
      "fieldName": "Field name",
      "value": "Draft answer from profile",
      "confidence": "auto-filled|suggested|missing|needs-review",
      "source": "Which profile field this came from",
      "reasoning": "Why this value was chosen"
    }
  ]
}

Rules:
- "auto-filled": Exact match from profile data
- "suggested": Reasonable inference from profile
- "missing": No relevant profile data found
- "needs-review": Uncertain or partial match
- Never fabricate data. If unsure, mark as "needs-review".`;
}

export function buildClauseSimplificationPrompt(clause: string, documentTitle: string): string {
  return `Simplify the following legal/formal clause from "${documentTitle}" into plain, simple language.

Original clause:
"""
${clause}
"""

Return JSON:
{
  "simplified": "Plain language version anyone can understand",
  "keyPoints": ["List of 2-5 key takeaways"],
  "actionItems": ["What the applicant needs to do about this clause"]
}

Rules:
- Use very simple words (grade 8 reading level)
- Keep it brief but complete
- Highlight any deadlines, penalties, or requirements
- If the clause is already simple, just restate it clearly`;
}

export function buildChatPrompt(
  question: string,
  document: ParsedDocument,
  profile: ApplicantProfile,
  eligibility: EligibilityResult | null,
  history: ChatMessage[]
): string {
  const historyStr = history
    .slice(-6)
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  return `You are Sahayak AI. Answer the user's question using ONLY the provided document data and profile.

DOCUMENT CONTEXT:
Title: ${document.title}
Authority: ${document.issuingAuthority}
Summary: ${document.summary}
Eligibility Criteria: ${document.eligibilityCriteria.join("; ")}
Required Documents: ${document.requiredAttachments.map((a) => a.name).join(", ")}
Risks: ${document.risks.map((r) => `${r.title}: ${r.description}`).join("; ")}
Sections: ${document.sections.map((s) => `${s.title}: ${s.content.slice(0, 200)}`).join("\n")}

USER PROFILE:
Name: ${profile.personal.firstName} ${profile.personal.lastName}
Category: ${profile.personal.category}
Education: ${profile.education.level} - ${profile.education.percentage}%
Income: ₹${profile.financial.familyIncome}

${eligibility ? `ELIGIBILITY: ${eligibility.status} (${eligibility.verdict})` : ""}

CONVERSATION HISTORY:
${historyStr || "(No previous messages)"}

QUESTION: ${question}

Rules:
1. Answer ONLY from document data and profile
2. Cite the specific document section your answer comes from
3. If the document doesn't address the question, say so
4. Use simple, clear language
5. Be concise but helpful
6. If you're uncertain, say "This requires manual verification with the issuing authority"

Respond in JSON:
{
  "answer": "Your answer in plain language",
  "citations": [{"text": "Relevant snippet", "source": "Document title", "section": "Section name"}]
}`;
}
