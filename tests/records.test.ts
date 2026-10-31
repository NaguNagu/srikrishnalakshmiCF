import test from 'node:test';
import assert from 'node:assert/strict';
import { recordWriteSchema } from '../lib/records';
import { initialPlans } from '../lib/catalogue';

test('Storage writes reject path traversal and unknown record types', () => {
  assert.equal(recordWriteSchema.safeParse({ type: 'plan', value: { ...initialPlans[0], id: 'nested/document' } }).success, false);
  assert.equal(recordWriteSchema.safeParse({ type: 'plan', value: { ...initialPlans[0], id: '..' } }).success, false);
  assert.equal(recordWriteSchema.safeParse({ type: 'admin', value: { role: 'owner' } }).success, false);
});
test('Storage validates scheme updates and strips unexpected private fields', () => {
  assert.equal(recordWriteSchema.safeParse({ type: 'plan', value: { ...initialPlans[0], months: 0 } }).success, false);
  const parsed = recordWriteSchema.parse({ type: 'plan', value: { ...initialPlans[0], phone: 'private', role: 'admin' } });
  assert.equal('phone' in parsed.value, false);
  assert.equal('role' in parsed.value, false);
});

test('Featured starts must select an existing-plan identifier and cannot supply financial details',()=>{
 assert.equal(recordWriteSchema.safeParse({type:'scheme',value:{}}).success,false);
 const parsed=recordWriteSchema.parse({type:'feature',value:{id:'feature-1',planId:'plan-60000-20',startDate:'2026-10-01',slots:10,published:true,amount:999999}});
 assert.equal('amount' in parsed.value,false);
});
