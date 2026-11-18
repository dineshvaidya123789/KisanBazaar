// The one admin login number (the same number is used in the Firestore rules). Compared by digits only,
// so "+919987917394" and "+91 99879 17394" both match, and nothing else does.
const ADMIN_PHONE_DIGITS = '919987917394';

export const isAdminPhone = (phone) => String(phone || '').replace(/\D/g, '') === ADMIN_PHONE_DIGITS;
