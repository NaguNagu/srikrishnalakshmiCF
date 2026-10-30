import { test } from 'node:test';
import assert from 'node:assert/strict';
import { administratorEmail, isAdministrator, hasRecentSignIn, passwordChangeSchema, sessionRequestSchema, requestHasSameOrigin } from '../lib/auth-policy';

test('Administrator access requires BOTH the pinned Firebase UID and owner email', () => {
  assert.equal(isAdministrator({uid:'owner-uid',email:administratorEmail},'owner-uid'),true);
  assert.equal(isAdministrator({uid:'owner-uid',email:administratorEmail.toUpperCase()},'owner-uid'),true);
  assert.equal(isAdministrator({uid:'other-uid',email:administratorEmail},'owner-uid'),false);
  assert.equal(isAdministrator({uid:'owner-uid',email:'another@example.com'},'owner-uid'),false);
  assert.equal(isAdministrator({uid:'owner-uid'},'owner-uid'),false);
  assert.equal(isAdministrator({uid:'owner-uid',email:administratorEmail},undefined),false);
  assert.equal(isAdministrator({email:administratorEmail},'owner-uid'),false);
});

test('Session creation and password change require a recent, plausible sign-in', () => {
  assert.equal(hasRecentSignIn(990,1000),true);
  assert.equal(hasRecentSignIn(701,1000),true);
  assert.equal(hasRecentSignIn(700,1000),false);
  assert.equal(hasRecentSignIn(1100,1000),false);
  assert.equal(hasRecentSignIn(undefined,1000),false);
  assert.equal(hasRecentSignIn('990',1000),false);
});

test('Legacy email/password session requests are rejected', () => {
  assert.equal(sessionRequestSchema.safeParse({email:administratorEmail,password:'example-only-password'}).success,false);
  assert.equal(sessionRequestSchema.safeParse({idToken:''}).success,false);
  assert.equal(sessionRequestSchema.safeParse({idToken:'x'.repeat(10001)}).success,false);
});

test('New passwords must meet the server-side length policy', () => {
  assert.equal(passwordChangeSchema.safeParse({idToken:'x'.repeat(30),newPassword:'short'}).success,false);
  assert.equal(passwordChangeSchema.safeParse({idToken:'x'.repeat(30),newPassword:'x'.repeat(129)}).success,false);
  assert.equal(passwordChangeSchema.safeParse({idToken:'x'.repeat(30),newPassword:'example-password-2026'}).success,true);
});

test('Origin protection uses the browser-facing host without accepting cross-site or missing origins', () => {
  const req = (origin: string, host = 'localhost:3002') => new Request('http://0.0.0.0:3002/api/auth', { headers: { host, origin } });
  assert.equal(requestHasSameOrigin(req('http://localhost:3002')),true);
  assert.equal(requestHasSameOrigin(req('https://untrusted.example')),false);
  assert.equal(requestHasSameOrigin(req('http://localhost:3002/path')),false);
  assert.equal(requestHasSameOrigin(req('null')),false);
  assert.equal(requestHasSameOrigin(new Request('http://localhost:3002/api/auth')),false);
  assert.equal(requestHasSameOrigin(req('https://sklcf.vercel.app','sklcf.vercel.app'),true),true);
  assert.equal(requestHasSameOrigin(req('http://sklcf.vercel.app','sklcf.vercel.app'),true),false);
});
