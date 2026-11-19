// Firebase calls for the livestock module. All business rules are in logic.js; access rules are in firestore.rules.
import { getApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import {
    collection, doc, getDoc, onSnapshot, query, where, writeBatch, setDoc, updateDoc, deleteDoc, deleteField,
} from 'firebase/firestore';
import { db } from '../firebase';
import { mergeConfig } from './config';
import { buildListingDoc, normalizePhone, expiryFrom } from './logic';
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
    await deleteDoc(doc(db, 'livestockContacts', listing.id)).catch(() => { });
    await deleteDoc(doc(db, LISTINGS, listing.id));
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
