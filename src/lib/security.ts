import { timingSafeEqual } from "crypto";

/**
 * Timing-safe string comparison to prevent timing attacks
 * on secret comparisons (cron tokens, API keys, etc.)
 */
export function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Compare against self to maintain constant time
    const buf = Buffer.from(a);
    timingSafeEqual(buf, buf);
    return false;
  }
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

/**
 * Escape HTML special characters to prevent XSS in
 * server-rendered HTML strings (emails, unsubscribe page, etc.)
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Basic email format validation */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

/**
 * Validate and sanitize a URL. Returns null if invalid.
 * Only allows http/https protocols to prevent javascript: and data: URIs.
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}
