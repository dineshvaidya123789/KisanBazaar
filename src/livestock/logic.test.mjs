import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeConfig } from './config.js';
import { normalizePhone, validateListing, statusForSellerSubmit, isPublic, displayState, expiryFrom, enabledCategories } from './logic.js';

const cfg = mergeConfig({});
const good = { category: 'goat', breed: 'Osmanabadi', sex: 'female', ageMonths: '14', quantity: '5', price: '9000', priceType: 'per_animal',
  purposeOfSale: 'breeding', state: 'Maharashtra', district: 'Satara', weightKg: '30', phone: '98765 43210', ownerType: 'farm', termsAccepted: true };

test('defaults: module off, only goats on', () => {
  assert.equal(cfg.enabled, false);
  assert.deepEqual(enabledCategories(cfg), ['goat']);
});
test('stored config overrides defaults but keeps the rest', () => {
  const c = mergeConfig({ enabled: true, categories: { cow: true } });
  assert.equal(c.enabled, true); assert.deepEqual(enabledCategories(c), ['goat', 'cow']); assert.equal(c.expiryDays, 30);
});
test('phone normalising', () => {
  assert.equal(normalizePhone('98765 43210'), '+919876543210');
  assert.equal(normalizePhone('+91 98765-43210'), '+919876543210');
  assert.equal(normalizePhone('919876543210'), '+919876543210');
  assert.equal(normalizePhone('12345'), ''); assert.equal(normalizePhone('5876543210'), ''); assert.equal(normalizePhone(null), '');
});
test('a good goat listing passes', () => assert.deepEqual(validateListing(good, cfg), {}));
test('cow is refused while cows are switched off', () => assert.ok(validateListing({ ...good, category: 'cow', breed: 'Gir' }, cfg).category));
test('cow needs the not-for-slaughter confirmation once on', () => {
  const c = mergeConfig({ categories: { cow: true } });
  const cow = { ...good, category: 'cow', breed: 'Gir' };
  assert.ok(validateListing(cow, c).notForSlaughter);
  assert.deepEqual(validateListing({ ...cow, notForSlaughter: true }, c), {});
});
test('missing and bad fields are reported', () => {
  const e = validateListing({ ...good, breed: 'Nope', quantity: '0', price: '-1', phone: '12', termsAccepted: false, state: '' }, cfg);
  for (const k of ['breed', 'quantity', 'price', 'phone', 'termsAccepted', 'location']) assert.ok(e[k], k);
});
test('quantity must be a whole number', () => assert.ok(validateListing({ ...good, quantity: '2.5' }, cfg).quantity));
test('first listing is pending, approved seller goes live', () => {
  assert.equal(statusForSellerSubmit(null, cfg), 'pending');
  assert.equal(statusForSellerSubmit({ autoApprove: false }, cfg), 'pending');
  assert.equal(statusForSellerSubmit({ autoApprove: true }, cfg), 'approved');
  assert.equal(statusForSellerSubmit({ autoApprove: true }, mergeConfig({ autoApproveAfterFirst: false })), 'pending');
});
test('public means approved and not expired', () => {
  const now = 1_000_000;
  assert.equal(isPublic({ status: 'approved', expiresAt: now + 1 }, now), true);
  assert.equal(isPublic({ status: 'approved', expiresAt: now }, now), false);
  assert.equal(isPublic({ status: 'pending', expiresAt: now + 9 }, now), false);
  assert.equal(isPublic({ status: 'rejected', expiresAt: now + 9 }, now), false);
  assert.equal(isPublic({ status: 'sold', expiresAt: now + 9 }, now), false);
});
test('display state shows expired', () => {
  assert.equal(displayState({ status: 'approved', expiresAt: 5 }, 10), 'expired');
  assert.equal(displayState({ status: 'pending', expiresAt: 5 }, 10), 'pending');
});
test('expiry is config days ahead', () => assert.equal(expiryFrom(0, cfg), 30 * 86400000));

import { buildListingDoc } from './logic.js';
test('built goat document has no phone, no undefined, goat-only fields', () => {
  const d = buildListingDoc({ ...good, milkYieldPerDay: '8', tehsil: '', healthNote: '  ' }, { uid: 'u1', nowMs: 1000, config: cfg, status: 'pending' });
  assert.equal(d.ownerUid, 'u1'); assert.equal(d.status, 'pending'); assert.equal(d.weightKg, 30); assert.equal(d.price, 9000);
  assert.ok(!('phone' in d)); assert.ok(!('milkYieldPerDay' in d)); assert.ok(!('tehsil' in d)); assert.ok(!('healthNote' in d));
  assert.ok(!Object.values(d).includes(undefined)); assert.equal(d.expiresAt, 1000 + 30 * 86400000); assert.equal(d.createdAt, 1000);
});
test('cow document is marked not for slaughter and has milk fields', () => {
  const c = mergeConfig({ categories: { cow: true } });
  const d = buildListingDoc({ ...good, category: 'cow', breed: 'Gir', milkYieldPerDay: '10', lactations: '2', notForSlaughter: true }, { uid: 'u1', nowMs: 5, config: c, status: 'pending' });
  assert.equal(d.notForSlaughter, true); assert.equal(d.milkYieldPerDay, 10); assert.ok(!('weightKg' in d));
});
test('editing keeps owner, createdAt, approval fields and a still valid expiry', () => {
  const existing = { ownerUid: 'orig', createdAt: 7, expiresAt: 9_999_999_999, approvedBy: 'adm', approvedAt: 8, termsAcceptedAt: 6 };
  const d = buildListingDoc(good, { uid: 'someoneElse', nowMs: 100, config: cfg, status: 'pending', existing });
  assert.equal(d.ownerUid, 'orig'); assert.equal(d.createdAt, 7); assert.equal(d.approvedBy, 'adm'); assert.equal(d.expiresAt, 9_999_999_999); assert.equal(d.termsAcceptedAt, 6);
});
test('admin posting is marked and pre-approved', () => {
  const d = buildListingDoc(good, { uid: 'adm', nowMs: 10, config: cfg, status: 'approved', byAdmin: true, adminUid: 'adm' });
  assert.equal(d.postedByAdmin, true); assert.equal(d.approvedBy, 'adm'); assert.equal(d.status, 'approved');
});

import { TEXTS, makeT } from './texts.js';
test('Hindi and Marathi have every English key', () => {
  for (const lang of ['hi', 'mr']) for (const k of Object.keys(TEXTS.en)) assert.ok(TEXTS[lang][k], lang + ' missing ' + k);
});
test('text fallback and variables', () => {
  assert.equal(makeT('xx')('save'), 'Save changes'); assert.equal(makeT('en')('photo_hint', { n: 4 }), 'Up to 4 clear photos. They are made smaller automatically.');
});
test('phone with a leading zero is accepted, other 11 digit numbers are not', () => {
  assert.equal(normalizePhone('09876543210'), '+919876543210');
  assert.equal(normalizePhone('0 98765 43210'), '+919876543210');
  assert.equal(normalizePhone('19876543210'), '');
  assert.equal(normalizePhone('00876543210'), '');
});
test('a blank age is refused (it used to count as 0 months)', () => {
  assert.ok(validateListing({ ...good, ageMonths: '' }, cfg).ageMonths);
  assert.ok(validateListing({ ...good, ageMonths: null }, cfg).ageMonths);
  assert.deepEqual(validateListing({ ...good, ageMonths: '0' }, cfg), {});
});
