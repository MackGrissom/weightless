"use client";

import { useState, useEffect, type ReactNode } from "react";
import { Lock, CheckCircle, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "weightless_data_unlocked";

interface DataGateProps {
  /** Content shown before the gate (always visible) */
  preview: ReactNode;
  /** Content hidden behind the gate */
  children: ReactNode;
  /** Headline for the unlock prompt */
  headline?: string;
  /** Subheadline for the unlock prompt */
  subheadline?: string;
}

export function DataGate({
  preview,
  children,
  headline = "Unlock full data",
  subheadline = "Enter your email to access all salary benchmarks, trends, and insights — free.",
}: DataGateProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "true") setUnlocked(true);
    }
  }, []);

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      localStorage.setItem(STORAGE_KEY, "true");
      setStatus("success");
      setTimeout(() => setUnlocked(true), 600);
    } catch {
      setStatus("error");
    }
  }

  if (unlocked) {
    return (
      <>
        {preview}
        {children}
      </>
    );
  }

  return (
    <>
      {preview}

      {/* Gated content with blur overlay */}
      <div className="relative mt-8">
        {/* Blurred preview of gated content */}
        <div className="blur-[6px] opacity-40 pointer-events-none select-none" aria-hidden="true">
          {children}
        </div>

        {/* Unlock overlay */}
        <div className="absolute inset-0 flex items-start justify-center pt-16">
          <Card className="w-full max-w-md p-8 text-center shadow-2xl border-accent/20 bg-background/95 backdrop-blur-sm">
            <Lock className="h-8 w-8 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">{headline}</h3>
            <p className="text-sm text-muted-foreground mb-6">{subheadline}</p>

            {status === "success" ? (
              <div className="flex items-center justify-center gap-2 text-green-400">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Unlocked! Loading data...</span>
              </div>
            ) : (
              <form onSubmit={handleUnlock} className="space-y-3">
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-center"
                />
                <Button type="submit" className="w-full" disabled={status === "loading"}>
                  {status === "loading" ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Unlocking...
                    </span>
                  ) : (
                    "Get Free Access"
                  )}
                </Button>
                {status === "error" && (
                  <p className="flex items-center justify-center gap-1 text-xs text-red-400">
                    <AlertCircle className="h-3 w-3" />
                    Something went wrong. Try again.
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground/60">
                  No spam, ever. Unsubscribe anytime.
                </p>
              </form>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
