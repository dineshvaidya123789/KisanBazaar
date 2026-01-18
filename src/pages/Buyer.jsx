import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useMarket } from '../context/MarketContext';
import { useLanguage } from '../context/LanguageContext';
// mpData import removed
import getCommodityImage from '../utils/commodityImages';
import { getSearchSynonyms, commodityMapping } from '../utils/searchMapping';
import LocationSelector from '../components/LocationSelector';

const ProductCard = React.memo(({ product }) => {
    const { t, language } = useLanguage(); // Get language
    // Handle both old format and new format
    const title = product[`title_${language}`] || product[`title_${language === 'hi' ? 'hi' : 'en'}`] || product.title || product.commodity || 'Unknown Product';
    // Fallback logic: Try current language -> Try English (or default) -> fallback to title

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

    const description = product[`description_${language}`] || product.description || product.comments || 'No description available';
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
                            loading="lazy" /* Lazy load image */
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
                        <div style={{ fontSize: '0.9rem', marginTop: '8px', fontWeight: '500' }}>{t('no_photo')}</div>
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
                    {product.type === 'Buy' ? t('want_to_buy') : t('want_to_sell')}
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
                            {product.type === 'Buy' ? t('price') : t('price')}
                        </span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: product.type === 'Buy' ? '#D32F2F' : 'var(--color-primary)' }}>
                            ₹{price}
                            <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 'normal' }}>/{unit}</span>
                        </span>
                    </div>
                    <div>
                        <span style={{ display: 'block', fontSize: '0.8rem', color: '#888' }}>
                            {product.type === 'Buy' ? t('needed') : t('available')}
                        </span>
                        <span style={{ fontWeight: '500' }}>{quantity} {unit}</span>
                    </div>
                </div>

                {product.type === 'Sell' && product.quality && (
                    <div style={{ marginBottom: '12px', fontSize: '0.85rem', color: '#666', backgroundColor: '#f9f9f9', padding: '6px 10px', borderRadius: '4px', borderLeft: '3px solid #4CAF50' }}>
                        <strong>{t('quality')}:</strong> {product.quality}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '8px' }}>
                    <a
                        href={product.contactMobile ? `tel:${product.contactMobile}` : '#'}
                        className="btn btn-outline"
                        style={{
                            flex: 1,
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onClick={(e) => {
                            if (!product.contactMobile) {
                                e.preventDefault();
                                alert('Contact number not available for this listing.');
                            }
                        }}
                    >
                        📞 {t('call_now')}
                    </a>
                    <a
                        href={product.contactMobile ? `https://wa.me/${product.contactMobile}?text=Hi, I am interested in your ${title} listing on KisanBazaar.` : '#'}
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
                        onClick={(e) => {
                            if (!product.contactMobile) {
                                e.preventDefault();
                                alert('Contact number not available for this listing.');
                            }
                        }}
                    >
                        💬 {t('whatsapp')}
                    </a>
                </div>
            </div>
        </div>
    );
});

