import { z } from 'zod';

export const administratorEmail = 'sklcf66@gmail.com';
export const sessionCookieName = 'sklcf-firebase-session';
export const sessionDurationMs = 8 * 60 * 60 * 1000;

export function requestHasSameOrigin(request: Request, forceHttps = false) {
  try {
    const origin = request.headers.get('origin');
    if (!origin) return false;
    const url = new URL(request.url);
    // Next's local server can use its bind address in request.url; Host identifies the browser-facing origin.
    const host = request.headers.get('host') || url.host;
    const expected = new URL(`${forceHttps ? 'https:' : url.protocol}//${host}`).origin;
    return new URL(origin).origin === origin && origin === expected;
  } catch { return false; }
}

export function isAdministrator(claims: { uid?: string; email?: string }, allowedUid: string | undefined) {
  return !!allowedUid && claims.uid === allowedUid && claims.email?.toLowerCase() === administratorEmail;
}

export function hasRecentSignIn(authTime: unknown, nowSeconds = Math.floor(Date.now() / 1000)) {
  return typeof authTime === 'number' && authTime <= nowSeconds + 30 && nowSeconds - authTime < 300;
}

export const sessionRequestSchema = z.object({ idToken: z.string().min(20).max(10000) });
export const passwordChangeSchema = sessionRequestSchema.extend({
  newPassword: z.string().min(12, 'Use at least 12 characters.').max(128, 'Use no more than 128 characters.'),
});
