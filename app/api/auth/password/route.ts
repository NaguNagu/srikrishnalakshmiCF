import { NextResponse } from 'next/server';
import { authenticated, configured, sameOrigin } from '@/lib/server';
import { firebaseAdminAuth } from '@/lib/firebase-admin';
import { hasRecentSignIn, isAdministrator, passwordChangeSchema, sessionCookieName } from '@/lib/auth-policy';

export const runtime = 'nodejs';
export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  if (!configured() || !await authenticated()) return NextResponse.json({ error: 'Please sign in before changing your password.' }, { status: 401 });
  try {
    const parsed = passwordChangeSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: 'Use a new password with 12 to 128 characters and confirm your current password.' }, { status: 400 });
    const auth = firebaseAdminAuth();
    const claims = await auth.verifyIdToken(parsed.data.idToken, true);
    if (!isAdministrator(claims, process.env.FIREBASE_ADMIN_UID) || !hasRecentSignIn(claims.auth_time)) {
      return NextResponse.json({ error: 'Confirm your current password again to continue.' }, { status: 401 });
    }
    // Firebase password updates automatically invalidate previous refresh tokens.
    await auth.updateUser(claims.uid, { password: parsed.data.newPassword });
    // Explicit revocation also invalidates older server sessions; every API checks revocation.
    await auth.revokeRefreshTokens(claims.uid).catch(() => undefined);
    const res = NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
    for (const name of [sessionCookieName, 'sklcf-session']) res.cookies.set(name, '', { maxAge: 0, path: '/' });
    return res;
  } catch (error) {
    const code = (error as { code?: string })?.code;
    const invalidPassword = code === 'auth/invalid-password' || code === 'auth/password-does-not-meet-requirements';
    return NextResponse.json({ error: invalidPassword ? 'The new password does not meet the configured password policy.' : 'Password change could not be completed. Please confirm your current password and try again.' }, { status: invalidPassword ? 400 : 401 });
  }
}
