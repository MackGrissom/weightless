"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterCTA() {
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

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage("You're in! Check your inbox for a welcome email.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-8 mt-12">
      <h3 className="text-xl font-bold mb-2">
        Get remote work insights delivered weekly
      </h3>
      <p className="text-muted-foreground mb-6">
        The best new remote jobs, salary data, and nomad city guides — straight
        to your inbox every Tuesday. Free, no spam, unsubscribe anytime.
      </p>

      {status === "success" ? (
        <p className="text-accent font-medium">{message}</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-3 flex-col sm:flex-row">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      )}

      {status === "error" && (
        <p className="text-red-400 text-sm mt-3">{message}</p>
      )}
    </div>
  );
}
