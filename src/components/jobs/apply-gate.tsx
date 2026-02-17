"use client";

import { useState } from "react";
import { ExternalLink, Mail, X, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ApplyGateProps {
  jobId: string;
  applyUrl: string;
  jobTitle: string;
  companyName: string;
}

export function ApplyGate({
  jobId,
  applyUrl,
  jobTitle,
  companyName,
}: ApplyGateProps) {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  async function handleApply(skipEmail = false) {
    setStatus("loading");

    try {
      await fetch("/api/track-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          email: skipEmail ? null : email || null,
        }),
      });
    } catch {
      // Don't block the user if tracking fails
    }

    setStatus("done");
    window.open(applyUrl, "_blank", "noopener,noreferrer");
    setShowModal(false);
    setStatus("idle");
  }

  function handleButtonClick() {
    // Check if user already gave email (stored in localStorage)
    const savedEmail = localStorage.getItem("weightless_email");
    if (savedEmail) {
      setEmail(savedEmail);
      handleApply(false);
      return;
    }
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) {
      localStorage.setItem("weightless_email", email);
    }
    await handleApply(false);
  }

  return (
    <>
      <Button size="lg" onClick={handleButtonClick}>
        {status === "loading" ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <ExternalLink className="mr-2 h-4 w-4" />
        )}
        Apply Now
      </Button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 mb-4">
                <Mail className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold">
                Apply to {companyName}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get the link to apply for <span className="text-foreground font-medium">{jobTitle}</span>, plus similar remote jobs sent to your inbox weekly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                autoFocus
              />
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="mr-2 h-4 w-4" />
                )}
                Get Apply Link
              </Button>
            </form>

            <button
              onClick={() => handleApply(true)}
              className="mt-3 w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip and apply directly
            </button>
          </div>
        </div>
      )}
    </>
  );
}
