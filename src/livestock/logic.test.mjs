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

import { serverFilters, serverFilterKey, hasPageFilters, matchesPageFilters, applyPageFilters, ageText, formatRupees, shareMessage, whatsappShareUrl, detailUrl, listingTitle } from './logic.js';
const L = (o) => ({ id: 'x', quantity: 5, breed: 'Osmanabadi', category: 'goat', state: 'Maharashtra', district: 'Satara', price: 8000, priceType: 'per_animal', ageMonths: 12, ...o });

test('browse: only equality filters go to the database, and a district needs its state', () => {
  assert.deepEqual(serverFilters({ category: 'goat', breed: 'Beetal', state: '', district: 'Satara', minPrice: '5' }), { category: 'goat', breed: 'Beetal' });
  assert.deepEqual(serverFilters({ breed: 'Beetal' }), { breed: 'Beetal' });
  assert.deepEqual(serverFilters({ state: 'Maharashtra', district: 'Satara' }), { state: 'Maharashtra', district: 'Satara' });
  assert.equal(serverFilterKey({ category: 'goat' }), serverFilterKey({ category: 'goat', minPrice: '100' }));
});
test('browse: price and age filters apply to the loaded page', () => {
  const list = [L({ id: 'a', price: 5000 }), L({ id: 'b', price: 12000 }), L({ id: 'c', price: 400, priceType: 'per_kg' }), L({ id: 'd', ageMonths: 30 })];
  assert.equal(hasPageFilters({ minPrice: '', maxPrice: ' ' }), false);
  assert.deepEqual(applyPageFilters(list, { maxPrice: '9000' }).map((l) => l.id), ['a', 'd']); // per-kg one is left out
  assert.deepEqual(applyPageFilters(list, { minAge: '24' }).map((l) => l.id), ['d']);
  assert.equal(applyPageFilters(list, {}).length, 4);
  assert.equal(matchesPageFilters(L({ price: 8000 }), { minPrice: '8000', maxPrice: '8000' }), true);
  assert.equal(matchesPageFilters(L({}), { maxPrice: 'abc' }), true); // junk is ignored, not a reason to hide everything
});
test('browse: display helpers', () => {
  assert.equal(ageText(8), '8 mo'); assert.equal(ageText(12), '1 yr'); assert.equal(ageText(14), '1 yr 2 mo'); assert.equal(ageText('x'), ''); assert.equal(ageText(0), '0 mo');
  assert.equal(formatRupees(125000), 'Rs 1,25,000');
  assert.equal(listingTitle(L({})), '5 × Osmanabadi goat');
  const m = shareMessage(L({}), 'https://kisanbazzar.co.in/livestock/abc');
  assert.ok(m.includes('Satara, Maharashtra') && m.includes('Rs 8,000') && m.includes('per animal') && m.endsWith('/livestock/abc'));
  assert.ok(whatsappShareUrl('a b&c').startsWith('https://wa.me/?text=a%20b%26c'));
  assert.equal(detailUrl('https://x.in/', 'id1'), 'https://x.in/livestock/id1');
});

