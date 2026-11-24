'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { parseLimit, istDayKey, isPublicListing, validListingId, DEFAULT_LIMIT } = require('./logic');

test('limit: whole numbers 1 to 500 are used, everything else falls back to 20', () => {
  assert.equal(parseLimit(5), 5); assert.equal(parseLimit('7'), 7); assert.equal(parseLimit(500), 500); assert.equal(parseLimit(1), 1);
  for (const bad of [0, -3, 501, 2.5, 'abc', null, undefined, NaN, Infinity, '']) assert.equal(parseLimit(bad), DEFAULT_LIMIT, String(bad));
});
test('day key follows the Indian calendar day (UTC+5:30)', () => {
  assert.equal(istDayKey(Date.UTC(2026, 10, 24, 0, 0, 0)), '20261124');      // 05:30 IST on the 24th
  assert.equal(istDayKey(Date.UTC(2026, 10, 24, 18, 29, 59)), '20261124');   // 23:59:59 IST on the 24th
  assert.equal(istDayKey(Date.UTC(2026, 10, 24, 18, 30, 0)), '20261125');    // midnight IST: new day
  assert.equal(istDayKey(Date.UTC(2026, 11, 31, 19, 0, 0)), '20270101');     // year end
});
test('only approved, unexpired listings are public', () => {
  const now = 1000;
  assert.equal(isPublicListing({ status: 'approved', expiresAt: 2000 }, now), true);
  assert.equal(isPublicListing({ status: 'approved', expiresAt: 1000 }, now), false);
  assert.equal(isPublicListing({ status: 'approved', expiresAt: 999 }, now), false);
  for (const s of ['pending', 'rejected', 'sold']) assert.equal(isPublicListing({ status: s, expiresAt: 2000 }, now), false, s);
  assert.equal(isPublicListing(null, now), false); assert.equal(isPublicListing({ status: 'approved' }, now), false);
});
test('listing ids: auto-id characters only, never a path', () => {
  assert.equal(validListingId('6Y2LSD5wczxFtrU45cn7'), true); assert.equal(validListingId('L01'), true);
  for (const bad of ['', 'a/b', '../x', 'a b', 'x'.repeat(101), 5, null, undefined, {}, 'a.b', 'livestockContacts/x']) assert.equal(validListingId(bad), false, String(bad));
});
