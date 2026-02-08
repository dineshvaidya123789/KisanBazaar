import { COMMODITIES } from '../data/commodities';
import { getAllDistricts } from '../data/locationData';

export const advisoryKeywords = ['tips', 'salah', 'kheti', 'farming', 'ugaye', 'grow', 'disease', 'rog', 'lagwad', 'mahiti', 'information', 'टिप्स', 'खेती', 'शेती', 'माहिती', 'जानकारी', 'सल्ला', 'रोग', 'लागवड'];

/**
 * Parses spoken text to extract form fields.
 * Supports Hindi, Marathi, and English inputs.
 * 
 * @param {string} text - The spoken text
 * @param {string} language - Current app language ('en', 'hi', 'mr')
 * @returns {object} - { commodity, quantity, unit, price, type, district, state, confidence }
 */
export const parseVoiceInput = (text, language) => {
    if (!text) return null;

    const lowerText = text.toLowerCase();
    const result = {
        commodity: null,
        quantity: null,
        unit: null,
        price: null,
        type: null, // 'Sell' or 'Buy'
        district: null,
        state: null,
        originalText: text
    };

    // 1. Detect Intent (Sell/Buy)
    const sellKeywords = [
        'bechna', 'bikri', 'sell', 'vikne', 'vikayche', 'dena', 'bech', 'vik',
        'vikne ahe', 'sell karna', 'bechna hai', 'vikray', 'bikna', 'bena'
    ];
    const buyKeywords = [
        'kharidna', 'buy', 'kharedi', 'chahiye', 'havay', 'lena', 'buy karna',
        'lena hai', 'pahije', 'kharid', 'purchase', 'leana'
    ];
    // Rate check keywords
    const rateKeywords = ['bhav', 'rate', 'kimat', 'daam', 'price', 'bhaav'];
    const weatherKeywords = ['weather', 'mausam', 'havaman', 'barish', 'rain', 'tapman', 'temperature'];
    const newsKeywords = ['news', 'khabar', 'batmya', 'scheme', 'yojna', 'sarkar'];


    // Specific check for "Mushroom" + "tips"/"farming" to ensure it's caught
    if (lowerText.includes('mushroom') && (lowerText.includes('tips') || lowerText.includes('farming') || lowerText.includes('kheti') || lowerText.includes('टिप्स') || lowerText.includes('खेती') || lowerText.includes('शेती'))) {
        result.type = 'Advisory';
    } else if (sellKeywords.some(k => lowerText.includes(k))) {
        result.type = 'Sell';
    } else if (buyKeywords.some(k => lowerText.includes(k))) {
        result.type = 'Buy';
    } else if (rateKeywords.some(k => lowerText.includes(k))) {
        result.type = 'Rate';
    } else if (weatherKeywords.some(k => lowerText.includes(k))) {
        result.type = 'Weather';
    } else if (newsKeywords.some(k => lowerText.includes(k))) {
        result.type = 'News';
    } else if (advisoryKeywords.some(k => lowerText.includes(k))) {
        result.type = 'Advisory';
    }

    // 2. Extract Commodity
    // We try to find the longest matching commodity name or alias
    let bestMatch = null;
    let maxMatchLength = 0;

    COMMODITIES.forEach(item => {
        // Gather all possible names/aliases for this commodity
        const names = [
            item.en,
            item.hi,
            item.mr,
            ...(item.tags || []),
            ...(item.synonyms || []) // Assuming we might have synonyms in future
        ].filter(Boolean); // Remove null/undefined

        names.forEach(name => {
            const lowerName = name.toLowerCase();
            if (lowerText.includes(lowerName)) {
                if (lowerName.length > maxMatchLength) {
                    maxMatchLength = lowerName.length;
                    bestMatch = item;
                }
            }
        });
    });

    if (bestMatch) {
        result.commodity = bestMatch;
    }

    // 3. Extract Quantity and Unit
    // We look for patterns like "50 kg", "100 quintal", "10 ton", "500 bori"
    // Also support Hindi/Marathi variations of units

    // Unit patterns:
    // Quintal: quintal, kwintal, clintal, quital
    // Kg: kg, kilo, kilogram
    // Ton: ton, tonne
    // Crate: crate, peti, box, carrat
    // Dozen: dozen, darjan, dakhila
    // Piece: nag, piece, pc

    const unitMap = {
        'quintal': 'Quintal', 'kwintal': 'Quintal', 'clintal': 'Quintal', 'quital': 'Quintal',
        'kg': 'Kg', 'kilo': 'Kg', 'kilogram': 'Kg',
        'ton': 'Ton', 'tonne': 'Ton', 'metric ton': 'Ton',
        'crate': 'Crate', 'peti': 'Crate', 'box': 'Crate', 'carrat': 'Crate',
        'dozen': 'Dozen', 'darjan': 'Dozen',
        'nag': 'Piece', 'piece': 'Piece', 'pc': 'Piece'
    };

    // Regex explanation:
    // (\d+(?:[\.,]\d+)?)  -> Capture number (integer or decimal like 1.5)
    // \s*                 -> Optional whitespace
    // (quintal|kwintal|...) -> Capture unit
    const unitsJoined = Object.keys(unitMap).join('|');
    const quantityRegex = new RegExp(`(\\d+(?:[\\.,]\\d+)?)\\s*(${unitsJoined})`, 'i');

    const quantityMatch = lowerText.match(quantityRegex);

    if (quantityMatch) {
        // Standardized Extraction
        result.quantity = parseFloat(quantityMatch[1].replace(/,/g, '')); // Handle comma decimals if any, though usually dot.
        const foundUnitRaw = quantityMatch[2].toLowerCase();
        result.unit = unitMap[foundUnitRaw] || 'Quintal'; // Fallback to Quintal if undefined (shouldn't happen due to regex)
    }

    // 4. Extract Price
    // Patterns: "2000 rupaye", "rs 2000", "2000 ka bhav", "rate 2000"
    // We explicitly look for currency markers or price context terms
    // Rs markers: Need double backslash for RegExp constructor
    const priceMarkers = ['rs\\.?', 'rupaye', 'rupees', 'rupya', 'inr'];
    const priceContexts = ['bhav', 'rate', 'price', 'kimat', 'dam'];

    // Regex for: "Rs 2000" OR "2000 Rs" OR "Rate 2000"
    const priceRegex = new RegExp(
        `(?:${priceMarkers.join('|')})\\s*(\\d+(?:[\\.,]\\d+)?)|(\\d+(?:[\\.,]\\d+)?)\\s*(?:${priceMarkers.join('|')})`,
        'i'
    );
    const priceContextRegex = new RegExp(
        `(?:${priceContexts.join('|')})\\s*(?:hai|he)?\\s*(\\d+(?:[\\.,]\\d+)?)`,
        'i'
    );

    const priceMatch = lowerText.match(priceRegex);
    const contextMatch = lowerText.match(priceContextRegex);

    if (priceMatch) {
        // Remove commas before parsing. If dot is used, it remains.
        result.price = parseFloat((priceMatch[1] || priceMatch[2]).replace(/,/g, ''));
    } else if (contextMatch) {
        result.price = parseFloat(contextMatch[1].replace(/,/g, ''));
    }

    // 5. Extract Location (Maharashtra Districts)
    const districts = getAllDistricts(); // Use dynamically from data source

    // Iterate and find match
    // Sort districts by length to match longest first (e.g. avoid partial match issues if any)
    const sortedDistricts = [...districts].sort((a, b) => b.length - a.length);

    for (const district of sortedDistricts) {
        if (lowerText.includes(district.toLowerCase())) {
            result.district = district;
            result.state = 'Maharashtra'; // Default
            break;
        }
    }

    // 6. Fallback Heuristics
    // If we have a standalone number and NO quantity/price extracted, guess it based on magnitude
    if (!result.quantity && !result.price) {
        const anyNumberRegex = /(\d+(?:[.,]\d+)?)/g;
        const matches = [...lowerText.matchAll(anyNumberRegex)];

        if (matches.length > 0) {
            // Take the first number found
            const val = parseFloat(matches[0][1].replace(/,/g, ''));

            // Logic: 
            // - If < 100, likely Quantity (in tons/quintals) -> but could be Price/Kg?
            // - If > 500, likely Price (per quintal)
            // - If between 100-500, ambiguous.

            // Default to Quantity for now as it's a required field for listings
            result.quantity = val;
            result.unit = 'Quintal'; // Default unit
        }
    }

    // If we found a number but no unit, and it wasn't identified as price
    if (result.quantity && !result.unit) {
        // Logic to guess unit based on magnitude?
        // E.g. < 50 -> likely Tons or Quintals
        // > 100 -> likely Kg or Quintals
        result.unit = 'Quintal'; // Default
    }

    return result;
};
