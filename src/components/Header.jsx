import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAlerts } from '../context/AlertContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';
import { useSearchLogic } from '../hooks/useSearchLogic';
import { useSmartVoice } from '../hooks/useSmartVoice';
import { advisoryKeywords } from '../utils/voiceParser';
import VoiceOverlay from './VoiceOverlay';

const Header = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const isActive = (path) => location.pathname === path ? 'active' : '';

    // Use Custom Hook for Search Logic
    const { query, setQuery, searchMode, setSearchMode, suggestions, handleSearchRaw } = useSearchLogic();

    // Smart Voice Handler
    const { isListening, transcript, showOverlay, startListening, stopListening, speak } = useSmartVoice();

    const handleVoiceSearch = () => {
        startListening(({ transcript, parsed }) => {
            setQuery(transcript);

            // Smart Routing based on parsed intent
            if (parsed) {
                console.log("Global Voice Parsed:", parsed);
                const commodityName = parsed.commodity ? (language === 'hi' ? parsed.commodity.hi : parsed.commodity.en) : transcript;
                const locationName = parsed.district || parsed.state || '';

                // 1. Explicit Sell Intent -> Go to Seller Form
                if (parsed.type === 'Sell') {
                    const speechText = commodityName
                        ? (t('voice_selling', { item: commodityName }) || `Opening seller form for ${commodityName}`)
                        : (t('voice_selling_generic') || "Opening seller form");

                    speak(speechText);
                    navigate('/sell?type=Sell', { state: { voiceData: parsed } });
                    return;
                }

                // 2. Explicit Buy Intent -> Go to Buyer Form (Request)
                if (parsed.type === 'Buy') {
                    const speechText = commodityName
                        ? (t('voice_buying', { item: commodityName }) || `Searching buyers for ${commodityName}`)
                        : (t('voice_buying_generic') || "Opening buyer form");

                    speak(speechText);
                    navigate('/sell?type=Buy', { state: { voiceData: parsed } });
                    return;
                }

                // 3. Rate Check Intent -> Go to Mandi Rates
                if (parsed.type === 'Rate') {
                    speak(t('voice_rates', { item: commodityName, loc: locationName }) || `Showing rates for ${commodityName} ${locationName ? 'in ' + locationName : ''}`);
                    navigate(`/rates?search=${parsed.commodity?.en || transcript}`);
                    return;
                }

                // 4. Weather Intent
                if (parsed.type === 'Weather') {
                    speak(t('voice_weather', { loc: locationName || 'your location' }) || `Checking weather for ${locationName || 'your location'}`);
                    navigate('/weather'); // Assuming /weather route exists
                    return;
                }

                // 5. News/Scheme Intent
                if (parsed.type === 'News') {
                    speak(t('voice_news') || "Opening News and Schemes");
                    navigate('/news'); // Assuming /news route exists
                    return;
                }

                // 6. Advisory/Farming Tips Intent
                if (parsed.type === 'Advisory') {
                    speak(t('voice_advisory', { item: commodityName }) || `Showing farming tips for ${commodityName}`);
                    // Navigate to advisory with search
                    setSearchMode('Advisory');
                    handleSearchRaw(parsed.commodity?.en || transcript, 'Advisory');
                    return;
                }
            }

            // Default: Standard Text Search
            const lowerTranscript = transcript.toLowerCase();
            const isAdvisoryFallback = advisoryKeywords.some(k => lowerTranscript.includes(k));

            if (isAdvisoryFallback) {
                const commodityName = parsed?.commodity ? (language === 'hi' ? parsed.commodity.hi : parsed.commodity.en) : transcript;
                speak(t('voice_advisory', { item: commodityName }) || `Showing farming tips for ${commodityName}`);
                setSearchMode('Advisory');
                handleSearchRaw(parsed?.commodity?.en || transcript, 'Advisory');
                return;
            }

            speak(t('voice_searching', { term: transcript }) || `Searching for ${transcript}`);
            handleSearchRaw(transcript);
        });
    };

    // Language display mapping
    const languageDisplay = {
        'en': 'EN',
        'hi': 'हिं',
        'mr': 'मर'
    };

    return (
        <header style={{
            backgroundColor: 'var(--color-surface)',
            boxShadow: 'var(--shadow-sm)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <VoiceOverlay
                isOpen={showOverlay}
                isListening={isListening}
                transcript={transcript}
                onClose={stopListening}
            />

            {/* Top Bar: Logo, Search, Sign In, Hamburger */}
            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.6rem 0.5rem', // Reduced padding for mobile
                borderBottom: '1px solid #eee',
                flexWrap: 'nowrap', // Prevent wrapping of main row
                gap: '8px'
            }}>
                {/* Logo & Actions Wrapper */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    gap: '4px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                        <Link to="/" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                            <img
                                src="/images/logo.png"
                                alt="Logo"
                                style={{
                                    height: '28px', // Smaller logo on mobile
                                    width: 'auto',
                                    objectFit: 'contain'
                                }}
                            />
                            <span style={{
                                fontSize: '1.2rem',
                                fontWeight: '800',
                                color: 'var(--color-primary)',
                                fontFamily: 'serif',
                                whiteSpace: 'nowrap'
                            }} className="logo-text">
                                KisanBazaar
                            </span>
                            <style>{`
                                @media (max-width: 340px) { .logo-text { display: none; } }
                            `}</style>
                        </Link>

                        {/* Hamburger Button */}
                        <button
                            onClick={toggleMenu}
                            className="mobile-menu-btn"
                            style={{
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                padding: '4px 6px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                color: '#333',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px',
                                fontWeight: 'bold'
                            }}
                        >
                            <span>☰</span>
                        </button>
                    </div>

                    {/* Right side actions */}
                    <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        {/* Clean Language Indicator - Opens Modal */}
                        <button
                            onClick={openLanguageModal}
                            style={{
                                background: 'linear-gradient(135deg, #f8fafc 0%, #e8f5e9 100%)',
                                border: '2px solid #c8e6c9',
                                padding: '6px 12px',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                color: '#2e7d32',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all 0.2s',
                                boxShadow: '0 2px 4px rgba(46, 125, 50, 0.1)'
                            }}
                            title="Change Language"
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 4px 8px rgba(46, 125, 50, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 2px 4px rgba(46, 125, 50, 0.1)';
                            }}
                        >
                            <span>🌐</span>
                            <span>{languageDisplay[language]}</span>
                        </button>

                        {/* Notification Bell */}
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setIsAlertOpen(!isAlertOpen)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '1.2rem',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    position: 'relative'
                                }}
                                title="Notifications"
                            >
                                🔔
                                {unreadCount > 0 && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '0',
                                        right: '0',
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '18px',
                                        height: '18px',
                                        fontSize: '0.7rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        border: '2px solid white'
                                    }}>
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Alert Dropdown */}
                            {isAlertOpen && (
                                <div className="fade-in" style={{
                                    position: 'absolute',
                                    top: '45px',
                                    right: '0',
                                    width: '320px',
                                    maxHeight: '70vh',
                                    backgroundColor: 'white',
                                    boxShadow: 'var(--shadow-lg)',
                                    borderRadius: '12px',
                                    zIndex: 1010,
                                    overflowY: 'auto',
                                    border: '1px solid #e2e8f0'
                                }}>
                                    <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                                        <h4 style={{ margin: 0, fontSize: '1rem' }}>{t('notifications')}</h4>
                                        <button onClick={clearAll} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold' }}>{t('clear_all')}</button>
                                    </div>

                                    {alerts.length === 0 ? (
                                        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
                                            <p style={{ margin: 0, fontSize: '0.9rem' }}>{t('no_new_alerts')}</p>
                                        </div>
                                    ) : (
                                        <div style={{ padding: '0.5rem' }}>
                                            {alerts.map(alert => {
                                                // Select language-specific content
                                                const title = language === 'hi' ? (alert.titleHi || alert.title) :
                                                    language === 'mr' ? (alert.titleMr || alert.titleHi || alert.title) :
                                                        alert.title;
                                                const message = language === 'hi' ? (alert.messageHi || alert.message) :
                                                    language === 'mr' ? (alert.messageMr || alert.messageHi || alert.message) :
                                                        alert.message;

                                                return (
                                                    <div
                                                        key={alert.id}
                                                        onClick={() => markAsRead(alert.id)}
                                                        style={{
                                                            padding: '1rem',
                                                            borderRadius: '8px',
                                                            marginBottom: '0.5rem',
                                                            backgroundColor: alert.read ? 'transparent' : '#f0f9ff',
                                                            borderLeft: `4px solid ${alert.type === 'weather' ? '#ef4444' : alert.type.includes('market') ? '#f59e0b' : '#10b981'}`,
                                                            cursor: 'pointer',
                                                            transition: 'background-color 0.2s'
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', gap: '10px' }}>
                                                            <span style={{ fontSize: '1.2rem' }}>{alert.icon}</span>
                                                            <div style={{ flex: 1 }}>
                                                                <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '2px' }}>
                                                                    {title}
                                                                </div>
                                                                <p style={{ fontSize: '0.8rem', margin: '5px 0', lineHeight: '1.4', color: '#334155' }}>
                                                                    {message}
                                                                </p>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                                                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                                                        {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </span>
                                                                    <a
                                                                        href={`https://wa.me/?text=${encodeURIComponent(alert.whatsappMsg)}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: '4px',
                                                                            fontSize: '0.75rem',
                                                                            color: '#25D366',
                                                                            textDecoration: 'none',
                                                                            fontWeight: 'bold',
                                                                            padding: '4px 8px',
                                                                            backgroundColor: '#f0fff4',
                                                                            borderRadius: '4px'
                                                                        }}
                                                                    >
                                                                        {t('share_whatsapp')} 🟢
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Subscribe CTA */}
                                    <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
                                        <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#475569' }}>{t('want_alerts_whatsapp')}</p>
                                        <a
                                            href={`https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(t('whatsapp_subscribe_msg'))}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-primary"
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '5px', textDecoration: 'none', borderRadius: '8px' }}
                                        >
                                            {t('subscribe_now')}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        {user ? (
                            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', backgroundColor: '#f0fdf4', padding: '4px 8px', borderRadius: '15px', border: '1px solid #dcfce7' }}>
                                <img src={user.avatar} alt="Profile" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                                <span style={{ fontWeight: '600', color: '#166534', fontSize: '0.8rem' }} className="user-name-short">
                                    {user.name.split(' ')[0]}
                                </span>
                            </Link>
                        ) : (
                            <Link to="/login" className="btn btn-primary" onClick={closeMenu} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '15px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span>🔑</span> <span className="login-text">Login</span>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Inline styling for mobile responsiveness */}
                <style>{`
                    .mobile-menu-btn { display: none !important; }
                    .user-name-short { display: inline; }
                    
                    @media (max-width: 768px) {
                        .mobile-menu-btn { display: flex !important; }
                        .desktop-nav { display: none !important; }
                        .login-text { font-size: 0.75rem; }
                        .voice-search-desktop { display: none !important; }
                        .voice-icon-mobile { display: inline-flex !important; }
                        .search-icon { display: none !important; }
                        
                        .header-search { 
                            order: 3; 
                            width: 100% !important; 
                            margin: 5px 0 !important; 
                            flex: 1 1 100% !important;
                            max-width: 100% !important;
                        }

                        .mobile-nav-open { 
                            display: flex !important; 
                            flex-direction: column; 
                            width: 100%; 
                            padding-top: 1rem;
                            animation: slideDown 0.3s ease;
                        }
                    }

                    @media (min-width: 769px) {
                        .header-actions { margin-left: auto; }
                        .voice-icon-mobile { display: none !important; }
                    }

                    @keyframes slideDown {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}</style>

                <div className="header-search" style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'nowrap',
                    flex: '1 1 300px',
                    maxWidth: '500px',
                    margin: '0 auto',
                    zIndex: 9999
                }}>
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        border: '1px solid #cbd5e1', // More subtle border
                        borderRadius: '50px', // Rounder pill shape
                        overflow: 'hidden',
                        height: '42px', // Slightly taller for professional feel
                        backgroundColor: '#f8fafc', // Slight off-white background
                        transition: 'all 0.3s ease',
                        boxShadow: isSearchFocused ? '0 0 0 3px rgba(34, 197, 94, 0.2)' : 'none' // Focus ring
                    }} className="search-input-wrapper">




                        <input
                            type="text"
                            placeholder={t('search_placeholder_global')}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => {
                                setTimeout(() => setIsSearchFocused(false), 300);
                            }}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearchRaw()}
                            style={{
                                flex: '1',
                                border: '0',
                                padding: '0 12px',
                                outline: '0',
                                fontSize: '16px',
                                minWidth: '0',
                                height: '100%',
                                background: '#fff',
                                color: '#000',
                                fontWeight: '600',
                                fontFamily: 'Arial, sans-serif',
                                WebkitTextFillColor: '#000',
                                WebkitAppearance: 'none',
                                MozAppearance: 'none'
                            }}
                        />


                        {/* Clear Button (X) - Improved UX like Google */}
                        {query && (
                            <button
                                onClick={() => {
                                    setQuery('');
                                    document.querySelector(`input[placeholder="${t('search_placeholder_global')}"]`).focus();
                                }}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0 8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#64748b',
                                    fontSize: '1.2rem',
                                    height: '100%',
                                    outline: 'none'
                                }}
                                title="Clear search"
                                onMouseDown={(e) => e.preventDefault()} // Prevent losing focus on click
                            >
                                ×
                            </button>
                        )}

                        {/* Voice Search - Desktop Only */}
                        <button
                            onClick={handleVoiceSearch}
                            className="voice-search-desktop"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0 12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'color 0.2s',
                                borderLeft: '1px solid #e2e8f0',
                                height: '60%',
                                alignSelf: 'center',
                                flexShrink: 0
                            }}
                            title="Voice Search"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#2E7D32' }}>
                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                <line x1="12" y1="19" x2="12" y2="23"></line>
                                <line x1="8" y1="23" x2="16" y2="23"></line>
                            </svg>
                        </button>

                        {/* Search Button with Voice on Mobile */}
                        <button
                            onClick={() => handleSearchRaw()}
                            style={{
                                width: 'auto',
                                border: 'none',
                                padding: '0 1.2rem',
                                background: 'var(--color-primary)',
                                color: 'white',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                fontSize: '1.1rem',
                                transition: 'background-color 0.2s',
                                flexShrink: 0
                            }}
                            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                            onMouseLeave={(e) => e.target.style.opacity = '1'}
                        >
                            <span className="search-icon">🔍</span>
                            <span
                                className="voice-icon-mobile"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleVoiceSearch();
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                    <line x1="12" y1="19" x2="12" y2="23"></line>
                                    <line x1="8" y1="23" x2="16" y2="23"></line>
                                </svg>
                            </span>
                        </button>
                    </div>

                    {/* Suggestions Dropdown */}
                    {(isSearchFocused && suggestions.length > 0) && (
                        <div style={{
                            position: 'absolute',
                            top: '40px',
                            left: '0',
                            right: '0',
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            border: '1px solid #e2e8f0',
                            overflow: 'hidden',
                            zIndex: 9998
                        }}>
                            {suggestions.map((s, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => {
                                        setSearchMode(s.type);
                                        handleSearchRaw(s.term, s.type, s.subtype, s.modeOverride); // Pass modeOverride
                                    }}
                                    onMouseDown={(e) => e.preventDefault()} // Prevent input blur on click
                                    onTouchStart={(e) => e.preventDefault()} // Prevent input blur on touch
                                    style={{
                                        padding: '10px 15px',
                                        cursor: 'pointer',
                                        borderBottom: idx < suggestions.length - 1 ? '1px solid #f1f5f9' : 'none',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        fontSize: '0.9rem'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                >
                                    <span>{s.text}</span>
                                    <span style={{
                                        fontSize: '0.7rem',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        backgroundColor: '#eff6ff',
                                        color: '#3b82f6'
                                    }}>
                                        {s.type}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Links (Responsive) */}
            <div className={`container ${isMobileMenuOpen ? 'mobile-nav-open' : 'desktop-nav'}`} style={{ padding: '0.8rem 1rem' }}>
                <nav style={{
                    display: 'flex',
                    gap: isMobileMenuOpen ? '1rem' : 'var(--spacing-lg)',
                    flexDirection: isMobileMenuOpen ? 'column' : 'row',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    color: '#555'
                }}>

                    {/* Buyer Section */}
                    <div className="nav-item dropdown">
                        <span
                            onClick={() => isMobileMenuOpen && toggleMobileSubmenu('buyer')}
                            style={{ paddingBottom: isMobileMenuOpen ? '2px' : '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: isMobileMenuOpen ? 'space-between' : 'flex-start', alignItems: 'center' }}>
                            {t('buyer_section')}
                            <span>{isMobileMenuOpen ? (activeMobileSubmenu === 'buyer' ? '▴' : '▾') : '▾'}</span>
                        </span>
                        <div className="dropdown-content" style={{
                            position: isMobileMenuOpen ? 'static' : 'absolute',
                            boxShadow: isMobileMenuOpen ? 'none' : '0 8px 16px rgba(0,0,0,0.1)',
                            border: isMobileMenuOpen ? 'none' : '1px solid #eee',
                            display: isMobileMenuOpen ? (activeMobileSubmenu === 'buyer' ? 'block' : 'none') : undefined // Let CSS handle desktop hover, JS handle mobile
                        }}>
                            <Link to="/sell?type=Buy" onClick={closeMenu} style={{ padding: isMobileMenuOpen ? '0.5rem 0 0.5rem 1rem' : '12px 16px' }}>{t('request_crop')}</Link>
                            <Link to="/my-products" onClick={closeMenu} style={{ padding: isMobileMenuOpen ? '0.5rem 0 0.5rem 1rem' : '12px 16px' }}>{t('my_posts')}</Link>
                            <Link to="/sellers" onClick={closeMenu} style={{ padding: isMobileMenuOpen ? '0.5rem 0 0.5rem 1rem' : '12px 16px' }}>{t('view_sellers')}</Link>
                        </div>
                    </div>

                    {/* Seller Section */}
                    <div className="nav-item dropdown">
                        <span
                            onClick={() => isMobileMenuOpen && toggleMobileSubmenu('seller')}
                            style={{ paddingBottom: isMobileMenuOpen ? '2px' : '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: isMobileMenuOpen ? 'space-between' : 'flex-start', alignItems: 'center' }}>
                            {t('seller_section')}
                            <span>{isMobileMenuOpen ? (activeMobileSubmenu === 'seller' ? '▴' : '▾') : '▾'}</span>
                        </span>
                        <div className="dropdown-content" style={{
                            position: isMobileMenuOpen ? 'static' : 'absolute',
                            boxShadow: isMobileMenuOpen ? 'none' : '0 8px 16px rgba(0,0,0,0.1)',
                            border: isMobileMenuOpen ? 'none' : '1px solid #eee',
                            display: isMobileMenuOpen ? (activeMobileSubmenu === 'seller' ? 'block' : 'none') : undefined
                        }}>
                            <Link to="/sell?type=Sell" onClick={closeMenu} style={{ padding: isMobileMenuOpen ? '0.5rem 0 0.5rem 1rem' : '12px 16px' }}>{t('list_product')}</Link>
                            <Link to="/my-products" onClick={closeMenu} style={{ padding: isMobileMenuOpen ? '0.5rem 0 0.5rem 1rem' : '12px 16px' }}>{t('my_products')}</Link>
                            <Link to="/marketplace?type=Buy" onClick={closeMenu} style={{ padding: isMobileMenuOpen ? '0.5rem 0 0.5rem 1rem' : '12px 16px' }}>{t('view_buyers')}</Link>
                        </div>
                    </div>

                    {/* Admin Link - Only visible to Admins */}
                    {user && user.role === 'Admin' && (
                        <Link
                            to="/admin"
                            onClick={closeMenu}
                            className={isActive('/admin')}
                            style={{
                                color: 'var(--color-primary)',
                                fontWeight: 'bold',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                        >
                            👑 Admin
                        </Link>
                    )}

                </nav>
            </div>
        </header>
    );
};

export default Header;

