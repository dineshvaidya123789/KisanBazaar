import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, updateDoc, doc } from 'firebase/firestore';

const MarketContext = createContext();

export const useMarket = () => useContext(MarketContext);

export const MarketProvider = ({ children }) => {
    const { t } = useLanguage();
    // Initial Mock Data (Fallback)
    const initialMockData = [
        {
            id: 'mock-1',
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
            description_mr: 'गावरान टोमॅटो, पूर्णपणे सेंद्रिय.',
            timestamp: Date.now()
        },
        {
            id: 'mock-2',
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
            description_mr: 'उच्च दर्जाचे बासमती तांदूळ.',
            timestamp: Date.now()
        },
        {
            id: 'mock-3',
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
            description_mr: 'गोड आणि ताजी केळी.',
            timestamp: Date.now()
        },
        {
            id: 'mock-4',
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
            description_mr: 'मोठ्या प्रमाणात टोमॅटो हवे आहेत.',
            timestamp: Date.now()
        }
    ];

    const [listings, setListings] = useState([]);
    const [buyerRequests, setBuyerRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- Firebase Integration ---
    useEffect(() => {
        const q = query(collection(db, 'listings'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const firebaseData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // If DB is empty, show mock data (UI only, don't write to DB to save quota)
            if (firebaseData.length === 0) {
                setListings(initialMockData);
            } else {
                setListings(firebaseData);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching listings:", error);
            // Fallback to mock data on error (e.g. offline/permission)
            setListings(initialMockData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // --- Fetch Buyer Requests ---
    useEffect(() => {
        const q = query(collection(db, 'buyerRequests'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const requests = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setBuyerRequests(requests);
        }, (error) => {
            console.error("Error fetching buyer requests:", error);
        });
        return () => unsubscribe();
    }, []);

    const addListing = async (newListing) => {
        try {
            const docRef = await addDoc(collection(db, 'listings'), {
                ...newListing,
                timestamp: Date.now()
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
            alert("Error saving listing. Please check your connection.");
        }
    };

    const addBuyerRequest = async (request) => {
        try {
            await addDoc(collection(db, 'buyerRequests'), {
                ...request,
                timestamp: Date.now()
            });
        } catch (e) {
            console.error("Error adding buyer request: ", e);
            throw e;
        }
    };

    const updateListing = async (id, updatedData) => {
        // If it's a mock item (string ID starting with 'mock-'), don't try to update DB
        if (typeof id === 'string' && id.startsWith('mock-')) return;

        try {
            const listingRef = doc(db, 'listings', id);
            await updateDoc(listingRef, updatedData);
        } catch (e) {
            console.error("Error updating document: ", e);
        }
    };

    const deleteListing = async (id) => {
        // If it's a mock item, just filter it out locally (or ignore)
        if (typeof id === 'string' && id.startsWith('mock-')) {
            setListings(prev => prev.filter(l => l.id !== id));
            return;
        }

        try {
            await deleteDoc(doc(db, 'listings', id));
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
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
            const lTimestamp = new Date(l.timestamp || l.id).getTime(); // Handle both timestamp formats
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
            checkListingEligibility,
            buyerRequests,
            addBuyerRequest,
            loading
        }}>
            {children}
        </MarketContext.Provider>
    );
};
