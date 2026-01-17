import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const PrivacyPolicy = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sectionStyle = {
        marginBottom: '2rem',
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid #f1f5f9'
    };

    const h2Style = {
        color: 'var(--color-primary)',
        fontSize: '1.25rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    };

    return (
        <div style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'var(--font-family-base)', lineHeight: '1.6' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--color-dark)', marginBottom: '0.5rem' }}>{t('privacy_title')}</h1>
                <p style={{ color: '#64748b' }}>{t('privacy_last_updated')} {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </div>

            <div style={sectionStyle}>
                <h2 style={h2Style}><span>🛡️</span> {t('privacy_intro_title')}</h2>
                <p>{t('privacy_intro_desc')}</p>
            </div>

            <div style={sectionStyle}>
                <h2 style={h2Style}><span>📊</span> {t('privacy_data_title')}</h2>
                <ul style={{ paddingLeft: '1.2rem' }}>
                    <li>{t('privacy_data_basic')}</li>
                    <li>{t('privacy_data_usage')}</li>
                    <li>{t('privacy_data_communication')}</li>
                </ul>
            </div>

            <div style={sectionStyle}>
                <h2 style={h2Style}><span>⚙️</span> {t('privacy_use_title')}</h2>
                <p>{t('privacy_use_intro')}</p>
                <ul style={{ paddingLeft: '1.2rem' }}>
                    <li>{t('privacy_use_listings')}</li>
                    <li>{t('privacy_use_alerts')}</li>
                    <li>{t('privacy_use_improve')}</li>
                </ul>
            </div>

            <div style={sectionStyle}>
                <h2 style={h2Style}><span>🤝</span> {t('privacy_sharing_title')}</h2>
                <p>{t('privacy_sharing_desc')}</p>
            </div>

            <div style={sectionStyle}>
                <h2 style={h2Style}><span>✅</span> {t('privacy_rights_title')}</h2>
                <ul style={{ paddingLeft: '1.2rem' }}>
                    <li>{t('privacy_rights_access')}</li>
                    <li>{t('privacy_rights_erasure')}</li>
                    <li>{t('privacy_rights_correction')}</li>
                </ul>
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem', borderTop: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>{t('privacy_contact')}</p>
                <button
                    onClick={() => navigate('/')}
                    className="btn btn-primary"
                    style={{ marginTop: '1.5rem', padding: '0.75rem 2rem' }}
                >
                    {t('privacy_go_back')}
                </button>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
