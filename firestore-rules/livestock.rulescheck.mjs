// Checks the livestock section of firestore.rules.PROPOSED against the Firebase emulator (throwaway in-memory project).
// Run from this folder:  firebase emulators:exec --only firestore --project demo-kisanbazaar "node livestock.rulescheck.mjs"
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/Test/.gemini/antigravity/scratch/smart-clinic-suite/scripts/rules-tests/x.js'); // borrows the test library installed for CuroSyncAI
const { initializeTestEnvironment, assertSucceeds, assertFails } = require('@firebase/rules-unit-testing');

const rules = fs.readFileSync(new URL('./firestore.rules.PROPOSED', import.meta.url), 'utf8');
const [host, port] = (process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8085').split(':');
const env = await initializeTestEnvironment({ projectId: 'demo-kisanbazaar', firestore: { rules, host, port: Number(port) } });

const ADMIN = '+919987917394';
const A = { uid: 'sellerA', phone: '+919000000001' };
const B = { uid: 'sellerB', phone: '+919000000002' };
const C = { uid: 'sellerC', phone: '+919000000003' }; // auto-approved seller
const ctxOf = (u, phone) => env.authenticatedContext(u, { phone_number: phone }).firestore();
const anon = () => env.unauthenticatedContext().firestore();
const admin = () => ctxOf('adminUid', ADMIN);
const sa = () => ctxOf(A.uid, A.phone);
const sb = () => ctxOf(B.uid, B.phone);
const sc = () => ctxOf(C.uid, C.phone);

let pass = 0, fail = 0;
const t = async (name, fn) => { try { await fn(); pass++; console.log('  ok   ' + name); } catch (e) { fail++; console.log('  FAIL ' + name + ' -> ' + String(e.message).split('\n')[0]); } };

const DAY = 86400000;
const listing = (uid, over = {}) => ({
  ownerUid: uid, ownerType: 'farm', sellerName: 'Test Farm', category: 'goat', breed: 'Osmanabadi', sex: 'female', ageMonths: 14,
  weightKg: 30, quantity: 5, priceType: 'per_animal', price: 9000, state: 'Maharashtra', district: 'Satara', photos: [],
  purposeOfSale: 'breeding', notForSlaughter: true, termsAcceptedAt: Date.now(), status: 'pending', createdAt: Date.now(),
  expiresAt: Date.now() + 30 * DAY, ...over,
});
const seed = async (fn) => env.withSecurityRulesDisabled(async (ctx) => fn(ctx.firestore()));

await seed(async (db) => {
  await db.collection('livestockConfig').doc('main').set({ enabled: true });
  await db.collection('livestockAccounts').doc(C.uid).set({ uid: C.uid, businessName: 'C Farm', ownerType: 'farm', autoApprove: true });
  await db.collection('livestockListings').doc('pubA').set(listing(A.uid, { status: 'approved' }));
  await db.collection('livestockContacts').doc('pubA').set({ ownerUid: A.uid, phone: A.phone });
  await db.collection('livestockListings').doc('pendA').set(listing(A.uid));
  await db.collection('livestockListings').doc('rejA').set(listing(A.uid, { status: 'rejected', rejectionReason: 'photo unclear' }));
  await db.collection('livestockListings').doc('oldA').set(listing(A.uid, { status: 'approved', expiresAt: Date.now() - DAY }));
  await db.collection('livestockListings').doc('pubB').set(listing(B.uid, { status: 'approved' }));
});

console.log('config (the switch)');
await t('anyone can read the config', () => assertSucceeds(anon().collection('livestockConfig').doc('main').get()));
await t('a seller cannot change the config', () => assertFails(sa().collection('livestockConfig').doc('main').set({ enabled: false })));
await t('logged-out cannot change the config', () => assertFails(anon().collection('livestockConfig').doc('main').set({ enabled: true })));
await t('admin can change the config', () => assertSucceeds(admin().collection('livestockConfig').doc('main').set({ enabled: true, categories: { goat: true } })));

console.log('who can see listings');
await t('public can query approved listings (status and expiry filters)', () => assertSucceeds(anon().collection('livestockListings').where('status', '==', 'approved').where('expiresAt', '>', Date.now()).get()));
await t('public cannot list everything (unfiltered)', () => assertFails(anon().collection('livestockListings').get()));
await t('public cannot read a pending listing', () => assertFails(anon().collection('livestockListings').doc('pendA').get()));
await t('public cannot read a rejected listing', () => assertFails(anon().collection('livestockListings').doc('rejA').get()));
await t('public cannot read an expired listing', () => assertFails(anon().collection('livestockListings').doc('oldA').get()));
await t('public can read an approved listing', () => assertSucceeds(anon().collection('livestockListings').doc('pubA').get()));
await t('owner reads own pending listing', () => assertSucceeds(sa().collection('livestockListings').doc('pendA').get()));
await t("another seller cannot read someone's pending listing", () => assertFails(sb().collection('livestockListings').doc('pendA').get()));
await t('owner lists own listings', () => assertSucceeds(sa().collection('livestockListings').where('ownerUid', '==', A.uid).get()));
await t('admin lists everything', () => assertSucceeds(admin().collection('livestockListings').get()));

console.log('phone numbers');
await t('public cannot read a seller phone', () => assertFails(anon().collection('livestockContacts').doc('pubA').get()));
await t('another seller cannot read a seller phone', () => assertFails(sb().collection('livestockContacts').doc('pubA').get()));
await t('owner reads own phone record', () => assertSucceeds(sa().collection('livestockContacts').doc('pubA').get()));
await t('admin reads a phone record', () => assertSucceeds(admin().collection('livestockContacts').doc('pubA').get()));
await t('nobody can list all phone records except admin', () => assertFails(sa().collection('livestockContacts').get()));

console.log('posting (seller)');
await t('seller posts a pending listing + phone together', async () => {
  const db = sa(); const b = db.batch();
  b.set(db.collection('livestockListings').doc('n1'), listing(A.uid));
  b.set(db.collection('livestockContacts').doc('n1'), { ownerUid: A.uid, phone: A.phone, updatedAt: Date.now() });
  await assertSucceeds(b.commit());
});
await t('phone record for someone else\'s listing is refused', () => assertFails(sa().collection('livestockContacts').doc('pubB').set({ ownerUid: A.uid, phone: A.phone })));
await t('logged-out cannot post', () => assertFails(anon().collection('livestockListings').doc('x1').set(listing('anon'))));
await t('cannot post as another seller', () => assertFails(sa().collection('livestockListings').doc('x2').set(listing(B.uid))));
await t('new seller cannot post straight to approved', () => assertFails(sa().collection('livestockListings').doc('x3').set(listing(A.uid, { status: 'approved' }))));
await t('auto-approved seller can post approved', () => assertSucceeds(sc().collection('livestockListings').doc('c1').set(listing(C.uid, { status: 'approved' }))));
await t('seller cannot set approvedBy', () => assertFails(sa().collection('livestockListings').doc('x4').set(listing(A.uid, { approvedBy: 'me' }))));
await t('seller cannot mark postedByAdmin', () => assertFails(sa().collection('livestockListings').doc('x5').set(listing(A.uid, { postedByAdmin: true }))));
await t('seller cannot set rejectionReason', () => assertFails(sa().collection('livestockListings').doc('x6').set(listing(A.uid, { rejectionReason: 'x' }))));
await t('unknown field refused', () => assertFails(sa().collection('livestockListings').doc('x7').set(listing(A.uid, { isFeatured: true }))));
await t('bad category refused', () => assertFails(sa().collection('livestockListings').doc('x8').set(listing(A.uid, { category: 'dog' }))));
await t('price of zero refused', () => assertFails(sa().collection('livestockListings').doc('x9').set(listing(A.uid, { price: 0 }))));
await t('quantity 0 refused', () => assertFails(sa().collection('livestockListings').doc('x10').set(listing(A.uid, { quantity: 0 }))));
await t('quantity 1001 refused', () => assertFails(sa().collection('livestockListings').doc('x11').set(listing(A.uid, { quantity: 1001 }))));
await t('7 photos refused', () => assertFails(sa().collection('livestockListings').doc('x12').set(listing(A.uid, { photos: [1, 2, 3, 4, 5, 6, 7].map(String) }))));
await t('expiry 100 days ahead refused', () => assertFails(sa().collection('livestockListings').doc('x13').set(listing(A.uid, { expiresAt: Date.now() + 100 * DAY }))));
await t('long health note refused', () => assertFails(sa().collection('livestockListings').doc('x14').set(listing(A.uid, { healthNote: 'x'.repeat(501) }))));
await t('seller cannot create own account with autoApprove', () => assertFails(sb().collection('livestockAccounts').doc(B.uid).set({ uid: B.uid, businessName: 'B', ownerType: 'farm', autoApprove: true, createdAt: 1 })));
await t('seller creates own plain account', () => assertSucceeds(sb().collection('livestockAccounts').doc(B.uid).set({ uid: B.uid, businessName: 'B', ownerType: 'farm', createdAt: 1 })));
await t('seller cannot create account for someone else', () => assertFails(sb().collection('livestockAccounts').doc('other').set({ uid: 'other', businessName: 'B', ownerType: 'farm', createdAt: 1 })));
await t('seller cannot self-set autoApprove on update', () => assertFails(sb().collection('livestockAccounts').doc(B.uid).update({ autoApprove: true })));
await t('seller can rename own business', () => assertSucceeds(sb().collection('livestockAccounts').doc(B.uid).update({ businessName: 'B2' })));
await t('seller cannot read another seller account', () => assertFails(sa().collection('livestockAccounts').doc(C.uid).get()));
await t('admin sets autoApprove on an account', () => assertSucceeds(admin().collection('livestockAccounts').doc(B.uid).update({ autoApprove: true })));

console.log('module switched off (dark)');
await seed((db) => db.collection('livestockConfig').doc('main').set({ enabled: false }));
await t('seller cannot post while the module is off', () => assertFails(sa().collection('livestockListings').doc('off1').set(listing(A.uid))));
await t('seller cannot create an account while off', () => assertFails(sa().collection('livestockAccounts').doc(A.uid).set({ uid: A.uid, businessName: 'A', ownerType: 'farm', createdAt: 1 })));
await t('admin can still post while off', () => assertSucceeds(admin().collection('livestockListings').doc('off2').set(listing('adminUid', { postedByAdmin: true }))));
await seed((db) => db.collection('livestockConfig').doc('main').set({ enabled: true }));

console.log('editing and moderation');
await t('owner marks own listing sold', () => assertSucceeds(sa().collection('livestockListings').doc('pubA').update({ status: 'sold' })));
await t('owner cannot approve own pending listing', () => assertFails(sa().collection('livestockListings').doc('pendA').update({ status: 'approved' })));
await t('owner cannot change the owner', () => assertFails(sa().collection('livestockListings').doc('pendA').update({ ownerUid: B.uid })));
await t('owner edits a pending listing (stays pending)', () => assertSucceeds(sa().collection('livestockListings').doc('pendA').update({ price: 9500 })));
await t('owner resubmits a rejected listing as pending', () => assertSucceeds(sa().collection('livestockListings').doc('rejA').update({ status: 'pending', price: 9100 })));
await t('owner cannot wipe the rejection reason', () => assertFails(sa().collection('livestockListings').doc('rejA').update({ rejectionReason: 'x' })));
await t("another seller cannot edit someone's listing", () => assertFails(sb().collection('livestockListings').doc('pubA').update({ price: 1 })));
await t('auto-approved seller keeps an edited listing approved', () => assertSucceeds(sc().collection('livestockListings').doc('c1').update({ price: 9900 })));
await t('admin approves a listing', () => assertSucceeds(admin().collection('livestockListings').doc('pendA').update({ status: 'approved', approvedBy: 'adminUid', approvedAt: Date.now() })));
await t('admin rejects with a reason', () => assertSucceeds(admin().collection('livestockListings').doc('pubB').update({ status: 'rejected', rejectionReason: 'blurry photo' })));
await t('admin posts on behalf of a farmer', () => assertSucceeds(admin().collection('livestockListings').doc('adm1').set(listing('adminUid', { postedByAdmin: true, sellerName: 'Ramesh (by admin)' }))));

console.log('deleting');
await t('another seller cannot delete', () => assertFails(sb().collection('livestockListings').doc('pendA').delete()));
await t('owner deletes own listing', () => assertSucceeds(sa().collection('livestockListings').doc('n1').delete()));
await t('admin deletes any listing', () => assertSucceeds(admin().collection('livestockListings').doc('adm1').delete()));

console.log('regression: nothing outside livestock opened up');
await t('logged-out still cannot read users', () => assertFails(anon().collection('users').doc('x').get()));
await t('an unknown collection stays closed', () => assertFails(sa().collection('somethingElse').doc('x').get()));

console.log(`\n${pass} passed, ${fail} failed`);
await env.cleanup();
process.exit(fail ? 1 : 0);
