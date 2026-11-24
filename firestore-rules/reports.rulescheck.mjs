// Checks the report rules (livestockReports) in firestore.rules.PROPOSED against the Firebase emulator.
// Run from this folder:  firebase emulators:exec --only firestore --project demo-kisanbazaar "node reports.rulescheck.mjs"
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/Test/.gemini/antigravity/scratch/smart-clinic-suite/scripts/rules-tests/x.js');
const { initializeTestEnvironment, assertSucceeds, assertFails } = require('@firebase/rules-unit-testing');

const rules = fs.readFileSync(new URL('./firestore.rules.PROPOSED', import.meta.url), 'utf8');
const [host, port] = (process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8085').split(':');
const env = await initializeTestEnvironment({ projectId: 'demo-kisanbazaar', firestore: { rules, host, port: Number(port) } });

const ADMIN = '+919987917394';
const SELLER = { uid: 'seller1', phone: '+919000000001' };
const BUYER = { uid: 'buyer1', phone: '+919111111111' };
const BUYER2 = { uid: 'buyer2', phone: '+919222222222' };
const ctxOf = (u) => env.authenticatedContext(u.uid, { phone_number: u.phone }).firestore();
const anon = () => env.unauthenticatedContext().firestore();
const admin = () => env.authenticatedContext('adminUid', { phone_number: ADMIN }).firestore();
const seed = async (fn) => env.withSecurityRulesDisabled(async (ctx) => fn(ctx.firestore()));

let pass = 0, fail = 0;
const t = async (name, fn) => { try { await fn(); pass++; console.log('  ok   ' + name); } catch (e) { fail++; console.log('  FAIL ' + name + ' -> ' + String(e.message).split('\n')[0]); } };

const DAY = 86400000;
const listing = (uid, over = {}) => ({
  ownerUid: uid, ownerType: 'farm', category: 'goat', breed: 'Osmanabadi', sex: 'female', ageMonths: 14, quantity: 5, priceType: 'per_animal',
  price: 9000, state: 'Maharashtra', district: 'Satara', photos: [], purposeOfSale: 'breeding', termsAcceptedAt: Date.now(),
  status: 'approved', createdAt: Date.now(), expiresAt: Date.now() + 30 * DAY, ...over,
});
const rep = (listingId, who, over = {}) => ({
  listingId, listingTitle: '5 x Osmanabadi goat', sellerUid: SELLER.uid, reporterUid: who.uid, reason: 'fake', note: 'Photos look copied', status: 'new', createdAt: Date.now(), ...over,
});
const idOf = (l, who) => `${l}_${who.uid}`;
const col = (db) => db.collection('livestockReports');
let nFresh = 0; const fresh = () => { nFresh++; return { uid: 'fresh' + nFresh, phone: '+9188' + String(10000000 + nFresh) }; };

await seed(async (db) => {
  await db.collection('livestockConfig').doc('main').set({ enabled: true });
  await db.collection('livestockListings').doc('live').set(listing(SELLER.uid));
  await db.collection('livestockListings').doc('pend').set(listing(SELLER.uid, { status: 'pending' }));
  await db.collection('livestockListings').doc('sold').set(listing(SELLER.uid, { status: 'sold' }));
  await db.collection('livestockListings').doc('old').set(listing(SELLER.uid, { expiresAt: Date.now() - DAY }));
  await col(db).doc(idOf('live', BUYER2)).set(rep('live', BUYER2));
});

console.log('sending a report');
await t('a signed-in buyer reports a live animal', () => assertSucceeds(col(ctxOf(BUYER)).doc(idOf('live', BUYER)).set(rep('live', BUYER))));
await t('the same buyer cannot report the same animal twice', () => assertFails(col(ctxOf(BUYER)).doc(idOf('live', BUYER)).set(rep('live', BUYER, { reason: 'spam' }))));
await t('a report without a note is fine', () => { const b = fresh(); const r = rep('live', b); delete r.note; return assertSucceeds(col(ctxOf(b)).doc(idOf('live', b)).set(r)); });
await t('every allowed reason works', async () => { for (const reason of ['fake', 'wrong_info', 'already_sold', 'spam', 'animal_welfare', 'other']) { const b = fresh(); await assertSucceeds(col(ctxOf(b)).doc(idOf('live', b)).set(rep('live', b, { reason }))); } });
await t('an unknown reason is refused', () => { const b = fresh(); return assertFails(col(ctxOf(b)).doc(idOf('live', b)).set(rep('live', b, { reason: 'because' }))); });
await t('a missing reason is refused', () => { const b = fresh(); const r = rep('live', b); delete r.reason; return assertFails(col(ctxOf(b)).doc(idOf('live', b)).set(r)); });
await t('201 character note refused', () => { const b = fresh(); return assertFails(col(ctxOf(b)).doc(idOf('live', b)).set(rep('live', b, { note: 'x'.repeat(201) }))); });
await t('200 character note accepted', () => { const b = fresh(); return assertSucceeds(col(ctxOf(b)).doc(idOf('live', b)).set(rep('live', b, { note: 'x'.repeat(200) }))); });
await t('a note that is not text is refused', () => { const b = fresh(); return assertFails(col(ctxOf(b)).doc(idOf('live', b)).set(rep('live', b, { note: 5 }))); });
await t('logged-out cannot report', () => assertFails(col(anon()).doc('live_x').set(rep('live', { uid: 'x' }))));
await t('cannot report as another person', () => assertFails(col(ctxOf(BUYER)).doc(idOf('live', BUYER2)).set(rep('live', BUYER2))));
await t('the id must be listing + reporter', () => { const b = fresh(); return assertFails(col(ctxOf(b)).doc('random-id').set(rep('live', b))); });
await t('the seller cannot report their own animal', () => assertFails(col(ctxOf(SELLER)).doc(idOf('live', SELLER)).set(rep('live', SELLER, { sellerUid: SELLER.uid }))));
await t('sellerUid must be the real owner', () => { const b = fresh(); return assertFails(col(ctxOf(b)).doc(idOf('live', b)).set(rep('live', b, { sellerUid: 'someoneElse' }))); });
await t('not for a pending animal', () => { const b = fresh(); return assertFails(col(ctxOf(b)).doc(idOf('pend', b)).set(rep('pend', b))); });
await t('not for a sold animal', () => { const b = fresh(); return assertFails(col(ctxOf(b)).doc(idOf('sold', b)).set(rep('sold', b))); });
await t('not for an expired animal', () => { const b = fresh(); return assertFails(col(ctxOf(b)).doc(idOf('old', b)).set(rep('old', b))); });
await t('not for an animal that does not exist', () => { const b = fresh(); return assertFails(col(ctxOf(b)).doc(idOf('ghost', b)).set(rep('ghost', b))); });
await t('unknown field refused', () => { const b = fresh(); return assertFails(col(ctxOf(b)).doc(idOf('live', b)).set(rep('live', b, { reporterPhone: '+919111111111' }))); });
await t('cannot start as already reviewed', () => { const b = fresh(); return assertFails(col(ctxOf(b)).doc(idOf('live', b)).set(rep('live', b, { status: 'reviewed' }))); });
await t('a 121 character title is refused', () => { const b = fresh(); return assertFails(col(ctxOf(b)).doc(idOf('live', b)).set(rep('live', b, { listingTitle: 'x'.repeat(121) }))); });
await t('control: a valid one from a fresh person works', () => { const b = fresh(); return assertSucceeds(col(ctxOf(b)).doc(idOf('live', b)).set(rep('live', b))); });
await t('refused while the module is switched off', async () => {
  await seed((db) => db.collection('livestockConfig').doc('main').set({ enabled: false }));
  const b = fresh();
  try { await assertFails(col(ctxOf(b)).doc(idOf('live', b)).set(rep('live', b))); } finally { await seed((db) => db.collection('livestockConfig').doc('main').set({ enabled: true })); }
});

console.log('who can read');
await seed((db) => col(db).doc(idOf('live', BUYER2)).set(rep('live', BUYER2)));
await t('the reporter reads their own report', () => assertSucceeds(col(ctxOf(BUYER2)).doc(idOf('live', BUYER2)).get()));
await t('another buyer cannot read it', () => assertFails(col(ctxOf(BUYER)).doc(idOf('live', BUYER2)).get()));
await t('the seller cannot read reports about their animal', () => assertFails(col(ctxOf(SELLER)).doc(idOf('live', BUYER2)).get()));
await t('logged-out cannot read', () => assertFails(col(anon()).doc(idOf('live', BUYER2)).get()));
await t('the admin reads any report', () => assertSucceeds(col(admin()).doc(idOf('live', BUYER2)).get()));
await t('the admin lists all reports', () => assertSucceeds(col(admin()).get()));
await t('a buyer cannot list all reports', () => assertFails(col(ctxOf(BUYER)).get()));
await t('a seller cannot list all reports', () => assertFails(col(ctxOf(SELLER)).get()));

console.log('changing and deleting');
await t('the admin marks one reviewed', () => assertSucceeds(col(admin()).doc(idOf('live', BUYER2)).update({ status: 'reviewed' })));
await t('the admin cannot edit the reason', () => assertFails(col(admin()).doc(idOf('live', BUYER2)).update({ reason: 'spam' })));
await t('the reporter cannot change their report', () => assertFails(col(ctxOf(BUYER2)).doc(idOf('live', BUYER2)).update({ note: 'edited' })));
await t('the reporter cannot mark it reviewed', () => assertFails(col(ctxOf(BUYER2)).doc(idOf('live', BUYER2)).update({ status: 'reviewed' })));
await t('the seller cannot change it', () => assertFails(col(ctxOf(SELLER)).doc(idOf('live', BUYER2)).update({ status: 'reviewed' })));
await t('the reporter cannot delete it', () => assertFails(col(ctxOf(BUYER2)).doc(idOf('live', BUYER2)).delete()));
await t('the seller cannot delete it', () => assertFails(col(ctxOf(SELLER)).doc(idOf('live', BUYER2)).delete()));
await t('the admin deletes it', () => assertSucceeds(col(admin()).doc(idOf('live', BUYER2)).delete()));

console.log('regression: nothing else opened up');
await t('logged-out still cannot read users', () => assertFails(anon().collection('users').doc('x').get()));
await t('an unknown collection stays closed', () => assertFails(ctxOf(SELLER).collection('somethingElse').doc('x').get()));

console.log(`\n${pass} passed, ${fail} failed`);
await env.cleanup();
process.exit(fail ? 1 : 0);
