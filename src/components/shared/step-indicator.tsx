"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

const STEPS = [
  { label: "Documents", path: "/documents" },
  { label: "Profile", path: "/profile" },
  { label: "Eligibility", path: "/eligibility" },
  { label: "Checklist", path: "/checklist" },
  { label: "Chat", path: "/chat" },
  { label: "Final", path: "/final" },
];

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground overflow-x-auto">
      {STEPS.map((step, i) => (
        <div key={step.path} className="flex items-center gap-2 whitespace-nowrap">
          <span
            className={`cursor-pointer transition-colors ${
              i === currentStep
                ? "text-foreground font-medium"
                : i < currentStep
                ? "text-primary hover:underline"
                : "text-muted-foreground/60"
            }`}
            onClick={() => router.push(step.path)}
          >
            {i + 1}. {step.label}
          </span>
          {i < STEPS.length - 1 && <ChevronRight className="h-3 w-3 shrink-0" />}
        </div>
      ))}
    </div>
  );
}
