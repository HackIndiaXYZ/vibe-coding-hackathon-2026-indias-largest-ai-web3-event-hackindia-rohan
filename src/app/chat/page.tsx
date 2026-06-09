"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Send,
  ArrowRight,
  ChevronRight,
  Sun,
  Moon,
  Bot,
  User,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDemoStore } from "@/lib/demo-store";
import { useTheme } from "next-themes";
import type { ChatMessage } from "@/types";

const SUGGESTED_QUESTIONS = [
  "Am I eligible for this scholarship?",
  "What documents am I missing?",
  "What should I upload first?",
  "Explain the eligibility criteria in simple language.",
  "What is the deadline and what happens if I miss it?",
  "What are the risks I should watch out for?",
];

export default function ChatPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const {
    activeDocument,
    profile,
    eligibility,
    chatMessages,
    addChatMessage,
    runScoring,
    language,
    setLanguage,
  } = useDemoStore();

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const msgIdRef = useRef(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, streamingText]);

  useEffect(() => {
    if (!activeDocument || !profile) {
      router.push("/demo");
    }
  }, [activeDocument, profile, router]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isSending || !activeDocument || !profile) return;

    const userMsg: ChatMessage = {
      id: `msg-${++msgIdRef.current}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };
    addChatMessage(userMsg);
    setInput("");
    setIsSending(true);
    setStreamingText("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: text.trim(),
          document: activeDocument,
          profile,
          eligibility,
          history: chatMessages,
          lang: language,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const errMsg = data?.error || "Failed to get response";
        if (data?.code === "AUTH_ERROR" || data?.code === "RATE_LIMIT" || data?.code === "SERVICE_UNAVAILABLE") {
          toast.error(`AI Error: ${errMsg}`, { duration: 6000 });
        } else {
          toast.error(errMsg, { duration: 4000 });
        }
        throw new Error(errMsg);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;
          setStreamingText(fullText);
        }
      }

      if (fullText) {
        addChatMessage({
          id: `msg-${++msgIdRef.current}-resp`,
          role: "assistant",
          content: fullText,
          citations: [],
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to process question";
      if (!msg.includes("AI Error")) {
        toast.error(msg, { duration: 4000 });
      }
      addChatMessage({
        id: `msg-${++msgIdRef.current}-err`,
        role: "assistant",
        content: msg.includes("AI Error") ? msg.replace("AI Error: ", "") : "Sorry, I couldn't process that question. Please try again.",
        citations: [],
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsSending(false);
      setStreamingText("");
    }
  };

  if (!activeDocument || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
            <Button size="sm" onClick={() => { runScoring(); router.push("/final"); }}>
              Final Pack
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </header>

      {/* Step indicator */}
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-primary cursor-pointer" onClick={() => router.push("/documents")}>1. Documents</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary cursor-pointer" onClick={() => router.push("/profile")}>2. Profile</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary cursor-pointer" onClick={() => router.push("/eligibility")}>3. Eligibility</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary cursor-pointer" onClick={() => router.push("/checklist")}>4. Checklist</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">5. Ask Sahayak</span>
            <ChevronRight className="h-3 w-3" />
            <span>6. Final</span>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6 space-y-4">
          {/* Welcome message */}
          {chatMessages.length === 0 && !streamingText && (
            <div className="text-center space-y-4 py-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-1">Ask Sahayak</h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  I can answer questions about <span className="font-medium text-foreground">{activeDocument.title}</span> using the document data and your profile.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto">
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    className="rounded-lg border p-3 text-left text-sm hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {chatMessages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div className={`max-w-[80%] space-y-2 ${msg.role === "user" ? "order-1" : ""}`}>
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
              {msg.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}

          {/* Streaming response */}
          {streamingText && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="max-w-[80%]">
                <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-3 text-sm leading-relaxed">
                  {streamingText}
                  <span className="inline-block w-1.5 h-4 bg-primary/60 animate-pulse ml-0.5 align-text-bottom" />
                </div>
              </div>
            </div>
          )}

          {isSending && !streamingText && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-3">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Thinking...
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-background">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this document..."
              disabled={isSending}
              className="flex-1"
            />
            <Button type="submit" disabled={isSending || !input.trim()} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
