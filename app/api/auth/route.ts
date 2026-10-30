import { NextResponse } from 'next/server';
import { authenticated, configured, sameOrigin } from '@/lib/server';
import { firebaseAdminAuth } from '@/lib/firebase-admin';
import { hasRecentSignIn, isAdministrator, sessionCookieName, sessionDurationMs, sessionRequestSchema } from '@/lib/auth-policy';

export const runtime = 'nodejs';
const noStore = { 'Cache-Control': 'no-store' };
export async function GET() {
  return NextResponse.json({ configured: configured(), authenticated: await authenticated(), storageConfigured: !!process.env.MONGODB_URI }, { headers: noStore });
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  if (!configured()) return NextResponse.json({ error: 'Firebase administrator sign-in has not been configured yet.' }, { status: 503 });
  try {
    const parsed = sessionRequestSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: 'A valid Firebase sign-in is required.' }, { status: 400 });
    const auth = firebaseAdminAuth();
    const claims = await auth.verifyIdToken(parsed.data.idToken, true);
    if (!isAdministrator(claims, process.env.FIREBASE_ADMIN_UID)) return NextResponse.json({ error: 'This account is not authorised for the owner workspace.' }, { status: 403 });
    if (!hasRecentSignIn(claims.auth_time)) return NextResponse.json({ error: 'Please sign in again to continue.' }, { status: 401 });
    const token = await auth.createSessionCookie(parsed.data.idToken, { expiresIn: sessionDurationMs });
    const res = NextResponse.json({ ok: true }, { headers: noStore });
    res.cookies.set(sessionCookieName, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: sessionDurationMs / 1000 });
    res.cookies.set('sklcf-session', '', { maxAge: 0, path: '/' });
    return res;
  } catch {
    return NextResponse.json({ error: 'Sign-in could not be verified. Please sign in again.' }, { status: 401 });
  }
}

export async function DELETE(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  const res = NextResponse.json({ ok: true }, { headers: noStore });
  for (const name of [sessionCookieName, 'sklcf-session']) res.cookies.set(name, '', { maxAge: 0, path: '/' });
  return res;
}
