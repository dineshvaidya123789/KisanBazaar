import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

const MarketContext = createContext();

export const useMarket = () => useContext(MarketContext);

export const MarketProvider = ({ children }) => {
    const { t } = useLanguage();
    // Initial Mock Data (used only if localStorage is empty)
    const initialMockData = [
        {
            id: 1,
            title: 'Fresh Tomato',
            title_hi: 'ताज़ा टमाटर',
            title_mr: 'ताजे टोमॅटो',
            commodity: 'tomato',
            type: 'Sell',
            category: 'Vegetables',
            price: '20',
            unit: 'kg',
            quantity: '500',
            location: 'Burhanpur',
            seller: 'Ramesh Kumar',
            contactMobile: '919876543210',
            image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=300&q=80',
            description: 'Desi tomato, fully organic.',
            description_hi: 'देसी टमाटर, पूरी तरह से जैविक।',
            description_mr: 'गावरान टोमॅटो, पूर्णपणे सेंद्रिय.'
        },
        {
            id: 2,
            title: 'Basmati Rice',
            title_hi: 'बासमती चावल',
            title_mr: 'बासमती तांदूळ',
            commodity: 'rice',
            type: 'Sell',
            category: 'Grains',
            price: '4500',
            unit: 'quintal',
            quantity: '10',
            location: 'Nepanagar',
            seller: 'Suresh Patel',
            contactMobile: '919876543211',
            image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80',
            description: 'High quality Basmati rice.',
            description_hi: 'उच्च गुणवत्ता वाला बासमती चावल।',
            description_mr: 'उच्च दर्जाचे बासमती तांदूळ.'
        },
        {
            id: 3,
            title: 'Banana',
            title_hi: 'केला',
            title_mr: 'केळी',
            commodity: 'banana',
            type: 'Sell',
            category: 'Fruits',
            price: '1500',
            unit: 'quintal',
            quantity: '50',
            location: 'Ambada',
            seller: 'Mukesh Bhai',
            contactMobile: '919876543212',
            image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=300&q=80',
            description: 'Sweet and fresh bananas.',
            description_hi: 'मिठास से भरपूर ताजे केले।',
            description_mr: 'गोड आणि ताजी केळी.'
        },
        {
            id: 4,
            title: 'Need Tomato',
            title_hi: 'टमाटर चाहिए',
            title_mr: 'टोमॅटो पाहिजे',
            commodity: 'tomato',
            type: 'Buy',
            category: 'Vegetables',
            price: '18',
            unit: 'kg',
            quantity: '200',
            location: 'Indore',
            seller: 'Rahul Singh',
            contactMobile: '919876543213',
            description: 'Looking for bulk tomatoes.',
            description_hi: 'थोक में टमाटर चाहिए।',
            description_mr: 'मोठ्या प्रमाणात टोमॅटो हवे आहेत.'
        },
        {
            id: 5,
            title: 'Sona Tomato Sellers',
            title_hi: 'सोना टमाटर',
            title_mr: 'सोना टोमॅटो',
            commodity: 'tomato',
            type: 'Sell',
            category: 'Vegetables',
            price: '22',
            unit: 'kg',
            quantity: '1000',
            location: 'Dhar',
            seller: 'Vikram Singh',
            contactMobile: '919876543214',
            description: 'High quality hybrid tomatoes.',
            description_hi: 'उच्च गुणवत्ता वाले हाइब्रिड टमाटर।',
            description_mr: 'उच्च दर्जाचे संकरित टोमॅटो.'
        },
        {
            id: 6,
            title: 'Premium Banana',
            title_hi: 'प्रीमियम केला',
            title_mr: 'प्रीमियम केळी',
            commodity: 'banana',
            type: 'Sell',
            category: 'Fruits',
            price: '1600',
            unit: 'quintal',
            quantity: '100',
            location: 'Buranpur',
            seller: 'Anil Gupta',
            contactMobile: '919876543215',
            description: 'Grade A bananas for export.',
            description_hi: 'निर्यात गुणवत्ता वाले ए-ग्रेड केले।',
            description_mr: 'निर्यात दर्जाची ए-ग्रेड केळी.'
        },
        {
            id: 7,
            title: 'Banana Buyer (bulk)',
            title_hi: 'केला खरीदार (थोक)',
            title_mr: 'केळी खरेदीदार (मोठ्या प्रमाणात)',
            commodity: 'banana',
            type: 'Buy',
            category: 'Fruits',
            price: '1400',
            unit: 'quintal',
            quantity: '500',
            location: 'Mumbai',
            seller: 'Fruit Co.',
            contactMobile: '919876543216',
            description: 'Buying bananas in bulk.',
            description_hi: 'थोक में केले खरीद रहे हैं।',
            description_mr: 'मोठ्या प्रमाणात केळी खरेदी करत आहे.'
        }
    ];

    // Initialize and Normalize State from LocalStorage or fallback to mock data
    const [listings, setListings] = useState(() => {
        try {
            const savedListings = localStorage.getItem('kisan_listings');
            const data = savedListings ? JSON.parse(savedListings) : initialMockData;

            // Defense: Handle null or non-array data
            if (!data || !Array.isArray(data)) {
                console.warn("MarketProvider: Data is not an array, falling back to mock data");
                return initialMockData;
            }

            // Normalize: Ensure all listings have 'images' array and other required fields
            const normalized = data.map(item => {
                // Feature: Enrich legacy data with new translations if ID matches mock data
                const mockMatch = initialMockData.find(m => m.id === item.id);
                const enrichedItem = mockMatch ? { ...item, ...mockMatch } : item;

                return {
                    ...enrichedItem,
                    images: Array.isArray(enrichedItem.images) ? enrichedItem.images : (enrichedItem.image ? [enrichedItem.image] : []),
                    title: enrichedItem.title || enrichedItem.commodity || 'Unknown Product',
                    location: enrichedItem.location || enrichedItem.district || 'Unknown Location'
                };
            });

            // Sort by ID descending (Latest on Top)
            const sorted = normalized.sort((a, b) => (b.id || 0) - (a.id || 0));
            return sorted;
        } catch (error) {
            console.error("Failed to load from local storage", error);
            return initialMockData;
        }
    });

    // Save to LocalStorage whenever listings change
    useEffect(() => {
        try {
            localStorage.setItem('kisan_listings', JSON.stringify(listings));
        } catch (error) {
            console.error("Failed to save to local storage", error);
        }
    }, [listings]);

    const addListing = (newListing) => {
        setListings(prev => [{
            id: Date.now(), // simple unique id
            ...newListing
        }, ...prev]);
    };

    const updateListing = (id, updatedData) => {
        setListings(prev => prev.map(listing =>
            listing.id === id ? { ...listing, ...updatedData } : listing
        ));
    };

    const deleteListing = (id) => {
        setListings(prev => prev.filter(listing => listing.id !== id));
    };

    const getUserListings = (mobileNumber) => {
        return listings.filter(listing => listing.contactMobile === mobileNumber);
    };

    // --- New Features for Seller Directory & Access Control ---
    const [isRestrictedMode, setIsRestrictedMode] = useState(false);

    const toggleRestriction = () => {
        setIsRestrictedMode(prev => !prev);
    };

    const getUniqueSellers = () => {
        const sellersMap = new Map();
        listings.forEach(item => {
            if (item.seller && !sellersMap.has(item.seller)) {
                sellersMap.set(item.seller, {
                    name: item.seller,
                    location: item.location || `${item.district || ''}, ${item.state || ''}`,
                    state: item.state || '',
                    district: item.district || '',
                    tehsil: item.tehsil || '',
                    products: [item.title || item.commodity],
                    contactMobile: item.contactMobile || '', // Include mobile number
                    rating: (Math.random() * 2 + 3).toFixed(1) // Mock rating 3.0-5.0
                });
            } else if (item.seller) {
                const existing = sellersMap.get(item.seller);
                if (!existing.products.includes(item.title || item.commodity)) {
                    existing.products.push(item.title || item.commodity);
                }
            }
        });
        return Array.from(sellersMap.values());
    };

    const checkListingEligibility = (mobile, commodity, editId = null) => {
        if (!listings || !Array.isArray(listings)) return { eligible: true };

        const userListings = listings.filter(l => l && l.contactMobile === mobile);

        // 1. Max 5 listings check
        const otherListings = editId ? userListings.filter(l => l.id !== editId) : userListings;
        if (otherListings.length >= 5) {
            return {
                eligible: false,
                reason: 'limit',
                message: t('limit_reached')
            };
        }

        // 2. Duplicate crop within 7 days check - ALLOW 2, BLOCK 3rd+
        if (!commodity || typeof commodity !== 'string') return { eligible: true };

        const normalizedCommodity = commodity.toLowerCase().trim();
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

        const duplicatesWithin7Days = otherListings.filter(l => {
            if (!l) return false;
            const lCommodity = (l.commodity || '').toLowerCase().trim();
            const lTimestamp = new Date(l.timestamp).getTime();
            return lCommodity === normalizedCommodity && lTimestamp > sevenDaysAgo;
        });

        if (duplicatesWithin7Days.length >= 2) {
            return {
                eligible: false,
                reason: 'duplicate',
                message: t('duplicate_limit')
            };
        }

        return { eligible: true };
    };

    // Deduplicated listings for public view (show only latest per user per crop)
    const publicListings = (() => {
        const seen = new Set();
        return listings.filter(l => {
            const mobile = l.contactMobile || 'unknown';
            const comm = (l.commodity || '').toLowerCase().trim();
            const type = (l.type || 'Sell').toLowerCase();
            const key = `${mobile}_${comm}_${type}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    })();

    const sellerListings = publicListings.filter(l => l.type === 'Sell');
    const buyerPosts = publicListings.filter(l => l.type === 'Buy');

    return (
        <MarketContext.Provider value={{
            listings,
            publicListings,
            sellerListings,
            buyerPosts,
            addListing,
            updateListing,
            deleteListing,
            getUserListings,
            isRestrictedMode,
            toggleRestriction,
            getUniqueSellers,
            checkListingEligibility
        }}>
            {children}
        </MarketContext.Provider>
    );
};
