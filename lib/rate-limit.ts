// Simple in-memory rate limiting (for single server)
// For production, use Redis instead
const attempts: Record<string, { count: number; resetTime: number }> = {};

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = attempts[identifier];

  if (!record || now > record.resetTime) {
    attempts[identifier] = { count: 1, resetTime: now + WINDOW_MS };
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }

  record.count++;

  if (record.count > MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: MAX_ATTEMPTS - record.count };
}

export function clearRateLimit(identifier: string) {
  delete attempts[identifier];
}
