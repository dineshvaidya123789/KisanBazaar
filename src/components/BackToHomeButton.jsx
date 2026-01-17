import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const BackToHomeButton = ({ style = {}, compact = false }) => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    if (compact) {
        // Compact version for top of page
        return (
            <div style={{
                textAlign: 'right',
                marginBottom: '1rem',
                ...style
            }}>
                <button
                    onClick={() => navigate('/')}
                    className="btn btn-outline"
                    style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.9rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    {t('back_to_home')}
                </button>
            </div>
        );
    }

    // Full version for bottom of page
    return (
        <div style={{
            textAlign: 'center',
            padding: '2rem 1rem',
            marginTop: '2rem',
            borderTop: '1px solid #e2e8f0',
            ...style
        }}>
            <button
                onClick={() => navigate('/')}
                className="btn btn-primary"
                style={{
                    padding: '0.75rem 2rem',
                    fontSize: '1rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                {t('back_to_home')}
            </button>
        </div>
    );
};

export default BackToHomeButton;
