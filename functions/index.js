// KisanBazaar livestock: server-side phone reveal.
//
// A seller's phone number is kept in livestockContacts/{listingId}, which the database rules hide from everyone but the owner
// and the admin. This function is the only way a buyer gets it: signed in, the animal still for sale, and under the daily limit.
// Every successful first reveal is logged (who, which animal, when; never the number).
'use strict';

const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { parseLimit, istDayKey, isPublicListing, validListingId } = require('./logic');

initializeApp();
const db = getFirestore();

// Same number the database rules and the app treat as the admin.
const ADMIN_PHONE = '+919987917394';

// `reason` travels in the error details so the app can show the right words (the HTTP code alone is not enough: a missing
// function and a missing animal would both look like "not found").
const fail = (code, reason, message) => new HttpsError(code, message, { reason });

exports.revealContact = onCall({ region: 'asia-south1', maxInstances: 10 }, async (request) => {
  if (!request.auth) throw fail('unauthenticated', 'LOGIN', 'Please log in.');
  const listingId = request.data && request.data.listingId;
  if (!validListingId(listingId)) throw fail('invalid-argument', 'BAD_REQUEST', 'Bad request.');

  const uid = request.auth.uid;
  const isAdmin = request.auth.token && request.auth.token.phone_number === ADMIN_PHONE;
  const nowMs = Date.now();

  const cfgSnap = await db.doc('livestockConfig/main').get();
  const cfg = cfgSnap.exists ? cfgSnap.data() : {};
  if (cfg.enabled !== true && !isAdmin) throw fail('failed-precondition', 'DISABLED', 'Not available yet.');
  const limit = parseLimit(cfg.revealLimitPerDay);

  const listingSnap = await db.doc(`livestockListings/${listingId}`).get();
  const listing = listingSnap.exists ? listingSnap.data() : null;
  // The admin may open any listing; everyone else only an approved, unexpired one. One answer for "missing" and "hidden".
  if (!listing || (!isAdmin && !isPublicListing(listing, nowMs))) throw fail('failed-precondition', 'GONE', 'This animal is no longer available.');
  if (listing.ownerUid === uid) throw fail('failed-precondition', 'OWN', 'This is your own listing.');

  const contactSnap = await db.doc(`livestockContacts/${listingId}`).get();
  const phone = contactSnap.exists ? contactSnap.data().phone : '';
  if (typeof phone !== 'string' || !phone) throw fail('failed-precondition', 'NO_PHONE', 'The seller has no number on file.');

  // One transaction: a repeat look at an animal already opened is free; a new one counts against today's limit, and two
  // calls at the same moment cannot both squeeze past the limit.
  const revealRef = db.doc(`livestockReveals/${uid}_${listingId}`);
  const countRef = db.doc(`livestockRevealCounts/${uid}_${istDayKey(nowMs)}`);
  const remaining = await db.runTransaction(async (tx) => {
    const [reveal, count] = await Promise.all([tx.get(revealRef), tx.get(countRef)]);
    const used = count.exists ? Number(count.data().count) || 0 : 0;
    if (reveal.exists) {
      tx.update(revealRef, { lastAt: nowMs });
      return isAdmin ? null : Math.max(0, limit - used);
    }
    if (isAdmin) {
      tx.set(revealRef, { buyerUid: uid, listingId, sellerUid: listing.ownerUid, createdAt: nowMs, lastAt: nowMs, byAdmin: true });
      return null;
    }
    if (used >= limit) throw fail('resource-exhausted', 'LIMIT', 'Daily limit reached.');
    tx.set(revealRef, { buyerUid: uid, listingId, sellerUid: listing.ownerUid, createdAt: nowMs, lastAt: nowMs });
    tx.set(countRef, { uid, day: istDayKey(nowMs), count: used + 1, updatedAt: nowMs });
    return limit - used - 1;
  });

  return { phone, remaining, limit: isAdmin ? null : limit };
});
