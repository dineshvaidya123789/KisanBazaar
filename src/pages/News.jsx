import React, { useState, useMemo } from 'react';
import { allSchemes, isNewScheme } from '../data/govtSchemes';
import { useLanguage } from '../context/LanguageContext';
import { newsData } from '../data/newsData';
import BackToHomeButton from '../components/BackToHomeButton';

const News = () => {
    const { t, language } = useLanguage();
    const [activeTab, setActiveTab] = useState('mp');
    const [expandedNews, setExpandedNews] = useState({});

    // Get current language code (fallback to 'en')
    const langCode = language || 'en';

    // Get localized news data
    const currentNews = newsData[langCode] || newsData['en'];

    const toggleNews = (id) => {
        setExpandedNews(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Current date for validations
    const today = new Date().toISOString().split('T')[0];

    // Utility function to generate dynamic dates
    const formatDate = (daysAgo) => {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);

        // Use localized date formatting
        return date.toLocaleDateString(langCode === 'hi' ? 'hi-IN' : langCode === 'mr' ? 'mr-IN' : 'en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Process MP News with dates
    const mpNews = useMemo(() => {
        return (currentNews.mpNews || []).map(news => ({
            ...news,
            date: formatDate(news.daysAgo)
        }));
    }, [currentNews]);

    // Process MH News with dates
    const mhNews = useMemo(() => {
        return (currentNews.mhNews || []).map(news => ({
            ...news,
            date: formatDate(news.daysAgo)
        }));
    }, [currentNews]);

    // Process Central News with dates
    const centralNews = useMemo(() => {
        return (currentNews.centralNews || []).map(news => ({
            ...news,
            date: formatDate(news.daysAgo)
        }));
    }, [currentNews]);

    // Government schemes imported from centralized data
    const schemes = allSchemes.filter(s => s.validUntil >= today);

    return (
        <div style={{
            padding: '1rem',
            maxWidth: '1200px',
            margin: '0 auto',
            fontFamily: 'var(--font-family-base)',
            minHeight: '100vh',
            backgroundImage: 'url("/images/pattern.png")',
            backgroundBlendMode: 'soft-light'
        }}>
            {/* Banner Section */}
            <div style={{
                width: '100%',
                height: '250px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1625246333195-bf404ec03d2e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                color: 'white',
                textAlign: 'center',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Dark Overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }}></div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{ margin: 0, fontSize: '3rem', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                        {t('news_page_title')}
                    </h1>
                    <span style={{ fontSize: '1.5rem', opacity: 1, textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                        {t('news_page_subtitle')}
                    </span>
                </div>
            </div>

            {/* Disclaimer for External Links */}
            <div style={{
                textAlign: 'center',
                marginBottom: '2rem',
                fontSize: '0.85rem',
                color: '#666',
                fontStyle: 'italic',
                backgroundColor: '#f5f5f5',
                padding: '0.5rem',
                borderRadius: '4px'
            }}>
                {t('disclaimer_text')}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                    onClick={() => setActiveTab('mp')}
                    className={`btn ${activeTab === 'mp' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: '1 1 auto', minWidth: '120px' }}
                >
                    {t('tab_mp_news')}
                </button>
                <button
                    onClick={() => setActiveTab('central')}
                    className={`btn ${activeTab === 'central' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: '1 1 auto', minWidth: '120px' }}
                >
                    {t('tab_central_news')}
                </button>
                <button
                    onClick={() => setActiveTab('mh')}
                    className={`btn ${activeTab === 'mh' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: '1 1 auto', minWidth: '120px' }}
                >
                    {t('tab_mh_news')}
                </button>
                <button
                    onClick={() => setActiveTab('schemes')}
                    className={`btn ${activeTab === 'schemes' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: '1 1 auto', minWidth: '120px', backgroundColor: activeTab === 'schemes' ? '#E91E63' : 'transparent', borderColor: '#E91E63', color: activeTab === 'schemes' ? 'white' : '#E91E63' }}
                >
                    {t('tab_schemes')}
                </button>
            </div>

            <div className="news-container fade-in">
                {activeTab === 'schemes' && (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {schemes.map(scheme => (
                            <div key={scheme.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden', borderColor: scheme.color, borderLeft: `5px solid ${scheme.color}` }}>
                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <span style={{ backgroundColor: scheme.color + '1A', color: scheme.color, padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600', marginRight: '0.5rem' }}>
                                            {scheme.title}
                                        </span>
                                        {isNewScheme(scheme.startDate) && (
                                            <span style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600', marginRight: '0.5rem' }}>
                                                {t('new_tag')}
                                            </span>
                                        )}
                                        {/* Localized scheme title if available, else standard title */}
                                        <span style={{ fontSize: '0.8rem', color: '#666' }}>
                                            {langCode === 'hi' ? scheme.titleHi : (langCode === 'mr' ? scheme.titleMr || scheme.titleHi : scheme.title)}
                                        </span>
                                    </div>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', lineHeight: '1.4', color: '#333' }}>
                                        {langCode === 'en' ? scheme.benefit : (langCode === 'mr' ? scheme.benefitMr || scheme.benefitHi : scheme.benefitHi)}
                                    </h3>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '0.85rem', color: '#777' }}>
                                            {t('valid_until')}: {new Date(scheme.validUntil).toLocaleDateString(langCode === 'hi' ? 'hi-IN' : langCode === 'mr' ? 'mr-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                        <a
                                            href={scheme.applyUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-outline"
                                            style={{
                                                fontSize: '0.9rem',
                                                padding: '0.4rem 1rem',
                                                borderColor: scheme.color,
                                                color: scheme.color,
                                                textDecoration: 'none',
                                                display: 'inline-block'
                                            }}
                                        >
                                            {scheme.applyText} 🔗
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'mp' && (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {mpNews.map(news => (
                            <div key={news.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
                                {/* Image removed as per user request to match Central Govt layout */}

                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ marginBottom: '0.5rem' }}>
                                        <span style={{ backgroundColor: news.tag === 'New' ? '#ffebee' : '#e8f5e9', color: news.tag === 'New' ? '#c62828' : '#2e7d32', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600' }}>
                                            {news.tag}
                                        </span>
                                        <span style={{ marginLeft: '1rem', fontSize: '0.8rem', color: '#666' }}>{news.date}</span>
                                    </div>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', lineHeight: '1.4' }}>{news.title}</h3>

                                    {/* Toggleable Content */}
                                    {expandedNews[news.id] ? (
                                        <div className="fade-in">
                                            <p style={{ color: '#555', marginBottom: '1rem' }}>{news.description}</p>
                                            <div style={{ display: 'flex', gap: '0.5rem', width: '100%', flexWrap: 'nowrap' }}>
                                                <button
                                                    onClick={() => toggleNews(news.id)}
                                                    className="btn-outline"
                                                    style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem 0.2rem', borderColor: '#666', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {t('read_less')}
                                                </button>
                                                {news.readMoreUrl && (
                                                    <a
                                                        href={news.readMoreUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn-outline"
                                                        style={{
                                                            flex: 1,
                                                            fontSize: '0.8rem',
                                                            padding: '0.4rem 0.2rem',
                                                            borderColor: 'var(--color-primary)',
                                                            color: 'var(--color-primary)',
                                                            textDecoration: 'none',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis'
                                                        }}>
                                                        {t('full_article')} 🔗
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <p style={{ color: '#555', marginBottom: '1rem' }}>{news.summary}</p>
                                            <div style={{ display: 'flex', gap: '0.5rem', width: '100%', flexWrap: 'nowrap' }}>
                                                <button
                                                    onClick={() => toggleNews(news.id)}
                                                    className="btn-outline"
                                                    style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem 0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {t('read_more')}
                                                </button>
                                                {news.readMoreUrl && (
                                                    <a
                                                        href={news.readMoreUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn-outline"
                                                        style={{
                                                            flex: 1,
                                                            fontSize: '0.8rem',
                                                            padding: '0.4rem 0.2rem',
                                                            borderColor: 'var(--color-primary)',
                                                            color: 'var(--color-primary)',
                                                            textDecoration: 'none',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis'
                                                        }}>
                                                        {t('full_article')} 🔗
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'mh' && (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {mhNews.map(news => (
                            <div key={news.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ marginBottom: '0.5rem' }}>
                                        <span style={{ backgroundColor: news.tag === 'New' ? '#ffebee' : '#e8f5e9', color: news.tag === 'New' ? '#c62828' : '#2e7d32', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600' }}>
                                            {news.tag}
                                        </span>
                                        <span style={{ marginLeft: '1rem', fontSize: '0.8rem', color: '#666' }}>{news.date}</span>
                                    </div>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', lineHeight: '1.4' }}>{news.title}</h3>

                                    {/* Toggleable Content */}
                                    {expandedNews[`mh-${news.id}`] ? ( // "mh-" prefix to avoid collision
                                        <div className="fade-in">
                                            <p style={{ color: '#555', marginBottom: '1rem' }}>{news.description}</p>
                                            <div style={{ display: 'flex', gap: '0.5rem', width: '100%', flexWrap: 'nowrap' }}>
                                                <button
                                                    onClick={() => toggleNews(`mh-${news.id}`)}
                                                    className="btn-outline"
                                                    style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem 0.2rem', borderColor: '#666', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {t('read_less')}
                                                </button>
                                                {news.readMoreUrl && (
                                                    <a
                                                        href={news.readMoreUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn-outline"
                                                        style={{
                                                            flex: 1,
                                                            fontSize: '0.8rem',
                                                            padding: '0.4rem 0.2rem',
                                                            borderColor: 'var(--color-primary)',
                                                            color: 'var(--color-primary)',
                                                            textDecoration: 'none',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis'
                                                        }}>
                                                        {t('full_article')} 🔗
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <p style={{ color: '#555', marginBottom: '1rem' }}>{news.summary}</p>
                                            <div style={{ display: 'flex', gap: '0.5rem', width: '100%', flexWrap: 'nowrap' }}>
                                                <button
                                                    onClick={() => toggleNews(`mh-${news.id}`)}
                                                    className="btn-outline"
                                                    style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem 0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {t('read_more')}
                                                </button>
                                                {news.readMoreUrl && (
                                                    <a
                                                        href={news.readMoreUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn-outline"
                                                        style={{
                                                            flex: 1,
                                                            fontSize: '0.8rem',
                                                            padding: '0.4rem 0.2rem',
                                                            borderColor: 'var(--color-primary)',
                                                            color: 'var(--color-primary)',
                                                            textDecoration: 'none',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis'
                                                        }}>
                                                        {t('full_article')} 🔗
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'central' && (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {centralNews.map(news => (
                            <div key={news.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ marginBottom: '0.5rem' }}>
                                        <span style={{ backgroundColor: '#e3f2fd', color: '#1565c0', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600' }}>
                                            {t('tab_central_news')}
                                        </span>
                                        <span style={{ marginLeft: '1rem', fontSize: '0.8rem', color: '#666' }}>{news.date}</span>
                                    </div>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', lineHeight: '1.4' }}>{news.title}</h3>

                                    {expandedNews[`c-${news.id}`] ? ( // "c-" prefix for central updates
                                        <div className="fade-in">
                                            <p style={{ color: '#555', marginBottom: '1rem' }}>{news.description}</p>
                                            <div style={{ display: 'flex', gap: '0.5rem', width: '100%', flexWrap: 'nowrap' }}>
                                                <button
                                                    onClick={() => toggleNews(`c-${news.id}`)}
                                                    className="btn-outline"
                                                    style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem 0.2rem', borderColor: '#666', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {t('read_less')}
                                                </button>
                                                {news.readMoreUrl && (
                                                    <a
                                                        href={news.readMoreUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn-outline"
                                                        style={{
                                                            flex: 1,
                                                            fontSize: '0.8rem',
                                                            padding: '0.4rem 0.2rem',
                                                            borderColor: 'var(--color-primary)',
                                                            color: 'var(--color-primary)',
                                                            textDecoration: 'none',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis'
                                                        }}>
                                                        {t('full_article')} 🔗
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <p style={{ color: '#555', marginBottom: '1rem' }}>{news.summary}</p>
                                            <div style={{ display: 'flex', gap: '0.5rem', width: '100%', flexWrap: 'nowrap' }}>
                                                <button
                                                    onClick={() => toggleNews(`c-${news.id}`)}
                                                    className="btn-outline"
                                                    style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem 0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {t('read_more')}
                                                </button>
                                                {news.readMoreUrl && (
                                                    <a
                                                        href={news.readMoreUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn-outline"
                                                        style={{
                                                            flex: 1,
                                                            fontSize: '0.8rem',
                                                            padding: '0.4rem 0.2rem',
                                                            borderColor: 'var(--color-primary)',
                                                            color: 'var(--color-primary)',
                                                            textDecoration: 'none',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis'
                                                        }}>
                                                        {t('full_article')} 🔗
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <BackToHomeButton />
        </div>
    );
};

export default News;
