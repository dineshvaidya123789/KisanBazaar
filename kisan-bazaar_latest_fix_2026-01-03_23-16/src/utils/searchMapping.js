// Bilingual Mapping for Commodities
// Maps common Hindi names to English equivalents for robust searching

export const commodityMapping = {
    // --- CEREALS & GRAINS ---
    'wheat': 'gehu',
    'gehu': 'wheat',
    'gehun': 'wheat',
    'kanak': 'wheat',

    'rice': 'chawal',
    'chawal': 'rice',
    'dhaan': 'rice',
    'basmati': 'rice',
    'paddy': 'rice',

    'maize': 'makka',
    'corn': 'makka',
    'makka': 'maize',
    'bhutta': 'maize',

    'millet': 'bajra',
    'bajra': 'millet',

    'sorghum': 'jowar',
    'jowar': 'sorghum',

    'barley': 'jau',
    'jau': 'barley',

    // --- PULSES (Dals) ---
    'gram': 'chana',
    'chickpea': 'chana',
    'bengal gram': 'chana',
    'chana': 'gram',
    'channa': 'gram',

    'pigeon pea': 'arhar',
    'red gram': 'arhar',
    'arhar': 'pigeon pea',
    'tuar': 'pigeon pea',
    'toor': 'pigeon pea',
    'tur': 'pigeon pea',
    'tur dal': 'arhar dal',

    // --- CHANA VARIETIES ---
    'black chana': 'kala chana',
    'kala chana': 'black chana',
    'kabuli chana': 'safed chana',
    'safed chana': 'kabuli chana',
    'dollar chana': 'kabuli chana',

    'lentil': 'masoor',
    'masoor': 'lentil',

    'black gram': 'urad',
    'urad': 'black gram',

    'green gram': 'moong',
    'mung': 'green gram',
    'moong': 'green gram',

    // --- OILSEEDS ---
    'soybean': 'soya',
    'soyabean': 'soya',
    'soya': 'soybean',

    'mustard': 'sarson',
    'sarson': 'mustard',
    'rai': 'mustard',

    'groundnut': 'moongfali',
    'peanut': 'moongfali',
    'moongfali': 'groundnut',
    'singdana': 'groundnut',

    'sunflower': 'surajmukhi',
    'surajmukhi': 'sunflower',

    'sesame': 'til',
    'til': 'sesame',

    // --- VEGETABLES ---
    'onion': 'pyaz',
    'pyaz': 'onion',
    'kanda': 'onion', // Regional
    'dungri': 'onion', // Regional

    'potato': 'aloo',
    'aloo': 'potato',
    'batata': 'potato', // Regional

    'tomato': 'tamatar',
    'tamatar': 'tomato',

    'garlic': 'lahsun',
    'lahsun': 'garlic',

    'ginger': 'adrak',
    'adrak': 'ginger',

    'chilli': 'mirch',
    'chilly': 'mirch',
    'mirch': 'chilli',
    'mirchi': 'chilli',

    'cabbage': 'patta gobhi',
    'patta gobhi': 'cabbage',
    'gobhi': 'cabbage', // Broad matching

    'cauliflower': 'phool gobhi',
    'phool gobhi': 'cauliflower',

    'brinjal': 'baingan',
    'eggplant': 'baingan',
    'aubergine': 'baingan',
    'baingan': 'brinjal',

    'lady finger': 'bhindi',
    'okra': 'bhindi',
    'bhindi': 'lady finger',

    'pea': 'matar',
    'peas': 'matar',
    'matar': 'pea',

    'carrot': 'gajar',
    'gajar': 'carrot',

    'radish': 'mooli',
    'mooli': 'radish',

    'spinach': 'palak',
    'palak': 'spinach',

    'fenugreek': 'methi',
    'methi': 'fenugreek',

    'bottle gourd': 'lauki',
    'lauki': 'bottle gourd',
    'ghiya': 'bottle gourd',

    'bitter gourd': 'karela',
    'karela': 'bitter gourd',

    'pumpkin': 'kaddu',
    'kaddu': 'pumpkin',
    'kashiphal': 'pumpkin',

    'cucumber': 'kheera',
    'kheera': 'cucumber',
    'kakdi': 'cucumber',

    // --- FRUITS ---
    'banana': 'kela',
    'kela': 'banana',

    'mango': 'aam',
    'aam': 'mango',

    'apple': 'seb',
    'seb': 'apple',

    'pomegranate': 'anar',
    'anar': 'pomegranate',

    'orange': 'santra',
    'santra': 'orange',
    'narangi': 'orange',

    'grapes': 'angoor',
    'angoor': 'grapes',

    'papaya': 'papita',
    'papita': 'papaya',

    'guava': 'amrood',
    'amrood': 'guava',

    'watermelon': 'tarbooz',
    'tarbooz': 'watermelon',

    'muskmelon': 'kharbuja',
    'kharbuja': 'muskmelon',

    // --- CASH CROPS / OTHERS ---
    'cotton': 'kapas',
    'kapas': 'cotton',
    'narma': 'cotton',
    'rui': 'cotton',

    'sugarcane': 'ganna',
    'ganna': 'sugarcane',

    'turmeric': 'haldi',
    'haldi': 'turmeric',

    'linseed': 'alsi',
    'alsi': 'linseed',
    'flax seed': 'alsi',

    'lemon': 'nimbu',
    'nimbu': 'lemon',

    'betel leaf': 'paan',
    'paan': 'betel leaf',

    'jute': 'patshan',
    'patshan': 'jute',

    // --- DEVANAGARI MAPPINGS (Hinglish -> Hindi) ---
    // Enables searching with Hindi typing (e.g. "गेहूं")
    'gehu': 'गेहूं',
    'chawal': 'चावल',
    'dhaan': 'धान',
    'makka': 'मक्का',
    'soya': 'सोयाबीन',
    'bajra': 'बाजरा',
    'jowar': 'ज्वार',
    'jau': 'जौ',

    'chana': 'चना',
    'arhar': 'अरहर',
    'masoor': 'मसूर',
    'urad': 'उड़द',
    'moong': 'मूंग',

    'sarson': 'सरसों',
    'moongfali': 'मूंगफली',
    'surajmukhi': 'सूरजमुखी',
    'til': 'तिल',
    'alsi': 'अलसी',

    'pyaz': 'प्याज',
    'aloo': 'आलू',
    'tamatar': 'टमाटर',
    'lahsun': 'लहसुन',
    'adrak': 'अदरक',
    'mirch': 'मिर्च',
    'patta gobhi': 'पत्तागोभी',
    'phool gobhi': 'फूलगोभी',
    'baingan': 'बैंगन',
    'bhindi': 'भिंडी',
    'matar': 'मटर',
    'gajar': 'गाजर',
    'mooli': 'मूली',
    'palak': 'पालक',
    'methi': 'मेथी',
    'lauki': 'लौकी',
    'karela': 'करेला',
    'kaddu': 'कद्दू',
    'kheera': 'खीरा',
    'kakdi': 'ककड़ी',

    'kela': 'केला',
    'aam': 'आम',
    'seb': 'सेब',
    'anar': 'अनार',
    'santra': 'संतरा',
    'angoor': 'अंगूर',
    'papita': 'पपीता',
    'amrood': 'अमरूद',
    'tarbooz': 'तरबूज',
    'kharbuja': 'खरबूजा',
    'nimbu': 'नींबू',

    'kapas': 'कपास',
    'ganna': 'गन्ना',
    'haldi': 'हल्दी',
    'dhaniya': 'धनिया',
    // --- MARATHI MAPPINGS (Extensive) ---
    // 1. Vegetables (भाज्या)
    'kanda': 'onion',
    'kaanda': 'onion',
    'कांदा': 'onion',

    'lasun': 'garlic',
    'lason': 'garlic',
    'लसूण': 'garlic',

    'bhendi': 'lady finger',
    'bhindi': 'lady finger',
    'भेंडी': 'lady finger',

    'batata': 'potato',
    'बटाटा': 'potato',

    'vange': 'brinjal',
    'wangy': 'brinjal',
    'baingan': 'brinjal',
    'वांगे': 'brinjal',

    'tomato': 'tomato',
    'टोमॅटो': 'tomato',

    'phul-kobi': 'cauliflower',
    'phulkobi': 'cauliflower',
    'flower': 'cauliflower',
    'फुलकोबी': 'cauliflower',
    'फ्लॉवर': 'cauliflower',

    'kobi': 'cabbage',
    'patta gobhi': 'cabbage',
    'कोबी': 'cabbage',

    'karale': 'bitter gourd',
    'karela': 'bitter gourd',
    'कारले': 'bitter gourd',

    'dudhi bhopla': 'bottle gourd',
    'lauki': 'bottle gourd',
    'दुधी भोपळा': 'bottle gourd',

    'dodka': 'ridge gourd',
    'tura': 'ridge gourd',
    'दोडका': 'ridge gourd',

    'vatana': 'peas',
    'matar': 'peas',
    'वाटाणा': 'peas',

    'palak': 'spinach',
    'पालक': 'spinach',

    'methi': 'fenugreek',
    'मेथी': 'fenugreek',

    // 2. Grains & Cereals (तृणधान्ये)
    'tandul': 'rice',
    'bhat': 'rice',
    'chawal': 'rice',
    'taandul': 'rice',
    'तांदूळ': 'rice',
    'भात': 'rice',

    'gahu': 'wheat',
    'gehu': 'wheat',
    'गहू': 'wheat',

    'jowari': 'sorghum',
    'jwari': 'sorghum',
    'jowar': 'sorghum',
    'ज्वारी': 'sorghum',

    'bajri': 'millet',
    'bajra': 'millet',
    'बाजरी': 'millet',

    'maka': 'maize',
    'makka': 'maize',
    'corn': 'maize',
    'मका': 'maize',

    'nachni': 'finger millet',
    'nagli': 'finger millet',
    'ragi': 'finger millet',
    'नाचणी': 'finger millet',
    'नागली': 'finger millet',

    // 3. Pulses & Legumes (कडधान्ये)
    'tur': 'pigeon pea',
    'toor': 'pigeon pea',
    'arhar': 'pigeon pea',
    'तूर': 'pigeon pea',

    'udid': 'black gram',
    'urad': 'black gram',
    'उडीद': 'black gram',

    'mug': 'green gram',
    'moong': 'green gram',
    'मूग': 'green gram',

    'harbara': 'chickpea',
    'chana': 'chickpea',
    'channa': 'chickpea',
    'हरभरा': 'chickpea',
    'चणा': 'chickpea',

    'chavli': 'cowpea',
    'lobia': 'cowpea',
    'चवळी': 'cowpea',

    // 4. Fruits (फळे)
    'amba': 'mango',
    'aam': 'mango',
    'hapus': 'mango',
    'आंबा': 'mango',

    'kele': 'banana',
    'keli': 'banana',
    'kela': 'banana',
    'केळे': 'banana',
    'केळी': 'banana',

    'draksha': 'grapes',
    'draksh': 'grapes',
    'angoor': 'grapes',
    'द्राक्षे': 'grapes',

    'dalimb': 'pomegranate',
    'anar': 'pomegranate',
    'डाळिंब': 'pomegranate',

    'sitaphal': 'custard apple',
    'custard apple': 'custard apple',
    'सिताफळ': 'custard apple',

    'papai': 'papaya',
    'papita': 'papaya',
    'पपई': 'papaya',

    // 5. General Terms (Might be useful for future/broader search)
    'krishi': 'agriculture',
    'sheti': 'agriculture',
    'कृषी': 'agriculture',
    'शेती': 'agriculture',

    'pike': 'crops',
    'pik': 'crop',
    'पिके': 'crops',

    'kapani': 'harvest',
    'कापणी': 'harvest',

    'perani': 'sowing',
    'pearni': 'sowing',
    'पेरणी': 'sowing',

    'sinchan': 'irrigation',
    'सिंचन': 'irrigation',

    'khat': 'fertilizer',
    'khata': 'fertilizer',
    'खत': 'fertilizer',

    'mati': 'soil',
    'maati': 'soil',
    'माती': 'soil',

    'shetkari': 'farmer',
    'kisan': 'farmer',
    'शेतकरी': 'farmer',

};