const Buyer = () => {
    const { buyerPosts, sellerListings } = useMarket();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('buy'); // 'buy' (I want to buy) or 'sell' (I want to sell)
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
    const [showFilters, setShowFilters] = useState(false);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Suggestions Logic
    const cropSuggestions = React.useMemo(() => {
        const unique = new Set([
            ...Object.keys(commodityMapping),
            ...Object.values(commodityMapping)
        ]);
        return Array.from(unique).sort();
    }, []);

    // Filter Logic
    const getFilteredItems = () => {
        // If activeTab is 'buy', show SELLER LISTINGS (what's available for sale)
        // If activeTab is 'sell', show BUYER POSTS (who wants to buy)
        const sourceData = activeTab === 'buy' ? sellerListings : buyerPosts;

        return sourceData.filter(item => {
            const prodSearchLower = searchTerm.toLowerCase();
            const prodSynonyms = getSearchSynonyms(prodSearchLower);

            const matchesSearch = !searchTerm ||
                item.commodity?.toLowerCase().includes(prodSearchLower) ||
                item.location?.toLowerCase().includes(prodSearchLower) ||
                item.title?.toLowerCase().includes(prodSearchLower) ||
                prodSynonyms.some(syn => item.commodity?.toLowerCase().includes(syn));

            const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory; // Assuming category exists
            // Simple price check if available (some might be market price)
            let itemPrice = parseFloat(item.price || item.expectedPrice || 0);
            const matchesPrice = itemPrice >= priceRange.min && itemPrice <= priceRange.max;

            return matchesSearch && matchesCategory && matchesPrice;
        });
    };

    const filteredItems = getFilteredItems();

    const categories = [
        { id: 'All', icon: '🌾', label: t('filter_all') },
        { id: 'Vegetables', icon: '🍅', label: t('filter_veg') },
        { id: 'Fruits', icon: '🥭', label: t('filter_fruits') },
        { id: 'Grains', icon: '🌾', label: t('filter_grains') }
    ];

    return (
        <div className="buyer-page fade-in" style={{ paddingBottom: '80px' }}>
            {/* Header Section */}
            <div className="page-header" style={{
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                color: 'white',
                padding: 'var(--spacing-xl) var(--spacing-md)',
                textAlign: 'center',
                borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
                marginBottom: 'var(--spacing-lg)',
                boxShadow: '0 4px 20px rgba(46, 125, 50, 0.2)'
            }}>
                <h1 style={{ marginBottom: '8px', fontSize: '2rem' }}>{t('marketplace_title')}</h1>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>
                    {t('buy_sell_hub')}
                </p>

                {/* Main Toggle Switch */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '2rem',
                    background: 'rgba(255, 255, 255, 0.15)',
                    padding: '6px',
                    borderRadius: 'var(--radius-xl)',
                    maxWidth: '400px',
                    margin: '2rem auto 0',
                    backdropFilter: 'blur(10px)'
                }}>
                    <button
                        onClick={() => setActiveTab('buy')}
                        style={{
                            flex: 1,
                            padding: '12px 24px',
                            borderRadius: 'var(--radius-lg)',
                            background: activeTab === 'buy' ? 'white' : 'transparent',
                            color: activeTab === 'buy' ? 'var(--color-primary)' : 'white',
                            border: 'none',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: activeTab === 'buy' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                        }}
                    >
                        <span style={{ fontSize: '1.2rem' }}>🛒</span> {t('i_want_buy')}
                    </button>
                    <button
                        onClick={() => setActiveTab('sell')}
                        style={{
                            flex: 1,
                            padding: '12px 24px',
                            borderRadius: 'var(--radius-lg)',
                            background: activeTab === 'sell' ? 'white' : 'transparent',
                            color: activeTab === 'sell' ? 'var(--color-secondary)' : 'white',
                            border: 'none',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: activeTab === 'sell' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                        }}
                    >
                        <span style={{ fontSize: '1.2rem' }}>🚜</span> {t('i_want_sell')}
                    </button>
                </div>
            </div>

            <div className="container">
                {/* Search & Filter Bar */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: 'var(--spacing-lg)',
                    position: 'sticky',
                    top: '80px', // Below header
                    zIndex: 10,
                    flexWrap: 'wrap'
                }}>
                    <div style={{
                        flex: 1,
                        position: 'relative',
                        minWidth: '280px'
                    }}>
                        <input
                            type="text"
                            list="marketplace-suggestions" /* Added suggestions */
                            placeholder={t('search_placeholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 3rem',
                                borderRadius: 'var(--radius-xl)',
                                border: '1px solid #e0e0e0',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                fontSize: '1rem'
                            }}
                        />
                        <datalist id="marketplace-suggestions">
                            {cropSuggestions.map((crop, index) => (
                                <option key={index} value={crop} />
                            ))}
                        </datalist>
                        <span style={{
                            position: 'absolute',
                            left: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            fontSize: '1.2rem',
                            color: '#666'
                        }}>🔍</span>
                    </div>

                    <button
                        className="btn"
                        onClick={() => setShowFilters(!showFilters)}
                        style={{
                            background: showFilters ? 'var(--color-primary)' : 'white',
                            color: showFilters ? 'white' : 'var(--color-primary)',
                            border: '1px solid var(--color-primary)',
                            borderRadius: 'var(--radius-xl)',
                            padding: '0 1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: '600'
                        }}
                    >
                        <span>⚙️</span> {t('filters')}
                    </button>
                </div>

                {/* Expanded Filters */}
                {showFilters && (
                    <div className="fade-in" style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-lg)',
                        marginBottom: 'var(--spacing-lg)',
                        boxShadow: 'var(--shadow-md)',
                        border: '1px solid #eee'
                    }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#666' }}>{t('category')}</label>
                            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '20px',
                                            border: `1px solid ${selectedCategory === cat.id ? 'var(--color-primary)' : '#ddd'}`,
                                            background: selectedCategory === cat.id ? '#e8f5e9' : 'white',
                                            color: selectedCategory === cat.id ? 'var(--color-primary)' : '#666',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {cat.icon} {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#666' }}>{t('price_range')}</label>
                            <input
                                type="range"
                                min="0"
                                max="100000"
                                step="1000"
                                style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.9rem', color: '#666' }}>
                                <span>₹0</span>
                                <span>₹1,00,000+</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Listings Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 'var(--spacing-lg)'
                }}>
                    {filteredItems.length === 0 ? (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem 2rem', color: '#666' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>🍃</div>
                            <h3>{t('no_posts_found')}</h3>
                            <p>{t('try_adjusting_filters')}</p>
                        </div>
                    ) : (
                        filteredItems.map(item => (
                            <ProductCard key={item.id} product={item} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Buyer;
