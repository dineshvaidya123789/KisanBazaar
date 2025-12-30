import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useMarket } from '../context/MarketContext';
import { mpLocations } from '../data/mpData';
import getCommodityImage from '../utils/commodityImages';
import { getSearchSynonyms } from '../utils/searchMapping';

const ProductCard = ({ product }) => {
    // Handle both old format and new format
    const title = product.title || product.commodity || 'Unknown Product';
    const location = product.location || product.district || 'Unknown Location';
    const price = product.price || product.targetPrice || '0';
    const unit = product.unit || product.priceUnit || 'unit';
    const quantity = product.quantity || '0';
    const seller = product.seller || 'Unknown Seller';
    // Use uploaded images (new array), or fallback to old image, or show placeholder
    const hasImages = Array.isArray(product.images) && product.images.length > 0 && product.images[0];
    const hasOldImage = product.image && typeof product.image === 'string' && product.image.length > 5;
    const displayImages = hasImages ? product.images : (hasOldImage ? [product.image] : []);
    const mainImg = displayImages.length > 0 ? displayImages[0] : null;

    const description = product.description || product.comments || 'No description available';
    const category = product.category || 'Others';

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0', overflow: 'hidden' }}>
            <div style={{ height: '200px', backgroundColor: '#eee', position: 'relative' }}>
                {mainImg ? (
                    <>
                        <img
                            src={mainImg}
                            alt={title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {displayImages.length > 1 && (
                            <div style={{
                                position: 'absolute',
                                bottom: '10px',
                                right: '10px',
                                background: 'rgba(0,0,0,0.6)',
                                color: 'white',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                            }}>
                                +{displayImages.length - 1} Photos
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#94a3b8',
                        background: '#f8fafc',
                        borderBottom: '1px solid #eee'
                    }}>
                        <div style={{ fontSize: '3rem' }}>📦</div>
                        <div style={{ fontSize: '0.9rem', marginTop: '8px', fontWeight: '500' }}>No Photo Provided</div>
                    </div>
                )}

                {/* Type Badge */}
                <span style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    backgroundColor: product.type === 'Buy' ? '#D32F2F' : '#1E4A35',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                }}>
                    {product.type === 'Buy' ? 'WANT TO BUY' : 'FOR SALE'}
                </span>

                {/* Location Badge */}
                <span style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.8rem'
                }}>
                    {location}
                </span>
            </div>

            <div style={{ padding: 'var(--spacing-md)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{title}</h3>
                    <span style={{
                        backgroundColor: '#E8F5E9',
                        color: 'var(--color-primary-light)',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                    }}>
                        {category}
                    </span>
                </div>

                <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem', marginBottom: 'var(--spacing-md)', flex: 1 }}>
                    {description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                    <div>
                        <span style={{ display: 'block', fontSize: '0.8rem', color: '#888' }}>
                            {product.type === 'Buy' ? 'Target Price' : 'Price'}
                        </span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                            ₹{price}
                            <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 'normal' }}>/{unit}</span>
                        </span>
                    </div>
                    <div>
                        <span style={{ display: 'block', fontSize: '0.8rem', color: '#888' }}>Quantity</span>
                        <span style={{ fontWeight: '500' }}>{quantity} {unit}</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => alert(`Contacting ${seller}... \n(Feature coming soon)`)}>
                        {product.type === 'Buy' ? '📞 Call' : '📞 Contact'}
                    </button>
                    <a
                        href={`https://wa.me/919876543210?text=I am interested in your ${title} listing at KisanBazaar.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn"
                        style={{
                            flex: 1,
                            backgroundColor: '#25D366',
                            color: 'white',
                            borderColor: '#25D366',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textDecoration: 'none'
                        }}
                    >
                        💬 WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
};

const Buyer = () => {
    const { publicListings: listings } = useMarket();
    const [searchParams, setSearchParams] = useSearchParams();
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    // Enhanced Filter State
    const [selectedDistrict, setSelectedDistrict] = useState('All');
    const [selectedTehsil, setSelectedTehsil] = useState('All');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Sync state with URL search params if it changes from external search
    React.useEffect(() => {
        const query = searchParams.get('search');
        if (query !== null) {
            setSearchTerm(query);
        }
    }, [searchParams]);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchTerm(val);
    };

    // Smart Search Parsing
    const parsedSearch = React.useMemo(() => {
        if (!searchTerm) return { type: null, location: null, commodityTerms: [] };

        const lower = searchTerm.toLowerCase();
        let type = null;
        let location = null;

        // 1. Detect Type Intent
        if (lower.includes('buyer') || lower.includes('buy') || lower.includes('want')) type = 'Buy';
        else if (lower.includes('seller') || lower.includes('sell')) type = 'Sell';

        // 2. Detect Location (Basic logic: check against known districts/tehsils)
        // Flatten all known locations for checking
        const allLocations = [
            ...Object.keys(mpLocations),
            ...Object.values(mpLocations).flatMap(d => d.tehsil || [])
        ].map(l => l.toLowerCase());

        const words = lower.split(/\s+/);
        const commodityWords = [];

        words.forEach(word => {
            // Skip keywords we already handled or common particles
            if (['buyer', 'buyers', 'buying', 'seller', 'sellers', 'selling', 'in', 'at', 'near', 'want', 'buy', 'sell'].includes(word)) return;

            // Check if word is a location
            if (allLocations.some(loc => loc === word || word.includes(loc) || loc.includes(word))) {
                location = word;
            } else {
                commodityWords.push(word);
            }
        });

        return { type, location, commodityTerms: commodityWords };
    }, [searchTerm]);

    const filteredListings = listings.filter(item => {
        const matchesCategory = filter === 'All' || item.category === filter;

        // Price Filter - Robust parsing for currency/strings
        const cleanPrice = (val) => parseFloat(String(val || 0).replace(/[^\d.]/g, '')) || 0;
        const itemPrice = cleanPrice(item.price || item.targetPrice);
        const matchesMinPrice = minPrice === '' || itemPrice >= parseFloat(minPrice);
        const matchesMaxPrice = maxPrice === '' || itemPrice <= parseFloat(maxPrice);

        // Location Filter (Dropdown)
        const itemDistrict = (item.district || (item.location ? item.location.split(',').pop().trim() : '')).toLowerCase();
        const itemTehsil = (item.tehsil || (item.location ? item.location.split(',')[0].trim() : '')).toLowerCase();
        const itemLocationFull = (item.location || '').toLowerCase();

        const matchesDistrict = selectedDistrict === 'All' || itemDistrict.includes(selectedDistrict.toLowerCase());
        const matchesTehsil = selectedTehsil === 'All' || itemTehsil.includes(selectedTehsil.toLowerCase());

        // Smart Search Matching
        let matchesSearch = true;
        if (searchTerm) {
            // 1. Match Type if detected
            if (parsedSearch.type && item.type !== parsedSearch.type) {
                matchesSearch = false;
            }

            // 2. Match Location if detected in query (overrides dropdown if present in query)
            if (matchesSearch && parsedSearch.location) {
                const locMatch = itemDistrict.includes(parsedSearch.location) ||
                    itemTehsil.includes(parsedSearch.location) ||
                    itemLocationFull.includes(parsedSearch.location);
                if (!locMatch) matchesSearch = false;
            }

            // 3. Match Commodity/Title with remaining words
            if (matchesSearch && parsedSearch.commodityTerms.length > 0) {
                const query = parsedSearch.commodityTerms.join(' ');
                const searchSynonyms = getSearchSynonyms(query);

                const searchableTitle = (item.title || item.commodity || '').toLowerCase();
                const titleMatch = searchSynonyms.some(syn => searchableTitle.includes(syn));

                if (!titleMatch) matchesSearch = false;
            }
        }

        return matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice && matchesDistrict && matchesTehsil;
    });

    return (
        <div className="container fade-in" style={{ padding: 'var(--spacing-xl) 0' }}>

            {/* Header & Controls */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-lg)'
            }}>
                <div>
                    <h1 style={{ marginBottom: '8px' }}>फ़सल बाज़ार (Marketplace)</h1>
                    <p style={{ color: 'var(--color-text-light)' }}>
                        खरीदें और बेचें - सभी एक जगह पर<br />
                        (Buy & Sell - All in one place)
                    </p>
                </div>

                <Link to="/sell" className="btn btn-primary">
                    + पोस्ट करें (Post Buy/Sell)
                </Link>
            </div>

            {/* Main Search & Basic Category Filter */}
            <div style={{
                backgroundColor: 'white',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: 'var(--spacing-md)',
                display: 'flex',
                gap: 'var(--spacing-md)',
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
                <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Search crop name (e.g. Tamatar, Rice)..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {['All', 'Vegetables', 'Fruits', 'Grains', 'Others'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            style={{
                                padding: '0.5rem 1.2rem',
                                borderRadius: '25px',
                                border: '1px solid var(--color-primary)',
                                backgroundColor: filter === cat ? 'var(--color-primary)' : 'transparent',
                                color: filter === cat ? 'white' : 'var(--color-primary)',
                                fontWeight: '600',
                                whiteSpace: 'nowrap',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {cat === 'All' ? 'सभी (All)' : cat}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        backgroundColor: showFilters ? '#f0f0f0' : 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}
                >
                    {showFilters ? '🔼 Close' : '🔽 Filters'}
                </button>
            </div>

            {/* Advanced Filters (Location & Price) */}
            {showFilters && (
                <div className="advanced-filters" style={{
                    backgroundColor: '#f8fafc',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                    marginBottom: 'var(--spacing-lg)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.5rem',
                    border: '1px solid #e2e8f0',
                    animation: 'slideDown 0.3s ease-out'
                }}>
                    <style>{`
                        @keyframes slideDown {
                            from { opacity: 0; transform: translateY(-10px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                        @media (max-width: 600px) {
                            .advanced-filters {
                                grid-template-columns: 1fr !important;
                                padding: 1rem !important;
                            }
                        }
                    `}</style>

                    {/* District */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.85rem', color: '#64748b' }}>📍 District (जिला):</label>
                        <select
                            value={selectedDistrict}
                            onChange={(e) => {
                                setSelectedDistrict(e.target.value);
                                setSelectedTehsil('All');
                            }}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        >
                            <option value="All">All Districts</option>
                            {Object.keys(mpLocations).map(dist => (
                                <option key={dist} value={dist}>{mpLocations[dist].label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Tehsil */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.85rem', color: '#64748b' }}>🏘️ Tehsil (तहसील):</label>
                        <select
                            value={selectedTehsil}
                            onChange={(e) => setSelectedTehsil(e.target.value)}
                            disabled={selectedDistrict === 'All'}
                            style={{
                                width: '100%',
                                padding: '0.6rem',
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                backgroundColor: selectedDistrict === 'All' ? '#f1f5f9' : 'white'
                            }}
                        >
                            <option value="All">All Tehsils</option>
                            {currentTehsils.map(tehsil => (
                                <option key={tehsil} value={tehsil}>{tehsil}</option>
                            ))}
                        </select>
                    </div>

                    {/* Price Range */}
                    <div style={{ gridColumn: 'span 1' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.85rem', color: '#64748b' }}>💰 Price Range (₹):</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="number"
                                placeholder="Min"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            />
                            <span>-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            />
                        </div>
                    </div>

                    {/* Reset Filters */}
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button
                            onClick={() => {
                                setSelectedDistrict('All');
                                setSelectedTehsil('All');
                                setMinPrice('');
                                setMaxPrice('');
                                setSearchTerm('');
                            }}
                            style={{
                                width: '100%',
                                padding: '0.6rem 1rem',
                                borderRadius: '6px',
                                border: '1px solid #ef4444',
                                color: '#ef4444',
                                backgroundColor: 'transparent',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '0.85rem'
                            }}
                        >
                            🔄 Reset All
                        </button>
                    </div>
                </div>
            )}

            {/* Grid */}
            {filteredListings.length > 0 ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 'var(--spacing-lg)'
                }}>
                    {filteredListings.map(listing => (
                        <ProductCard key={listing.id} product={listing} />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: '#888' }}>
                    <h3>No posts found matching your criteria.</h3>
                </div>
            )}
        </div>
    );
};

export default Buyer;
