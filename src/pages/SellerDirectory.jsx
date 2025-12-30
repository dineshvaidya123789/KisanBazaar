import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useMarket } from '../context/MarketContext';
import { mpLocations } from '../data/mpData';
import { getSearchSynonyms } from '../utils/searchMapping';

const SellerDirectory = () => {
    const { getUniqueSellers, isRestrictedMode, toggleRestriction } = useMarket();

    // SCALABILITY: Generate large mock dataset with structure: District -> Tehsil
    const [allSellers] = useState(() => {
        const baseSellers = getUniqueSellers();
        let largeList = [];
        const districts = Object.keys(mpLocations);

        // Generate 500 sellers with specific locations
        for (let i = 0; i < 500; i++) {
            const base = baseSellers[i % baseSellers.length];

            // 1. Pick Random District
            const randomDistrict = districts[Math.floor(Math.random() * districts.length)];

            // 2. Pick Random Tehsil from that District
            // FIX: Access .tehsils property from the new data structure
            const tehsilsList = mpLocations[randomDistrict]?.tehsils || [];
            const randomTehsil = tehsilsList.length > 0
                ? tehsilsList[Math.floor(Math.random() * tehsilsList.length)]
                : 'Main City';

            largeList.push({
                ...base,
                id: `seller-${i}`,
                name: `${base.name} ${i + 1}`,
                district: randomDistrict,
                tehsil: randomTehsil,
                location: `${randomTehsil}, ${randomDistrict}` // Display format
            });
        }
        return largeList;
    });

    const [searchParams] = useSearchParams();
    const globalSearch = searchParams.get('search')?.toLowerCase() || '';

    const [selectedDistrict, setSelectedDistrict] = useState('All');
    const [selectedTehsil, setSelectedTehsil] = useState('All');
    const [productSearch, setProductSearch] = useState('');
    const [visibleCount, setVisibleCount] = useState(9);

    // Dynamic Tehsils based on selected District
    // FIX: Access .tehsils property
    const currentTehsils = selectedDistrict !== 'All' ? mpLocations[selectedDistrict]?.tehsils || [] : [];

    // Filter Logic
    const filteredSellers = useMemo(() => {
        return allSellers.filter(seller => {
            const matchDistrict = selectedDistrict === 'All' || seller.district === selectedDistrict;
            const matchTehsil = selectedTehsil === 'All' || seller.tehsil === selectedTehsil;

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

            return matchDistrict && matchTehsil && matchGlobalSearch && matchProduct;
        });
    }, [selectedDistrict, selectedTehsil, allSellers, globalSearch, productSearch]);

    const displayedSellers = filteredSellers.slice(0, visibleCount);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 9);
    };

    return (
        <div className="container fade-in" style={{ padding: 'var(--spacing-xl) 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ margin: 0 }}>Verified Sellers (सत्यापित विक्रेता)</h1>
                        <p style={{ color: '#666' }}>Find buyers & sellers in your district.</p>
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
                            🌾 Product (फसल):
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Tomato, Wheat..."
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #aaa', fontSize: '1rem' }}
                        />
                    </div>

                    {/* District Dropdown */}
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#2e7d32' }}>
                            📍 District (जिला):
                        </label>
                        <select
                            value={selectedDistrict}
                            onChange={(e) => {
                                setSelectedDistrict(e.target.value);
                                setSelectedTehsil('All'); // Reset Tehsil when District changes
                                setVisibleCount(9);
                            }}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #aaa', fontSize: '1rem' }}
                        >
                            <option value="All">All Districts</option>
                            {Object.keys(mpLocations).map((dist) => (
                                <option key={dist} value={dist}>{mpLocations[dist].label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Tehsil Dropdown (Conditional) */}
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#2e7d32' }}>
                            🏘️ Tehsil (तहसील):
                        </label>
                        <select
                            value={selectedTehsil}
                            onChange={(e) => {
                                setSelectedTehsil(e.target.value);
                                setVisibleCount(9);
                            }}
                            disabled={selectedDistrict === 'All'} // Disabled until District is chosen
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid #aaa',
                                fontSize: '1rem',
                                backgroundColor: selectedDistrict === 'All' ? '#eee' : 'white',
                                cursor: selectedDistrict === 'All' ? 'not-allowed' : 'pointer'
                            }}
                        >
                            <option value="All">All Tehsils</option>
                            {currentTehsils.map((tehsil) => (
                                <option key={tehsil} value={tehsil}>{tehsil}</option>
                            ))}
                        </select>
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
                    Found <strong>{filteredSellers.length}</strong> sellers
                    {selectedDistrict !== 'All' && ` in ${selectedDistrict}`}
                    {selectedTehsil !== 'All' && ` -> ${selectedTehsil}`}
                </span>
                {filteredSellers.length > 0 && (
                    <button
                        onClick={() => {
                            setSelectedDistrict('All');
                            setSelectedTehsil('All');
                            setProductSearch('');
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
                    >
                        Reset Filters
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
                                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>Deals In:</strong>
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
                                    🔒 <strong>Contact Hidden</strong>
                                    <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem' }}>Upgrade to Premium to view contact details.</p>
                                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '10px', fontSize: '0.8rem', padding: '5px' }}>
                                        Unlock Access
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button className="btn btn-outline" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                        📞 Call Now
                                    </button>
                                    <button className="btn" style={{
                                        flex: 1,
                                        backgroundColor: '#25D366',
                                        color: 'white',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '5px'
                                    }}>
                                        💬 WhatsApp
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {filteredSellers.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#666' }}>
                        <h3>No sellers found in this area.</h3>
                        <p>Try changing the Tehsil or District.</p>
                        {selectedDistrict === 'All' && <Link to="/sell" className="btn btn-primary">Start Selling</Link>}
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
                        Load More Sellers (⬇️)
                    </button>
                    <p style={{ marginTop: '0.5rem', color: '#999', fontSize: '0.8rem' }}>
                        Showing {displayedSellers.length} of {filteredSellers.length}
                    </p>
                </div>
            )}
        </div>
    );
};

export default SellerDirectory;
