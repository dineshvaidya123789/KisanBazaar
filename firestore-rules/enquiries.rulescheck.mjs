// Checks the buyer-enquiry rules (livestockEnquiries) in firestore.rules.PROPOSED against the Firebase emulator.
// Run from this folder:  firebase emulators:exec --only firestore --project demo-kisanbazaar "node enquiries.rulescheck.mjs"
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/Test/.gemini/antigravity/scratch/smart-clinic-suite/scripts/rules-tests/x.js');
const { initializeTestEnvironment, assertSucceeds, assertFails } = require('@firebase/rules-unit-testing');

const rules = fs.readFileSync(new URL('./firestore.rules.PROPOSED', import.meta.url), 'utf8');
const [host, port] = (process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8085').split(':');
const env = await initializeTestEnvironment({ projectId: 'demo-kisanbazaar', firestore: { rules, host, port: Number(port) } });

const ADMIN = '+919987917394';
const SELLER = { uid: 'seller1', phone: '+919000000001' };
const SELLER2 = { uid: 'seller2', phone: '+919000000002' };
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
const enq = (listingId, buyer, over = {}) => ({
  listingId, sellerUid: SELLER.uid, buyerUid: buyer.uid, buyerName: 'Ravi', buyerPhone: '+919111111111', message: 'Is it still available?',
  listingTitle: '5 x Osmanabadi goat', status: 'new', createdAt: Date.now(), ...over,
});
const idOf = (listingId, buyer) => `${listingId}_${buyer.uid}`;
const col = (db) => db.collection('livestockEnquiries');
let nFresh = 0; const fresh = () => { nFresh++; return { uid: 'fresh' + nFresh, phone: '+9188' + String(10000000 + nFresh) }; }; // brand-new buyer each time

await seed(async (db) => {
  await db.collection('livestockConfig').doc('main').set({ enabled: true });
  await db.collection('livestockListings').doc('live').set(listing(SELLER.uid));
  await db.collection('livestockListings').doc('pend').set(listing(SELLER.uid, { status: 'pending' }));
  await db.collection('livestockListings').doc('sold').set(listing(SELLER.uid, { status: 'sold' }));
  await db.collection('livestockListings').doc('old').set(listing(SELLER.uid, { expiresAt: Date.now() - DAY }));
  await db.collection('livestockListings').doc('other').set(listing(SELLER2.uid));
  // an existing enquiry, to test reading and marking
  await col(db).doc(idOf('live', BUYER2)).set(enq('live', BUYER2, { buyerName: 'Sita', buyerPhone: '+919222222222' }));
});

console.log('sending an enquiry');
await t('a signed-in buyer sends one for a live animal', () => assertSucceeds(col(ctxOf(BUYER)).doc(idOf('live', BUYER)).set(enq('live', BUYER))));
await t('the same buyer cannot send a second one for the same animal (no duplicates)', () => assertFails(col(ctxOf(BUYER)).doc(idOf('live', BUYER)).set(enq('live', BUYER, { message: 'again' }))));
await t('the same buyer can ask about a different animal of another seller', () => assertSucceeds(col(ctxOf(BUYER)).doc(idOf('other', BUYER)).set(enq('other', BUYER, { sellerUid: SELLER2.uid }))));
await t('logged-out cannot send', () => assertFails(col(anon()).doc('live_x').set(enq('live', { uid: 'x' }))));
await t('cannot send as another buyer', () => assertFails(col(ctxOf(BUYER)).doc(idOf('live', BUYER2)).set(enq('live', BUYER2))));
await t('the id must be listing + buyer', () => { const b = fresh(); return assertFails(col(ctxOf(b)).doc('random-id').set(enq('live', b))); });
await t('a seller cannot enquire on their own animal', () => assertFails(col(ctxOf(SELLER)).doc(idOf('live', SELLER)).set(enq('live', SELLER))));
await t('sellerUid must be the real owner of the animal', () => assertFails(col(ctxOf(BUYER2)).doc(idOf('other', BUYER2)).set(enq('other', BUYER2, { sellerUid: SELLER.uid }))));
await t('not for a pending animal', () => assertFails(col(ctxOf(BUYER2)).doc(idOf('pend', BUYER2)).set(enq('pend', BUYER2))));
await t('not for a sold animal', () => assertFails(col(ctxOf(BUYER2)).doc(idOf('sold', BUYER2)).set(enq('sold', BUYER2))));
await t('not for an expired animal', () => assertFails(col(ctxOf(BUYER2)).doc(idOf('old', BUYER2)).set(enq('old', BUYER2))));
await t('not for an animal that does not exist', () => assertFails(col(ctxOf(BUYER2)).doc(idOf('ghost', BUYER2)).set(enq('ghost', BUYER2))));
await t('empty message refused', () => { const b = fresh(); return assertFails(col(ctxOf(b)).doc(idOf('live', b)).set(enq('live', b, { message: '' }))); });
await t('301 character message refused', () => { const b = fresh(); return assertFails(col(ctxOf(b)).doc(idOf('live', b)).set(enq('live', b, { message: 'x'.repeat(301) }))); });
await t('300 character message accepted', () => { const b = fresh(); return assertSucceeds(col(ctxOf(b)).doc(idOf('live', b)).set(enq('live', b, { message: 'x'.repeat(300) }))); });
await t('missing buyer name refused', () => { const b = fresh(); return assertFails(col(ctxOf(b)).doc(idOf('live', b)).set(enq('live', b, { buyerName: '' }))); });
await t('unknown field refused', () => { const b = fresh(); return assertFails(col(ctxOf(b)).doc(idOf('live', b)).set(enq('live', b, { isAdminNote: true }))); });
await t('cannot start as already read', () => { const b = fresh(); return assertFails(col(ctxOf(b)).doc(idOf('live', b)).set(enq('live', b, { status: 'read' }))); });
await t('a valid one from a fresh buyer works (control: the refusals above are about the field, not the setup)', () => { const b = fresh(); return assertSucceeds(col(ctxOf(b)).doc(idOf('live', b)).set(enq('live', b))); });
await t('a missing buyer phone is refused', () => { const b = fresh(); return assertFails(col(ctxOf(b)).doc(idOf('live', b)).set(enq('live', b, { buyerPhone: '' }))); });
await t('a seller id that is not a string is refused', () => { const b = fresh(); return assertFails(col(ctxOf(b)).doc(idOf('live', b)).set(enq('live', b, { sellerUid: 5 }))); });
await t('a 121 character title is refused', () => { const b = fresh(); return assertFails(col(ctxOf(b)).doc(idOf('live', b)).set(enq('live', b, { listingTitle: 'x'.repeat(121) }))); });

await seed((db) => col(db).doc(idOf('live', BUYER2)).set(enq('live', BUYER2, { buyerName: 'Sita', buyerPhone: '+919222222222' })));
console.log('a signed-in buyer reading animals (the page checks this before showing an enquiry form)');
await t('signed-in buyer can read a live animal', () => assertSucceeds(ctxOf(BUYER).collection('livestockListings').doc('live').get()));
await t('signed-in buyer cannot read an expired animal', () => assertFails(ctxOf(BUYER).collection('livestockListings').doc('old').get()));
await t('signed-in buyer cannot read a sold animal', () => assertFails(ctxOf(BUYER).collection('livestockListings').doc('sold').get()));
await t('signed-in buyer cannot read a pending animal', () => assertFails(ctxOf(BUYER).collection('livestockListings').doc('pend').get()));
console.log('who can read');
await t('buyer reads own enquiry', () => assertSucceeds(col(ctxOf(BUYER)).doc(idOf('live', BUYER)).get()));
await t('the seller reads an enquiry about their animal', () => assertSucceeds(col(ctxOf(SELLER)).doc(idOf('live', BUYER)).get()));
await t('another buyer cannot read it', () => assertFails(col(ctxOf(BUYER2)).doc(idOf('live', BUYER)).get()));
await t('another seller cannot read it', () => assertFails(col(ctxOf(SELLER2)).doc(idOf('live', BUYER)).get()));
await t('logged-out cannot read it', () => assertFails(col(anon()).doc(idOf('live', BUYER)).get()));
await t('admin reads it', () => assertSucceeds(col(admin()).doc(idOf('live', BUYER)).get()));
await t('seller lists their own inbox', () => assertSucceeds(col(ctxOf(SELLER)).where('sellerUid', '==', SELLER.uid).get()));
await t("seller cannot list another seller's inbox", () => assertFails(col(ctxOf(SELLER)).where('sellerUid', '==', SELLER2.uid).get()));
await t('buyer lists their own sent enquiries', () => assertSucceeds(col(ctxOf(BUYER)).where('buyerUid', '==', BUYER.uid).get()));
await t('nobody can list everything except admin', () => assertFails(col(ctxOf(SELLER)).get()));
await t('admin lists everything', () => assertSucceeds(col(admin()).get()));

console.log('marking read, editing, deleting');
await t('seller marks an enquiry read', () => assertSucceeds(col(ctxOf(SELLER)).doc(idOf('live', BUYER)).update({ status: 'read' })));
await t('seller marks it unread again', () => assertSucceeds(col(ctxOf(SELLER)).doc(idOf('live', BUYER)).update({ status: 'new' })));
await t('seller cannot set another status', () => assertFails(col(ctxOf(SELLER)).doc(idOf('live', BUYER)).update({ status: 'done' })));
await t('seller cannot change the message', () => assertFails(col(ctxOf(SELLER)).doc(idOf('live', BUYER)).update({ message: 'edited' })));
await t('seller cannot change the buyer phone', () => assertFails(col(ctxOf(SELLER)).doc(idOf('live', BUYER)).update({ buyerPhone: '+919999999999' })));
await t('buyer cannot edit own enquiry', () => assertFails(col(ctxOf(BUYER)).doc(idOf('live', BUYER)).update({ message: 'edited' })));
await t('another seller cannot mark it read', () => assertFails(col(ctxOf(SELLER2)).doc(idOf('live', BUYER)).update({ status: 'read' })));
await t('seller cannot delete an enquiry', () => assertFails(col(ctxOf(SELLER)).doc(idOf('live', BUYER)).delete()));
await t('another buyer cannot delete it', () => assertFails(col(ctxOf(BUYER2)).doc(idOf('live', BUYER)).delete()));
await t('buyer deletes own enquiry', () => assertSucceeds(col(ctxOf(BUYER)).doc(idOf('live', BUYER)).delete()));
await t('admin deletes any enquiry', () => assertSucceeds(col(admin()).doc(idOf('live', BUYER2)).delete()));

console.log('module switched off (dark)');
await seed((db) => db.collection('livestockConfig').doc('main').set({ enabled: false }));
await t('a buyer cannot send while the module is off', () => assertFails(col(ctxOf(BUYER)).doc(idOf('live', BUYER)).set(enq('live', BUYER))));
await seed((db) => db.collection('livestockConfig').doc('main').set({ enabled: true }));

console.log('regression: nothing else opened up');
await t('logged-out still cannot read users', () => assertFails(anon().collection('users').doc('x').get()));
await t('an unknown collection stays closed', () => assertFails(ctxOf(SELLER).collection('somethingElse').doc('x').get()));

console.log(`\n${pass} passed, ${fail} failed`);
await env.cleanup();
process.exit(fail ? 1 : 0);
