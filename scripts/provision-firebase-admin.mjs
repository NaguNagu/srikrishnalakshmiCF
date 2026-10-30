// Run with: node scripts/provision-firebase-admin.mjs
// Reads the initial password from a hidden prompt, never from arguments or a file.
import nextEnv from '@next/env';
import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

nextEnv.loadEnvConfig(process.cwd());
const email = 'sklcf66@gmail.com';
const projectId = process.env.FIREBASE_PROJECT_ID;
if (!projectId || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
  console.error('Configure the Firebase Admin SDK credentials in .env.local first.'); process.exit(1);
}
const auth = getAuth(initializeApp({ projectId, credential: cert({ projectId,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
}) }));
try {
  const user = await auth.getUserByEmail(email);
  console.log(`Administrator already exists. No password changed. Set FIREBASE_ADMIN_UID=${user.uid} in the server environment.`);
  process.exit(0);
} catch (error) {
  if (error.code !== 'auth/user-not-found') { console.error('Unable to verify the administrator account. Check the selected Firebase project and credentials.'); process.exit(1); }
}
if (!process.stdin.isTTY) { console.error('Use an interactive terminal so the initial password can be entered without echoing it.'); process.exit(1); }
process.stdout.write(`Initial password for ${email}: `);
const password = await new Promise(resolve => {
  let value = '';
  process.stdin.setRawMode(true); process.stdin.resume(); process.stdin.setEncoding('utf8');
  const listener = chunk => {
    for (const char of chunk) {
      if (char === '\u0003') { process.stdin.setRawMode(false); process.exit(130); }
      if (char === '\r' || char === '\n') {
        process.stdin.off('data', listener); process.stdin.setRawMode(false); process.stdin.pause(); process.stdout.write('\n'); resolve(value); return;
      }
      if (char === '\u007f' || char === '\b') value = value.slice(0, -1); else value += char;
    }
  };
  process.stdin.on('data', listener);
});
if (password.length < 12 || password.length > 128) { console.error('Use a password with 12 to 128 characters.'); process.exit(1); }
try {
  const user = await auth.createUser({ email, password, displayName: 'SKLCF Administrator', emailVerified: false, disabled: false });
  console.log(`Administrator created. Set FIREBASE_ADMIN_UID=${user.uid} in the server environment.`);
} catch {
  console.error('Administrator could not be created. Check Firebase Authentication configuration and credentials.'); process.exit(1);
}
