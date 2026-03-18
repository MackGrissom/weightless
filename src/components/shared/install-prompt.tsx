"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("pwa-install-dismissed")) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
    setDismissed(true);
  }

  function handleDismiss() {
    localStorage.setItem("pwa-install-dismissed", "true");
    setDismissed(true);
  }

  if (!deferredPrompt || dismissed) return null;

  return (
    <div className="fixed bottom-20 left-3 right-3 z-40 sm:left-auto sm:right-6 sm:bottom-6 sm:w-80 animate-slide-up">
      <div className="rounded-2xl border border-accent/20 bg-card/95 backdrop-blur-xl p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
            <Download className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">Install Weightless</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Add to home screen for the full app experience.
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleInstall}
                className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-all active:scale-95"
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="rounded-xl border border-border px-5 py-2.5 text-sm text-muted-foreground transition-all active:scale-95"
              >
                Not now
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground active:scale-90 transition-transform"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
