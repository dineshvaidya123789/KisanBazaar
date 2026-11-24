// Firebase calls for the livestock module. All business rules are in logic.js; access rules are in firestore.rules.
import { getApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import {
    collection, doc, getDoc, getDocFromServer, getDocs, onSnapshot, query, where, orderBy, limit, startAfter, writeBatch, setDoc, updateDoc, deleteDoc, deleteField,
} from 'firebase/firestore';
import { db } from '../firebase';
import { mergeConfig } from './config';
import { buildListingDoc, normalizePhone, expiryFrom, serverFilters, BROWSE_PAGE_SIZE, enquiryId, buildEnquiryDoc } from './logic';
import { compressImage } from '../utils/imageCompression';

const LISTINGS = 'livestockListings';

// ---- config ----
export const subscribeConfig = (cb) =>
    onSnapshot(doc(db, 'livestockConfig', 'main'), (snap) => cb(mergeConfig(snap.exists() ? snap.data() : {})), () => cb(mergeConfig({})));

export const saveConfig = (patch) => setDoc(doc(db, 'livestockConfig', 'main'), patch, { merge: true });

// ---- photos (Firebase Storage; each photo is shrunk first) ----
const dataUrlToBlob = async (dataUrl) => (await fetch(dataUrl)).blob();

export const uploadPhotos = async (uid, listingId, files) => {
    const storage = getStorage(getApp());
    const urls = [];
    for (let i = 0; i < files.length; i++) {
        const dataUrl = await compressImage(files[i], { maxWidth: 1000, maxHeight: 1000, quality: 0.7 });
        const blob = await dataUrlToBlob(dataUrl);
        const r = ref(storage, `livestock/${uid}/${listingId}/${Date.now()}_${i}.jpg`);
        await uploadBytes(r, blob, { contentType: 'image/jpeg' });
        urls.push(await getDownloadURL(r));
    }
    return urls;
};

const deletePhotoByUrl = async (url) => {
    try { await deleteObject(ref(getStorage(getApp()), url)); } catch (e) { console.warn('photo not deleted', e.code || e); }
};

// ---- seller side ----
export const subscribeAccount = (uid, cb) =>
    onSnapshot(doc(db, 'livestockAccounts', uid), (s) => cb(s.exists() ? s.data() : null), () => cb(null));

export const ensureAccount = async (uid, existing, { businessName, ownerType }) => {
    if (existing) {
        if (existing.businessName !== businessName || existing.ownerType !== ownerType) {
            await updateDoc(doc(db, 'livestockAccounts', uid), { businessName, ownerType });
        }
        return;
    }
    await setDoc(doc(db, 'livestockAccounts', uid), { uid, businessName: businessName || '', ownerType, createdAt: Date.now() });
};

// Creates a listing and its private phone record together. Returns the new listing id.
export const createListing = async ({ form, files, uid, config, status, byAdmin = false }) => {
    const nowMs = Date.now();
    const listingRef = doc(collection(db, LISTINGS));
    const photos = files.length ? await uploadPhotos(uid, listingRef.id, files) : [];
    const data = buildListingDoc(form, { uid, nowMs, config, status, photos, byAdmin, adminUid: byAdmin ? uid : null });
    const batch = writeBatch(db);
    batch.set(listingRef, data);
    batch.set(doc(db, 'livestockContacts', listingRef.id), { ownerUid: uid, phone: normalizePhone(form.phone), updatedAt: nowMs });
    await batch.commit();
    return listingRef.id;
};

export const updateListing = async ({ id, existing, form, newFiles, keepPhotos, uid, config, status }) => {
    const nowMs = Date.now();
    const added = newFiles.length ? await uploadPhotos(existing.ownerUid, id, newFiles) : [];
    const photos = [...keepPhotos, ...added];
    const data = buildListingDoc(form, { uid, nowMs, config, status, photos, existing });
    const batch = writeBatch(db);
    batch.set(doc(db, LISTINGS, id), data);
    batch.set(doc(db, 'livestockContacts', id), { ownerUid: existing.ownerUid, phone: normalizePhone(form.phone), updatedAt: nowMs });
    await batch.commit();
    const removed = (existing.photos || []).filter((u) => !keepPhotos.includes(u));
    await Promise.all(removed.map(deletePhotoByUrl));
};

export const getContactPhone = async (id) => {
    const s = await getDoc(doc(db, 'livestockContacts', id));
    return s.exists() ? s.data().phone : '';
};

export const subscribeMyListings = (uid, cb) =>
    onSnapshot(query(collection(db, LISTINGS), where('ownerUid', '==', uid)),
        (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))),
        (err) => { console.error('my listings', err); cb([]); });

export const markSold = (id) => updateDoc(doc(db, LISTINGS, id), { status: 'sold', updatedAt: Date.now() });

// Renewing needs the full valid document (rules check it), so write it back with a new expiry.
export const renewListing = (listing, status, config) => {
    const { id, ...rest } = listing;
    return setDoc(doc(db, LISTINGS, id), { ...rest, status, expiresAt: expiryFrom(Date.now(), config), updatedAt: Date.now() });
};

