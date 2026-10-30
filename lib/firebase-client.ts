'use client';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, inMemoryPersistence, setPersistence, type Auth } from 'firebase/auth';

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function firebaseClientConfigured() {
  return !!(config.apiKey && config.authDomain && config.projectId && config.appId);
}

let authReady: Promise<Auth> | undefined;
export function firebaseClientAuth() {
  if (!firebaseClientConfigured()) throw new Error('Firebase sign-in has not been configured for this website yet.');
  authReady ??= (async () => {
    const app = getApps().length ? getApp() : initializeApp(config);
    const auth = getAuth(app);
    auth.languageCode = 'en';
    await setPersistence(auth, inMemoryPersistence);
    return auth;
  })().catch(error => { authReady = undefined; throw error; });
  return authReady;
}

export function firebaseErrorMessage(error: unknown) {
  const code = (error as { code?: string })?.code;
  if (['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found', 'auth/invalid-email', 'auth/user-disabled'].includes(code || '')) return 'Email or password is incorrect, or this account cannot sign in.';
  if (code === 'auth/too-many-requests') return 'Too many attempts. Please wait a few minutes before trying again.';
  if (code === 'auth/network-request-failed') return 'Unable to connect to Firebase. Check your connection and try again.';
  if (code === 'auth/weak-password' || code === 'auth/password-does-not-meet-requirements') return 'Choose a stronger password with at least 12 characters.';
  if (code === 'auth/requires-recent-login') return 'Please sign in again before changing your password.';
  if (['auth/operation-not-allowed', 'auth/invalid-api-key', 'auth/configuration-not-found', 'auth/unauthorized-domain'].includes(code || '')) return 'Firebase sign-in needs to be enabled and configured for this website.';
  return error instanceof Error && !code ? error.message : 'This request could not be completed. Please try again.';
}
