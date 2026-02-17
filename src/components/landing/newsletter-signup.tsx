"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("You're in! Check your inbox for a welcome email.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again.");
    }
  }

  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Stay in the Loop
          </h2>
          <p className="mt-2 text-muted-foreground">
            Get the best new remote jobs delivered to your inbox weekly.
            No spam, unsubscribe anytime.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12"
              disabled={status === "loading" || status === "success"}
            />
            <Button
              type="submit"
              size="lg"
              disabled={status === "loading" || status === "success"}
            >
              {status === "loading" ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>

          {status === "success" && (
            <p className="mt-3 text-sm text-green-400 flex items-center justify-center gap-1">
              <CheckCircle className="h-4 w-4" />
              {message}
            </p>
          )}
          {status === "error" && (
            <p className="mt-3 text-sm text-red-400 flex items-center justify-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
