import React, { createContext, useState, useContext, useEffect } from 'react';

const MarketContext = createContext();

export const useMarket = () => useContext(MarketContext);

export const MarketProvider = ({ children }) => {
    // Initial Mock Data (used only if localStorage is empty)
    const initialMockData = [
        {
            id: 1,
            title: 'ताज़ा टमाटर (Fresh Tomato)',
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
            description: 'देसी टमाटर, पूरी तरह से जैविक।'
        },
        {
            id: 2,
            title: 'बासमती चावल (Basmati Rice)',
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
            description: 'उच्च गुणवत्ता वाला बासमती चावल।'
        },
        {
            id: 3,
            title: 'केला (Banana)',
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
            description: 'मिठास से भरपूर ताजे केले।'
        },
        {
            id: 4,
            title: 'टमाटर चाहिए (Need Tomato)',
            commodity: 'tomato',
            type: 'Buy',
            category: 'Vegetables',
            price: '18',
            unit: 'kg',
            quantity: '200',
            location: 'Indore',
            seller: 'Rahul Singh',
            contactMobile: '919876543213',
            description: 'Looking for bulk tomatoes.'
        },
        {
            id: 5,
            title: 'Sona Tomato Sellers',
            commodity: 'tomato',
            type: 'Sell',
            category: 'Vegetables',
            price: '22',
            unit: 'kg',
            quantity: '1000',
            location: 'Dhar',
            seller: 'Vikram Singh',
            contactMobile: '919876543214',
            description: 'High quality hybrid tomatoes.'
        },
        {
            id: 6,
            title: 'Premium Kela (Banana)',
            commodity: 'banana',
            type: 'Sell',
            category: 'Fruits',
            price: '1600',
            unit: 'quintal',
            quantity: '100',
            location: 'Buranpur',
            seller: 'Anil Gupta',
            contactMobile: '919876543215',
            description: 'Grade A bananas for export.'
        },
        {
            id: 7,
            title: 'Banana Buyer (bulk)',
            commodity: 'banana',
            type: 'Buy',
            category: 'Fruits',
            price: '1400',
            unit: 'quintal',
            quantity: '500',
            location: 'Mumbai',
            seller: 'Fruit Co.',
            contactMobile: '919876543216',
            description: 'Buying bananas in bulk.'
        }
    ];

    // Initialize and Normalize State from LocalStorage or fallback to mock data
    const [listings, setListings] = useState(() => {
        try {
            const savedListings = localStorage.getItem('kisan_listings');
            const data = savedListings ? JSON.parse(savedListings) : initialMockData;

            // Normalize: Ensure all listings have 'images' array and other required fields
            const normalized = data.map(item => ({
                ...item,
                images: Array.isArray(item.images) ? item.images : (item.image ? [item.image] : []),
                title: item.title || item.commodity || 'Unknown Product',
                location: item.location || item.district || 'Unknown Location'
            }));

            // Sort by ID descending (Latest on Top)
            return normalized.sort((a, b) => (b.id || 0) - (a.id || 0));
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
                    location: item.location || item.district || 'Unknown',
                    products: [item.title || item.commodity],
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
        const userListings = listings.filter(l => l.contactMobile === mobile);

        // 1. Max 5 listings check
        const otherListings = editId ? userListings.filter(l => l.id !== editId) : userListings;
        if (otherListings.length >= 5) {
            return {
                eligible: false,
                reason: 'limit',
                message: 'You have reached the limit of 5 listings. Please contact admin for more. (आप 5 लिस्टिंग की सीमा तक पहुँच गए हैं। अधिक के लिए व्यवस्थापक से संपर्क करें।)'
            };
        }

        // 2. Duplicate crop within 7 days check - ALLOW 2, BLOCK 3rd+
        const normalizedCommodity = commodity.toLowerCase().trim();
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

        const duplicatesWithin7Days = otherListings.filter(l => {
            const lCommodity = (l.commodity || '').toLowerCase().trim();
            const lTimestamp = new Date(l.timestamp).getTime();
            return lCommodity === normalizedCommodity && lTimestamp > sevenDaysAgo;
        });

        if (duplicatesWithin7Days.length >= 2) {
            return {
                eligible: false,
                reason: 'duplicate',
                message: 'You can only post the same crop twice in 7 days. (आप 7 दिनों में एक ही फसल केवल दो बार पोस्ट कर सकते हैं।)'
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

    return (
        <MarketContext.Provider value={{
            listings,
            publicListings,
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