/**
 * Normalizes a search term by checking if it matches a Hindi synonym
 * @param {string} term 
 * @returns {string[]} - Array of related terms (original + mapped)
 */
export const getSearchSynonyms = (term) => {
    if (!term) return [];

    // Split term into words to handle "Red Grapes" -> "Red" "Grapes" -> "Red" "Angoor"
    // But for now, let's keep it simple and handle full term or single words
    const lower = term.toLowerCase().trim();
    const synonyms = new Set([lower]);

    // 1. Direct Lookup
    if (commodityMapping[lower]) {
        synonyms.add(commodityMapping[lower]);
    }

    // 2. Reverse Lookup (iterate entire map)
    for (const [key, value] of Object.entries(commodityMapping)) {
        if (value === lower) {
            synonyms.add(key);
        }
        if (key === lower) {
            synonyms.add(value);
        }
    }

    // 3. Robust partial matching (e.g. if user types 'gobhi', match 'patta gobhi' and 'phool gobhi')
    // This makes sure 'onion' -> matches 'Onion Red' if defined, or 'kanda' -> matches 'onion'

    // If term is 'kanda' (which is mapped to 'onion' above), we want to ensure we get 'onion'
    // The Direct Lookup logic above handles 'kanda' -> 'onion'.

    // But if we have multiple keys mapping to same value e.g. 'kanda'->'onion', 'pyaz'->'onion'
    // If user types 'kanda', synonyms={'kanda', 'onion'}. 
    // We should ALSO verify if 'onion' maps to other things (like 'pyaz') and add them!

    // Transitive closure (1 level deep)
    const initialSet = Array.from(synonyms);
    initialSet.forEach(s => {
        // Find everything that maps FROM 's' or TO 's'
        for (const [key, value] of Object.entries(commodityMapping)) {
            if (key === s) synonyms.add(value);
            if (value === s) synonyms.add(key);
        }
    });

    return Array.from(synonyms);
};

export default getSearchSynonyms;
