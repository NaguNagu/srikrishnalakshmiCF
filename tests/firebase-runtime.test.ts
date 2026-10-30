import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

test('Firebase Admin loads when serverless runtimes disable require(ESM)', () => {
  const result = spawnSync(process.execPath, [
    '--no-experimental-require-module', '-e', "require('firebase-admin/auth')",
  ], { encoding: 'utf8', timeout: 10000 });
  assert.equal(result.status, 0, result.stderr);
});
