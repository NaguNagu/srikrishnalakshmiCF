import 'server-only';
import { getFirestore } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';
import { firebaseAdminApp, firebaseAdminAuth, firebaseServerConfigured } from './firebase-admin';
import { isAdministrator, sessionCookieName, requestHasSameOrigin } from './auth-policy';
export const configured = firebaseServerConfigured;
export function db() { return getFirestore(firebaseAdminApp()); }
export async function authenticated() {
  if (!configured()) return false;
  try {
    const token = (await cookies()).get(sessionCookieName)?.value;
    if (!token) return false;
    const claims = await firebaseAdminAuth().verifySessionCookie(token, true);
    return isAdministrator(claims, process.env.FIREBASE_ADMIN_UID);
  } catch { return false; }
}
export function sameOrigin(req: Request) { return requestHasSameOrigin(req, !!process.env.VERCEL); }
