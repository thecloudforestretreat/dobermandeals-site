import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const source = await readFile(new URL('../functions/api/waitlist.js', import.meta.url), 'utf8');
const { onRequestPost, onRequestGet } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const writes = [];
const env = { TURNSTILE_SECRET_KEY: 'fixture-secret', WAITLIST: { put: async (...args) => { writes.push(args); } } };
function request(data, origin = 'https://dobermandeals.com', host = 'dobermandeals.com') {
  return new Request('https://' + host + '/api/waitlist', { method: 'POST', headers: { Origin: origin }, body: JSON.stringify(data) });
}
const valid = { email: 'fixture@example.com', consent: true, token: 'fixture-token' };
const originalFetch = globalThis.fetch;
let check = { success: true, hostname: 'dobermandeals.com', action: 'waitlist' };
globalThis.fetch = async () => Response.json(check);
assert.equal((await onRequestGet()).status, 405);
assert.equal((await onRequestPost({ request: request(null), env })).status, 400);
assert.equal((await onRequestPost({ request: request(valid, 'https://other.example'), env })).status, 403);
assert.equal((await onRequestPost({ request: request(valid), env: {} })).status, 503);
assert.equal((await onRequestPost({ request: request({ ...valid, consent: false }), env })).status, 400);
assert.equal((await onRequestPost({ request: request({ ...valid, token: '' }), env })).status, 400);
for (const failure of [{ success: false }, { ...check, hostname: 'other.example' }, { ...check, action: 'other' }]) {
  check = failure;
  assert.equal((await onRequestPost({ request: request(valid), env })).status, 400);
}
assert.equal(writes.length, 0);
check = { success: true, hostname: 'dobermandeals.com', action: 'waitlist' };
assert.equal((await onRequestPost({ request: request(valid), env })).status, 200);
assert.equal(writes.length, 1);
assert.match(writes[0][0], /^signup:[a-f0-9]{64}$/);
assert.equal(JSON.parse(writes[0][1]).email, valid.email);
check = { success: true, hostname: 'staging.dobermandeals.com', action: 'waitlist' };
assert.equal((await onRequestPost({ request: request(valid, 'https://staging.dobermandeals.com', 'staging.dobermandeals.com'), env })).status, 200);
assert.match(writes[1][0], /^staging:/);
assert.equal(writes[1][2].expirationTtl, 86400);
globalThis.fetch = async () => { throw Error('fixture outage'); };
assert.equal((await onRequestPost({ request: request(valid), env })).status, 503);
globalThis.fetch = originalFetch;
console.log('Waitlist validation, Turnstile failures, persistence, staging isolation, and outage handling passed.');
