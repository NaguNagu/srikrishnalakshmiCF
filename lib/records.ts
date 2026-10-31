import type { Firestore } from 'firebase-admin/firestore';
import { z } from 'zod';
import { customerSchema, schemeSchema, planSchema, featureSchema, settingsSchema, defaults, type Data } from './domain';
import { mergePlans, resolveFeatured } from './catalogue';
export const recordWriteSchema = z.discriminatedUnion('type', [
  z.object({ type:z.literal('customer'), value:customerSchema }),
  z.object({ type:z.literal('plan'), value:planSchema }),
  z.object({ type:z.literal('feature'), value:featureSchema }),
  z.object({ type:z.literal('settings'), value:settingsSchema }),
]);
export class MissingSchemeError extends Error {}
export async function readPlans(database:Firestore) {
 const records=await database.collection('plans').limit(1000).get();
 return mergePlans(records.docs.map(d=>planSchema.parse(d.data())));
}
export async function readRecords(database:Firestore):Promise<Data> {
 const [plans,schemes,customers,settings]=await Promise.all([
  readPlans(database),database.collection('schemes').limit(1000).get(),
  database.collection('customers').limit(10000).get(),database.collection('settings').doc('company').get(),
 ]);
 return {plans,schemes:resolveFeatured(schemes.docs.map(d=>schemeSchema.parse(d.data())),plans),customers:customers.docs.map(d=>customerSchema.parse(d.data())),settings:settings.exists?settingsSchema.parse(settings.data()):defaults};
}
export async function writeRecord(database:Firestore,input:unknown) {
 const record=recordWriteSchema.parse(input);
 if(record.type==='settings') {await database.collection('settings').doc('company').set(record.value);return;}
 if(record.type==='plan') {await database.collection('plans').doc(record.value.id).set(record.value);return;}
 const plans=await readPlans(database);
 if(record.type==='feature') {
  const plan=plans.find(p=>p.id===record.value.planId);
  if(!plan)throw new MissingSchemeError('Choose an existing plan.');
  if(!plan.enabled&&record.value.published)throw new MissingSchemeError('Turn on this plan before featuring it.');
  await database.collection('schemes').doc(record.value.id).set(schemeSchema.parse({...plan,...record.value}));return;
 }
 await database.runTransaction(async transaction=>{
  const customerRef=database.collection('customers').doc(record.value.id);
  const existing=await transaction.get(customerRef);
  const plan=plans.find(p=>p.id===record.value.schemeId);
  const keepingExisting=existing.exists&&existing.data()?.schemeId===record.value.schemeId;
  if(!plan) {
   const legacy=await transaction.get(database.collection('schemes').doc(record.value.schemeId));
   if(!legacy.exists||!keepingExisting)throw new MissingSchemeError('Choose an available plan.');
  } else if(!plan.enabled&&!keepingExisting)throw new MissingSchemeError('This plan is turned off. Choose an available plan.');
  transaction.set(customerRef,record.value);
 });
}
export async function readUpcomingSchemes(database:Firestore) {
 const [plans,records]=await Promise.all([readPlans(database),database.collection('schemes').where('published','==',true).limit(1000).get()]);
 return {schemes:resolveFeatured(records.docs.map(d=>schemeSchema.parse(d.data())),plans).filter(s=>s.published).sort((a,b)=>a.startDate.localeCompare(b.startDate))};
}
