/**
 * Service to fetch real-time agricultural buy leads from Google Search via Serper.dev
 * 
 * To use this service:
 * 1. Get a free API key from https://serper.dev
 * 2. Replace the placeholder below or add it to your environment variables.
 */

const SERPER_API_KEY = "6c2973d259e27a9b7dea3006ab70246e20c6cb80"; // Enabled live leads

const CATEGORIES = {
    requirements: [
        "wanted buy Tuur Chana Moong pulses India",
        "Maize Corn yellow maize buy requirement India",
        "Wheat procurement bulk requirement India",
        "Soybean soybean meal buy requirement MP Maharashtra",
        "Pomegranate Grapes Mango export requirement India",
        "Onion garlic potato procurement requirement India",
        "Agri commodities bulk buy requirement India"
    ],
    farmers: [
        "Tuur dal Chana dal stock for sale MP Maharashtra",
        "Maize Corn yellow maize stock available for sale India",
        "Wheat Soybean stock for sale Madhya Pradesh",
        "fresh Grapes Pomegranate Mango for sale Maharashtra India",
        "Onion garlic potato stock available for sale India"
    ],
    news: [
        "pulses mandi price trend India 2025",
        "Maize Wheat market price trend India",
        "mandi rates Chana Tuur Maize MP today",
        "government procurement policy agriculture 2025 India",
        "horticulture news Maharashtra 2025"
    ]
};

const CROP_KEYWORDS = [
    'tuur', 'chana', 'moong', 'pulses', 'pomegranate', 'grapes', 'mango',
    'soybean', 'wheat', 'dal', 'corn', 'maize', 'banana', 'fruits',
    'grain', 'anar', 'kismis', 'orange', 'santra', 'arhar', 'urad', 'masoor',
    'onion', 'garlic', 'potato', 'veg', 'tomato', 'ginger'
];

const PERSONA_KEYWORDS = [
    'buyer', 'seller', 'exporter', 'trader', 'procurement', 'wanted',
    'available', 'stock', 'requirement', 'purchase', 'contact', 'wholesale',
    'importer', 'supply', 'need', 'buying', 'selling', 'stock'
];

const LOCATION_KEYWORDS = [
    'india', 'maharashtra', 'madhya pradesh', 'mp', 'mumbai', 'indore',
    'burhanpur', 'nashik', 'pune', 'nagpur', 'satara', 'sangli', 'ratnagiri',
    'bhopal', 'jabalpur', 'gwalior', 'delhi', 'indiana', 'rajasthan', 'gujarat'
];

const B2B_SITES = [
    "exportersindia.com",
    "expertsofdeals.com",
    "go4worldbusiness.com",
    "globalbuyersonline.com",
    "b2bmap.com",
    "indiamart.com",
    "tradeindia.com",
    "facebook.com",
    "linkedin.com"
];

const NEWS_BLACKLIST = [
    'news', 'policy', 'breaking', 'government', 'mandi rates', 'trend',
    'daily', 'report', 'withdraw', 'limit', 'decided', 'reopens',
    'analysis', 'outlook', 'forecast', 'update', 'headlines'
];

export const fetchLiveLeads = async (type = 'requirements') => {
    if (!SERPER_API_KEY) {
        // ... (keep fallback logic for demo)
    }

    const queries = CATEGORIES[type] || CATEGORIES.requirements;
    const baseQuery = queries[Math.floor(Math.random() * queries.length)];

    // Target specific platforms or do a broad search
    let finalQuery = baseQuery;
    const useSiteOperator = Math.random() > 0.4; // 60% chance to target a specific site
    if (useSiteOperator && type !== 'news') {
        const site = B2B_SITES[Math.floor(Math.random() * B2B_SITES.length)];
        finalQuery = `"${baseQuery}" site:${site}`; // Quotes for exact match
    }

    // Aggressive negative filters for total noise removal
    if (type === 'requirements' || type === 'farmers') {
        const negativeTerms = NEWS_BLACKLIST.map(term => `-${term}`).join(' ');
        finalQuery += ` ${negativeTerms} -recipe -cooking -kitchen -delicious -menu -benefits -healthy -tips -day -plates -disposable -college -Karachi -Pakistan -Lahore -Indonesia`;
    }

    try {
        const response = await fetch("https://google.serper.dev/search", {
            method: "POST",
            headers: {
                "X-API-KEY": SERPER_API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                q: finalQuery,
                gl: "in",
                hl: "en",
                location: "India",
                autocorrect: true,
                tbs: "qdr:w",
                num: 40
            }),
        });

        const data = await response.json();

        if (data.organic && data.organic.length > 0) {
            const seen = new Set();
            return data.organic.filter(item => {
                const text = (item.title + " " + item.snippet).toLowerCase();
                const link = item.link.toLowerCase();

                // 1. CROP VALIDATION: Mandatory
                const hasAgriTerm = CROP_KEYWORDS.some(k => text.includes(k)) || text.includes('agri');
                if (!hasAgriTerm && type !== 'news') return false;

                // 2. TRANSACTIONAL VALIDATION: Mandatory for transactional types
                const hasPersonaTerm = PERSONA_KEYWORDS.some(k => text.includes(k));
                if (!hasPersonaTerm && type !== 'news') return false;

                // 3. NEWS FILTER: For transactional types, must NOT look like news
                if (type !== 'news') {
                    const looksLikeNews = NEWS_BLACKLIST.some(term => text.includes(term)) ||
                        link.includes('news') ||
                        link.includes('press');
                    if (looksLikeNews) return false;
                }

                // 4. GEOGRAPHY VALIDATION: Softer check
                // If it's a known B2B site or mention India/States, it's good.
                const isKnownB2B = B2B_SITES.some(site => link.includes(site));
                const hasLocation = LOCATION_KEYWORDS.some(k => text.includes(k));

                if (type !== 'news' && !isKnownB2B && !hasLocation) return false;

                // 5. AGGRESSIVE BLACKLIST for food/lifestyle noise
                const noise = [
                    'menu', 'pulao', 'recipe', 'delicious', 'benefits', 'healthy',
                    'cooking', 'kitchen', 'day', 'plates', 'disposable', 'insecticide',
                    'college', 'university', 'admission', 'karachi', 'pakistan'
                ];
                if (noise.some(n => text.includes(n))) return false;

                const dupKey = (item.title + item.snippet).substring(0, 50);
                if (seen.has(dupKey)) return false;
                seen.add(dupKey);
                return true;
            }).map((item, index) => ({
                id: `live_${type}_${index}_${Date.now()}`,
                author: item.title.split('-')[0].split('|')[0].trim(),
                district: item.link.includes('facebook') ? "Facebook" : "Web Result",
                question: item.snippet,
                questionHindi: `[Live ${type}] ${item.snippet}`,
                isExternal: true,
                source: item.link.includes('facebook') ? "Facebook" :
                    item.link.includes('linkedin') ? "LinkedIn" : "Google Search",
                link: item.link,
                type: type, // 'requirements', 'farmers', 'news'
                timestamp: "Real-time",
                replies: [],
                likes: 0
            }));
        }

        return [];
    } catch (error) {
        console.error(`Error fetching ${type} leads:`, error);
        return [];
    }
};
