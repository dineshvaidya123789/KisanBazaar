// Integration test for the revealContact function against the LOCAL emulators (auth, firestore, functions). No live Firebase.
// Start the emulators from the repo root:  firebase emulators:start --config firebase.emu.json --project demo-kisanbazaar
// Then:  node functions/reveal.integration.mjs
const PROJECT = 'demo-kisanbazaar';
const FS = `http://127.0.0.1:9137/v1/projects/${PROJECT}/databases/(default)/documents`;
const AUTH = 'http://127.0.0.1:9190';
const FN = `http://127.0.0.1:5001/${PROJECT}/asia-south1/revealContact`;
const OWNER = { Authorization: 'Bearer owner', 'Content-Type': 'application/json' };
const ADMIN_PHONE = '+919987917394';
const DAY = 86400000;

// ---- tiny helpers ----
const S = (v) => ({ stringValue: String(v) }), I = (v) => ({ integerValue: String(v) }), B = (v) => ({ booleanValue: v });
const put = async (path, fields) => { const r = await fetch(`${FS}/${path}`, { method: 'PATCH', headers: OWNER, body: JSON.stringify({ fields }) }); if (!r.ok) throw new Error(`seed ${path} ${r.status}`); };
const getDoc = async (path) => { const r = await fetch(`${FS}/${path}`, { headers: OWNER }); return r.ok ? (await r.json()).fields : null; };
const del = (path) => fetch(`${FS}/${path}`, { method: 'DELETE', headers: OWNER });
const call = async (token, data) => {
  const r = await fetch(FN, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, body: JSON.stringify({ data }) });
  const j = await r.json();
  return j.error ? { error: j.error.status, reason: j.error.details && j.error.details.reason } : { ok: j.result };
};
const signIn = async (phone) => {
  const s = await (await fetch(`${AUTH}/identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode?key=fake`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phoneNumber: phone, recaptchaToken: 'fake' }) })).json();
  const codes = (await (await fetch(`${AUTH}/emulator/v1/projects/${PROJECT}/verificationCodes`)).json()).verificationCodes;
  const code = codes.filter((c) => c.phoneNumber === phone).pop().code;
  const t = await (await fetch(`${AUTH}/identitytoolkit.googleapis.com/v1/accounts:signInWithPhoneNumber?key=fake`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionInfo: s.sessionInfo, code }) })).json();
  return { uid: t.localId, token: t.idToken };
};
let pass = 0, fail = 0;
const t = async (name, fn) => { try { await fn(); pass++; console.log('  ok   ' + name); } catch (e) { fail++; console.log('  FAIL ' + name + ' -> ' + e.message); } };
const eq = (a, b, what = '') => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${what} expected ${JSON.stringify(b)} got ${JSON.stringify(a)}`); };
const now = Date.now();
const istDay = (ms) => new Date(ms + 5.5 * 3600000).toISOString().slice(0, 10).replace(/-/g, '');
const listing = (ownerUid, o = {}) => ({ ownerUid: S(ownerUid), status: S(o.status || 'approved'), expiresAt: I(o.exp || now + 20 * DAY), category: S('goat'), breed: S('Beetal') });
const setConfig = (o) => put('livestockConfig/main', { enabled: B(o.enabled !== false), ...(o.limit !== undefined ? { revealLimitPerDay: typeof o.limit === 'string' ? S(o.limit) : I(o.limit) } : {}) });

// ---- people and data ----
const seller = await signIn('+919000000001');
const buyer1 = await signIn('+919111111111');
const buyer2 = await signIn('+919222222222');
const buyer3 = await signIn('+919333333333');
const buyer4 = await signIn('+919444444444');
const admin = await signIn(ADMIN_PHONE);

await setConfig({ enabled: true });
for (let i = 1; i <= 8; i++) { await put(`livestockListings/R0${i}`, listing(seller.uid)); await put(`livestockContacts/R0${i}`, { ownerUid: S(seller.uid), phone: S('+9190000000' + String(10 + i)) }); }
await put('livestockListings/PEND', listing(seller.uid, { status: 'pending' })); await put('livestockContacts/PEND', { ownerUid: S(seller.uid), phone: S('+919000000099') });
await put('livestockListings/REJ', listing(seller.uid, { status: 'rejected' }));
await put('livestockListings/SOLD', listing(seller.uid, { status: 'sold' }));
await put('livestockListings/OLD', listing(seller.uid, { exp: now - DAY })); await put('livestockContacts/OLD', { ownerUid: S(seller.uid), phone: S('+919000000098') });
await put('livestockListings/NOPHONE', listing(seller.uid));

console.log('who is refused');
await t('logged out', async () => eq(await call(null, { listingId: 'R01' }), { error: 'UNAUTHENTICATED', reason: 'LOGIN' }));
for (const bad of ['', 'a/b', '../x', 'livestockContacts/R01', 'x'.repeat(101), 5, null]) {
  await t(`bad listing id ${JSON.stringify(bad)}`, async () => eq(await call(buyer1.token, { listingId: bad }), { error: 'INVALID_ARGUMENT', reason: 'BAD_REQUEST' }));
}
await t('no listing id at all', async () => eq(await call(buyer1.token, {}), { error: 'INVALID_ARGUMENT', reason: 'BAD_REQUEST' }));
await t('animal that does not exist', async () => eq(await call(buyer1.token, { listingId: 'GHOST' }), { error: 'FAILED_PRECONDITION', reason: 'GONE' }));
for (const id of ['PEND', 'REJ', 'SOLD', 'OLD']) await t(`${id} is not for sale`, async () => eq(await call(buyer1.token, { listingId: id }), { error: 'FAILED_PRECONDITION', reason: 'GONE' }));
await t('the seller cannot reveal their own number', async () => eq(await call(seller.token, { listingId: 'R01' }), { error: 'FAILED_PRECONDITION', reason: 'OWN' }));
await t('animal with no phone on file', async () => eq(await call(buyer1.token, { listingId: 'NOPHONE' }), { error: 'FAILED_PRECONDITION', reason: 'NO_PHONE' }));
await t('nothing was logged or counted for any refusal', async () => { eq(await getDoc(`livestockRevealCounts/${buyer1.uid}_${istDay(now)}`), null, 'counter'); });
await setConfig({ enabled: false });
await t('module switched off: buyer refused', async () => eq(await call(buyer1.token, { listingId: 'R01' }), { error: 'FAILED_PRECONDITION', reason: 'DISABLED' }));
await t('module switched off: admin still works', async () => { const r = await call(admin.token, { listingId: 'R01' }); eq(r.ok && r.ok.phone, '+919000000011'); });
await setConfig({ enabled: true, limit: 3 });

console.log('a successful reveal');
await t('buyer gets the number, with the allowance left', async () => {
  const r = await call(buyer1.token, { listingId: 'R01' });
  eq(r, { ok: { phone: '+919000000011', remaining: 2, limit: 3 } });
});
await t('the reply holds only phone, remaining, limit', async () => { const r = await call(buyer1.token, { listingId: 'R01' }); eq(Object.keys(r.ok).sort(), ['limit', 'phone', 'remaining']); });
await t('the log says who and which animal, and never holds the number', async () => {
  const l = await getDoc(`livestockReveals/${buyer1.uid}_R01`);
  eq(l.buyerUid.stringValue, buyer1.uid); eq(l.listingId.stringValue, 'R01'); eq(l.sellerUid.stringValue, seller.uid);
  eq(Object.keys(l).some((k) => /phone|mobile/i.test(k)), false, 'phone in log');
  eq(JSON.stringify(l).includes('9000000011'), false, 'number in log');
});
await t('looking again at the same animal is free', async () => {
  const r = await call(buyer1.token, { listingId: 'R01' }); eq(r.ok.remaining, 2);
  const c = await getDoc(`livestockRevealCounts/${buyer1.uid}_${istDay(Date.now())}`); eq(c.count.integerValue, '1');
});

console.log('the daily limit');
await t('second and third animals count down', async () => {
  eq((await call(buyer1.token, { listingId: 'R02' })).ok.remaining, 1);
  eq((await call(buyer1.token, { listingId: 'R03' })).ok.remaining, 0);
});
await t('a fourth animal is refused', async () => eq(await call(buyer1.token, { listingId: 'R04' }), { error: 'RESOURCE_EXHAUSTED', reason: 'LIMIT' }));
await t('an animal already opened still works at the limit (and stays at 0 left)', async () => eq((await call(buyer1.token, { listingId: 'R02' })).ok.remaining, 0));
await t('the refused fourth animal was not logged', async () => eq(await getDoc(`livestockReveals/${buyer1.uid}_R04`), null));
await t('another buyer has their own allowance', async () => eq((await call(buyer2.token, { listingId: 'R04' })).ok.remaining, 2));
await t('five at the same moment with 3 allowed: exactly 3 succeed', async () => {
  const rs = await Promise.all(['R01', 'R02', 'R03', 'R04', 'R05'].map((id) => call(buyer3.token, { listingId: id })));
  eq(rs.filter((r) => r.ok).length, 3, 'successes'); eq(rs.filter((r) => r.reason === 'LIMIT').length, 2, 'limit errors');
  eq((await getDoc(`livestockRevealCounts/${buyer3.uid}_${istDay(Date.now())}`)).count.integerValue, '3', 'counter');
});
await t('yesterday\'s count does not carry over', async () => {
  await put(`livestockRevealCounts/${buyer4.uid}_${istDay(Date.now() - DAY)}`, { uid: S(buyer4.uid), day: S(istDay(Date.now() - DAY)), count: I(3) });
  eq((await call(buyer4.token, { listingId: 'R06' })).ok.remaining, 2);
});
await t("today's count already at the limit refuses a new animal", async () => {
  await put(`livestockRevealCounts/${buyer2.uid}_${istDay(Date.now())}`, { uid: S(buyer2.uid), day: S(istDay(Date.now())), count: I(3) });
  eq(await call(buyer2.token, { listingId: 'R07' }), { error: 'RESOURCE_EXHAUSTED', reason: 'LIMIT' });
});
await t('the admin raising the limit takes effect at once', async () => { await setConfig({ enabled: true, limit: 10 }); eq((await call(buyer2.token, { listingId: 'R07' })).ok.limit, 10); });
for (const bad of ['abc', 0, -5, 501]) {
  await t(`a bad limit setting (${JSON.stringify(bad)}) falls back to 20`, async () => { await setConfig({ enabled: true, limit: bad }); eq((await call(buyer4.token, { listingId: 'R06' })).ok.limit, 20); });
}

console.log('the admin');
await setConfig({ enabled: true, limit: 1 });
await t('admin is not limited and sees no allowance', async () => {
  for (const id of ['R01', 'R02', 'R03', 'R04', 'R05']) { const r = await call(admin.token, { listingId: id }); eq([!!r.ok, r.ok && r.ok.remaining, r.ok && r.ok.limit], [true, null, null], id); }
  eq(await getDoc(`livestockRevealCounts/${admin.uid}_${istDay(Date.now())}`), null, 'admin counter');
});
await t('admin can open an animal that is not public (pending)', async () => eq((await call(admin.token, { listingId: 'PEND' })).ok.phone, '+919000000099'));

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
