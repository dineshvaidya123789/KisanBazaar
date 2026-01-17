import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useMarket } from '../context/MarketContext';
import { getTehsils } from '../data/locationData';
import { getSearchSynonyms, commodityMapping } from '../utils/searchMapping';
import { useLanguage } from '../context/LanguageContext';
import BackToHomeButton from '../components/BackToHomeButton';

const TradeArea = () => {
    const { getUniqueSellers, isRestrictedMode, toggleRestriction } = useMarket();
    const { t } = useLanguage();

    // FIXED LOCATION FOR TRADE AREA
    const FIXED_STATE = "Maharashtra";
    const FIXED_DISTRICT = "Satara";

    // GENERATE DATA (Similar to SellerDirectory but filtered for Satara)
    const [allSellers] = useState(() => {
        const baseSellers = getUniqueSellers();
        const mockCrops = ['Wheat', 'Rice', 'Sugarcane', 'Cotton', 'Tomato', 'Onion', 'Soybean', 'Maize', 'Turmeric', 'Gram', 'Ginger', 'Bajra'];
        const tehsils = getTehsils(FIXED_STATE, FIXED_DISTRICT);

        let largeList = [];

        // Generate 50 mock sellers for Satara
        for (let i = 0; i < 50; i++) {
            const base = baseSellers.length > 0 ? baseSellers[i % baseSellers.length] : { name: 'Seller' };
            const randomCrop = mockCrops[Math.floor(Math.random() * mockCrops.length)];
            const randomCrop2 = mockCrops[Math.floor(Math.random() * mockCrops.length)];
            const products = [randomCrop, randomCrop2 !== randomCrop ? randomCrop2 : null].filter(Boolean);

            const randomTehsil = tehsils.length > 0 ? tehsils[Math.floor(Math.random() * tehsils.length)] : 'Satara City';

            largeList.push({
                ...base,
                id: `trade-area-seller-${i}`,
                name: `${base.name || 'Farmer'} (Satara ${i + 1})`,
                contactMobile: '9123456789',
                products: products,
                state: FIXED_STATE,
                district: FIXED_DISTRICT,
                tehsil: randomTehsil,
                location: `${randomTehsil}, ${FIXED_DISTRICT}, ${FIXED_STATE}`,
                isMock: true
            });
        }
        return largeList;
    });

    const [selectedTehsil, setSelectedTehsil] = useState('');
    const [productSearch, setProductSearch] = useState('');
    const [visibleCount, setVisibleCount] = useState(9);

    // Filter Logic
    const filteredSellers = useMemo(() => {
        return allSellers.filter(seller => {
            const matchTehsil = !selectedTehsil || seller.tehsil === selectedTehsil;

            const prodSearchLower = productSearch.toLowerCase();
            const prodSynonyms = getSearchSynonyms(prodSearchLower);
            const matchProduct = !productSearch ||
                seller.products.some(p => {
                    const pLower = p.toLowerCase();
                    return prodSynonyms.some(syn => pLower.includes(syn));
                });

            return matchTehsil && matchProduct;
        });
    }, [selectedTehsil, allSellers, productSearch]);

    const displayedSellers = filteredSellers.slice(0, visibleCount);
    const sataraTehsils = useMemo(() => getTehsils(FIXED_STATE, FIXED_DISTRICT), []);

    const cropSuggestions = useMemo(() => {
        const unique = new Set([
            ...Object.keys(commodityMapping),
            ...Object.values(commodityMapping)
        ]);
        return Array.from(unique).sort();
    }, []);

    return (
        <div className="container fade-in" style={{ padding: 'var(--spacing-xl) 0' }}>
            <BackToHomeButton compact />

            <div style={{ marginBottom: '2rem', marginTop: '1rem' }}>
                <h1 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>{t('trade_area_title')}</h1>
                <p style={{ color: '#666', fontSize: '1.1rem' }}>{t('trade_area_desc')}</p>
            </div>

            {/* FILTERS */}
            <div className="card" style={{ padding: '1.5rem', backgroundColor: '#e3f2fd', border: '1px solid #bbdefb', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>

                    {/* Tehsil Selector */}
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#1565c0' }}>
                            📍 Filter by Tehsil (Satara):
                        </label>
                        <select
                            value={selectedTehsil}
                            onChange={(e) => setSelectedTehsil(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #aaa', fontSize: '1rem' }}
                        >
                            <option value="">All Tehsils</option>
                            {sataraTehsils.map((t, i) => (
                                <option key={i} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    {/* Product Search */}
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#1565c0' }}>
                            🌾 {t('product_label')}:
                        </label>
                        <input
                            type="text"
                            list="crop-suggestions"
                            placeholder="e.g. Tomato, Wheat..."
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #aaa', fontSize: '1rem' }}
                        />
                        <datalist id="crop-suggestions">
                            {cropSuggestions.map((crop, index) => (
                                <option key={index} value={crop} />
                            ))}
                        </datalist>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div style={{ marginBottom: '1rem', color: '#666' }}>
                {t('found_sellers')}: <strong>{filteredSellers.length}</strong>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {displayedSellers.map((seller) => (
                    <div key={seller.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{
                            backgroundColor: '#e3f2fd',
                            padding: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            borderBottom: '1px solid #bbdefb'
                        }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                backgroundColor: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                color: '#1565c0',
                                fontWeight: 'bold'
                            }}>
                                {seller.name.charAt(0)}
                            </div>
                            <div>
                                <h3 style={{ margin: 0, color: '#0d47a1' }}>{seller.name}</h3>
                                <div style={{ fontSize: '0.9rem', color: '#555' }}>
                                    📍 {seller.tehsil}, Satara
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>{t('deals_in')}:</strong>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                    {seller.products.map((prod, i) => (
                                        <span key={i} style={{
                                            backgroundColor: '#bbdefb',
                                            color: '#0d47a1',
                                            padding: '2px 8px',
                                            borderRadius: '10px',
                                            fontSize: '0.8rem'
                                        }}>
                                            {prod}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => alert('Call feature simulated')}>📞 {t('call_now')}</button>
                                <button className="btn" style={{ flex: 1, backgroundColor: '#25D366', color: 'white', border: 'none' }} onClick={() => window.open('https://wa.me/919123456789', '_blank')}>💬 {t('whatsapp')}</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {displayedSellers.length < filteredSellers.length && (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button onClick={() => setVisibleCount(p => p + 9)} className="btn btn-outline">Load More</button>
                </div>
            )}
        </div>
    );
};

export default TradeArea;
