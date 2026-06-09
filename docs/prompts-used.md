# Sahayak AI - Prompts Used

## Frontend
- "Build a Next.js 15 app with TypeScript, Tailwind CSS v4, shadcn/ui for an AI document copilot"
- "Create a landing page with hero section, feature cards, how-it-works steps, and CTA buttons"
- "Build a file upload component with drag-and-drop using react-dropzone"

## Backend / Parsing
- "Create an API route that accepts PDF uploads, extracts text with pdfjs-dist, and sends to NVIDIA NIM for structured parsing"
- "Design a Zod schema for parsed document output with title, authority, eligibility, fields, attachments, risks"
- "Build a document type detector that categorizes uploads as scholarship, reimbursement, admission, or government"

## AI Integration
- "Use Vercel AI SDK with generateObject to get structured output from NVIDIA NIM"
- "Build a chat API that takes document context, user profile, and question, then returns grounded answer with citations"
- "Create prompt builders that inject full document context and profile into chat requests"

## Eligibility Engine
- "Build a deterministic eligibility evaluator that checks income, education, age, category, and state against document criteria"
- "Make each criterion explainable with pass/fail/uncertain status and reasoning"

## Field Completion
- "Map profile fields to form fields using name-based matching with confidence labels"
- "Never invent data. Use auto-filled, suggested, missing, needs-review labels"

## UX / Polish
- "Add dark mode support with next-themes"
- "Create loading states, empty states, and error states for all pages"
- "Design a step indicator wizard for the document-to-submission flow"
