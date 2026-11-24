// Pure rules for the phone-reveal function (no Firebase here, so they can be tested alone).
'use strict';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 500;
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

// The admin sets "phone numbers a buyer may open per day". Anything that is not a whole number from 1 to 500 falls back to 20.
const parseLimit = (v) => {
  const n = Number(v);
  return Number.isInteger(n) && n >= 1 && n <= MAX_LIMIT ? n : DEFAULT_LIMIT;
};

// The "day" the limit resets on: the Indian calendar day (the farmers and buyers are in India).
const istDayKey = (ms) => new Date(ms + IST_OFFSET_MS).toISOString().slice(0, 10).replace(/-/g, '');

// What a buyer may open: an approved, unexpired listing.
const isPublicListing = (l, nowMs) => !!l && l.status === 'approved' && Number(l.expiresAt) > nowMs;

// Listing ids come from the client. Allow only the characters Firestore auto-ids use, so an id can never be a path.
const validListingId = (id) => typeof id === 'string' && /^[A-Za-z0-9_-]{1,100}$/.test(id);

module.exports = { DEFAULT_LIMIT, MAX_LIMIT, parseLimit, istDayKey, isPublicListing, validListingId };
