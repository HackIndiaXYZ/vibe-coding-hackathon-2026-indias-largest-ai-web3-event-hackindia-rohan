"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Send,
  ArrowRight,
  ChevronRight,
  Sun,
  Moon,
  Bot,
  User,
  FileText,
  Loader2,
  Quote,
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
  } = useDemoStore();

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    if (!activeDocument || !profile) {
      router.push("/demo");
    }
  }, [activeDocument, profile, router]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isSending || !activeDocument || !profile) return;

    idRef.current += 1;
    const userMsg: ChatMessage = {
      id: `msg-${idRef.current}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };
    addChatMessage(userMsg);
    setInput("");
    setIsSending(true);

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
        }),
      });
      const data = await res.json();
      if (res.ok) {
        addChatMessage(data);
      } else {
        idRef.current += 1;
        addChatMessage({
          id: `msg-${idRef.current}-err`,
          role: "assistant",
          content: "Sorry, I couldn't process that question. Please try again.",
          citations: [],
          timestamp: new Date().toISOString(),
        });
      }
    } catch {
      idRef.current += 1;
      addChatMessage({
        id: `msg-${idRef.current}-err`,
        role: "assistant",
        content: "Network error. Please check your connection and try again.",
        citations: [],
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsSending(false);
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
          {chatMessages.length === 0 && (
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

                {/* Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="space-y-1">
                    {msg.citations.map((citation, ci) => (
                      <div key={ci} className="flex items-start gap-2 rounded-lg bg-muted/50 border p-2.5 text-xs">
                        <Quote className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <p className="text-muted-foreground italic">{citation.text}</p>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <FileText className="h-3 w-3" />
                            <span>{citation.source}</span>
                            {citation.section && <span>&middot; {citation.section}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {msg.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}

          {isSending && (
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
