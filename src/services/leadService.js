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
        "Wanted Agri BUYER \"Tuur\" OR \"Chana\" OR \"Moong\" India",
        "Requirement Pomegranate OR Grapes OR Mango \"Exporter\" Maharashtra",
        "Agri TRADER contact \"Pulses\" OR \"Grains\" MP Maharashtra",
        "wanted buy bulk \"Tuur dal\" OR \"Chana dal\" India",
        "wanted Soybean \"procurement\" buyer India MP"
    ],
    farmers: [
        "Tuur dal stock \"available for sale\" MP Maharashtra",
        "fresh \"Grapes\" OR \"Pomegranate\" sale Maharashtra facebook",
        "Moong Chana pulses stock \"sale\" Madhya Pradesh",
        "Ratnagiri \"Mango\" for sale Maharashtra",
        "bulk fruits pulses \"stock available\" MP MS"
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
    'grain', 'anar', 'kismis', 'orange', 'santra', 'arhar'
];

export const fetchLiveLeads = async (type = 'requirements') => {
    if (!SERPER_API_KEY) {
        // ... (keep fallback logic for demo)
    }

    const queries = CATEGORIES[type] || CATEGORIES.requirements;
    const query = queries[Math.floor(Math.random() * queries.length)];

    // Aggressive negative filters for total noise removal
    let finalQuery = query;
    if (type === 'requirements' || type === 'farmers') {
        finalQuery += " -plates -disposable -insecticides -pesticides -colleges -MBA -courses -exam -admission -travel -mess -Innovation -Menstrual -Pakistan -Jobs -Careers";
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
                if (!hasAgriTerm && type !== 'news') return false;

                // Noise keywords to kill again at post-fetch
                const noise = ['disposable', 'plate', 'insecticide', 'college', 'university', 'admission', 'course'];
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
