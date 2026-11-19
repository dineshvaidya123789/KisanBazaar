// Checks firestore.rules.PROPOSED against the Firebase emulator (throwaway in-memory project, never touches the real one).
// Run from this folder:  firebase emulators:exec --only firestore --project demo-kisanbazaar "node rules.rulescheck.mjs"
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/Test/.gemini/antigravity/scratch/smart-clinic-suite/scripts/rules-tests/x.js'); // borrows the test library installed for CuroSyncAI
const { initializeTestEnvironment, assertSucceeds, assertFails } = require('@firebase/rules-unit-testing');

const rules = fs.readFileSync(new URL('./firestore.rules.PROPOSED', import.meta.url), 'utf8');
const [host, port] = (process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8085').split(':');
const env = await initializeTestEnvironment({ projectId: 'demo-kisanbazaar', firestore: { rules, host, port: Number(port) } });

const ADMIN = '+919987917394';
const A = { uid: 'userA', phone: '+919000000001' };
const B = { uid: 'userB', phone: '+919000000002' };
const ctxOf = (u, phone) => env.authenticatedContext(u, { phone_number: phone }).firestore();
const anon = () => env.unauthenticatedContext().firestore();
const admin = () => ctxOf('adminUid', ADMIN);
const userA = () => ctxOf(A.uid, A.phone);
const userB = () => ctxOf(B.uid, B.phone);

let pass = 0, fail = 0;
const t = async (name, fn) => { try { await fn(); pass++; console.log('  ok   ' + name); } catch (e) { fail++; console.log('  FAIL ' + name + ' -> ' + String(e.message).split('\n')[0]); } };

// ---- seed (rules disabled): real-shaped data ----
const backup = (n) => JSON.parse(fs.readFileSync('C:/Users/Test/kisanbazaar-backup-2026-11-18/' + n + '.json', 'utf8'));
const val = (v) => { const k = Object.keys(v)[0]; return k === 'integerValue' ? Number(v[k]) : k === 'mapValue' ? Object.fromEntries(Object.entries(v[k].fields || {}).map(([a, b]) => [a, val(b)])) : k === 'arrayValue' ? (v[k].values || []).map(val) : v[k]; };
const plain = (d) => Object.fromEntries(Object.entries(d.fields || {}).map(([k, v]) => [k, val(v)]));
const realListings = backup('listings').map(plain);
const realAlerts = backup('alerts').map(plain);
const realUsers = backup('users').map(plain);

await env.withSecurityRulesDisabled(async (ctx) => {
  const db = ctx.firestore();
  await db.collection('users').doc(A.uid).set({ uid: A.uid, phone: A.phone, role: 'Farmer', isVerified: false, interests: [] });
  await db.collection('users').doc(B.uid).set({ uid: B.uid, phone: B.phone, role: 'Farmer', isVerified: false, interests: [] });
  await db.collection('listings').doc('legacyPhone10').set({ type: 'Sell', commodity: 'Onion', seller: 'A', contactMobile: A.phone.slice(3), images: [] });
  await db.collection('listings').doc('legacyPlus91').set({ type: 'Sell', commodity: 'Onion', seller: 'A', contactMobile: A.phone });
  await db.collection('listings').doc('byUid').set({ type: 'Sell', commodity: 'Rice', seller: 'B', contactMobile: '9111111111', ownerUid: B.uid });
  await db.collection('listings').doc('legacyOther').set({ type: 'Buy', commodity: 'Wheat', seller: 'C', contactMobile: '9222222222' });
  await db.collection('buyerRequests').doc('r1').set({ commodity: 'Maize', buyerPhone: '9333333333' });
  await db.collection('alerts').doc('al1').set({ userId: '9444444444', type: 'sell_alert', commodity: 'Rice' });
});

console.log('users');
await t('logged-out cannot read a user', () => assertFails(anon().collection('users').doc(A.uid).get()));
await t('logged-out cannot list users', () => assertFails(anon().collection('users').get()));
await t('user reads own profile', () => assertSucceeds(userA().collection('users').doc(A.uid).get()));
await t("user cannot read someone else's profile", () => assertFails(userA().collection('users').doc(B.uid).get()));
await t('user cannot list all users', () => assertFails(userA().collection('users').get()));
await t('admin lists all users', () => assertSucceeds(admin().collection('users').get()));
await t('new user creates own Farmer profile', () => assertSucceeds(ctxOf('new1', '+919000000009').collection('users').doc('new1').set({ uid: 'new1', phone: '+919000000009', role: 'Farmer', isVerified: false, onboardingCompleted: false, createdAt: 1 })));
await t('new user cannot create an Admin profile', () => assertFails(ctxOf('new2', '+919000000008').collection('users').doc('new2').set({ uid: 'new2', role: 'Admin', isVerified: false })));
await t('admin phone creates the Admin profile', () => assertSucceeds(admin().collection('users').doc('adminUid').set({ uid: 'adminUid', phone: ADMIN, role: 'Admin', isVerified: false })));
await t('user cannot create a profile for another uid', () => assertFails(userA().collection('users').doc('someoneElse').set({ uid: 'someoneElse', role: 'Farmer', isVerified: false })));
await t('user updates own interests', () => assertSucceeds(userA().collection('users').doc(A.uid).update({ interests: ['Rice'] })));
await t('user cannot make themselves Admin', () => assertFails(userA().collection('users').doc(A.uid).update({ role: 'Admin' })));
await t('user cannot self-verify', () => assertFails(userA().collection('users').doc(A.uid).update({ isVerified: true })));
await t("user cannot edit someone else's profile", () => assertFails(userA().collection('users').doc(B.uid).update({ interests: ['x'] })));
await t('user cannot delete a profile', () => assertFails(userA().collection('users').doc(A.uid).delete()));

console.log('listings');
const good = { type: 'Sell', commodity: 'Maize', seller: 'Ravi', contactMobile: '9555555555', quantity: '10', images: [], timestamp: 1 };
await t('anyone (logged out) reads listings', () => assertSucceeds(anon().collection('listings').get()));
await t('guest can still post a valid listing (today\'s behaviour)', () => assertSucceeds(anon().collection('listings').add(good)));
await t('listing with a wrong type is refused', () => assertFails(anon().collection('listings').add({ ...good, type: 'Hack' })));
await t('listing with 7 images is refused', () => assertFails(anon().collection('listings').add({ ...good, images: [1, 2, 3, 4, 5, 6, 7] })));
await t('listing with a huge comment is refused', () => assertFails(anon().collection('listings').add({ ...good, comments: 'x'.repeat(3000) })));
await t('listing with 41 fields is refused', () => assertFails(anon().collection('listings').add({ ...good, ...Object.fromEntries(Array.from({ length: 40 }, (_, i) => ['f' + i, i])) })));
await t('logged-out cannot delete a listing', () => assertFails(anon().collection('listings').doc('legacyPhone10').delete()));
await t('owner deletes a legacy listing saved as 10 digits', () => assertSucceeds(userA().collection('listings').doc('legacyPhone10').delete()));
await t('owner updates a legacy listing saved as +91', () => assertSucceeds(userA().collection('listings').doc('legacyPlus91').update({ quantity: '20' })));
await t("user cannot delete someone else's listing", () => assertFails(userA().collection('listings').doc('byUid').delete()));
await t('owner by ownerUid deletes', () => assertSucceeds(userB().collection('listings').doc('byUid').delete()));
await t('legacy listing of another phone is admin-only', () => assertFails(userA().collection('listings').doc('legacyOther').delete()));
await t('admin deletes any listing', () => assertSucceeds(admin().collection('listings').doc('legacyOther').delete()));
await t('owner cannot hand a listing to someone else (update to refused data)', () => assertFails(userA().collection('listings').doc('legacyPlus91').update({ type: 'Hack' })));

console.log('real listings from the backup (shape replay)');
let n = 0;
for (const l of realListings) {
  n++;
  const copy = { ...l }; delete copy.id;
  await t('real listing ' + n + ' passes the create rule as a guest', () => assertSucceeds(anon().collection('listings').add(copy)));
}

console.log('buyerRequests');
await t('logged-out cannot read buyer requests', () => assertFails(anon().collection('buyerRequests').get()));
await t('signed-in reads buyer requests', () => assertSucceeds(userA().collection('buyerRequests').get()));
await t('signed-in creates a buyer request', () => assertSucceeds(userA().collection('buyerRequests').add({ commodity: 'Rice', status: 'open', buyerName: 'x', buyerPhone: '1', location: 'y' })));
await t('logged-out cannot create a buyer request', () => assertFails(anon().collection('buyerRequests').add({ commodity: 'Rice' })));
await t('user cannot delete a buyer request', () => assertFails(userA().collection('buyerRequests').doc('r1').delete()));
await t('admin deletes a buyer request', () => assertSucceeds(admin().collection('buyerRequests').doc('r1').delete()));

console.log('alerts');
await t('guest creates an alert (today\'s behaviour)', () => assertSucceeds(anon().collection('alerts').add({ userId: 'anonymous', type: 'sell_alert', commodity: 'Rice', maxPrice: 10, channel: 'app', timestamp: 1 })));
let m = 0;
for (const a of realAlerts) { m++; await t('real alert ' + m + ' passes the create rule', () => assertSucceeds(anon().collection('alerts').add(a))); }
await t('guest cannot read alerts', () => assertFails(anon().collection('alerts').get()));
await t('user cannot read alerts', () => assertFails(userA().collection('alerts').get()));
await t('admin reads alerts', () => assertSucceeds(admin().collection('alerts').get()));
await t('user cannot delete an alert', () => assertFails(userA().collection('alerts').doc('al1').delete()));

console.log('everything else');
await t('unknown collection: read refused', () => assertFails(userA().collection('secrets').get()));
await t('unknown collection: write refused even for admin', () => assertFails(admin().collection('secrets').add({ a: 1 })));

console.log('real users from the backup (shape replay)');
let k = 0;
for (const u of realUsers) { k++; const uid = 'real' + k; await t('real user ' + k + ' profile shape can be created by its owner (role ' + u.role + ')', async () => {
  const phone = u.role === 'Admin' ? ADMIN : '+919777777' + String(700 + k);
  const ctx = u.role === 'Admin' ? ctxOf(uid, ADMIN) : ctxOf(uid, phone);
  await assertSucceeds(ctx.collection('users').doc(uid).set({ ...u, uid })); }); }

console.log('\n' + pass + ' passed, ' + fail + ' failed');
await env.cleanup();
process.exit(fail ? 1 : 0);
