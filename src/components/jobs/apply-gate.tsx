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
  const [salaryRange, setSalaryRange] = useState("");
  const [userLocation, setUserLocation] = useState("");
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
          salaryRange: salaryRange || null,
          userLocation: userLocation || null,
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
      <Button size="lg" onClick={handleButtonClick} className="h-12">
        {status === "loading" ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <ExternalLink className="mr-2 h-4 w-4" />
        )}
        Apply Now
      </Button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md animate-sheet-backdrop" onClick={() => setShowModal(false)} aria-hidden="true" />
          <div className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-border bg-background/98 backdrop-blur-2xl p-6 shadow-2xl safe-area-bottom animate-sheet-up sm:animate-scale-in">
            {/* Drag handle on mobile */}
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border sm:hidden" />

            <button
              onClick={() => setShowModal(false)}
              className="absolute right-3 top-3 h-9 w-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 mb-4">
                <Mail className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold">
                Apply to {companyName}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Get the link to apply for <span className="text-foreground font-medium">{jobTitle}</span>, plus similar remote jobs sent to your inbox weekly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-base"
                autoFocus
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  className="flex-1 h-11 rounded-lg border border-border bg-input px-3 text-sm text-muted-foreground"
                >
                  <option value="">Current salary (optional)</option>
                  <option value="0-50k">Under $50k</option>
                  <option value="50-80k">$50k – $80k</option>
                  <option value="80-120k">$80k – $120k</option>
                  <option value="120-160k">$120k – $160k</option>
                  <option value="160-200k">$160k – $200k</option>
                  <option value="200k+">$200k+</option>
                </select>
                <Input
                  type="text"
                  placeholder="City (optional)"
                  value={userLocation}
                  onChange={(e) => setUserLocation(e.target.value)}
                  className="flex-1 h-11 text-sm"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-base"
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
              className="mt-4 w-full text-center py-2.5 text-sm text-muted-foreground hover:text-foreground active:text-accent transition-colors"
            >
              Skip and apply directly
            </button>
          </div>
        </div>
      )}
    </>
  );
}
