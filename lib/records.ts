import type { Firestore } from 'firebase-admin/firestore';
import { z } from 'zod';
import { customerSchema, schemeSchema, settingsSchema, defaults, indiaToday, type Data } from './domain';
import { nextMonthRange } from './catalogue';

export const recordWriteSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('customer'), value: customerSchema }),
  z.object({ type: z.literal('scheme'), value: schemeSchema }),
  z.object({ type: z.literal('settings'), value: settingsSchema }),
]);
export class MissingSchemeError extends Error {}

export async function readRecords(database: Firestore): Promise<Data> {
  const [schemes, customers, settings] = await Promise.all([
    database.collection('schemes').limit(1000).get(),
    database.collection('customers').limit(10000).get(),
    database.collection('settings').doc('company').get(),
  ]);
  return {
    schemes: schemes.docs.map(doc => schemeSchema.parse(doc.data())),
    customers: customers.docs.map(doc => customerSchema.parse(doc.data())),
    settings: settings.exists ? settingsSchema.parse(settings.data()) : defaults,
  };
}

export async function writeRecord(database: Firestore, input: unknown) {
  const record = recordWriteSchema.parse(input);
  if (record.type === 'settings') {
    await database.collection('settings').doc('company').set(record.value);
  } else if (record.type === 'scheme') {
    await database.collection('schemes').doc(record.value.id).set(record.value);
  } else {
    await database.runTransaction(async transaction => {
      const scheme = await transaction.get(database.collection('schemes').doc(record.value.schemeId));
      if (!scheme.exists) throw new MissingSchemeError('Choose an existing scheme.');
      transaction.set(database.collection('customers').doc(record.value.id), record.value);
    });
  }
}

export async function readUpcomingSchemes(database: Firestore, today = indiaToday()) {
  const { start, end } = nextMonthRange(today);
  const result = await database.collection('schemes').where('published', '==', true)
    .where('startDate', '>=', start).where('startDate', '<', end)
    .orderBy('startDate').limit(100).get();
  return { schemes: result.docs.map(doc => schemeSchema.parse(doc.data())), monthStart: start };
}
