// Pure rules for livestock listings (no Firebase here, so they can be tested alone).
import { PRICE_TYPES, PURPOSES, SEXES, OWNER_TYPES } from './config.js';

const DAY_MS = 24 * 60 * 60 * 1000;

export const normalizePhone = (p) => {
    const d = String(p || '').replace(/\D/g, '');
    // 12 digits starting 91 = country code; 11 digits starting 0 = the usual trunk zero people type before a mobile number.
    const ten = d.length >= 12 && d.startsWith('91') ? d.slice(2) : (d.length === 11 && d.startsWith('0') ? d.slice(1) : d);
    return /^[6-9]\d{9}$/.test(ten) ? '+91' + ten : '';
};

export const enabledCategories = (config) =>
    Object.keys(config.categories).filter((c) => config.categories[c]);

// Returns an object of {field: message}. Empty object = valid.
export const validateListing = (f, config) => {
    const e = {};
    // The values are text KEYS (err_*), translated on screen with tx() in English, Hindi and Marathi.
    if (!enabledCategories(config).includes(f.category)) e.category = 'err_category';
    if (!f.breed || !(config.breeds[f.category] || []).includes(f.breed)) e.breed = 'err_breed';
    if (!SEXES.includes(f.sex)) e.sex = 'err_sex';
    const age = Number(f.ageMonths);
    if (f.ageMonths === '' || f.ageMonths == null || !Number.isFinite(age) || age < 0 || age > 300) e.ageMonths = 'err_age';
    const qty = Number(f.quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > 1000) e.quantity = 'err_qty';
    const price = Number(f.price);
    if (!Number.isFinite(price) || price <= 0 || price > 100000000) e.price = 'err_price';
    if (!PRICE_TYPES.includes(f.priceType)) e.priceType = 'err_price_type';
    if (!PURPOSES.includes(f.purposeOfSale)) e.purposeOfSale = 'err_purpose';
    if (!f.state || !f.district) e.location = 'err_location';
    if (f.category === 'goat' && f.weightKg !== '' && f.weightKg != null) {
        const w = Number(f.weightKg);
        if (!Number.isFinite(w) || w <= 0 || w > 200) e.weightKg = 'err_weight';
    }
    if (f.category !== 'goat' && !f.notForSlaughter) e.notForSlaughter = 'err_slaughter';
    if (!f.termsAccepted) e.termsAccepted = 'err_terms';
    if (!normalizePhone(f.phone)) e.phone = 'err_phone';
    if (!OWNER_TYPES.includes(f.ownerType)) e.ownerType = 'err_owner';
    if (f.healthNote && String(f.healthNote).length > 500) e.healthNote = 'err_health';
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

// ---- buyer side: browsing ----

export const BROWSE_PAGE_SIZE = 12;
export const EMPTY_FILTERS = { category: '', breed: '', state: '', district: '', minPrice: '', maxPrice: '', minAge: '', maxAge: '' };

// Only the filters the database can apply are sent to it (equality ones). Price and age are applied to the loaded page.
export const serverFilters = (f) => {
    const out = {};
    ['category', 'breed', 'state', 'district'].forEach((k) => { if (f && f[k]) out[k] = String(f[k]); });
    // A district only makes sense with its state. (A breed is allowed without an animal type: the breed list shows every type's breeds.)
    if (out.district && !out.state) delete out.district;
    return out;
};

export const serverFilterKey = (f) => JSON.stringify(serverFilters(f));

const numOrNull = (v) => (v == null || String(v).trim() === '' || !Number.isFinite(Number(v)) ? null : Number(v));

export const hasPageFilters = (f) => ['minPrice', 'maxPrice', 'minAge', 'maxAge'].some((k) => numOrNull(f && f[k]) !== null);

// Price filter is per animal: a price per kg or per lot cannot be compared, so those are left out while a price filter is on.
export const matchesPageFilters = (l, f) => {
    const minP = numOrNull(f.minPrice), maxP = numOrNull(f.maxPrice), minA = numOrNull(f.minAge), maxA = numOrNull(f.maxAge);
    if (minP !== null || maxP !== null) {
        if (l.priceType !== 'per_animal') return false;
        if (minP !== null && Number(l.price) < minP) return false;
        if (maxP !== null && Number(l.price) > maxP) return false;
    }
    if (minA !== null && Number(l.ageMonths) < minA) return false;
    if (maxA !== null && Number(l.ageMonths) > maxA) return false;
    return true;
};

export const applyPageFilters = (list, f) => (hasPageFilters(f) ? list.filter((l) => matchesPageFilters(l, f)) : list);

export const ageText = (months) => {
    const m = Math.round(Number(months));
    if (!Number.isFinite(m) || m < 0) return '';
    const y = Math.floor(m / 12), r = m % 12;
    if (y === 0) return `${m} mo`;
    return r === 0 ? `${y} yr` : `${y} yr ${r} mo`;
};

export const formatRupees = (n) => 'Rs ' + Number(n).toLocaleString('en-IN');

export const listingTitle = (l) => `${l.quantity} × ${l.breed} ${l.category}`;

export const shareMessage = (l, url) =>
    `${listingTitle(l)} for sale in ${l.district}, ${l.state}. ${formatRupees(l.price)} (${String(l.priceType || '').replace(/_/g, ' ')}). ${url}`;

export const whatsappShareUrl = (text) => 'https://wa.me/?text=' + encodeURIComponent(text);

export const detailUrl = (origin, id) => `${String(origin || '').replace(/\/$/, '')}/livestock/${id}`;

// ---- buyer side: enquiries ----

export const ENQUIRY_MAX = 300;

// One enquiry per buyer per animal: the id says so (the rules check it too).
export const enquiryId = (listingId, buyerUid) => `${listingId}_${buyerUid}`;

// Returns {field: message}. Empty object = valid. The phone is the buyer's login number.
export const validateEnquiry = ({ name, message, phone }) => {
    const e = {};
    // Values are text keys (err_*); the screen translates them, and err_msg_long takes {n} = ENQUIRY_MAX.
    if (!String(name || '').trim()) e.name = 'err_name';
    else if (String(name).trim().length > 80) e.name = 'err_name_long';
    const m = String(message || '').trim();
    if (!m) e.message = 'err_msg';
    else if (m.length > ENQUIRY_MAX) e.message = 'err_msg_long';
    if (!normalizePhone(phone)) e.phone = 'err_login_phone';
    return e;
};

// The record written to livestockEnquiries. The title is copied in so the seller's inbox needs no extra reads.
export const buildEnquiryDoc = ({ listing, buyerUid, name, phone, message, nowMs }) => ({
    listingId: listing.id,
    sellerUid: listing.ownerUid,
    buyerUid,
    buyerName: String(name).trim(),
    buyerPhone: normalizePhone(phone),
    message: String(message).trim(),
    listingTitle: listingTitle(listing).slice(0, 120),
    status: 'new',
    createdAt: nowMs,
});

// ---- reports ("Report this listing") ----
export const REPORT_REASONS = ['fake', 'wrong_info', 'already_sold', 'spam', 'animal_welfare', 'other'];
export const REPORT_NOTE_MAX = 200;
export const reportId = (listingId, reporterUid) => `${listingId}_${reporterUid}`;

// Returns {field: text key}. Empty object = valid.
export const validateReport = ({ reason, note }) => {
    const e = {};
    if (!REPORT_REASONS.includes(reason)) e.reason = 'err_rep_reason';
    if (String(note || '').trim().length > REPORT_NOTE_MAX) e.note = 'err_rep_note';
    return e;
};

// The record written to livestockReports. The note is left out when empty (the rules allow it to be missing).
export const buildReportDoc = ({ listing, reporterUid, reason, note, nowMs }) => {
    const d = {
        listingId: listing.id,
        listingTitle: listingTitle(listing).slice(0, 120),
        sellerUid: listing.ownerUid,
        reporterUid,
        reason,
        status: 'new',
        createdAt: nowMs,
    };
    const n = String(note || '').trim();
    if (n) d.note = n;
    return d;
};

export const newReportCount = (list) => (list || []).filter((r) => r.status !== 'reviewed').length;

export const unreadCount = (list) => (list || []).filter((q) => q.status !== 'read').length;

const digits = (p) => normalizePhone(p).replace(/\D/g, '');

// Links are built only from the checked phone digits, never from free text.
export const telUrl = (phone) => (normalizePhone(phone) ? 'tel:' + normalizePhone(phone) : '');
export const whatsappChatUrl = (phone, text = '') => (digits(phone) ? `https://wa.me/${digits(phone)}${text ? '?text=' + encodeURIComponent(text) : ''}` : '');
export const replyText = (q) => `Hello ${q.buyerName}, thank you for asking about ${q.listingTitle}.`;

// Which screen text goes with each reason the reveal function gives. Unknown or missing reasons mean the function was unreachable.
export const revealErrorKey = (reason) => ({
    LOGIN: 'reveal_login', DISABLED: 'soon', GONE: 'unavailable', OWN: 'enq_own', NO_PHONE: 'reveal_nophone', LIMIT: 'reveal_limit',
}[reason] || 'reveal_failed');
