import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useMarket } from '../context/MarketContext';
import { locationData, getStates, getDistricts, getTehsils } from '../data/locationData';
import { getSearchSynonyms, commodityMapping } from '../utils/searchMapping';
import LocationSelector from '../components/LocationSelector';
import { useLanguage } from '../context/LanguageContext';
import BackToHomeButton from '../components/BackToHomeButton';

const SellerDirectory = () => {
    const { getUniqueSellers, isRestrictedMode, toggleRestriction } = useMarket();
    const { t } = useLanguage();

    // SCALABILITY: Generate large mock dataset with structure: State -> District -> Tehsil
    const [allSellers] = useState(() => {
        const baseSellers = getUniqueSellers();
        let largeList = [...baseSellers.map(s => ({
            ...s,
            id: s.contactMobile || s.name, // Ensure unique ID for real sellers
            // If location is partial, try to keep it, else fallback
            location: s.location.includes(',') ? s.location : `${s.district || 'Unknown'}, ${s.state || 'Unknown'}`
        }))];

        const states = getStates();
        const mockCrops = ['Wheat', 'Rice', 'Sugarcane', 'Cotton', 'Tomato', 'Onion', 'Soybean', 'Maize', 'Turmeric', 'Gram', 'Ginger', 'Bajra'];

        // Generate mock sellers to fill up to 500
        for (let i = 0; i < 500; i++) {
            // Use a mock base if we have no real sellers, or cycle through them
            const base = baseSellers.length > 0 ? baseSellers[i % baseSellers.length] : { name: 'Seller' };

            // Random Crop for better search testing
            const randomCrop = mockCrops[Math.floor(Math.random() * mockCrops.length)];
            const randomCrop2 = mockCrops[Math.floor(Math.random() * mockCrops.length)];
            const products = base.products ? base.products : [randomCrop, randomCrop2 !== randomCrop ? randomCrop2 : null].filter(Boolean);

            // 1. Pick Random State
            const randomState = states[Math.floor(Math.random() * states.length)];

            // 2. Pick Random District
            const districts = getDistricts(randomState);
            const randomDistrict = districts.length > 0 ? districts[Math.floor(Math.random() * districts.length)] : 'Unknown';

            // 3. Pick Random Tehsil
            const tehsils = getTehsils(randomState, randomDistrict);
            const randomTehsil = tehsils.length > 0
                ? tehsils[Math.floor(Math.random() * tehsils.length)]
                : 'Main City';

            largeList.push({
                ...base,
                id: `mock-seller-${i}`,
                name: `${base.name || 'Farmer'} (Mock ${i + 1})`, // Distinct name
                contactMobile: '9123456789', // Dummy number for testing actions
                products: products,
                state: randomState,
                district: randomDistrict,
                tehsil: randomTehsil,
                location: `${randomTehsil}, ${randomDistrict}, ${randomState}`, // Display format
                isMock: true
            });
        }
        return largeList;
    });

    const [searchParams] = useSearchParams();
    const globalSearch = searchParams.get('search')?.toLowerCase() || '';

    const [selectedState, setSelectedState] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedTehsil, setSelectedTehsil] = useState('');
    const [productSearch, setProductSearch] = useState('');
    const [visibleCount, setVisibleCount] = useState(9);

    // Filter Logic
    const filteredSellers = useMemo(() => {
        return allSellers.filter(seller => {
            const matchState = !selectedState || seller.state === selectedState;
            const matchDistrict = !selectedDistrict || seller.district === selectedDistrict;
            const matchTehsil = !selectedTehsil || seller.tehsil === selectedTehsil;

            const prodSearchLower = productSearch.toLowerCase();
            const prodSynonyms = getSearchSynonyms(prodSearchLower);
            const matchProduct = !productSearch ||
                seller.products.some(p => {
                    const pLower = p.toLowerCase();
                    return prodSynonyms.some(syn => pLower.includes(syn));
                });

            const globalSearchLower = globalSearch.toLowerCase();
            const globalSynonyms = getSearchSynonyms(globalSearchLower);
            const matchGlobalSearch = !globalSearch ||
                seller.name.toLowerCase().includes(globalSearchLower) ||
                seller.location.toLowerCase().includes(globalSearchLower) ||
                seller.products.some(p => {
                    const pLower = p.toLowerCase();
                    return globalSynonyms.some(syn => pLower.includes(syn));
                });

            return matchState && matchDistrict && matchTehsil && matchGlobalSearch && matchProduct;
        });
    }, [selectedState, selectedDistrict, selectedTehsil, allSellers, globalSearch, productSearch]);

    const displayedSellers = filteredSellers.slice(0, visibleCount);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 9);
    };

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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ margin: 0 }}>{t('verified_sellers')}</h1>
                        <p style={{ color: '#666' }}>{t('find_sellers_desc')}</p>
                    </div>

                    {/* Admin Toggle */}
                    <div style={{
                        backgroundColor: '#f5f5f5',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px dashed #ccc',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>👑 Admin:</span>
                        <button
                            onClick={toggleRestriction}
                            style={{
                                backgroundColor: isRestrictedMode ? '#e53935' : '#43a047',
                                color: 'white',
                                border: 'none',
                                padding: '5px 15px',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                fontSize: '0.8rem'
                            }}
                        >
                            {isRestrictedMode ? 'Restricted ON' : 'Free Access ON'}
                        </button>
                    </div>
                </div>

                {/* FILTERS CONTAINER */}
                <div className="card" style={{ padding: '1.5rem', backgroundColor: '#e8f5e9', border: '1px solid #c8e6c9', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>

                    {/* Product Search */}
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#2e7d32' }}>
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

                    {/* Location Selector */}
                    <div style={{ flex: 2, minWidth: '300px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#2e7d32' }}>
                            📍 {t('location')}:
                        </label>
                        <LocationSelector
                            selectedState={selectedState}
                            selectedDistrict={selectedDistrict}
                            selectedTehsil={selectedTehsil}
                            onLocationChange={(loc) => {
                                setSelectedState(loc.state);
                                setSelectedDistrict(loc.district);
                                setSelectedTehsil(loc.tehsil);
                                setVisibleCount(9); // Reset view on location change
                            }}
                            showTehsil={true}
                            vertical={false}
                        />
                    </div>
                </div>
            </div>

            {/* Results Info */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                flexWrap: 'wrap',
                gap: '10px'
            }}>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>
                    {t('found_sellers')}: <strong>{filteredSellers.length}</strong>
                    {selectedDistrict && ` (${selectedDistrict})`}
                    {selectedTehsil && ` -> ${selectedTehsil}`}
                </span>
                {filteredSellers.length > 0 && (
                    <button
                        onClick={() => {
                            setSelectedState('');
                            setSelectedDistrict('');
                            setSelectedTehsil('');
                            setProductSearch('');
                        }}
                        style={{
                            background: 'white',
                            border: '1px solid var(--color-primary)',
                            color: 'var(--color-primary)',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            padding: '6px 16px',
                            borderRadius: '20px',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = 'var(--color-primary)';
                            e.target.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = 'white';
                            e.target.style.color = 'var(--color-primary)';
                        }}
                    >
                        🔄 {t('reset_filters')}
                    </button>
                )}
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {displayedSellers.map((seller, index) => (
                    <div key={seller.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{
                            backgroundColor: 'var(--color-primary-light)',
                            padding: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                backgroundColor: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem',
                                color: 'var(--color-primary)',
                                fontWeight: 'bold'
                            }}>
                                {seller.name.charAt(0)}
                            </div>
                            <div>
                                <h3 style={{ margin: 0, color: 'var(--color-surface)' }}>{seller.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem' }}>
                                    <span>📍 {seller.location}</span>
                                </div>
                                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', marginTop: '2px' }}>
                                    ⭐ {seller.rating} Rating
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>{t('deals_in')}:</strong>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                    {seller.products.map((prod, i) => (
                                        <span key={i} style={{
                                            backgroundColor: '#f0f4c3',
                                            color: '#558b2f',
                                            padding: '2px 8px',
                                            borderRadius: '10px',
                                            fontSize: '0.8rem'
                                        }}>
                                            {prod}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '1rem 0' }} />

                            {isRestrictedMode ? (
                                <div style={{
                                    backgroundColor: '#fff3cd',
                                    border: '1px solid #ffeeba',
                                    color: '#856404',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    textAlign: 'center',
                                    fontSize: '0.9rem'
                                }}>
                                    🔒 <strong>{t('contact_hidden')}</strong>
                                    <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem' }}>{t('upgrade_premium')}</p>
                                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '10px', fontSize: '0.8rem', padding: '5px' }}>
                                        {t('unlock_access')}
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <a
                                        href={seller.contactMobile ? `tel:${seller.contactMobile}` : '#'}
                                        className="btn btn-outline"
                                        style={{
                                            flex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '5px',
                                            textDecoration: 'none'
                                        }}
                                        onClick={(e) => {
                                            if (!seller.contactMobile) {
                                                e.preventDefault();
                                                alert('Contact number hidden or not available.');
                                            }
                                        }}
                                    >
                                        📞 {t('call_now')}
                                    </a>
                                    <a
                                        href={seller.contactMobile ? `https://wa.me/${seller.contactMobile}?text=Hi ${seller.name}, I found your profile on KisanBazaar.` : '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn"
                                        style={{
                                            flex: 1,
                                            backgroundColor: '#25D366',
                                            color: 'white',
                                            border: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '5px',
                                            textDecoration: 'none'
                                        }}
                                        onClick={(e) => {
                                            if (!seller.contactMobile) {
                                                e.preventDefault();
                                                alert('Contact number hidden or not available.');
                                            }
                                        }}
                                    >
                                        💬 {t('whatsapp')}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {filteredSellers.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#666' }}>
                        <h3>{t('no_sellers_found')}</h3>
                        <p>{t('try_changing_location')}</p>
                        {selectedDistrict === 'All' && <Link to="/sell" className="btn btn-primary">{t('list_product')}</Link>}
                    </div>
                )}
            </div>

            {/* LOAD MORE BUTTON */}
            {displayedSellers.length < filteredSellers.length && (
                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <button
                        onClick={handleLoadMore}
                        className="btn btn-outline"
                        style={{ padding: '0.8rem 3rem', fontSize: '1.1rem' }}
                    >
                        {t('load_more_sellers')} (⬇️)
                    </button>
                    <p style={{ marginTop: '0.5rem', color: '#999', fontSize: '0.8rem' }}>
                        {t('showing_sellers_count')} {displayedSellers.length} / {filteredSellers.length}
                    </p>
                </div>
            )}

            <div style={{ marginTop: '2rem' }}>
                <BackToHomeButton />
            </div>
        </div>
    );
};

export default SellerDirectory;
