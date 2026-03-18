"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Small delay for smooth entry
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  function accept() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up safe-area-bottom">
      <div className="mx-auto max-w-lg p-3 sm:p-4">
        <div className="rounded-2xl border border-border bg-card/95 backdrop-blur-xl p-4 shadow-2xl">
          <p className="text-xs sm:text-sm text-muted-foreground text-center leading-relaxed">
            We use privacy-friendly analytics. No ad trackers.{" "}
            <Link href="/privacy" className="text-accent underline">
              Privacy Policy
            </Link>
          </p>
          <button
            onClick={accept}
            className="mt-3 w-full rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-all active:scale-95"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
