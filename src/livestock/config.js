// Livestock marketplace settings. Defaults live here; the admin can override them in Firestore document
// livestockConfig/main (no code change needed). The module stays dark until that document says enabled: true.

export const DEFAULT_CONFIG = {
    enabled: false,                       // master switch: only the admin sees the module while false
    categories: { goat: true, cow: false, buffalo: false }, // cows and buffaloes stay off until the legal check
    breeds: {
        goat: ['Osmanabadi', 'Sangamneri', 'Beetal', 'Jamunapari', 'Sirohi', 'Other'],
        cow: ['Gir', 'Sahiwal', 'Jersey cross', 'HF cross', 'Other'],
        buffalo: ['Murrah', 'Jaffarabadi', 'Nili-Ravi', 'Pandharpuri', 'Other'],
    },
    autoApproveAfterFirst: true,          // after the admin approves a seller once, that seller's listings go live at once
    expiryDays: 30,                       // a listing disappears from the public after this many days unless renewed
    maxPhotos: 4,
    revealLimitPerDay: 20,                // phone numbers one buyer may open per day (the server function enforces it)
    defaultState: '',
    defaultDistrict: '',
};

export const OWNER_TYPES = ['individual', 'farm', 'trader', 'fpo'];
export const PRICE_TYPES = ['per_animal', 'per_kg', 'per_lot'];
export const PURPOSES = ['dairy', 'breeding', 'rearing'];
export const SEXES = ['male', 'female', 'mixed'];
export const STATUSES = ['pending', 'approved', 'rejected', 'sold', 'expired'];

export const mergeConfig = (stored) => {
    const s = stored && typeof stored === 'object' ? stored : {};
    return {
        ...DEFAULT_CONFIG,
        ...s,
        categories: { ...DEFAULT_CONFIG.categories, ...(s.categories || {}) },
        breeds: { ...DEFAULT_CONFIG.breeds, ...(s.breeds || {}) },
    };
};
