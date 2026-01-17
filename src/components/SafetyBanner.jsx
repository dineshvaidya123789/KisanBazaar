import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const SafetyBanner = () => {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div style={{
            backgroundColor: '#fff3cd',
            color: '#856404',
            padding: '8px 12px', // Reduced padding
            borderBottom: '1px solid #ffeeba',
            position: 'relative',
            fontSize: '0.85rem', // Slightly smaller text
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            lineHeight: '1.3'
        }}>
            <span style={{ fontSize: '1.1rem' }}>⚠️</span>

            <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                    {t('safety_tip') || 'Safety Tip'}:
                </span>
                <span style={{ whiteSpace: 'pre-line' }}>
                    {t('warning_no_advance') || 'Never pay any advance amount to sellers.\nAlways inspect the crop before buying.'}
                </span>
            </div>

            <button
                onClick={() => setIsVisible(false)}
                style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.2rem',
                    lineHeight: 1,
                    cursor: 'pointer',
                    color: '#856404',
                    padding: '0 4px',
                    marginLeft: '4px',
                    opacity: 0.6,
                    alignSelf: 'flex-start' // Align close button to top
                }}
                aria-label="Close"
            >
                ×
            </button>
        </div>
    );
};

export default SafetyBanner;
