// Commodity to Image Mapping
// Automatically assigns default images based on commodity name

const commodityImageMap = {
    // Grains & Cereals
    'maize': 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=400&h=300&fit=crop&q=80',
    'corn': 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=400&h=300&fit=crop&q=80',
    'makka': 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=400&h=300&fit=crop&q=80',
    'wheat': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
    'gehu': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
    'rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
    'basmati': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
    'sorghum': 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=400&h=300&fit=crop',
    'jowar': 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=400&h=300&fit=crop',
    'bajra': 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=400&h=300&fit=crop',
    'millet': 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=400&h=300&fit=crop',

    // Pulses & Legumes
    'gram': 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=400&h=300&fit=crop',
    'chana': 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=400&h=300&fit=crop',
    'chickpea': 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=400&h=300&fit=crop',
    'black chana': 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=400&h=300&fit=crop',
    'black channa': 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=400&h=300&fit=crop',
    'kala chana': 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=400&h=300&fit=crop',
    'black gram': 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=400&h=300&fit=crop',
    'lentil': 'https://images.unsplash.com/photo-1596040033229-a0b3b83b6f0f?w=400&h=300&fit=crop',
    'dal': 'https://images.unsplash.com/photo-1596040033229-a0b3b83b6f0f?w=400&h=300&fit=crop',
    'moong': 'https://images.unsplash.com/photo-1596040033229-a0b3b83b6f0f?w=400&h=300&fit=crop',
    'urad': 'https://images.unsplash.com/photo-1596040033229-a0b3b83b6f0f?w=400&h=300&fit=crop',
    'masoor': 'https://images.unsplash.com/photo-1596040033229-a0b3b83b6f0f?w=400&h=300&fit=crop',
    'arhar': 'https://images.unsplash.com/photo-1596040033229-a0b3b83b6f0f?w=400&h=300&fit=crop',
    'toor': 'https://images.unsplash.com/photo-1596040033229-a0b3b83b6f0f?w=400&h=300&fit=crop',
    'tur': 'https://images.unsplash.com/photo-1596040033229-a0b3b83b6f0f?w=400&h=300&fit=crop',

    // Vegetables
    'tomato': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop',
    'potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop',
    'aloo': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop',
    'batata': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop',
    'onion': 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?w=400&h=300&fit=crop',
    'pyaz': 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?w=400&h=300&fit=crop',
    'kanda': 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?w=400&h=300&fit=crop',
    'cabbage': 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400&h=300&fit=crop',
    'cauliflower': 'https://images.unsplash.com/photo-1568584711271-e0e4f3c9e4e6?w=400&h=300&fit=crop',
    'carrot': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop',
    'gajar': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop',
    'brinjal': 'https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?w=400&h=300&fit=crop',
    'eggplant': 'https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?w=400&h=300&fit=crop',
    'baingan': 'https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?w=400&h=300&fit=crop',
    'pumpkin': 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=400&h=300&fit=crop',
    'kaddu': 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=400&h=300&fit=crop',
    'cucumber': 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400&h=300&fit=crop',
    'kheera': 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400&h=300&fit=crop',
    'spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop',
    'palak': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop',
    'peas': 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&h=300&fit=crop',
    'green peas': 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&h=300&fit=crop',
    'matar': 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&h=300&fit=crop',

    // Fruits
    'banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
    'kela': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
    'mango': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop',
    'aam': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop',
    'apple': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop',
    'seb': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop',
    'orange': 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop',
    'santra': 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop',
    'grapes': 'https://images.unsplash.com/photo-1599819177626-c0d3b3d0e4e7?w=400&h=300&fit=crop',
    'angoor': 'https://images.unsplash.com/photo-1599819177626-c0d3b3d0e4e7?w=400&h=300&fit=crop',
    'pomegranate': 'https://images.unsplash.com/photo-1615485500834-bc10199bc727?w=400&h=300&fit=crop',
    'anar': 'https://images.unsplash.com/photo-1615485500834-bc10199bc727?w=400&h=300&fit=crop',
    'watermelon': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop',
    'tarbooz': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop',
    'papaya': 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=400&h=300&fit=crop',
    'papita': 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=400&h=300&fit=crop',

    'cotton': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=300&fit=crop',
    'kapas': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=300&fit=crop',
    'sugarcane': 'https://images.unsplash.com/photo-1583468323330-9032ad490fed?w=400&h=300&fit=crop',
    'ganna': 'https://images.unsplash.com/photo-1583468323330-9032ad490fed?w=400&h=300&fit=crop',
    'soybean': 'https://images.unsplash.com/photo-1596040033229-a0b3b83b6f0f?w=400&h=300&fit=crop',
    'soya': 'https://images.unsplash.com/photo-1596040033229-a0b3b83b6f0f?w=400&h=300&fit=crop',
    'groundnut': 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=400&h=300&fit=crop',
    'peanut': 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=400&h=300&fit=crop',
    'moongfali': 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=400&h=300&fit=crop',
    'mustard': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=300&fit=crop',
    'sarson': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=300&fit=crop',
    'pigeon pea': 'https://images.unsplash.com/photo-1596040033229-a0b3b83b6f0f?w=400&h=300&fit=crop',
    'tuer': 'https://images.unsplash.com/photo-1596040033229-a0b3b83b6f0f?w=400&h=300&fit=crop',
    'channa': 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=400&h=300&fit=crop',
};

/**
 * Get default image for a commodity
 * @param {string} commodityName - Name of the commodity (e.g., "Yellow Maize", "Black Gram")
 * @returns {string} - Image URL or placeholder
 */
export const getCommodityImage = (commodityName) => {
    if (!commodityName) {
        return 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop'; // Generic farm/crop image
    }

    // Normalize the commodity name (lowercase, remove extra spaces)
    const normalized = commodityName.toLowerCase().trim();

    // Try exact match first
    if (commodityImageMap[normalized]) {
        return commodityImageMap[normalized];
    }

    // Try word-based partial match (more conservative)
    // Only match if the key is a complete word in the commodity name
    // This prevents "black" matching "blackberry" or similar issues
    const words = normalized.split(/\s+/);
    for (const [key, imageUrl] of Object.entries(commodityImageMap)) {
        // Check if key matches any complete word
        if (words.includes(key)) {
            return imageUrl;
        }
        // Check if normalized contains key as a complete word (e.g., "yellow maize" contains "maize")
        const keyWords = key.split(/\s+/);
        if (keyWords.every(kw => words.includes(kw))) {
            return imageUrl;
        }
    }

    // No confident match found - return null instead of generic image
    // This allows the UI to show no image rather than a potentially wrong one
    return null;
};

export default getCommodityImage;
