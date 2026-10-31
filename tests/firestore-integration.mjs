// Explicit cloud verification uses disposable, uniquely named records only.
// Run: node --import tsx tests/firestore-integration.mjs --verify-sklcf-production
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import nextEnv from '@next/env';
import { cert, initializeApp, deleteApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readRecords, writeRecord, readUpcomingSchemes, MissingSchemeError } from '../lib/records.ts';
import { defaults, indiaToday } from '../lib/domain.ts';
import { nextMonthRange } from '../lib/catalogue.ts';
nextEnv.loadEnvConfig(process.cwd());
assert.ok(process.argv.includes('--verify-sklcf-production'), 'Explicit production verification flag is required.');
assert.equal(process.env.FIREBASE_PROJECT_ID, 'sklcf-crm-2026');
const app = initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID, credential: cert({ projectId: process.env.FIREBASE_PROJECT_ID, clientEmail: process.env.FIREBASE_CLIENT_EMAIL, privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') }) }, 'storage-verification');
const database = getFirestore(app);
const schemeId = `verification-${randomUUID()}`, customerId = `verification-${randomUUID()}`;
const settingsRef = database.collection('settings').doc('company');
const previousSettings = await settingsRef.get();
let settingsWritten = false;
try {
  const scheme = { id: schemeId, name: 'Disposable storage verification', amount: 60000, monthly: 3000, months: 20, startDate: nextMonthRange().start, slots: 1, benefits: ['Verification only'], published: false };
  const customer = { id: customerId, name: 'Disposable verification record', phone: '9000000000', address: 'Synthetic verification address', city: 'Test city', dob: '1990-01-01', schemeId, status: 'live', dueDate: indiaToday(), months: 20, consent: false, paidPeriods: [] };
  await assert.rejects(writeRecord(database, { type: 'customer', value: customer }), MissingSchemeError);
  await writeRecord(database, { type: 'scheme', value: scheme });
  await writeRecord(database, { type: 'customer', value: customer });
  let records = await readRecords(database);
  assert.deepEqual(records.customers.find(c => c.id === customerId), customer);
  assert.equal((await readUpcomingSchemes(database)).schemes.some(s => s.id === schemeId), false);
  await writeRecord(database, { type: 'scheme', value: { ...scheme, published: true, slots: 2 } });
  const publicSchemes = await readUpcomingSchemes(database);
  assert.equal(publicSchemes.schemes.find(s => s.id === schemeId)?.slots, 2);
  assert.ok(!JSON.stringify(publicSchemes).includes(customer.phone));
  const updatedCustomer = { ...customer, paidPeriods: [indiaToday().slice(0,7)], status: 'closed' };
  await writeRecord(database, { type: 'customer', value: updatedCustomer });
  await writeRecord(database, { type: 'settings', value: previousSettings.exists ? previousSettings.data() : defaults });
  settingsWritten = true;
  records = await readRecords(database);
  assert.deepEqual(records.customers.find(c => c.id === customerId), updatedCustomer);
  assert.deepEqual(records.settings, previousSettings.exists ? previousSettings.data() : defaults);
  const response = await fetch(`https://firestore.googleapis.com/v1/projects/sklcf-crm-2026/databases/(default)/documents/customers/${customerId}?key=${encodeURIComponent(process.env.NEXT_PUBLIC_FIREBASE_API_KEY)}`);
  assert.equal(response.status, 403, 'Anonymous direct access must be denied');
  console.log('PASS: Cloud customer create/update/reload, payment history, scheme validation, publication filtering, settings persistence and anonymous database access denied.');
} finally {
  await database.collection('customers').doc(customerId).delete();
  await database.collection('schemes').doc(schemeId).delete();
  if (settingsWritten && !previousSettings.exists) await settingsRef.delete();
  console.log('Cleaned up disposable verification records; original business settings preserved.');
  await deleteApp(app);
}
