"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm p-4 sm:p-6 safe-area-bottom">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row sm:gap-4">
        <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left leading-relaxed">
          We use essential cookies and privacy-friendly analytics to improve your
          experience. No advertising trackers. See our{" "}
          <Link href="/privacy" className="text-accent underline">
            Privacy Policy
          </Link>{" "}
          for details.
        </p>
        <button
          onClick={accept}
          className="shrink-0 w-full sm:w-auto rounded-xl bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 active:bg-accent/80"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
