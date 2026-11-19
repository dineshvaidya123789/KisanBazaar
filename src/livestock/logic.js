// Pure rules for livestock listings (no Firebase here, so they can be tested alone).
import { PRICE_TYPES, PURPOSES, SEXES, OWNER_TYPES } from './config.js';

const DAY_MS = 24 * 60 * 60 * 1000;

export const normalizePhone = (p) => {
    const d = String(p || '').replace(/\D/g, '');
    const ten = d.length >= 12 && d.startsWith('91') ? d.slice(2) : d;
    return /^[6-9]\d{9}$/.test(ten) ? '+91' + ten : '';
};

export const enabledCategories = (config) =>
    Object.keys(config.categories).filter((c) => config.categories[c]);

// Returns an object of {field: message}. Empty object = valid.
export const validateListing = (f, config) => {
    const e = {};
    if (!enabledCategories(config).includes(f.category)) e.category = 'Choose an animal type';
    if (!f.breed || !(config.breeds[f.category] || []).includes(f.breed)) e.breed = 'Choose a breed';
    if (!SEXES.includes(f.sex)) e.sex = 'Choose male, female or mixed';
    const age = Number(f.ageMonths);
    if (!Number.isFinite(age) || age < 0 || age > 300) e.ageMonths = 'Enter age in months (0 to 300)';
    const qty = Number(f.quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > 1000) e.quantity = 'Enter how many animals (1 to 1000)';
    const price = Number(f.price);
    if (!Number.isFinite(price) || price <= 0 || price > 100000000) e.price = 'Enter the price';
    if (!PRICE_TYPES.includes(f.priceType)) e.priceType = 'Choose how the price is counted';
    if (!PURPOSES.includes(f.purposeOfSale)) e.purposeOfSale = 'Choose the purpose of sale';
    if (!f.state || !f.district) e.location = 'Choose state and district';
    if (f.category === 'goat' && f.weightKg !== '' && f.weightKg != null) {
        const w = Number(f.weightKg);
        if (!Number.isFinite(w) || w <= 0 || w > 200) e.weightKg = 'Weight must be 1 to 200 kg';
    }
    if (f.category !== 'goat' && !f.notForSlaughter) e.notForSlaughter = 'You must confirm: not for slaughter';
    if (!f.termsAccepted) e.termsAccepted = 'Please accept the seller declaration';
    if (!normalizePhone(f.phone)) e.phone = 'Enter a 10 digit mobile number';
    if (!OWNER_TYPES.includes(f.ownerType)) e.ownerType = 'Choose who you are';
    if (f.healthNote && String(f.healthNote).length > 500) e.healthNote = 'Keep it under 500 characters';
    return e;
};

// Status a seller's own new listing or edit gets. Only the admin ever writes approved/rejected by hand.
export const statusForSellerSubmit = (account, config) =>
    config.autoApproveAfterFirst && account && account.autoApprove === true ? 'approved' : 'pending';

export const expiryFrom = (nowMs, config) => nowMs + config.expiryDays * DAY_MS;

// What the public can see: approved and not past expiry.
export const isPublic = (l, nowMs) => l.status === 'approved' && Number(l.expiresAt) > nowMs;

// What the owner sees as the state of a listing.
export const displayState = (l, nowMs) =>
    l.status === 'approved' && Number(l.expiresAt) <= nowMs ? 'expired' : l.status;

export const canRenew = (l, nowMs) => ['approved', 'expired'].includes(displayState(l, nowMs));

const num = (v) => (v === '' || v == null ? undefined : Number(v));
const str = (v) => (v == null ? undefined : String(v).trim() || undefined);

// Builds the Firestore document for a listing (no phone number in it: that goes to livestockContacts).
// `existing` is the old document when editing, so createdAt and approval fields are kept.
export const buildListingDoc = (f, { uid, nowMs, config, status, photos = [], existing = null, byAdmin = false, adminUid = null }) => {
    const d = {
        ownerUid: existing ? existing.ownerUid : uid,
        ownerType: f.ownerType,
        sellerName: str(f.sellerName),
        businessName: str(f.businessName),
        category: f.category,
        breed: f.breed,
        sex: f.sex,
        ageMonths: Number(f.ageMonths),
        weightKg: f.category === 'goat' ? num(f.weightKg) : undefined,
        milkYieldPerDay: f.category !== 'goat' ? num(f.milkYieldPerDay) : undefined,
        lactations: f.category !== 'goat' ? num(f.lactations) : undefined,
        pregnancyMonths: f.category !== 'goat' ? num(f.pregnancyMonths) : undefined,
        quantity: Number(f.quantity),
        priceType: f.priceType,
        price: Number(f.price),
        state: f.state,
        district: f.district,
        tehsil: str(f.tehsil),
        photos,
        earTagNo: str(f.earTagNo),
        healthNote: str(f.healthNote),
        purposeOfSale: f.purposeOfSale,
        notForSlaughter: f.category !== 'goat' ? true : undefined,
        termsAcceptedAt: existing && existing.termsAcceptedAt ? existing.termsAcceptedAt : nowMs,
        status,
        createdAt: existing ? existing.createdAt : nowMs,
        updatedAt: nowMs,
        expiresAt: existing && existing.expiresAt > nowMs ? existing.expiresAt : expiryFrom(nowMs, config),
    };
    if (existing) {
        for (const k of ['approvedBy', 'approvedAt', 'rejectionReason', 'postedByAdmin']) if (existing[k] !== undefined) d[k] = existing[k];
    }
    if (byAdmin) { d.postedByAdmin = true; d.approvedBy = adminUid; d.approvedAt = nowMs; }
    Object.keys(d).forEach((k) => d[k] === undefined && delete d[k]); // Firestore rejects undefined
    return d;
};
