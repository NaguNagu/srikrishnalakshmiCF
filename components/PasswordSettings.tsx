'use client';
import { useState, type FormEvent } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { LockKey } from '@phosphor-icons/react';
import { administratorEmail, passwordChangeSchema } from '@/lib/auth-policy';
import { firebaseClientAuth, firebaseErrorMessage } from '@/lib/firebase-client';

export default function PasswordSettings({ onChanged }: { onChanged: () => void }) {
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  async function change(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('');
    const f = new FormData(event.currentTarget), currentPassword = String(f.get('currentPassword')), newPassword = String(f.get('newPassword'));
    if (newPassword !== f.get('confirmPassword')) { setError('The new passwords do not match.'); return; }
    if (newPassword === currentPassword) { setError('Choose a new password that is different from your current password.'); return; }
    if (!passwordChangeSchema.shape.newPassword.safeParse(newPassword).success) { setError('Use a new password with 12 to 128 characters.'); return; }
    setBusy(true);
    let clientAuth: Awaited<ReturnType<typeof firebaseClientAuth>> | undefined;
    try {
      clientAuth = await firebaseClientAuth();
      const result = await signInWithEmailAndPassword(clientAuth, administratorEmail, currentPassword);
      const response = await fetch('/api/auth/password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken: await result.user.getIdToken(), newPassword }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Password change could not be completed.');
      onChanged();
    } catch (error) { setError(firebaseErrorMessage(error)); }
    finally { if (clientAuth) await signOut(clientAuth).catch(() => undefined); setBusy(false); }
  }
  return <section className="panel settings-form password-settings"><h2>Keep your account yours.</h2><p>Change the password for {administratorEmail}. Confirm your current password first. After a successful change, sign in again with your new password.</p>
    {error && <p className="error" role="alert">{error}</p>}
    <form onSubmit={change}><fieldset disabled={busy}><label>Current password<input name="currentPassword" type="password" required maxLength={128} autoComplete="current-password" /></label>
      <div className="form-grid"><label>New password<input name="newPassword" type="password" required minLength={12} maxLength={128} autoComplete="new-password" /></label><label>Confirm new password<input name="confirmPassword" type="password" required minLength={12} maxLength={128} autoComplete="new-password" /></label></div>
      <small>Use at least 12 characters. Your password is managed by Firebase Authentication.</small><button className="button primary" disabled={busy}>{busy ? 'Changing password…' : 'Change password'} <LockKey size={18} /></button></fieldset></form>
  </section>;
}
