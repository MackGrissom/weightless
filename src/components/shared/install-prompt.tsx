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
    <div className="fixed bottom-20 left-4 right-4 z-40 sm:left-auto sm:right-6 sm:bottom-6 sm:w-80">
      <div className="rounded-2xl border border-accent/30 bg-card p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
            <Download className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Install Weightless</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Add to your home screen for faster access and offline browsing.
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleInstall}
                className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:bg-accent/90 active:bg-accent/80 transition-colors"
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="rounded-xl border border-border px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground active:bg-muted transition-colors"
              >
                Not now
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss install prompt"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
