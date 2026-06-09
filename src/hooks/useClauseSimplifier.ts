"use client";

import { useState, useCallback } from "react";
import toast from "react-hot-toast";

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
        const errMsg = data.error || "Failed to simplify";
        if (data.code === "AUTH_ERROR" || data.code === "RATE_LIMIT" || data.code === "SERVICE_UNAVAILABLE") {
          toast.error(`AI Error: ${errMsg}`, { duration: 6000 });
        } else {
          toast.error(errMsg, { duration: 4000 });
        }
        setError(errMsg);
        return null;
      }
      setResult(data);
      return data as SimplifyResult;
    } catch {
      const msg = "Network error. Please try again.";
      toast.error(msg, { duration: 4000 });
      setError(msg);
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
