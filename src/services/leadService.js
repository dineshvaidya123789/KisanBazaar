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
        "wanted buy maize tons India MP",
        "soybean purchase requirement Maharashtra contact",
        "bulk onion buyers Mumbai Maharashtra",
        "wheat procurement requirement 2025 India",
        "whatsapp group requirement buy maize India"
    ],
    farmers: [
        "available maize for sale Burhanpur MP farmer",
        "onion stock available for sale Maharashtra facebook",
        "soybean harvest sale Madhya Pradesh farmers",
        "I want to sell wheat contact Maharashtra",
        "banana production for sale Burhanpur MP facebook"
    ],
    news: [
        "agriculture export policy India 2025",
        "mandi rates today Madhya Pradesh",
        "onion price trend Maharashtra",
        "government procurement update India",
        "new agricultural schemes Maharashtra 2025"
    ]
};

export const fetchLiveLeads = async (type = 'requirements') => {
    if (!SERPER_API_KEY) {
        // ... (keep fallback logic for demo)
    }

    const queries = CATEGORIES[type] || CATEGORIES.requirements;
    const query = queries[Math.floor(Math.random() * queries.length)];

    // Add strict negative filters to eliminate news, corporate noise, and jobs
    let finalQuery = query;
    if (type === 'requirements') {
        finalQuery += " -news -government -policy -approves -pdf -SEBI -regulation -results -standalone -unaudited -jobs -vacancies -careers -recruitment -mandi -rates -prices";
    } else if (type === 'farmers') {
        finalQuery += " -news -government -policy -approves -jobs -pdf -mandi -rates";
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
                tbs: "qdr:w", // Always past week
                num: 30 // Fetch more results for better filtering
            }),
        });

        const data = await response.json();

        if (data.organic && data.organic.length > 0) {
            // Deduplicate by title or snippet to remove redundant results
            const seen = new Set();
            return data.organic.filter(item => {
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