import { ENQUIRY_MAX, enquiryId, validateEnquiry, buildEnquiryDoc, unreadCount, telUrl, whatsappChatUrl, replyText } from './logic.js';
test('enquiry: id is listing + buyer', () => assert.equal(enquiryId('L1', 'u9'), 'L1_u9'));
test('enquiry: validation', () => {
  const ok = { name: 'Ravi', message: 'Still available?', phone: '+919876543210' };
  assert.deepEqual(validateEnquiry(ok), {});
  assert.ok(validateEnquiry({ ...ok, name: '   ' }).name);
  assert.ok(validateEnquiry({ ...ok, name: 'x'.repeat(81) }).name);
  assert.ok(validateEnquiry({ ...ok, message: '   ' }).message);
  assert.ok(validateEnquiry({ ...ok, message: 'x'.repeat(ENQUIRY_MAX + 1) }).message);
  assert.deepEqual(validateEnquiry({ ...ok, message: 'x'.repeat(ENQUIRY_MAX) }), {});
  assert.ok(validateEnquiry({ ...ok, phone: '' }).phone);
  assert.ok(validateEnquiry({ ...ok, phone: '12345' }).phone);
  assert.deepEqual(validateEnquiry({ ...ok, phone: '9876543210' }), {}); // 10 digits as login stores it
});
test('enquiry: the record has exactly the fields the rules allow, trimmed, with a normalised phone', () => {
  const d = buildEnquiryDoc({ listing: { id: 'L1', ownerUid: 's1', quantity: 5, breed: 'Beetal', category: 'goat' }, buyerUid: 'b1', name: ' Ravi ', phone: '9876543210', message: ' hi ', nowMs: 5 });
  assert.deepEqual(Object.keys(d).sort(), ['buyerName', 'buyerPhone', 'buyerUid', 'createdAt', 'listingId', 'listingTitle', 'message', 'sellerUid', 'status'].sort());
  assert.equal(d.buyerName, 'Ravi'); assert.equal(d.message, 'hi'); assert.equal(d.buyerPhone, '+919876543210'); assert.equal(d.status, 'new'); assert.equal(d.listingTitle, '5 × Beetal goat');
});
test('enquiry: unread count and contact links', () => {
  assert.equal(unreadCount([{ status: 'new' }, { status: 'read' }, {}]), 2); assert.equal(unreadCount(null), 0);
  assert.equal(telUrl('9876543210'), 'tel:+919876543210'); assert.equal(telUrl('abc'), '');
  assert.equal(whatsappChatUrl('+91 98765 43210'), 'https://wa.me/919876543210');
  assert.equal(whatsappChatUrl('9876543210', 'a b'), 'https://wa.me/919876543210?text=a%20b'); assert.equal(whatsappChatUrl('x'), '');
  assert.ok(replyText({ buyerName: 'Ravi', listingTitle: '5 × Beetal goat' }).includes('Ravi'));
});

import { revealErrorKey } from './logic.js';
test('reveal: every reason maps to a screen text that exists in all three languages', () => {
  for (const r of ['LOGIN', 'DISABLED', 'GONE', 'OWN', 'NO_PHONE', 'LIMIT', 'BAD_REQUEST', undefined, 'SOMETHING_NEW']) {
    const k = revealErrorKey(r);
    for (const l of ['en', 'hi', 'mr']) assert.ok(TEXTS[l][k], l + ' text for ' + String(r));
  }
  assert.equal(revealErrorKey('LIMIT'), 'reveal_limit'); assert.equal(revealErrorKey(undefined), 'reveal_failed');
});

// Every message the forms can show is a text key that exists in English, Hindi and Marathi (no English-only leftovers).
test('all validation messages are translated keys in en, hi and mr', () => {
  const bad = { category: 'cow', breed: '', sex: 'x', ageMonths: '', quantity: '0', price: '0', priceType: 'x', purposeOfSale: 'x', state: '', district: '',
    weightKg: '999', notForSlaughter: false, termsAccepted: false, phone: '1', ownerType: 'x', healthNote: 'a'.repeat(501) };
  const keys = new Set([...Object.values(validateListing({ ...bad, category: 'goat' }, cfg)), ...Object.values(validateListing(bad, cfg)),
    ...Object.values(validateEnquiry({ name: '', message: '', phone: '' })), ...Object.values(validateEnquiry({ name: 'a'.repeat(81), message: 'a'.repeat(ENQUIRY_MAX + 1), phone: '9876543210' }))]);
  assert.ok(keys.size >= 15, 'collected ' + keys.size);
  for (const k of keys) for (const l of ['en', 'hi', 'mr']) assert.ok(TEXTS[l][k], `${k} missing in ${l}`);
  assert.equal(makeT('hi')('err_msg_long', { n: 300 }).includes('300'), true);
});
