import React from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessModal = ({ show, onClose, type = 'Sell' }) => {
    const navigate = useNavigate();

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
                    Post Created Successfully!
                </h2>
                <p style={{
                    color: '#2E7D32',
                    marginBottom: '0.5rem',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                }}>
                    पोस्ट सफलतापूर्वक बनाई गई!
                </p>

                <p style={{
                    color: '#666',
                    fontSize: '1rem',
                    marginBottom: '2rem',
                    lineHeight: '1.6'
                }}>
                    Your post has been successfully submitted. It will be live on the platform shortly.
                    <br />
                    आपकी पोस्ट सफलतापूर्वक सबमिट हो गई है। यह जल्द ही प्लेटफॉर्म पर लाइव होगी।
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
                        📋 View My Listings (मेरी पोस्ट देखें)
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
                        🏠 Return to Home (होम पर जाएं)
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
