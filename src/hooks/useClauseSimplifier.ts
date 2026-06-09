"use client";

import { useState, useCallback } from "react";

interface SimplifyResult {
  simplified: string;
  keyPoints: string[];
  actionItems: string[];
}

export function useClauseSimplifier() {
  const [result, setResult] = useState<SimplifyResult | null>(null);
  const [isSimplifying, setIsSimplifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const simplify = useCallback(async (clause: string, documentTitle: string, lang: "en" | "hi" = "en") => {
    setIsSimplifying(true);
    setError(null);
    try {
      const res = await fetch("/api/simplify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clause, documentTitle, lang }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to simplify");
        return null;
      }
      setResult(data);
      return data as SimplifyResult;
    } catch {
      setError("Network error. Please try again.");
      return null;
    } finally {
      setIsSimplifying(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, isSimplifying, error, simplify, reset };
}