export const deleteListing = async (listing) => {
    await Promise.all((listing.photos || []).map(deletePhotoByUrl));
    // The listing first: if this fails nothing else was touched and the animal still works. If only the phone record fails afterwards,
    // what is left is a record only the owner and the admin can read.
    await deleteDoc(doc(db, LISTINGS, listing.id));
    await deleteDoc(doc(db, 'livestockContacts', listing.id)).catch((e) => console.warn('contact not deleted', e && (e.code || e)));
};

// ---- admin side ----
export const subscribeAllListings = (cb) =>
    onSnapshot(collection(db, LISTINGS),
        (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))),
        (err) => { console.error('all listings', err); cb([]); });

export const subscribeAccounts = (cb) =>
    onSnapshot(collection(db, 'livestockAccounts'), (snap) => {
        const m = {}; snap.docs.forEach((d) => { m[d.id] = d.data(); }); cb(m);
    }, () => cb({}));

export const approveListing = async (listing, adminUid, config) => {
    const { id, ...rest } = listing;
    delete rest.rejectionReason;
    await setDoc(doc(db, LISTINGS, id), { ...rest, status: 'approved', approvedBy: adminUid, approvedAt: Date.now(), expiresAt: Math.max(rest.expiresAt || 0, expiryFrom(Date.now(), config)) });
    if (config.autoApproveAfterFirst && !listing.postedByAdmin) {
        await setDoc(doc(db, 'livestockAccounts', listing.ownerUid), { autoApprove: true }, { merge: true });
    }
};

export const rejectListing = async (listing, adminUid, reason) => {
    const { id, ...rest } = listing;
    await setDoc(doc(db, LISTINGS, id), { ...rest, status: 'rejected', rejectionReason: String(reason).slice(0, 300), approvedBy: adminUid, approvedAt: Date.now() });
};

export const setAccountFlag = (uid, patch) => setDoc(doc(db, 'livestockAccounts', uid), patch, { merge: true });
export { deleteField };

// ---- buyer side ----
// One page of public listings: approved, not expired, newest expiry first (expiry = posted or renewed + valid days, so this is
// "newest first"). The rules need the status filter in every list query; the time filter is ours. `cursor` is the last
// document of the previous page (null for the first page). Returns { items, cursor, done }.
export const fetchBrowsePage = async ({ filters, cursor = null, pageSize = BROWSE_PAGE_SIZE, nowMs = Date.now() }) => {
    const f = serverFilters(filters);
    const parts = [where('status', '==', 'approved'), where('expiresAt', '>', nowMs)];
    ['category', 'breed', 'state', 'district'].forEach((k) => { if (f[k]) parts.push(where(k, '==', f[k])); });
    parts.push(orderBy('expiresAt', 'desc'));
    if (cursor) parts.push(startAfter(cursor));
    parts.push(limit(pageSize));
    const snap = await getDocs(query(collection(db, LISTINGS), ...parts));
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return { items, cursor: snap.docs.length ? snap.docs[snap.docs.length - 1] : cursor, done: snap.docs.length < pageSize };
};

// One listing by id. Returns null when it does not exist OR the viewer may not see it (the same answer on purpose).
// fresh = ask the server, never the local copy (used right after a failed action, to find out whether the animal is still there).
export const fetchListing = async (id, { fresh = false } = {}) => {
    try {
        const s = await (fresh ? getDocFromServer : getDoc)(doc(db, LISTINGS, id));
        return s.exists() ? { id: s.id, ...s.data() } : null;
    } catch (e) {
        if (e && e.code === 'permission-denied') return null;
        throw e;
    }
};

// ---- enquiries ----
const ENQUIRIES = 'livestockEnquiries';

// The buyer's own enquiry for this animal, or null. (One per buyer per animal: the id is listing + buyer.)
export const getMyEnquiry = async (listingId, buyerUid) => {
    try {
        const s = await getDoc(doc(db, ENQUIRIES, enquiryId(listingId, buyerUid)));
        return s.exists() ? { id: s.id, ...s.data() } : null;
    } catch (e) {
        if (e && e.code === 'permission-denied') return null;
        throw e;
    }
};

export const sendEnquiry = async ({ listing, buyerUid, name, phone, message }) => {
    const data = buildEnquiryDoc({ listing, buyerUid, name, phone, message, nowMs: Date.now() });
    await setDoc(doc(db, ENQUIRIES, enquiryId(listing.id, buyerUid)), data);
    return { id: enquiryId(listing.id, buyerUid), ...data };
};

export const subscribeSellerEnquiries = (sellerUid, cb) =>
    onSnapshot(query(collection(db, ENQUIRIES), where('sellerUid', '==', sellerUid)),
        (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))),
        (err) => { console.error('enquiries', err); cb([]); });

export const setEnquiryStatus = (id, status) => updateDoc(doc(db, ENQUIRIES, id), { status });

// ---- phone reveal (server function; the number is not in any public record) ----
// Resolves { phone, remaining, limit } (remaining and limit are null for the admin). Rejects with an Error whose .reason is one of
// LOGIN, DISABLED, GONE, OWN, NO_PHONE, LIMIT, BAD_REQUEST, or undefined when the function could not be reached.
export const revealPhone = async (listingId) => {
    try {
        const fn = httpsCallable(getFunctions(getApp(), 'asia-south1'), 'revealContact');
        return (await fn({ listingId })).data;
    } catch (e) {
        const err = new Error((e && e.message) || 'reveal failed');
        err.reason = e && e.details && e.details.reason;
        err.code = e && e.code;
        throw err;
    }
};
