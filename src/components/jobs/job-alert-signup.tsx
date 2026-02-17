"use client";

import { useState, type FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CATEGORIES = [
  { slug: "", label: "All Categories" },
  { slug: "engineering", label: "Engineering" },
  { slug: "design", label: "Design" },
  { slug: "marketing", label: "Marketing" },
  { slug: "product", label: "Product" },
  { slug: "support", label: "Support" },
  { slug: "writing", label: "Writing" },
  { slug: "data", label: "Data" },
  { slug: "education", label: "Education" },
] as const;

type Frequency = "daily" | "weekly";
type Status = "idle" | "loading" | "success" | "error";

export function JobAlertSignup() {
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [keywords, setKeywords] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("weekly");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          category: category || null,
          keywords: keywords || null,
          frequency,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-accent"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <p className="font-medium text-foreground">Alert created!</p>
          <p className="text-sm text-muted-foreground">
            We&apos;ll notify you at{" "}
            <span className="font-medium text-foreground">{email}</span> when
            new matching jobs are posted.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setStatus("idle");
              setEmail("");
              setCategory("");
              setKeywords("");
              setFrequency("weekly");
            }}
          >
            Create another alert
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-accent"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          Get Job Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email address"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Job category"
            className="flex h-10 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.label}
              </option>
            ))}
          </select>

          <Input
            type="text"
            placeholder="Keywords (optional)"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            maxLength={200}
            aria-label="Keywords"
          />

          <div className="flex gap-1 rounded-lg border border-border bg-input p-1">
            <button
              type="button"
              onClick={() => setFrequency("weekly")}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                frequency === "weekly"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Weekly
            </button>
            <button
              type="button"
              onClick={() => setFrequency("daily")}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                frequency === "daily"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Daily
            </button>
          </div>

          <Button type="submit" disabled={status === "loading"}>
            {status === "loading" ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Creating...
              </span>
            ) : (
              "Create Alert"
            )}
          </Button>

          {status === "error" && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errorMessage}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
