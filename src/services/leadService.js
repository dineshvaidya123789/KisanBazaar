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
        "Pomegranate Grapes Mango export requirement Maharashtra",
        "pulses trader contact requirement MP Maharashtra",
        "fruit exporter requirement Mumbai Nashik",
        "buy bulk Tuur dal Chana dal procurement India"
    ],
    farmers: [
        "Tuur dal stock available for sale MP Maharashtra",
        "fresh Grapes Pomegranate for sale Maharashtra",
        "Moong Chana pulses stock for sale Madhya Pradesh",
        "Ratnagiri Mango production for sale Maharashtra",
        "bulk fruits pulses stock available India"
    ],
    news: [
        "pulses mandi price trend India 2025",
        "fruit export policy Maharashtra 2025",
        "mandi rates Chana Tuur MP today",
        "government procurement pulses 2025",
        "horticulture news Maharashtra 2025"
    ]
};

const CROP_KEYWORDS = [
    'tuur', 'chana', 'moong', 'pulses', 'pomegranate', 'grapes', 'mango',
    'soybean', 'wheat', 'dal', 'corn', 'maize', 'banana', 'fruits',
    'grain', 'anar', 'kismis', 'orange', 'santra', 'arhar', 'urad', 'masoor'
];

const PERSONA_KEYWORDS = [
    'buyer', 'seller', 'exporter', 'trader', 'procurement', 'wanted',
    'available', 'stock', 'requirement', 'purchase', 'contact', 'wholesale'
];

export const fetchLiveLeads = async (type = 'requirements') => {
    if (!SERPER_API_KEY) {
        // ... (keep fallback logic for demo)
    }

    const queries = CATEGORIES[type] || CATEGORIES.requirements;
    const query = queries[Math.floor(Math.random() * queries.length)];

    // Loosened filters to allow more candidates through to the manual vetting layer
    let finalQuery = query;
    if (type === 'requirements' || type === 'farmers') {
        finalQuery += " -travel -mess -college -admission -exam -plates -disposable";
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
                autocorrect: true,
                tbs: "qdr:w",
                num: 40 // Fetch more to allow for stricter filtering
            }),
        });

        const data = await response.json();

        if (data.organic && data.organic.length > 0) {
            const seen = new Set();
            return data.organic.filter(item => {
                const text = (item.title + " " + item.snippet).toLowerCase();

                // MANDATORY AGRI VALIDATION: Result must mention a crop/agri term
                const hasAgriTerm = CROP_KEYWORDS.some(k => text.includes(k));

                // MANDATORY PERSONA VALIDATION: Result must mention a buyer/seller/exporter/trader
                const hasPersonaTerm = PERSONA_KEYWORDS.some(k => text.includes(k));

                // Strict rule for transactional leads: both must match
                if (type !== 'news') {
                    if (!hasAgriTerm || !hasPersonaTerm) return false;
                }

                // Noise keywords to kill again at post-fetch
                const noise = ['disposable', 'plate', 'insecticide', 'college', 'university', 'admission', 'course', 'travel', 'mess'];
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
