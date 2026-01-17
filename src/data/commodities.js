// Comprehensive Commodity Database with Multilingual Support
// Includes Hindi, Marathi, English names + phonetic tags for English keyboard search

export const COMMODITIES = [
    // Vegetables
    { id: 'tomato', en: 'Tomato', hi: 'टमाटर', mr: 'टोमॅटो', category: 'Vegetables', unit: 'Kg', icon: '🍅', tags: ['tamatar', 'tomato', 'tomatot', 'tometo'] },
    { id: 'potato', en: 'Potato', hi: 'आलू', mr: 'बटाटा', category: 'Vegetables', unit: 'Kg', icon: '🥔', tags: ['aalu', 'batata', 'potato', 'alu'] },
    { id: 'onion', en: 'Onion', hi: 'प्याज', mr: 'कांदा', category: 'Vegetables', unit: 'Kg', icon: '🧅', tags: ['pyaj', 'kanda', 'onion', 'pyaaj'] },
    { id: 'cabbage', en: 'Cabbage', hi: 'पत्तागोभी', mr: 'कोबी', category: 'Vegetables', unit: 'Kg', icon: '🥬', tags: ['pattagobhi', 'kobi', 'cabbage', 'patta gobhi'] },
    { id: 'cauliflower', en: 'Cauliflower', hi: 'फूलगोभी', mr: 'फ्लॉवर', category: 'Vegetables', unit: 'Kg', icon: '🥦', tags: ['fulgobhi', 'flower', 'cauliflower', 'phool gobhi'] },
    { id: 'brinjal', en: 'Brinjal', hi: 'बैंगन', mr: 'वांगी', category: 'Vegetables', unit: 'Kg', icon: '🍆', tags: ['baingan', 'vangi', 'brinjal', 'eggplant'] },
    { id: 'ladyfinger', en: 'Ladyfinger / Bhindi', hi: 'भिंडी', mr: 'भेंडी', category: 'Vegetables', unit: 'Kg', icon: '🌱', tags: ['bhindi', 'bhendi', 'bendi', 'ladyfinger', 'okra'] },
    { id: 'carrot', en: 'Carrot', hi: 'गाजर', mr: 'गाजर', category: 'Vegetables', unit: 'Kg', icon: '🥕', tags: ['gajar', 'carrot'] },
    { id: 'peas', en: 'Peas', hi: 'मटर', mr: 'वाटाणा', category: 'Vegetables', unit: 'Kg', icon: '🫛', tags: ['matar', 'watana', 'peas'] },
    { id: 'spinach', en: 'Spinach / Palak', hi: 'पालक', mr: 'पालक', category: 'Vegetables', unit: 'Kg', icon: '🥬', tags: ['palak', 'spinach'] },
    { id: 'methi', en: 'Fenugreek / Methi', hi: 'मेथी', mr: 'मेथी', category: 'Vegetables', unit: 'Kg', icon: '🌿', tags: ['methi', 'menthi', 'fenugreek'] },
    { id: 'coriander', en: 'Coriander', hi: 'धनिया', mr: 'कोथिंबीर', category: 'Vegetables', unit: 'Kg', icon: '🌿', tags: ['dhaniya', 'kothimbir', 'coriander', 'dhanya'] },
    { id: 'chilli', en: 'Green Chilli', hi: 'हरी मिर्च', mr: 'हिरवी मिरची', category: 'Vegetables', unit: 'Kg', icon: '🌶️', tags: ['mirchi', 'chilli', 'mirch'] },
    { id: 'cucumber', en: 'Cucumber', hi: 'खीरा', mr: 'काकडी', category: 'Vegetables', unit: 'Kg', icon: '🥒', tags: ['khira', 'kakdi', 'cucumber'] },
    { id: 'bittergourd', en: 'Bitter Gourd', hi: 'करेला', mr: 'कारले', category: 'Vegetables', unit: 'Kg', icon: '🥒', tags: ['karela', 'karle', 'bitter gourd'] },
    { id: 'bottlegourd', en: 'Bottle Gourd', hi: 'लौकी', mr: 'दुधी भोपळा', category: 'Vegetables', unit: 'Kg', icon: '🥒', tags: ['lauki', 'dudhi', 'bottle gourd'] },
    { id: 'pumpkin', en: 'Pumpkin', hi: 'कद्दू', mr: 'भोपळा', category: 'Vegetables', unit: 'Kg', icon: '🎃', tags: ['kaddu', 'bhopla', 'pumpkin'] },
    { id: 'radish', en: 'Radish', hi: 'मूली', mr: 'मुळा', category: 'Vegetables', unit: 'Kg', icon: '🥕', tags: ['mooli', 'mula', 'radish', 'muli'] },
    { id: 'capsicum', en: 'Capsicum', hi: 'शिमला मिर्च', mr: 'ढोबळी मिरची', category: 'Vegetables', unit: 'Kg', icon: '🫑', tags: ['shimlapuri', 'shimla mirch', 'capsicum'] },
    { id: 'drumstick', en: 'Drumstick', hi: 'सहजन', mr: 'शेवगा', category: 'Vegetables', unit: 'Kg', icon: '🌳', tags: ['shevga', 'sahjan', 'drumstick'] },

    // Fruits
    { id: 'banana', en: 'Banana', hi: 'केला', mr: 'केळी', category: 'Fruits', unit: 'Kg', icon: '🍌', tags: ['kela', 'keli', 'banana'] },
    { id: 'mango', en: 'Mango', hi: 'आम', mr: 'आंबा', category: 'Fruits', unit: 'Kg', icon: '🥭', tags: ['aam', 'amba', 'mango'] },
    { id: 'apple', en: 'Apple', hi: 'सेब', mr: 'सफरचंद', category: 'Fruits', unit: 'Kg', icon: '🍎', tags: ['seb', 'safarachand', 'apple'] },
    { id: 'orange', en: 'Orange', hi: 'संतरा', mr: 'संत्रा', category: 'Fruits', unit: 'Kg', icon: '🍊', tags: ['santara', 'orange'] },
    { id: 'grapes', en: 'Grapes', hi: 'अंगूर', mr: 'द्राक्षे', category: 'Fruits', unit: 'Kg', icon: '🍇', tags: ['angoor', 'draksha', 'grapes', 'black grapes', 'green grapes'] },
    { id: 'pomegranate', en: 'Pomegranate', hi: 'अनार', mr: 'डाळिंब', category: 'Fruits', unit: 'Kg', icon: '🍎', tags: ['anaar', 'dalimb', 'pomegranate'] },
    { id: 'papaya', en: 'Papaya', hi: 'पपीता', mr: 'पपई', category: 'Fruits', unit: 'Kg', icon: '🍈', tags: ['papita', 'papai', 'papaya'] },
    { id: 'watermelon', en: 'Watermelon', hi: 'तरबूज', mr: 'टरबूज', category: 'Fruits', unit: 'Kg', icon: '🍉', tags: ['tarbuj', 'tarbhuj', 'watermelon'] },
    { id: 'guava', en: 'Guava', hi: 'अमरूद', mr: 'पेरू', category: 'Fruits', unit: 'Kg', icon: '🍐', tags: ['amrud', 'peru', 'guava'] },
    { id: 'lemon', en: 'Lemon', hi: 'नींबू', mr: 'लिंबू', category: 'Fruits', unit: 'Kg', icon: '🍋', tags: ['nimbu', 'limbu', 'lemon'] },

    // Grains
    { id: 'wheat', en: 'Wheat', hi: 'गेहूं', mr: 'गहू', category: 'Grains', unit: 'Quintal', icon: '🌾', tags: ['gehu', 'gahu', 'wheat'] },
    { id: 'rice', en: 'Rice', hi: 'चावल', mr: 'तांदूळ', category: 'Grains', unit: 'Quintal', icon: '🍚', tags: ['chawal', 'tandul', 'rice', 'paddy'] },
    { id: 'maize', en: 'Maize', hi: 'मक्का', mr: 'मका', category: 'Grains', unit: 'Quintal', icon: '🌽', tags: ['makka', 'maka', 'maize', 'corn'] },
    { id: 'bajra', en: 'Pearl Millet', hi: 'बाजरा', mr: 'बाजरी', category: 'Grains', unit: 'Quintal', icon: '🌾', tags: ['bajra', 'millet'] },
    { id: 'jowar', en: 'Sorghum', hi: 'ज्वार', mr: 'ज्वारी', category: 'Grains', unit: 'Quintal', icon: '🌾', tags: ['jowar', 'jawari', 'sorghum'] },
    { id: 'barley', en: 'Barley', hi: 'जौ', mr: 'जव', category: 'Grains', unit: 'Quintal', icon: '🌾', tags: ['jau', 'barley'] },

    // Pulses
    { id: 'chickpea', en: 'Chickpea', hi: 'चना', mr: 'हरभरा', category: 'Pulses', unit: 'Quintal', icon: '🫘', tags: ['chana', 'harbhara', 'chickpea', 'gram'] },
    { id: 'pigeon_pea', en: 'Pigeon Pea', hi: 'तुअर दाल', mr: 'तूर डाळ', category: 'Pulses', unit: 'Quintal', icon: '🫘', tags: ['tuar', 'tur', 'pigeon pea', 'tur dal', 'toor', 'arhar'] },
    { id: 'moong', en: 'Green Gram', hi: 'मूंग', mr: 'मूग', category: 'Pulses', unit: 'Quintal', icon: '🫘', tags: ['moong', 'mug', 'green gram'] },
    { id: 'urad', en: 'Black Gram', hi: 'उड़द', mr: 'उडीद', category: 'Pulses', unit: 'Quintal', icon: '🫘', tags: ['urad', 'udid', 'black gram'] },
    { id: 'masoor', en: 'Lentil', hi: 'मसूर', mr: 'मसूर', category: 'Pulses', unit: 'Quintal', icon: '🫘', tags: ['masur', 'lentil'] },

    // Oilseeds
    { id: 'soybean', en: 'Soybean', hi: 'सोयाबीन', mr: 'सोयाबीन', category: 'Oilseeds', unit: 'Quintal', icon: '🫘', tags: ['soyabean', 'soybean'] },
    { id: 'groundnut', en: 'Groundnut', hi: 'मूंगफली', mr: 'शेंगदाणा', category: 'Oilseeds', unit: 'Quintal', icon: '🥜', tags: ['mungfali', 'shengdana', 'groundnut', 'peanut'] },
    { id: 'mustard', en: 'Mustard', hi: 'सरसों', mr: 'मोहरी', category: 'Oilseeds', unit: 'Quintal', icon: '🌱', tags: ['sarson', 'mohari', 'mustard'] },
    { id: 'sunflower', en: 'Sunflower', hi: 'सूरजमुखी', mr: 'सूर्यफूल', category: 'Oilseeds', unit: 'Quintal', icon: '🌻', tags: ['surajmukhi', 'suryaphul', 'sunflower'] },

    // Cash Crops
    { id: 'cotton', en: 'Cotton', hi: 'कपास', mr: 'कापूस', category: 'Cash Crops', unit: 'Quintal', icon: '☁️', tags: ['kapaas', 'kapus', 'cotton'] },
    { id: 'sugarcane', en: 'Sugarcane', hi: 'गन्ना', mr: 'ऊस', category: 'Cash Crops', unit: 'Ton', icon: '🎋', tags: ['ganna', 'us', 'sugarcane'] },
    { id: 'turmeric', en: 'Turmeric', hi: 'हल्दी', mr: 'हळद', category: 'Spices', unit: 'Quintal', icon: '🟡', tags: ['haldi', 'halad', 'turmeric'] },
    { id: 'ginger', en: 'Ginger', hi: 'अदरक', mr: 'आले', category: 'Spices', unit: 'Kg', icon: '🫚', tags: ['adrak', 'ale', 'ginger'] },
    { id: 'garlic', en: 'Garlic', hi: 'लहसुन', mr: 'लसूण', category: 'Spices', unit: 'Kg', icon: '🧄', tags: ['lahsun', 'lasun', 'garlic'] },
];

/**
 * Searches commodities using English, Hindi, Marathi, and tags.
 * Handles phonetic English spellings of Hindi/Marathi words.
 */
export const searchCommodities = (query) => {
    if (!query || query.length < 1) return [];

    const lowerQuery = query.toLowerCase().trim();

    return COMMODITIES.filter(commodity => {
        // Search in English, Hindi, Marathi names
        const matchesName =
            commodity.en.toLowerCase().includes(lowerQuery) ||
            commodity.hi.includes(lowerQuery) ||
            commodity.mr.includes(lowerQuery) ||
            commodity.id.includes(lowerQuery);

        // Search in tags for phonetic matches (e.g., 'palak', 'bendi')
        const matchesTags = commodity.tags && commodity.tags.some(tag => tag.toLowerCase().includes(lowerQuery));

        return matchesName || matchesTags;
    }).slice(0, 8); // Limit to 8 suggestions
};

// Get commodity by ID
export const getCommodityById = (id) => {
    return COMMODITIES.find(c => c.id === id);
};

// Get recommended unit for commodity
export const getRecommendedUnit = (commodityId) => {
    const commodity = getCommodityById(commodityId);
    return commodity ? commodity.unit : 'Kg';
};

export default COMMODITIES;
