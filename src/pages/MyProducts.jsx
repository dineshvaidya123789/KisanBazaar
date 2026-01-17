import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import getCommodityImage from '../utils/commodityImages';

const DeleteConfirmModal = ({ show, onConfirm, onCancel, productName }) => {
    const { t } = useLanguage();
    if (!show) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            zIndex: 3000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem'
        }}>
            <div className="card fade-in" style={{
                maxWidth: '450px',
                width: '100%',
                textAlign: 'center',
                padding: '2rem'
            }}>
                {/* Warning Icon */}
                <div style={{
                    width: '70px',
                    height: '70px',
                    margin: '0 auto 1.5rem',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #D32F2F 0%, #F44336 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                </div>

                {/* Confirmation Message */}
                <h3 style={{
                    color: '#333',
                    marginBottom: '1rem',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                }}>
                    {t('delete_confirm_title')}
                </h3>

                {productName && (
                    <p style={{
                        color: '#666',
                        fontSize: '0.95rem',
                        marginBottom: '1.5rem',
                        padding: '10px',
                        background: '#f9f9f9',
                        borderRadius: '4px'
                    }}>
                        <strong>{productName}</strong>
                    </p>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={onCancel}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            backgroundColor: '#f5f5f5',
                            color: '#666',
                            border: '2px solid #ddd',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#e0e0e0'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                    >
                        ❌ {t('delete_confirm_no')}
                    </button>

                    <button
                        onClick={onConfirm}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            backgroundColor: '#D32F2F',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#B71C1C'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#D32F2F'}
                    >
                        ✓ {t('delete_confirm_yes')}
                    </button>
                </div>
            </div>
        </div>
    );
};

const MyProducts = () => {
    const { getUserListings, deleteListing } = useMarket();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });

    // Get current user's mobile number from localStorage
    const currentUserMobile = localStorage.getItem('kisan_user_mobile');

    if (!currentUserMobile) {
        return (
            <div className="container" style={{ padding: 'var(--spacing-xl) 0', textAlign: 'center' }}>
                <h2>{t('please_sign_in')}</h2>
                <button
                    onClick={() => navigate('/sell')}
                    className="btn btn-primary"
                    style={{ marginTop: '1rem' }}
                >
                    {t('sign_in_btn')}
                </button>
            </div>
        );
    }

    const userListings = getUserListings(currentUserMobile);

    const handleEdit = (listing) => {
        // Store listing data for edit mode
        localStorage.setItem('edit_listing', JSON.stringify(listing));
        navigate('/sell');
    };

    const handleDeleteClick = (listing) => {
        setDeleteModal({
            show: true,
            id: listing.id,
            name: listing.commodity
        });
    };

    const confirmDelete = () => {
        deleteListing(deleteModal.id);
        setDeleteModal({ show: false, id: null, name: '' });
    };

    return (
        <>
            <div className="container" style={{ padding: 'var(--spacing-xl) 0' }}>
                <h1 style={{
                    marginBottom: 'var(--spacing-lg)',
                    borderBottom: '3px solid var(--color-primary)',
                    paddingBottom: '0.5rem',
                    color: 'var(--color-primary)'
                }}>
                    {t('my_products_list')}
                </h1>

                {userListings.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem 2rem',
                        background: '#f9f9f9',
                        borderRadius: '12px'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
                        <h3 style={{ color: '#666', marginBottom: '0.5rem' }}>
                            {t('no_posts_title')}
                        </h3>
                        <button
                            onClick={() => navigate('/sell')}
                            className="btn btn-primary"
                            style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}
                        >
                            ➕ {t('post_first_req')}
                        </button>
                    </div>
                ) : (
                    <div className="products-grid" style={{ display: 'grid', gap: '1.5rem' }}>
                        {userListings.map(listing => (
                            <div
                                key={listing.id}
                                className="card product-card"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: '1.5rem',
                                    alignItems: 'center',
                                    padding: '1.5rem',
                                    flexWrap: 'wrap' // Allow wrapping on small screens
                                }}
                            >
                                {/* Product Image Container */}
                                <div style={{
                                    width: '120px',
                                    height: '120px',
                                    minWidth: '120px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    background: '#f1f5f9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    border: '1px solid #e2e8f0'
                                }}>
                                    {(() => {
                                        const hasImagesArray = Array.isArray(listing.images) && listing.images.length > 0 && listing.images[0];
                                        const hasSingleImage = listing.image && typeof listing.image === 'string' && listing.image.length > 5;

                                        if (hasImagesArray) {
                                            return (
                                                <>
                                                    <img
                                                        src={listing.images[0]}
                                                        alt={listing.commodity}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                    {listing.images.length > 1 && (
                                                        <div style={{
                                                            position: 'absolute',
                                                            bottom: '5px',
                                                            right: '5px',
                                                            background: 'rgba(0,0,0,0.6)',
                                                            color: 'white',
                                                            padding: '2px 6px',
                                                            borderRadius: '4px',
                                                            fontSize: '0.7rem',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            +{listing.images.length - 1}
                                                        </div>
                                                    )}
                                                </>
                                            );
                                        } else if (hasSingleImage) {
                                            return (
                                                <img
                                                    src={listing.image}
                                                    alt={listing.commodity}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            );
                                        } else {
                                            return (
                                                <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                                                    <div style={{ fontSize: '2rem' }}>🖼️</div>
                                                    <div style={{ fontSize: '0.7rem', marginTop: '2px' }}>{t('no_photo')}</div>
                                                </div>
                                            );
                                        }
                                    })()}
                                </div>

                                {/* Product Details - flexible width */}
                                <div style={{ flex: '1 1 300px' }}>
                                    <div style={{
                                        display: 'inline-block',
                                        padding: '4px 12px',
                                        borderRadius: '4px',
                                        fontSize: '0.85rem',
                                        fontWeight: 'bold',
                                        marginBottom: '0.5rem',
                                        backgroundColor: listing.type === 'Buy' ? '#FFEBEE' : '#E8F5E9',
                                        color: listing.type === 'Buy' ? '#D32F2F' : '#2E7D32'
                                    }}>
                                        {listing.type === 'Buy' ? `🔴 ${t('want_to_buy')}` : `🟢 ${t('want_to_sell')}`}
                                    </div>

                                    <h3 style={{
                                        fontSize: '1.5rem',
                                        marginBottom: '0.5rem',
                                        color: '#333'
                                    }}>
                                        {listing.commodity}
                                    </h3>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', // Responsive grid
                                        gap: '0.5rem',
                                        fontSize: '0.95rem',
                                        color: '#666'
                                    }}>
                                        <div><strong>{t('quantity')}:</strong> {listing.quantity} {listing.unit}</div>
                                        <div><strong>{t('price')}:</strong> ₹{listing.targetPrice}/{listing.priceUnit}</div>
                                        <div><strong>{t('location')}:</strong> {listing.district}, {listing.state}</div>
                                        {listing.type === 'Sell' && <div><strong>{t('quality')}:</strong> {listing.quality}</div>}
                                    </div>
                                </div>

                                {/* Action Buttons - Stack on mobile */}
                                <div className="action-buttons" style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.8rem',
                                    flex: '1 1 100%', // Take full width on wrap
                                    marginTop: '1rem',
                                    '@media (min-width: 768px)': { // This won't work inline, need class or raw style logic
                                        flex: '0 0 auto',
                                        marginTop: 0
                                    }
                                }}>
                                    {/* Inline style hack for responsive flex-basis: using a class would be better but keeping it simple */}
                                    <style>{`
                                        @media (min-width: 768px) {
                                            .product-card { flex-wrap: nowrap !important; }
                                            .action-buttons { flex: 0 0 auto !important; margin-top: 0 !important; }
                                        }
                                    `}</style>
                                    <button
                                        onClick={() => handleEdit(listing)}
                                        style={{
                                            padding: '0.8rem 1.5rem',
                                            fontSize: '1rem',
                                            fontWeight: 'bold',
                                            backgroundColor: '#2E7D32',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                            whiteSpace: 'nowrap',
                                            width: '100%' // Full width on mobile
                                        }}
                                        onMouseOver={(e) => e.target.style.backgroundColor = '#1B5E20'}
                                        onMouseOut={(e) => e.target.style.backgroundColor = '#2E7D32'}
                                    >
                                        ✏️ {t('edit_product')}
                                    </button>

                                    <button
                                        onClick={() => handleDeleteClick(listing)}
                                        style={{
                                            padding: '0.8rem 1.5rem',
                                            fontSize: '1rem',
                                            fontWeight: 'bold',
                                            backgroundColor: '#D32F2F',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                            whiteSpace: 'nowrap',
                                            width: '100%' // Full width on mobile
                                        }}
                                        onMouseOver={(e) => e.target.style.backgroundColor = '#B71C1C'}
                                        onMouseOut={(e) => e.target.style.backgroundColor = '#D32F2F'}
                                    >
                                        🗑️ {t('delete_product')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <DeleteConfirmModal
                show={deleteModal.show}
                productName={deleteModal.name}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteModal({ show: false, id: null, name: '' })}
            />
        </>
    );
};

export default MyProducts;
