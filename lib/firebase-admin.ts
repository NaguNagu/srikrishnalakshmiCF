import 'server-only';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { administratorEmail } from './auth-policy';

export function firebaseServerConfigured() {
  return !!(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_ADMIN_UID &&
    process.env.FIREBASE_PROJECT_ID === process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
}

export function firebaseAdminApp() {
  if (!firebaseServerConfigured()) throw new Error('Firebase administrator authentication is not configured.');
  const projectId = process.env.FIREBASE_PROJECT_ID!;
  const name = 'sklcf-administrator';
  const app = getApps().find(app => app.name === name) || initializeApp({
    projectId,
    credential: cert({ projectId, clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n') }),
  }, name);
  return app;
}

export function firebaseAdminAuth() { return getAuth(firebaseAdminApp()); }

export { administratorEmail };
