import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { useNavigate } from 'react-router-dom';
import getCommodityImage from '../utils/commodityImages';

const DeleteConfirmModal = ({ show, onConfirm, onCancel, productName }) => {
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
                    marginBottom: '0.5rem',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                }}>
                    क्या आप वाकई इसे हटाना चाहते हैं?
                </h3>
                <p style={{
                    color: '#333',
                    marginBottom: '1rem',
                    fontSize: '1.2rem'
                }}>
                    Do you really want to delete this?
                </p>

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
                        ❌ नहीं (No)
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
                        ✓ हाँ, हटाएं (Yes, Delete)
                    </button>
                </div>
            </div>
        </div>
    );
};

const MyProducts = () => {
    const { getUserListings, deleteListing } = useMarket();
    const navigate = useNavigate();
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });

    // Get current user's mobile number from localStorage
    const currentUserMobile = localStorage.getItem('kisan_user_mobile');

    if (!currentUserMobile) {
        return (
            <div className="container" style={{ padding: 'var(--spacing-xl) 0', textAlign: 'center' }}>
                <h2>Please sign in to view your products</h2>
                <p>कृपया अपने उत्पाद देखने के लिए साइन इन करें</p>
                <button
                    onClick={() => navigate('/sell')}
                    className="btn btn-primary"
                    style={{ marginTop: '1rem' }}
                >
                    Sign In (साइन इन करें)
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
                    My Products List
                    <br />
                    <span style={{ fontSize: '1.2rem', color: '#666' }}>मेरी पोस्ट की सूची</span>
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
                            आपने अभी तक कुछ पोस्ट नहीं किया है
                        </h3>
                        <p style={{ color: '#999', marginBottom: '2rem' }}>
                            You haven't posted anything yet
                        </p>
                        <button
                            onClick={() => navigate('/sell')}
                            className="btn btn-primary"
                            style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}
                        >
                            ➕ Post Your First Requirement (पहली पोस्ट करें)
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {userListings.map(listing => (
                            <div
                                key={listing.id}
                                className="card"
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'auto 1fr auto',
                                    gap: '1.5rem',
                                    alignItems: 'center',
                                    padding: '1.5rem'
                                }}
                            >
                                {/* Product Image Container */}
                                <div style={{
                                    width: '120px',
                                    height: '120px',
                                    minWidth: '120px', // Force width
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    background: '#f1f5f9', // Slightly different gray for better visibility
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    border: '1px solid #e2e8f0'
                                }}>
                                    {(() => {
                                        // Robust image selection logic
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
                                                    <div style={{ fontSize: '0.7rem', marginTop: '2px' }}>No Photo</div>
                                                </div>
                                            );
                                        }
                                    })()}
                                </div>

                                {/* Product Details */}
                                <div>
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
                                        {listing.type === 'Buy' ? '🔴 WANT TO BUY' : '🟢 WANT TO SELL'}
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
                                        gridTemplateColumns: 'repeat(2, 1fr)',
                                        gap: '0.5rem',
                                        fontSize: '0.95rem',
                                        color: '#666'
                                    }}>
                                        <div><strong>Quantity:</strong> {listing.quantity} {listing.unit}</div>
                                        <div><strong>Price:</strong> ₹{listing.targetPrice}/{listing.priceUnit}</div>
                                        <div><strong>Location:</strong> {listing.district}, {listing.state}</div>
                                        <div><strong>Quality:</strong> {listing.quality}</div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
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
                                            whiteSpace: 'nowrap'
                                        }}
                                        onMouseOver={(e) => e.target.style.backgroundColor = '#1B5E20'}
                                        onMouseOut={(e) => e.target.style.backgroundColor = '#2E7D32'}
                                    >
                                        ✏️ Edit Product
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
                                            whiteSpace: 'nowrap'
                                        }}
                                        onMouseOver={(e) => e.target.style.backgroundColor = '#B71C1C'}
                                        onMouseOut={(e) => e.target.style.backgroundColor = '#D32F2F'}
                                    >
                                        🗑️ Delete Product
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
