import { NextResponse } from "next/server";

// Simple in-memory rate limiter for API routes.
// For production at scale, swap this for Upstash Redis (@upstash/ratelimit).
const requests = new Map<string, { count: number; resetAt: number }>();

interface RateLimitOptions {
  /** Max requests per window */
  limit?: number;
  /** Window duration in seconds */
  windowSeconds?: number;
}

export function rateLimit(
  ip: string,
  { limit = 10, windowSeconds = 60 }: RateLimitOptions = {}
): { success: boolean; response?: NextResponse } {
  const now = Date.now();
  const entry = requests.get(ip);

  if (!entry || now > entry.resetAt) {
    requests.set(ip, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { success: true };
  }

  if (entry.count >= limit) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      ),
    };
  }

  entry.count++;
  return { success: true };
}

// Periodically clean up expired entries to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  requests.forEach((entry, key) => {
    if (now > entry.resetAt) {
      requests.delete(key);
    }
  });
}, 60_000);
