'use client';
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { ArrowUpRight, EnvelopeSimple } from '@phosphor-icons/react';
import Brand from './Brand';
import { administratorEmail } from '@/lib/auth-policy';
import { firebaseClientAuth, firebaseErrorMessage } from '@/lib/firebase-client';

type Props = { configured: boolean; busy: boolean; error: string; message: string; onLogin: (event: FormEvent<HTMLFormElement>) => void };
export default function OwnerLogin({ configured, busy, error, message, onLogin }: Props) {
  const [forgot, setForgot] = useState(false), [resetBusy, setResetBusy] = useState(false), [resetMessage, setResetMessage] = useState(''), [resetError, setResetError] = useState('');
  async function resetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setResetBusy(true); setResetError(''); setResetMessage('');
    try {
      const email = String(new FormData(event.currentTarget).get('email')).trim().toLowerCase();
      if (email === administratorEmail) await sendPasswordResetEmail(await firebaseClientAuth(), email);
      setResetMessage('If this address is registered as the administrator, a password reset email has been sent. Check your inbox and spam folder.');
    } catch (error) {
      const code = (error as { code?: string })?.code;
      if (code === 'auth/user-not-found') setResetMessage('If this address is registered as the administrator, a password reset email has been sent. Check your inbox and spam folder.');
      else setResetError(firebaseErrorMessage(error));
    } finally { setResetBusy(false); }
  }
  return <div className="login-page"><div className="login-card"><Brand /><span className="eyebrow">YOUR BUSINESS, IN ONE PLACE</span>
    <h1>{forgot ? 'A fresh start.' : 'Welcome back.'}</h1>
    <p>{forgot ? 'Request a secure Firebase password reset link for your administrator account.' : 'Sign in to manage customers, schemes and the moments that matter.'}</p>
    {!forgot && error && <p className="error" role="alert">{error}</p>}
    {!forgot && message && <p className="success" role="status">{message}</p>}
    {forgot ? <><form onSubmit={resetPassword}><label>Administrator email<input name="email" type="email" required autoComplete="username" defaultValue={administratorEmail} /></label>
      <button className="button primary" disabled={!configured || resetBusy}>{resetBusy ? 'Requesting link…' : 'Send password reset email'} <EnvelopeSimple size={18} /></button></form>
      {resetMessage && <p className="success" role="status">{resetMessage}</p>}{resetError && <p className="error" role="alert">{resetError}</p>}
      <button className="text-link auth-text-button" onClick={() => setForgot(false)}>Back to sign in</button></> :
      <><form onSubmit={onLogin}><label>Email address<input name="email" type="email" required autoComplete="username" defaultValue={administratorEmail} /></label><label>Password<input name="password" type="password" required maxLength={128} autoComplete="current-password" placeholder="Your password" /></label><button className="button primary" disabled={busy || !configured}>{busy ? 'Signing in…' : 'Sign in to workspace'} <ArrowUpRight /></button></form>
        <button className="text-link auth-text-button" onClick={() => { setForgot(true); setResetMessage(''); setResetError(''); }}>Forgot password?</button></>}
    {!configured && <p className="notice">Firebase Authentication must be connected before administrator sign-in and password reset can be used.</p>}
    <Link className="text-link" href="/">Back to website</Link>
  </div></div>;
}
