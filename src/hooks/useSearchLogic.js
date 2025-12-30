import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSearchSynonyms } from '../utils/searchMapping';
import { useAuth } from '../context/AuthContext';
import { mpDistricts } from '../utils/mpDistricts'; // Import districts

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
    'Indore', 'Bhopal', 'Ujjain', 'Dewas', 'Jabalpur', 'Sehore', 'Khandwa', 'Ratlam', 'Mandsaur', 'Harda'
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

    // Generate Suggestions based on query
    useEffect(() => {
        if (!query || query.length < 2) {
            setSuggestions([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        let newSuggestions = [];

        // 1. CROP MATCHING
        const matchedCrops = new Set();

        // Loop through ALL known English crops
        EXPANDED_CROPS.forEach(crop => {
            // Get all names for this crop (e.g. Spinach -> [spinach, palak])
            const cropVariants = getSearchSynonyms(crop);

            // Check if user's query partial matches ANY of the crop names
            // e.g. query "pal" matches "palak" -> Match!
            const isMatch = cropVariants.some(variant =>
                variant.toLowerCase().includes(lowerQuery) || lowerQuery.includes(variant.toLowerCase())
            );

            if (isMatch) {
                matchedCrops.add(crop);
            }
        });

        // 2. LOCATION MATCHING (Districts)
        const matchedDistricts = mpDistricts.filter(d =>
            d.toLowerCase().includes(lowerQuery) || lowerQuery.includes(d.toLowerCase())
        );

        const popularLocMatches = POPULAR_LOCATIONS.filter(l =>
            l.toLowerCase().includes(lowerQuery)
        );

        // Merge locations unique
        const allLocSet = new Set([...matchedDistricts, ...popularLocMatches]);

        // 3. ADVISORY KEYWORD DETECTION
        const isSowing = lowerQuery.includes('sow') || lowerQuery.includes('buai') || lowerQuery.includes('buaie') || lowerQuery.includes('seed');
        const isHarvesting = lowerQuery.includes('harvest') || lowerQuery.includes('katai') || lowerQuery.includes('cutting');
        const isCare = lowerQuery.includes('care') || lowerQuery.includes('tips') || lowerQuery.includes('rog') || lowerQuery.includes('medicine');
        const isWeather = lowerQuery.includes('weather') || lowerQuery.includes('mosam') || lowerQuery.includes('mausam');

        // 4. BUILD SUGGESTIONS

        // A) Weather Suggestions
        if (isWeather || matchedDistricts.length > 0) {
            allLocSet.forEach(loc => {
                // If user typed 'bhopal', show 'Bhopal Weather'
                newSuggestions.push({ text: `${loc} Weather (मौसम)`, type: 'Weather', term: loc });
            });
        }

        // B) Crop Suggestions (Sellers, Buyers, Rates, Advisory)
        Array.from(matchedCrops).forEach(crop => {
            const cropSynonyms = getSearchSynonyms(crop);
            const hindiName = cropSynonyms.find(s => s !== crop.toLowerCase());
            const displayName = hindiName ? `${crop} (${hindiName})` : crop;

            // Advisory Specific
            if (isSowing) {
                newSuggestions.push({ text: `${displayName} Sowing (बुवाई)`, type: 'Advisory', term: crop, subtype: 'sowing' });
            }
            if (isHarvesting) {
                newSuggestions.push({ text: `${displayName} Harvesting (कटाई)`, type: 'Advisory', term: crop, subtype: 'harvesting' });
            }
            if (isCare) {
                newSuggestions.push({ text: `${displayName} Care & Tips (देखभाल)`, type: 'Advisory', term: crop, subtype: 'care' });
            }

            // General Trading
            if (!isSowing && !isHarvesting && !isCare && !isWeather) {
                newSuggestions.push({ text: `${displayName} Sellers`, type: 'Sellers', term: crop });
                newSuggestions.push({ text: `${displayName} Buyers`, type: 'Buyers', term: crop });
                newSuggestions.push({ text: `${displayName} Rates`, type: 'Rates', term: crop });

                // Also suggest generic advisory if just crop name
                newSuggestions.push({ text: `${displayName} Farming Tips`, type: 'Advisory', term: crop, subtype: 'general' });
            }
        });

        // C) General Location Trading (if no crop matched)
        if (matchedCrops.size === 0 && allLocSet.size > 0) {
            allLocSet.forEach(loc => {
                if (!isWeather) {
                    newSuggestions.push({ text: `Sellers in ${loc}`, type: 'Sellers', term: loc });
                    newSuggestions.push({ text: `Mandi Rates in ${loc}`, type: 'Rates', term: loc });
                }
            });
        }

        // Limit results
        setSuggestions(newSuggestions.slice(0, 10));

    }, [query]);

    const handleSearchRaw = (overrideTerm, overrideMode, subtype) => {
        const term = overrideTerm || query;
        const mode = overrideMode || searchMode; // Logic might need to respect the clicked item's type

        if (!term.trim()) return;

        let path = '/marketplace';
        let param = 'search';

        // Direct Routing based on Suggestion Type
        if (mode === 'Weather') {
            navigate(`/weather?city=${encodeURIComponent(term)}`);
            setSuggestions([]); setQuery(''); return;
        }
        if (mode === 'Advisory') {
            navigate(`/advisory?crop=${encodeURIComponent(term)}&topic=${subtype || 'general'}`);
            setSuggestions([]); setQuery(''); return;
        }
        if (mode === 'Sellers') {
            path = '/sellers'; // User requested this page exists or will exist. 
            // If /sellers doesn't exist, we might route to /marketplace with intent=sell
            // Assuming /sellers exists or mapping to SellerDirectory
            path = '/sellers';
            // Note: If no specific seller page, fallback to Directory
        } else if (mode === 'Rates') {
            path = '/rates';
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
