import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
// import SafetyBanner from '../components/SafetyBanner';
import InterestsModal from '../components/InterestsModal';


import SEO from '../components/SEO';
import LiveDealsTicker from '../components/LiveDealsTicker';

const Home = () => {
    const { t } = useLanguage();
    const { user, updateProfile } = useAuth();

    // Onboarding State
    const showOnboarding = user && !user.onboardingCompleted;

    const handleOnboardingComplete = () => {
        // Optimistically update local state to hide modal immediately
        updateProfile({ onboardingCompleted: true });
    };

    return (
        <div className="fade-in">
            {showOnboarding && <InterestsModal onClose={handleOnboardingComplete} />}
            <SEO
                title={t('hero_title')}
                description={t('hero_subtitle')}
            />
            {/* <SafetyBanner /> */}
            <LiveDealsTicker />
            {/* Hero Section */}
            <section style={{
                background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), url('/images/hero_opt.jpg') center/cover no-repeat`,
                color: 'white',
                padding: 'var(--spacing-xl) 0',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '75vh',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div className="container" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <h1 style={{ color: 'var(--color-secondary)', fontSize: 'clamp(2rem, 5vw, 4rem)', marginBottom: '1rem', lineHeight: 1.2 }}>
                            {user?.city ? `Fast & Reliable Marketplace for ${user.city} Farmers` : t('hero_title')}
                        </h1>
                        <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', opacity: 0.9 }}>
                            {t('hero_subtitle')}
                        </p>

                        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2.5rem' }}>
                            <Link to="/sell?type=Sell" className="btn hero-btn primary" style={{
                                backgroundColor: '#2e7d32',
                                color: 'white',
                                padding: '1.4rem 3rem',
                                fontSize: '1.3rem',
                                borderRadius: '50px',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                boxShadow: '0 8px 25px rgba(46, 125, 50, 0.5)',
                                border: '2px solid #2e7d32',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                {t('i_am_farmer')}
                            </Link>
                            <Link to="/sell?type=Buy" className="btn hero-btn secondary" style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                padding: '1.4rem 3rem',
                                fontSize: '1.3rem',
                                borderRadius: '50px',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                border: '2px solid white',
                                backdropFilter: 'blur(5px)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                {t('i_am_buyer')}
                            </Link>
                        </div>

                        <style>{`
                            .hero-btn:hover {
                                transform: translateY(-5px);
                                filter: brightness(1.1);
                            }
                            .hero-btn.primary:hover {
                                boxShadow: 0 12px 30px rgba(46, 125, 50, 0.6);
                            }
                            .hero-btn.secondary:hover {
                                background-color: white;
                                color: #2e7d32;
                            }
                        `}</style>
                    </div>
                </div>
            </section>

            {/* Quick Action Cards */}
            <section className="container quick-actions-section" style={{ position: 'relative', zIndex: 10 }}>
                <style>{`
                    .quick-actions-section {
                        margin-top: -3rem;
                    }
                    @media (max-width: 768px) {
                        .quick-actions-section {
                            margin-top: 1rem !important; /* Push down on mobile */
                        }
                    }
                `}</style>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '1rem',
                    padding: '0 1rem'
                }}>
                    <QuickCard title={t('quick_todays_rate')} icon="📈" link="/rates" color="#ef6c00">
                        <div style={{ fontSize: '0.85rem', textAlign: 'left', color: '#555', padding: '0.5rem', borderRadius: '8px', marginTop: '0.3rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                                <span>{t('wheat')}</span>
                                <span style={{ fontWeight: 'bold' }}>₹2450</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                                <span>{t('soybean')}</span>
                                <span style={{ fontWeight: 'bold' }}>₹4250</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{t('onion')}</span>
                                <span style={{ fontWeight: 'bold' }}>₹1800</span>
                            </div>
                            {!user && (
                                <div style={{ marginTop: '0.4rem', paddingTop: '0.4rem', borderTop: '1px dashed #ccc', fontSize: '0.75rem', color: '#d32f2f', fontWeight: 'bold' }}>
                                    {t('login_for_rates')}
                                </div>
                            )}
                        </div>
                    </QuickCard>
                    <QuickCard title={t('quick_weather')} icon="🌦" link="/weather" color="#7b1fa2">
                        <div style={{ fontSize: '0.85rem', lineHeight: '1.3', color: '#555', padding: '0.5rem', borderRadius: '8px', marginTop: '0.3rem', textAlign: 'left' }}>
                            {t('weather_teaser_text')}
                        </div>
                    </QuickCard>
                    <QuickCard title={t('quick_farming_services')} icon="🚜" link="/transport" color="#2e7d32">
                        <div style={{ fontSize: '0.85rem', color: '#555', marginTop: '0.3rem', lineHeight: '1.3', padding: '0 0.5rem' }}>
                            {t('desc_services')}
                        </div>
                    </QuickCard>
                    <QuickCard title={t('quick_smart_advisory')} icon="💡" link="/advisory" color="#1565c0">
                        <div style={{ fontSize: '0.85rem', color: '#555', marginTop: '0.3rem', lineHeight: '1.3', padding: '0 0.5rem' }}>
                            {t('desc_advisory')}
                        </div>
                    </QuickCard>
                    <QuickCard title={t('quick_news')} icon="📰" link="/news" color="#d32f2f">
                        <div style={{ fontSize: '0.85rem', color: '#555', marginTop: '0.3rem', lineHeight: '1.3', padding: '0 0.5rem' }}>
                            {t('desc_news')}
                        </div>
                    </QuickCard>
                    <QuickCard title={t('quick_chaupal')} icon="💬" link="/chaupal" color="#f57c00">
                        <div style={{ fontSize: '0.85rem', color: '#555', marginTop: '0.3rem', lineHeight: '1.3', padding: '0 0.5rem' }}>
                            {t('desc_chaupal')}
                        </div>
                    </QuickCard>
                    <QuickCard title={t('quick_trade_area')} icon="🏘️" link="/trade-area" color="#0288d1">
                        <div style={{ fontSize: '0.85rem', color: '#555', marginTop: '0.3rem', lineHeight: '1.3', padding: '0 0.5rem' }}>
                            {t('desc_trade_area')}
                        </div>
                    </QuickCard>
                    <QuickCard title={t('quick_land_lease')} icon="⛰️" link="/land" color="#795548">
                        <div style={{ fontSize: '0.85rem', color: '#555', marginTop: '0.3rem', lineHeight: '1.3', padding: '0 0.5rem' }}>
                            {t('desc_land_lease')}
                        </div>
                    </QuickCard>
                </div>
            </section>

            {/* Media & Knowledge Center - HIDDEN per user request */}
            {/*
            <section className="container" style={{ padding: '2rem 1rem', marginBottom: '2rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
                    {t('knowledge_center_title')}
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ height: '200px', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', position: 'relative' }}>
                            <img src="/images/video_thumb.jpg" alt="Kisan TV" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
                                onError={(e) => { e.target.style.display = 'none' }} />
                            <div style={{ position: 'absolute', zIndex: 2, textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>▶️</div>
                                <span>{t('watch_now')}</span>
                            </div>
                        </div>
                        <div style={{ padding: '1rem' }}>
                            <h3>{t('kisan_tv')}</h3>
                            <p style={{ color: '#666', fontSize: '0.9rem' }}>
                                {t('kisan_tv_desc')}
                            </p>
                            <a href="#" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 'bold' }}>{t('watch_now')}</a>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '1rem' }}>
                        <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>{t('latest_blog')}</h3>
                        <div style={{ marginBottom: '1rem' }}>
                            <span style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: '0.2rem' }}>28 Dec 2025</span>
                            <h4 style={{ margin: '0 0 0.5rem 0' }}>Organic Farming: A Guide for Beginners</h4>
                            <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.4' }}>
                                Start your journey into chemical-free farming with these 5 simple steps. Improve soil health and reduce costs.
                            </p>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <span style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: '0.2rem' }}>26 Dec 2025</span>
                            <h4 style={{ margin: '0 0 0.5rem 0' }}>Winter Crop Protection Tips</h4>
                            <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.4' }}>
                                Protect your Wheat and Gram crops from frost and pest attacks this winter.
                            </p>
                        </div>
                        <Link to="/news" className="btn-outline" style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>{t('read_more')}</Link>
                    </div>

                    <div className="card" style={{ padding: '1rem', backgroundColor: '#E8F5E9', border: '1px solid #C8E6C9' }}>
                        <h3>{t('join_community')}</h3>
                        <p style={{ color: '#555', marginBottom: '1.5rem' }}>
                            {t('community_desc')}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <button className="btn" style={{ backgroundColor: '#25D366', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                {t('join_whatsapp')}
                            </button>
                            <button className="btn" style={{ backgroundColor: '#0088cc', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                {t('join_telegram')}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            */}
        </div>
    );
};

const QuickCard = ({ title, icon, link, color, children }) => {
    const lightColors = {
        '#ef6c00': '#fff3e0', // Light Orange (Rates) - kept same
        '#7b1fa2': '#f3e5f5', // Light Purple (Weather) - kept same
        '#2e7d32': '#e8f5e9', // Light Green (Services)
        '#1565c0': '#e3f2fd', // Light Blue (Advisory)
        '#d32f2f': '#ffebee', // Light Red (News)
        '#f57c00': '#fff3e0', // Light Orange (Chaupal)
        '#0288d1': '#e1f5fe'  // Light Sky Blue (Trade Area)
    };

    return (
        <Link to={link} style={{ textDecoration: 'none', color: 'inherit', height: '100%', display: 'block' }}>
            <div className="card" style={{
                backgroundColor: lightColors[color] || 'white',
                padding: '1rem',
                textAlign: 'center',
                borderRadius: '12px',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
                borderBottom: `4px solid ${color === '#e8f5e9' ? '#2e7d32' : color === '#e3f2fd' ? '#1565c0' : color === '#fff3e0' ? '#ef6c00' : '#7b1fa2'}`,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start'
            }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.2rem' }}>{icon}</div>
                <h3 style={{ margin: '0', fontSize: '1rem', marginBottom: children ? '0.4rem' : '0' }}>{title}</h3>
                {children && (
                    <div style={{ marginTop: '0.2rem', width: '100%' }}>
                        {children}
                    </div>
                )}
            </div>
        </Link>
    );
};

export default Home;
