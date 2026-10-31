import test from 'node:test';
import assert from 'node:assert/strict';
import { recordWriteSchema } from '../lib/records';
import { examples } from '../lib/domain';

test('Storage writes reject path traversal and unknown record types', () => {
  assert.equal(recordWriteSchema.safeParse({ type: 'scheme', value: { ...examples[0], id: 'nested/document' } }).success, false);
  assert.equal(recordWriteSchema.safeParse({ type: 'scheme', value: { ...examples[0], id: '..' } }).success, false);
  assert.equal(recordWriteSchema.safeParse({ type: 'admin', value: { role: 'owner' } }).success, false);
});
test('Storage validates scheme updates and strips unexpected private fields', () => {
  assert.equal(recordWriteSchema.safeParse({ type: 'scheme', value: { ...examples[0], slots: -1 } }).success, false);
  const parsed = recordWriteSchema.parse({ type: 'scheme', value: { ...examples[0], phone: 'private', role: 'admin' } });
  assert.equal('phone' in parsed.value, false);
  assert.equal('role' in parsed.value, false);
});
