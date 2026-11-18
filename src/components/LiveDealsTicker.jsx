import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useLanguage } from '../context/LanguageContext';

const LiveDealsTicker = () => {
    const { t, language } = useLanguage();
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Only real listings are shown. (An earlier version padded the ticker with made-up deals such as
    // "Ramesh (Satara) sold 50kg Onion"; removed 2026-11-19 so no invented activity is shown.)
    useEffect(() => {
        const fetchDeals = async () => {
            try {
                // Fetch recent 5 real listings
                const q = query(
                    collection(db, 'listings'),
                    orderBy('timestamp', 'desc'),
                    limit(5)
                );

                const snapshot = await getDocs(q);
                const realDeals = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const action = data.type === 'Sell' ? 'sold' : 'wants';
                    const crop = data.commodity || data.title;
                    const qty = data.quantity ? `${data.quantity} ${data.unit}` : '';
                    const loc = data.location || data.district || '';
                    const name = data.seller ? data.seller.split(' ')[0] : 'Farmer';

                    return {
                        id: doc.id,
                        isReal: true,
                        // Construct dynamic messages based on available data
                        text_en: `${name} (${loc}) ${data.type === 'Sell' ? 'listed' : 'wants'} ${qty} ${crop}`,
                        text_hi: `${name} (${loc}) ने ${qty} ${crop} ${data.type === 'Sell' ? 'पोस्ट किया' : 'की मांग की'}`,
                        text_mr: `${name} (${loc}) यांनी ${qty} ${crop} ${data.type === 'Sell' ? 'पोस्ट केले' : 'मागणी केली'}`,
                        type: data.type === 'Sell' ? 'sell' : 'buy'
                    };
                });

                setDeals(realDeals);
            } catch (error) {
                console.error("Error fetching ticker deals:", error);
                setDeals([]); // nothing real to show: the ticker hides itself
            } finally {
                setLoading(false);
            }
        };

        fetchDeals();
    }, []);

    if (loading || deals.length === 0) return null;

    return (
        <div className="ticker-container" style={{
            background: '#fff',
            borderBottom: '1px solid #e2e8f0',
            overflow: 'hidden',
            padding: '8px 0',
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
        }}>
            <div className="ticker-label" style={{
                background: '#22c55e',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                marginLeft: '10px',
                zIndex: 2,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                whiteSpace: 'nowrap'
            }}>
                {t('live_updates') || 'LIVE'}
            </div>

            <div className="ticker-track">
                {/* Double the content for seamless infinite scroll */}
                {[...deals, ...deals].map((deal, idx) => (
                    <div key={`${deal.id}-${idx}`} className="ticker-item" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        margin: '0 15px',
                        padding: '4px 12px',
                        background: deal.type === 'sell' ? '#ecfdf5' : '#fff7ed', // Green tint for sell, Orange for buy
                        border: `1px solid ${deal.type === 'sell' ? '#a7f3d0' : '#fed7aa'}`,
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        whiteSpace: 'nowrap',
                        color: '#334155'
                    }}>
                        <span style={{ marginRight: '6px' }}>{deal.type === 'sell' ? '🟢' : '🟠'}</span>
                        <span style={{ fontWeight: '600' }}>
                            {language === 'hi' ? deal.text_hi : language === 'mr' ? deal.text_mr : deal.text_en}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LiveDealsTicker;
