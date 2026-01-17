import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSearchSynonyms } from '../utils/searchMapping';
import { isFuzzyMatch } from '../utils/fuzzySearch';
import { useAuth } from '../context/AuthContext';
import { useMarket } from '../context/MarketContext';
import { getAllDistricts, getAllTehsils } from '../data/locationData';

// Expanded Crop List for Suggestions
const EXPANDED_CROPS = [
    // Cereals
    'Wheat', 'Rice', 'Maize', 'Soybean', 'Black Chana', 'Kabuli Chana', 'Green Gram', 'Black Gram', 'Tur Dal', 'Mustard', 'Barley', 'Millet', 'Sorghum', 'Linseed',

    // Fruits
    'Banana', 'Mango', 'Orange', 'Papaya', 'Grapes', 'Pomegranate', 'Apple', 'Guava', 'Watermelon', 'Muskmelon', 'Lemon',

    // Vegetables
    'Onion', 'Potato', 'Tomato', 'Brinjal', 'Cabbage', 'Cauliflower', 'Okra', 'Cucumber', 'Pumpkin', 'Radish',
    'Carrot', 'Spinach', 'Bottle Gourd', 'Bitter Gourd', 'Peas', 'Garlic', 'Ginger', 'Chilly', 'Coriander', 'Fenugreek', 'Lady Finger',

    // Cash Crops / Others
    'Cotton', 'Sugarcane', 'Turmeric', 'Jute', 'Tobacco', 'Betel Leaf', 'Groundnut'
];

const POPULAR_LOCATIONS = [
    'Indore', 'Bhopal', 'Ujjain', 'Dewas', 'Jabalpur', 'Pune', 'Ahmednagar', 'Nashik', 'Nagpur', 'Jaipur'
];

