import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import BackToHomeButton from '../components/BackToHomeButton';

const About = () => {
    const { t } = useLanguage();

    return (
        <div className="fade-in" style={{
            padding: '2rem 1rem',
            maxWidth: '1000px',
            margin: '0 auto',
            fontFamily: 'var(--font-family-base)',
            lineHeight: '1.6',
            color: '#333'
        }}>
            <BackToHomeButton compact />

            {/* Hero Section */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ color: 'var(--color-primary)', fontSize: '2.5rem', marginBottom: '1rem' }}>
                    {t('about_title')}
                </h1>
                <p style={{ fontSize: '1.2rem', color: '#555', maxWidth: '800px', margin: '0 auto' }}>
                    {t('about_subtitle')}
                </p>
            </div>

            {/* Mission Section */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem', borderLeft: '5px solid var(--color-secondary)' }}>
                <h2 style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    🎯 {t('about_mission')}
                </h2>
                <p>
                    {t('about_mission_desc')}
                </p>
            </div>

            {/* What We Do */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <div className="card" style={{ backgroundColor: '#f9f9f9' }}>
                    <h3 style={{ color: '#E65100' }}>🤝 {t('about_direct_trade')}</h3>
                    <p>
                        {t('about_direct_trade_desc')}
                    </p>
                </div>
                <div className="card" style={{ backgroundColor: '#f9f9f9' }}>
                    <h3 style={{ color: '#2E7D32' }}>🌦️ {t('about_smart_farming')}</h3>
                    <p>
                        {t('about_smart_farming_desc')}
                    </p>
                </div>
                <div className="card" style={{ backgroundColor: '#f9f9f9' }}>
                    <h3 style={{ color: '#1565C0' }}>📈 {t('about_market_rates')}</h3>
                    <p>
                        {t('about_market_rates_desc')}
                    </p>
                </div>
            </div>

            {/* Founder/Context Note (Generic) */}
            <div style={{ textAlign: 'center', background: '#E8F5E9', padding: '2rem', borderRadius: '12px' }}>
                <h3 style={{ margin: '0 0 1rem 0' }}>{t('about_built_for')}</h3>
                <p style={{ fontStyle: 'italic', fontSize: '1.1rem' }}>
                    "Jai Jawan, Jai Kisan"
                </p>
                <p>
                    {t('about_team_desc')}
                </p>
            </div>
        </div>
    );
};

export default About;
