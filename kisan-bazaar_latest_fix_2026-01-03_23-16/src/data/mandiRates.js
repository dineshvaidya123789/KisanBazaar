import { getDistricts, getDistrictData } from './locationData';

// Base List of Crops for generation
// In a real app, this would come from an API based on the Mandi ID
export const getMandiRates = (mandiName) => {
    return generateRates(mandiName);
};

// Base Crop Data (Prices in ?/Quintal)
const baseCrops = [
    { name: 'Wheat (गेहूं)', icon: '🌾', category: 'Grains', basePrice: 2200, variance: 300 },
    { name: 'Soybean (सोयाबीन)', icon: '🌱', category: 'Pulses', basePrice: 4200, variance: 600 },
    { name: 'Cotton (कपास)', icon: '☁️', category: 'Others', basePrice: 6500, variance: 500 },
    { name: 'Gram (Chana/चना)', icon: '🟤', category: 'Pulses', basePrice: 5800, variance: 400 },
    { name: 'Maize (मक्का)', icon: '🌽', category: 'Grains', basePrice: 1800, variance: 250 },
    { name: 'Onion (प्याज)', icon: '🧅', category: 'Vegetables', basePrice: 2000, variance: 800 }, // High volatility, increased base
    { name: 'Potato (आलू)', icon: '🥔', category: 'Vegetables', basePrice: 800, variance: 300 },
    { name: 'Tomato (टमाटर)', icon: '🍅', category: 'Vegetables', basePrice: 1500, variance: 600 },
    { name: 'Garlic (लहसुन)', icon: '🧄', category: 'Vegetables', basePrice: 12500, variance: 2000 }, // Current high trend
    { name: 'Mustard (सरसों)', icon: '🟡', category: 'Pulses', basePrice: 5200, variance: 400 },
    { name: 'Tur (अरहर)', icon: '🥣', category: 'Pulses', basePrice: 9500, variance: 800 },
    { name: 'Moong (मूंग)', icon: '💚', category: 'Pulses', basePrice: 7200, variance: 600 },
    { name: 'Banana (केला)', icon: '🍌', category: 'Fruits', basePrice: 1200, variance: 400 },
    { name: 'Pomegranate (अनार)', icon: '🍎', category: 'Fruits', basePrice: 6000, variance: 1500 },
    { name: 'Orange (संतरा)', icon: '🍊', category: 'Fruits', basePrice: 2500, variance: 800 },
];

// Simple Seeded Random Number Generator
// Returns a number between 0 and 1 based on a seed
const seededRandom = (seed) => {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
};

// Generate Rates for a specific Mandi and Date object
export const generateRates = (mandiName, dateObj = new Date()) => {
    // Create a unique seed based on Date + Mandi Name
    const dateStr = dateObj.toISOString().split('T')[0].replace(/-/g, ''); // 20231213
    const mandiSeed = mandiName.length + mandiName.charCodeAt(0);
    const daySeed = parseInt(dateStr) + mandiSeed;

    // Filter crops roughly based on region "flavor" (Simulated)
    return baseCrops.filter((crop, index) => {
        // Randomly decide if a crop is available in this mandi today 
        // INCREASED PROBABILITY: was 0.3, now 0.1 to show more crops for debugging/demo
        // Also ensure key crops like Wheat/Soybean are almost always available (index < 5)
        if (index < 5) return seededRandom(daySeed + index) > 0.1;

        return seededRandom(daySeed + index) > 0.4;
    }).map((crop, index) => {
        const volatility = seededRandom(daySeed + index + 100); // 0-1
        const priceShift = Math.floor((volatility - 0.5) * crop.variance * 2); // +/- variance

        const min = crop.basePrice + priceShift - Math.floor(seededRandom(daySeed + index) * 200);
        const max = crop.basePrice + priceShift + Math.floor(seededRandom(daySeed + index + 50) * 300);
        const modal = Math.floor((min + max) / 2);

        return {
            ...crop,
            unit: 'Quintal',
            min: Math.max(min, 100), // Ensure positive price
            max: Math.max(max, min), // Ensure max > min
            modal: modal,
            date: dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        };
    });
};

// Keep original function for backward compatibility
export const getRatesForMandi = (mandiName) => {
    return generateRates(mandiName, new Date());
};

// Helper to get rate history for a specific crop in a specific mandi
export const getRateHistory = (mandiId, cropName) => {
    // Deterministic seed based on mandi and crop
    const seed = (mandiId.length || 0) + cropName.length;

    // Find base price or default
    // We don't have direct access to baseCrops here easily without exporting it, 
    // so we'll simulate a base price hash
    const basePrice = 2000 + (cropName.charCodeAt(0) * 10);

    const history = [];
    const today = new Date();

    for (let i = -4; i <= 2; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        // Pseudo-random fluctuation
        const daySeed = (date.getDate() + date.getMonth()) * seed;
        const volatility = Math.sin(daySeed) * 500;

        const price = Math.round(basePrice + volatility);

        history.push({
            date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            price: Math.abs(price), // Ensure positive
            isForecast: i > 0
        });
    }

    return history;
};
