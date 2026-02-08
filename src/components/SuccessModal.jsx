import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const SuccessModal = ({ show, onClose, type = 'Sell', listingDetails }) => {
    const navigate = useNavigate();
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
            padding: '1rem',
            animation: 'fadeIn 0.3s ease-in'
        }}>
            <div className="card fade-in" style={{
                maxWidth: '500px',
                width: '100%',
                textAlign: 'center',
                padding: '2.5rem 2rem',
                position: 'relative'
            }}>
                {/* Success Icon */}
                <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 1.5rem',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'scaleIn 0.5s ease-out'
                }}>
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>

                {/* Success Message */}
                <h2 style={{
                    color: '#2E7D32',
                    marginBottom: '0.5rem',
                    fontSize: '1.8rem',
                    fontWeight: 'bold'
                }}>
                    {t('success_title')}
                </h2>

                <p style={{
                    color: '#666',
                    fontSize: '1rem',
                    marginBottom: '2rem',
                    lineHeight: '1.6'
                }}>
                    {t('success_msg')}
                </p>

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button
                        onClick={() => {
                            onClose();
                            navigate('/my-products');
                        }}
                        style={{
                            padding: '1rem 1.5rem',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            backgroundColor: '#2E7D32',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#1B5E20'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#2E7D32'}
                    >
                        {t('view_my_listings')}
                    </button>

                    {/* Share on WhatsApp Button */}
                    <button
                        onClick={() => {
                            // Construct share message
                            const shareText = `Check out this listing on Kisan Bazaar!\n\nI am selling: ${listingDetails?.commodity || 'Crops'} (${listingDetails?.quantity || ''} ${listingDetails?.unit || ''})\nPrice: ₹${listingDetails?.price || 'Best Market Price'}\nLocation: ${listingDetails?.district || ''}, ${listingDetails?.state || ''}\n\nCall me: ${localStorage.getItem('kisan_user_mobile') || ''}\n\nDownload App: https://kisanbazaar.app`;

                            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
                            window.open(whatsappUrl, '_blank');
                        }}
                        style={{
                            padding: '1rem 1.5rem',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            backgroundColor: '#25D366', // WhatsApp Green
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.3s',
                            boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#128C7E'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#25D366'}
                    >
                        <span style={{ fontSize: '1.4rem' }}>📱</span>
                        {t('share_whatsapp') || 'Share on WhatsApp'}
                    </button>

                    <button
                        onClick={() => {
                            onClose();
                            navigate('/');
                        }}
                        style={{
                            padding: '1rem 1.5rem',
                            fontSize: '1rem',
                            fontWeight: '500',
                            backgroundColor: 'white',
                            color: '#2E7D32',
                            border: '2px solid #2E7D32',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#f1f8f4';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = 'white';
                        }}
                    >
                        {t('return_home')}
                    </button>
                </div>

                <style>{`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes scaleIn {
                        from { transform: scale(0); }
                        to { transform: scale(1); }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default SuccessModal;
