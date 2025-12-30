import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ConsentBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasConsented = localStorage.getItem('kb_privacy_consent');
        if (!hasConsented) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('kb_privacy_consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div
            className="fade-in"
            style={{
                position: 'fixed',
                bottom: '70px', // Above mobile nav
                left: '20px',
                right: '20px',
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                padding: '1.25rem',
                zIndex: 9999,
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                maxWidth: '500px',
                margin: '0 auto'
            }}
        >
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.5rem' }}>🍪</div>
                <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: 'var(--color-dark)' }}>
                        Privacy & Cookies (गोपनीयता और कुकीज़)
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: '1.4' }}>
                        We use cookies to improve your marketplace experience and send alerts.
                        By using Kisan Bazaar, you agree to our <Link to="/privacy" style={{ color: 'var(--color-primary)', fontWeight: 'bold', textDecoration: 'none' }}>Privacy Policy</Link>.
                    </p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
                <button
                    onClick={handleAccept}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem', borderRadius: '8px' }}
                >
                    Accept & Close (स्वीकार करें)
                </button>
                <Link
                    to="/privacy"
                    className="btn btn-outline"
                    style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem', borderRadius: '8px', textAlign: 'center', textDecoration: 'none' }}
                >
                    Learn More (अधिक जानें)
                </Link>
            </div>
        </div>
    );
};

export default ConsentBanner;