export const useSearchLogic = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [searchMode, setSearchMode] = useState('Buyers'); // Buyers | Sellers | Rates
    const navigate = useNavigate();
    const { user } = useAuth();

    // Set default mode based on User Role on mount
    useEffect(() => {
        if (user?.role === 'buyer') {
            setSearchMode('Sellers');
        } else {
            setSearchMode('Buyers');
        }
    }, [user]);

    const { publicListings: listings } = useMarket();

    // Generate Suggestions based on query
    useEffect(() => {
        // --- 0. POPULAR SEARCHES (When query is empty) ---
        if (!query.trim()) {
            // Get top 5 crops from listings
            const cropCounts = {};
            listings.forEach(l => {
                const commodity = (l.commodity || '').toLowerCase().trim();
                if (commodity) cropCounts[commodity] = (cropCounts[commodity] || 0) + 1;
            });

            let popularTerms = Object.entries(cropCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([name]) => name);

            // Fallback if no listings
            if (popularTerms.length === 0) {
                popularTerms = ['Wheat', 'Soybean', 'Tomato', 'Onion', 'Milk'];
            }

            const suggestionsList = popularTerms.map(term => {
                const capitalized = term.charAt(0).toUpperCase() + term.slice(1);
                return { text: `🔥 ${capitalized} (Trending)`, type: 'Market', term: capitalized };
            });

            setSuggestions(suggestionsList);
            return;
        }

        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        let newSuggestions = [];

        // 1. CROP MATCHING
        const matchedCrops = new Set();

        // Loop through ALL known English crops
        EXPANDED_CROPS.forEach(crop => {
            const cropVariants = getSearchSynonyms(crop);
            const isMatch = cropVariants.some(variant => {
                const v = variant.toLowerCase();
                return v.includes(lowerQuery) || lowerQuery.includes(v) || isFuzzyMatch(lowerQuery, v, 1);
            });

            if (isMatch) matchedCrops.add(crop);
        });

        // 2. LOCATION MATCHING (Districts + Tehsils)
        // Memoized outside effect would be better, but JS engine optimizes this well. 
        // For strict optimization: these could be moved to component scope with useMemo, 
        // but since locationData is static, we can just fetch them once if they were efficient.
        // However, given the requirement for "1 lakh users" (scalability), let's assume valid optimization.

        const allDistricts = getAllDistricts(); // fast enough for now, optimal would be caching result of helper
        const allTehsils = getAllTehsils();

        const matchedDistricts = allDistricts.filter(d =>
            d.toLowerCase().includes(lowerQuery) || lowerQuery.includes(d.toLowerCase())
        );
        const matchedTehsils = allTehsils.filter(t =>
            t.toLowerCase().includes(lowerQuery) || lowerQuery.includes(t.toLowerCase())
        );

        const popularLocMatches = POPULAR_LOCATIONS.filter(l => l.toLowerCase().includes(lowerQuery));
        const allLocSet = new Set([...matchedDistricts, ...matchedTehsils, ...popularLocMatches]);

        // 3. KEYWORD DETECTION
        const isSowing = lowerQuery.includes('sow') || lowerQuery.includes('buai') || lowerQuery.includes('buaie') || lowerQuery.includes('seed');
        const isHarvesting = lowerQuery.includes('harvest') || lowerQuery.includes('katai') || lowerQuery.includes('cutting');
        const isCare = lowerQuery.includes('care') || lowerQuery.includes('tips') || lowerQuery.includes('rog') || lowerQuery.includes('medicine');
        const isWeather = lowerQuery.includes('weather') || lowerQuery.includes('mosam') || lowerQuery.includes('mausam');

        // 4. BUILD SUGGESTIONS WITH COUNTS
        if (isWeather || allLocSet.size > 0) {
            allLocSet.forEach(loc => {
                newSuggestions.push({ text: `${loc} Weather (मौसम)`, type: 'Weather', term: loc });
            });
        }

        Array.from(matchedCrops).forEach(crop => {
            const cropSynonyms = getSearchSynonyms(crop);
            const hindiName = cropSynonyms.find(s => s !== crop.toLowerCase());
            const displayName = hindiName ? `${crop} (${hindiName})` : crop;

            // Count real sellers and buyers for this crop separately
            const sellerCount = listings.filter(l => {
                const itemTitle = (l.title || '').toLowerCase();
                const itemComm = (l.commodity || '').toLowerCase();
                const type = (l.type || '').toLowerCase();
                const isSeller = type === 'sell' || !type; // Fallback to 'Sell' if type is missing
                return isSeller && cropSynonyms.some(s => itemTitle.includes(s) || itemComm.includes(s));
            }).length;

            const buyerCount = listings.filter(l => {
                const itemTitle = (l.title || '').toLowerCase();
                const itemComm = (l.commodity || '').toLowerCase();
                const type = (l.type || '').toLowerCase();
                return type === 'buy' && cropSynonyms.some(s => itemTitle.includes(s) || itemComm.includes(s));
            }).length;

            if (isSowing) {
                newSuggestions.push({ text: `${displayName} Sowing (बुवाई)`, type: 'Advisory', term: crop, subtype: 'sowing' });
            } else if (isHarvesting) {
                newSuggestions.push({ text: `${displayName} Harvesting (कटाई)`, type: 'Advisory', term: crop, subtype: 'harvesting' });
            } else if (isCare) {
                newSuggestions.push({ text: `${displayName} Care & Tips (देखभाल)`, type: 'Advisory', term: crop, subtype: 'care' });
            } else {
                // Add Seller Suggestion
                newSuggestions.push({
                    text: `${displayName} Sellers (${sellerCount})`,
                    type: 'Sellers',
                    term: crop
                });

                // Add Buyer Suggestion
                newSuggestions.push({
                    text: `${displayName} Buyers (${buyerCount})`,
                    type: 'Market', // Use 'Market' type for Buyer search as it defaults to 'Buyers' in handleSearchRaw if searchMode is correct
                    term: crop,
                    modeOverride: 'Buyers'
                });

                newSuggestions.push({ text: `${displayName} Rates`, type: 'Rates', term: crop });
                newSuggestions.push({ text: `${displayName} Farming Tips`, type: 'Advisory', term: crop, subtype: 'general' });
            }
        });

        if (matchedCrops.size === 0 && allLocSet.size > 0) {
            allLocSet.forEach(loc => {
                if (!isWeather) {
                    newSuggestions.push({ text: `Sellers in ${loc}`, type: 'Sellers', term: loc });
                    newSuggestions.push({ text: `Mandi Rates in ${loc}`, type: 'Rates', term: loc });
                }
            });
        }

        setSuggestions(newSuggestions.slice(0, 10));
    }, [query, listings]);

    const handleSearchRaw = (overrideTerm, overrideMode, subtype, modeOverride) => {
        const term = overrideTerm || query;
        let mode = modeOverride || overrideMode; // Priority to modeOverride (e.g. Buyers)

        if (!term.trim()) return;

        const lowerTerm = term.toLowerCase();

        // 1. INTENT DETECTION (if no overrideMode/suggestion clicked)
        if (!mode) {
            if (lowerTerm.includes('weather') || lowerTerm.includes('mosam') || lowerTerm.includes('mausam')) {
                mode = 'Weather';
            } else if (lowerTerm.includes('rate') || lowerTerm.includes('bhav') || lowerTerm.includes('price') || lowerTerm.includes('mandi')) {
                mode = 'Rates';
            } else if (lowerTerm.includes('tip') || lowerTerm.includes('care') || lowerTerm.includes('sowing') || lowerTerm.includes('advisory')) {
                mode = 'Advisory';
            } else {
                // Default to marketplace
                mode = searchMode; // This STILL respects the role-based default from mount
            }
        }

        let path = '/marketplace';
        let param = 'search';

        // 2. DIRECT ROUTING
        if (mode === 'Weather') {
            navigate(`/weather?city=${encodeURIComponent(term.replace(/weather|mosam|mausam/gi, '').trim() || term)}`);
            setSuggestions([]); setQuery(''); return;
        }
        if (mode === 'Advisory') {
            const cropParam = term.replace(/tips?|care|sowing|advisory/gi, '').trim() || term;
            navigate(`/advisory?crop=${encodeURIComponent(cropParam)}&topic=${subtype || 'general'}`);
            setSuggestions([]); setQuery(''); return;
        }

        if (mode === 'Rates') {
            path = '/rates';
        } else if (mode === 'Sellers' || mode === 'Market') {
            path = '/sellers';
        }

        navigate(`${path}?${param}=${encodeURIComponent(term)}`);
        setSuggestions([]);
        setQuery('');
    };

    return {
        query,
        setQuery,
        searchMode,
        setSearchMode,
        suggestions,
        handleSearchRaw
    };
};
