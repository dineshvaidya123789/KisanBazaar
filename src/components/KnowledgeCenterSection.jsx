import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const KnowledgeCenterSection = () => {
    const { t } = useLanguage();

    return (
        <section className="container" style={{ padding: '2rem 1rem', marginBottom: '2rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
                {t('knowledge_center_title')}
            </h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem'
            }}>
                {/* Video / Media Card */}
                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ height: '200px', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', position: 'relative' }}>
                        <img src="/images/video_thumb_opt.jpg" alt="Kisan TV" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
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

                {/* Blog / News Card */}
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

                {/* Community / Social Card */}
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
    );
};

export default KnowledgeCenterSection;
