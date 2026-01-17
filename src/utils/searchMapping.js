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

    // --- DEVANAGARI MAPPINGS (Removed to avoid duplicates) ---
    // 'gehu': 'गेहूं', etc. removed.
    // Ensure we map Hindi Script -> English instead.
    'गेहूं': 'wheat',
    'चावल': 'rice',
    'धान': 'rice',
    'मक्का': 'maize',
    'सोयाबीन': 'soybean',
    'बाजरा': 'millet',
    'ज्वार': 'sorghum',
    'जौ': 'barley',
    'चना': 'gram',
    'अरहर': 'pigeon pea',
    'मसूर': 'lentil',
    'उड़द': 'black gram',
    'मूंग': 'green gram',
    'सरसों': 'mustard',
    'मूंगफली': 'groundnut',
    'सूरजमुखी': 'sunflower',
    'तिल': 'sesame',
    'अलसी': 'linseed',
    'प्याज': 'onion',
    'आलू': 'potato',
    'टमाटर': 'tomato',
    'लहसुन': 'garlic',
    'अदरक': 'ginger',
    'मिर्च': 'chilli',
    'पत्तागोभी': 'cabbage',
    'फूलगोभी': 'cauliflower',
    'बैंगन': 'brinjal',
    'भिंडी': 'lady finger',
    'मटर': 'pea',
    'गाजर': 'carrot',
    'मूली': 'radish',
    'पालक': 'spinach',
    'मेथी': 'fenugreek',
    'लौकी': 'bottle gourd',
    'करेला': 'bitter gourd',
    'कद्दू': 'pumpkin',
    'खीरा': 'cucumber',
    'ककड़ी': 'cucumber',
    'केला': 'banana',
    'आम': 'mango',
    'सेब': 'apple',
    'अनार': 'pomegranate',
    'संतरा': 'orange',
    'अंगूर': 'grapes',
    'पपीता': 'papaya',
    'अमरूद': 'guava',
    'तरबूज': 'watermelon',
    'खरबूजा': 'muskmelon',
    'नींबू': 'lemon',
    'कपास': 'cotton',
    'गन्ना': 'sugarcane',
    'हल्दी': 'turmeric',
    'धनिया': 'coriander',
    // --- MARATHI MAPPINGS (Extensive) ---
    // 1. Vegetables (भाज्या)
    // 'kanda': 'onion', (Duplicate of line 86)
    'kaanda': 'onion',
    'कांदा': 'onion',

    'lasun': 'garlic',
    'lason': 'garlic',
    'लसूण': 'garlic',

    'bhendi': 'lady finger',
    'भेंडी': 'lady finger',

    'बटाटा': 'potato',

    'vange': 'brinjal',
    'wangy': 'brinjal',
    'वांगे': 'brinjal',

    // 'tomato': 'tomato', (Duplicate of line 93)
    'टोमॅटो': 'tomato',

    'phul-kobi': 'cauliflower',
    'phulkobi': 'cauliflower',
    'flower': 'cauliflower',
    'फुलकोबी': 'cauliflower',
    'फ्लॉवर': 'cauliflower',

    'kobi': 'cabbage',
    'कोबी': 'cabbage',

    'karale': 'bitter gourd',
    'कारले': 'bitter gourd',

    'dudhi bhopla': 'bottle gourd',
    'दुधी भोपळा': 'bottle gourd',

    'dodka': 'ridge gourd',
    'tura': 'ridge gourd',
    'दोडका': 'ridge gourd',

    'vatana': 'peas',
    'वाटाणा': 'peas',

    // 'palak': 'spinach', (Duplicate)
    // 'पालक': 'spinach', (Duplicate of line 245)

    // 'methi': 'fenugreek', (Duplicate)
    // 'मेथी': 'fenugreek', (Duplicate of line 246)

    // 2. Grains & Cereals (तृणधान्ये)
    'tandul': 'rice',
    'bhat': 'rice',
    'taandul': 'rice',
    'तांदूळ': 'rice',
    'भात': 'rice',

    'gahu': 'wheat',
    'गहू': 'wheat',

    'jowari': 'sorghum',
    'jwari': 'sorghum',
    'ज्वारी': 'sorghum',

    'bajri': 'millet',
    // 'bajra': 'millet', (Duplicate)
    'बाजरी': 'millet',

    'maka': 'maize',
    // 'makka': 'maize', (Duplicate)
    // 'corn': 'maize', (Duplicate)
    'मका': 'maize',

    'nachni': 'finger millet',
    'nagli': 'finger millet',
    'ragi': 'finger millet',
    'नाचणी': 'finger millet',
    'नागली': 'finger millet',

    // 3. Pulses & Legumes (कडधान्ये)
    // 3. Pulses & Legumes (कडधान्ये)
    // 'tur' maps to pigeon pea (duplicate removed)
    'तूर': 'pigeon pea',

    'udid': 'black gram',
    'उडीद': 'black gram',

    'mug': 'green gram',
    'मूग': 'green gram',

    'harbara': 'chickpea',
    'हरभरा': 'chickpea',
    'चणा': 'chickpea',

    'chavli': 'cowpea',
    'lobia': 'cowpea',
    'चवळी': 'cowpea',

    // 4. Fruits (फळे)
    'amba': 'mango',
    'hapus': 'mango',
    'आंबा': 'mango',

    'kele': 'banana',
    'keli': 'banana',
    'केळे': 'banana',
    'केळी': 'banana',

    'draksha': 'grapes',
    'draksh': 'grapes',
    'द्राक्षे': 'grapes',

    'dalimb': 'pomegranate',
    'डाळिंब': 'pomegranate',

    'sitaphal': 'custard apple',
    'custard apple': 'custard apple',
    'सिताफळ': 'custard apple',

    'papai': 'papaya',
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

    // --- NEW MARATHI & HINDI ADDITIONS (Dynamic) ---
    // Sugarcane
    'oos': 'sugarcane',
    'us': 'sugarcane',
    'ऊस': 'sugarcane',
    'ganna': 'sugarcane',

    // Turmeric
    'halad': 'turmeric',
    'haldi': 'turmeric',
    'हळद': 'turmeric',
    'हल्दी': 'turmeric', // Hindi

    // Ginger
    'ale': 'ginger',
    'aal': 'ginger',
    'आले': 'ginger',
    'अद्रक': 'ginger',

    // Cotton
    'kapus': 'cotton',
    'kaapus': 'cotton',
    'कापूस': 'cotton',

    // Groundnut
    'bhuimug': 'groundnut',
    'shingdana': 'groundnut',
    'भुईमूग': 'groundnut',
    'शेंगदाणा': 'groundnut',

    // Pomegranate
    'dalimb': 'pomegranate',
    'डाळिंब': 'pomegranate',

    // Grapes
    'draksh': 'grapes',
    'द्राक्षे': 'grapes',

    // Onion
    'kanda': 'onion',
    'kaanda': 'onion',
    'कांदा': 'onion',

    // Potato
    'batata': 'potato',
    'बटाटा': 'potato',

    // Tomato
    'tomato': 'tomato',
    'टोमॅटो': 'tomato',

    // Soybean
    'soyabin': 'soybean',
    'सोयाबीन': 'soybean',

    // Maize
    'maka': 'maize',
    'makka': 'maize',
    'मका': 'maize',

    // Wheat
    'gahu': 'wheat',
    'gahhu': 'wheat',
    'गहू': 'wheat',

    // Rice
    'tandul': 'rice',
    'taandul': 'rice',
    'तांदूळ': 'rice',
    'bhaat': 'rice',
    'भात': 'rice',

    // Gram
    'harbhara': 'gram',
    'chana': 'gram',
    'हरभरा': 'gram',
    'चना': 'gram',

    // Pigeon Pea (Tur)
    'tur': 'pigeon pea',
    'toor': 'pigeon pea',
    'twar': 'pigeon pea',
    'तूर': 'pigeon pea',

    // Chili
    'mirchi': 'chilli',
    'mirch': 'chilli',
    'मिर्ची': 'chilli',
    'मिरची': 'chilli',

    // Garlic
    'lasun': 'garlic',
    'lason': 'garlic',
    'लसूण': 'garlic',

    // Coriander
    'kothimbir': 'coriander',
    'dhaniya': 'coriander',
    'कोथिंबीर': 'coriander',
    'धनिया': 'coriander',

    // Fenugreek
    'methi': 'fenugreek',
    'मेथी': 'fenugreek',

    // Additional Script Mappings (Robustness)
    'कांदा': 'onion',
    'बटाटा': 'potato',
    'टोमॅटो': 'tomato',
    'लसूण': 'garlic',
    'आले': 'ginger',
    'अद्रक': 'ginger',
    'मिरची': 'chilli',
    'कोथिंबीर': 'coriander',
    'वांगे': 'brinjal',
    'भेन्डी': 'lady finger',
    'भेंडी': 'lady finger',
    'फ्लॉवर': 'cauliflower',
    'कोबी': 'cabbage',
    'गवार': 'cluster beans',
    'शेवगा': 'drumstick',
    'कारले': 'bitter gourd',
    'दुधी भोपळा': 'bottle gourd',
    'दोडका': 'ridge gourd',
    'घोसाळे': 'sponge gourd',
    'चवळी': 'cowpea',
    'wal': 'field beans',
    'वाल': 'field beans',
    'पावट': 'field beans',
    'घेवडा': 'french beans',
    'मका': 'maize',
    'ज्वारी': 'sorghum',
    'बाजरी': 'millet',
    'नाचणी': 'finger millet',
    'वरई': 'little millet',
    'सावा': 'little millet',
    'राजगिरा': 'amaranth',
    'कुळीथ': 'horse gram',
    'मठ': 'moth bean',
    'तूर': 'pigeon pea',
    'मूग': 'green gram',
    'उडीद': 'black gram',
    'मसूर': 'lentil',
    'हरभरा': 'chickpea',
    'चणा': 'chickpea',
    'वाटाणा': 'pea',
    'शेंगदाणा': 'groundnut',
    'भुईमूग': 'groundnut',
    'सुर्यफूल': 'sunflower',
    'करडई': 'safflower',
    'जवस': 'linseed',
    'तीळ': 'sesame',
    'मोहरी': 'mustard',
    'सोयाबीन': 'soybean',
    'कापूस': 'cotton',
    'ऊस': 'sugarcane',
    'हळद': 'turmeric',
    'आंबा': 'mango',
    'केळी': 'banana',
    'द्राक्षे': 'grapes',
    'डाळिंब': 'pomegranate',
    'पपई': 'papaya',
    'सीताफळ': 'custard apple',
    'पेरू': 'guava',
    'चिकू': 'sapota',
    'सफरचंद': 'apple',
    'संत्र': 'orange',
    'मोसंबी': 'sweet lime',
    'लिंबू': 'lemon',
    'कलिंगड': 'watermelon',
    'खरबूज': 'muskmelon',
    'नारळ': 'coconut',
    'सुपारी': 'arecanut',
    'काजू': 'cashew nut',
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
