import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { DemoStoreProvider } from "@/lib/demo-store";
import { ToastProvider } from "@/components/shared/toast-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sahayak AI - Your AI Copilot for Forms & Paperwork",
  description:
    "Upload any form, application, or official document. Sahayak explains it in plain language, extracts fields, flags missing items, drafts answers, and creates a step-by-step submission plan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DemoStoreProvider>
            <ToastProvider />
            {children}
          </DemoStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
