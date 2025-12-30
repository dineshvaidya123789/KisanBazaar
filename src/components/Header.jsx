import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAlerts } from '../context/AlertContext';
import { useSearchLogic } from '../hooks/useSearchLogic';

const Header = () => {
    const { user } = useAuth();
    const location = useLocation();
    const isActive = (path) => location.pathname === path ? 'active' : '';

    // Use Custom Hook for Search Logic
    const { query, setQuery, searchMode, setSearchMode, suggestions, handleSearchRaw } = useSearchLogic();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeMobileSubmenu, setActiveMobileSubmenu] = useState(null); // Track open submenu on mobile
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const { alerts, unreadCount, markAsRead, clearAll } = useAlerts();

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const toggleMobileSubmenu = (menuName) => {
        if (activeMobileSubmenu === menuName) {
            setActiveMobileSubmenu(null); // Close if already open
        } else {
            setActiveMobileSubmenu(menuName); // Open this one
        }
    };

    const closeMenu = () => {
        setIsMobileMenuOpen(false);
        setActiveMobileSubmenu(null);
        setIsAlertOpen(false); // Close alert dropdown when navigating
    };

    return (
        <header style={{
            backgroundColor: 'var(--color-surface)',
            boxShadow: 'var(--shadow-sm)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            {/* Top Bar: Logo, Search, Sign In, Hamburger */}
            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.6rem 1rem', // Further reduced padding
                borderBottom: '1px solid #eee',
                flexWrap: 'wrap',
                gap: '8px'
            }}>
                {/* Logo & Actions Wrapper - Adjusted for Logo Left, Login Right */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    gap: '8px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Link to="/" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                            <img
                                src="/images/logo.png"
                                alt="Logo"
                                style={{
                                    height: '32px',
                                    width: 'auto',
                                    objectFit: 'contain'
                                }}
                            />
                            <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-primary)', fontFamily: 'serif', whiteSpace: 'nowrap' }}>
                                KisanBazaar
                            </span>
                        </Link>

                        {/* Hamburger Button - Now labeled for farmers */}
                        <button
                            onClick={toggleMenu}
                            className="mobile-menu-btn"
                            style={{
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                padding: '4px 8px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                color: '#333',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontWeight: 'bold'
                            }}
                        >
                            <span>☰</span>
                            <span style={{ fontSize: '0.8rem' }}>मेनू (Menu)</span>
                        </button>
                    </div>

                    {/* Right side actions - Login pinned to right */}
                    <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Notification Bell */}
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setIsAlertOpen(!isAlertOpen)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '1.4rem',
                                    cursor: 'pointer',
                                    padding: '5px',
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
                                    zIndex: 1001,
                                    overflowY: 'auto',
                                    border: '1px solid #e2e8f0'
                                }}>
                                    <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                                        <h4 style={{ margin: 0, fontSize: '1rem' }}>Notifications (सूचनाएं)</h4>
                                        <button onClick={clearAll} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold' }}>Clear All</button>
                                    </div>

                                    {alerts.length === 0 ? (
                                        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
                                            <p style={{ margin: 0, fontSize: '0.9rem' }}>No new alerts</p>
                                        </div>
                                    ) : (
                                        <div style={{ padding: '0.5rem' }}>
                                            {alerts.map(alert => (
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
                                                                {alert.title}
                                                                <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'normal', color: '#64748b' }}>{alert.titleHi}</span>
                                                            </div>
                                                            <p style={{ fontSize: '0.8rem', margin: '5px 0', lineHeight: '1.4', color: '#334155' }}>
                                                                {alert.message}
                                                                <span style={{ display: 'block', fontStyle: 'italic', marginTop: '2px' }}>{alert.messageHi}</span>
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
                                                                    Share 🟢
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Subscribe CTA */}
                                    <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
                                        <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#475569' }}>Want alerts on WhatsApp?</p>
                                        <a
                                            href="https://wa.me/91XXXXXXXXXX?text=I%20want%20to%20subscribe%20to%20Kisan%20Bazaar%20Alerts"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-primary"
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '5px', textDecoration: 'none', borderRadius: '8px' }}
                                        >
                                            📲 Subscribe Now
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
                    }

                    @keyframes slideDown {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}</style>

                {/* Search Bar - Centered */}
                <div className="header-search" style={{
                    position: 'relative', // For dropdown positioning
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'nowrap',
                    flex: '1 1 300px',
                    maxWidth: '500px',
                    margin: '0 auto',
                    zIndex: 1002 // Higher than alert dropdown if they overlap
                }}>
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        border: '1.5px solid var(--color-primary)',
                        borderRadius: '25px',
                        overflow: 'hidden',
                        height: '36px',
                        backgroundColor: 'white'
                    }}>
                        <select
                            value={searchMode}
                            onChange={(e) => setSearchMode(e.target.value)}
                            style={{
                                width: 'auto',
                                border: 'none',
                                padding: '0 0.4rem',
                                backgroundColor: '#f1f5f9',
                                borderRight: '1px solid #e2e8f0',
                                outline: 'none',
                                color: '#475569',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                height: '100%',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="Buyers">Buy</option>
                            <option value="Sellers">Sell</option>
                            <option value="Rates">Rates</option>
                        </select>
                        <input
                            type="text"
                            placeholder={
                                searchMode === 'Buyers' ? 'Search Buyers... (e.g. Wheat)' :
                                    searchMode === 'Sellers' ? 'Search Farmers... (e.g. Seeds)' :
                                        'Search Mandi Rates...'
                            }
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearchRaw()}
                            style={{
                                flex: 1,
                                border: 'none',
                                padding: '0 0.8rem',
                                outline: 'none',
                                fontSize: '0.85rem',
                                minWidth: '0',
                                height: '100%',
                                color: '#1e293b'
                            }}
                        />
                        <button
                            onClick={() => handleSearchRaw()}
                            style={{
                                width: 'auto',
                                border: 'none',
                                padding: '0 1rem',
                                background: 'var(--color-primary)',
                                color: 'white',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >🔍</button>
                    </div>

                    {/* Suggestions Dropdown */}
                    {suggestions.length > 0 && (
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
                            zIndex: 1003
                        }}>
                            {suggestions.map((s, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => {
                                        setSearchMode(s.type);
                                        handleSearchRaw(s.term, s.type); // This will clear query automatically
                                    }}
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
                            style={{ paddingBottom: isMobileMenuOpen ? '2px' : '10px', display: 'block', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: isMobileMenuOpen ? 'space-between' : 'flex-start', alignItems: 'center' }}>
                            Buyer Section (खरीदार)
                            <span>{isMobileMenuOpen ? (activeMobileSubmenu === 'buyer' ? '▴' : '▾') : '▾'}</span>
                        </span>
                        <div className="dropdown-content" style={{
                            position: isMobileMenuOpen ? 'static' : 'absolute',
                            boxShadow: isMobileMenuOpen ? 'none' : '0 8px 16px rgba(0,0,0,0.1)',
                            border: isMobileMenuOpen ? 'none' : '1px solid #eee',
                            display: isMobileMenuOpen ? (activeMobileSubmenu === 'buyer' ? 'block' : 'none') : undefined // Let CSS handle desktop hover, JS handle mobile
                        }}>
                            <Link to="/sell?type=Buy" onClick={closeMenu} style={{ padding: isMobileMenuOpen ? '0.5rem 0 0.5rem 1rem' : '12px 16px' }}>Request Crop (फसल मांगें)</Link>
                            <Link to="/marketplace?filter=my-requests" onClick={closeMenu} style={{ padding: isMobileMenuOpen ? '0.5rem 0 0.5rem 1rem' : '12px 16px' }}>My Requests (मेरी मांगें)</Link>
                            <Link to="/sellers" onClick={closeMenu} style={{ padding: isMobileMenuOpen ? '0.5rem 0 0.5rem 1rem' : '12px 16px' }}>View Sellers Directory</Link>
                        </div>
                    </div>

                    {/* Seller Section */}
                    <div className="nav-item dropdown">
                        <span
                            onClick={() => isMobileMenuOpen && toggleMobileSubmenu('seller')}
                            style={{ paddingBottom: isMobileMenuOpen ? '2px' : '10px', display: 'block', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: isMobileMenuOpen ? 'space-between' : 'flex-start', alignItems: 'center' }}>
                            Seller Section (विक्रेता)
                            <span>{isMobileMenuOpen ? (activeMobileSubmenu === 'seller' ? '▴' : '▾') : '▾'}</span>
                        </span>
                        <div className="dropdown-content" style={{
                            position: isMobileMenuOpen ? 'static' : 'absolute',
                            boxShadow: isMobileMenuOpen ? 'none' : '0 8px 16px rgba(0,0,0,0.1)',
                            border: isMobileMenuOpen ? 'none' : '1px solid #eee',
                            display: isMobileMenuOpen ? (activeMobileSubmenu === 'seller' ? 'block' : 'none') : undefined
                        }}>
                            <Link to="/sell?type=Sell" onClick={closeMenu} style={{ padding: isMobileMenuOpen ? '0.5rem 0 0.5rem 1rem' : '12px 16px' }}>List Your Product For Sale</Link>
                            <Link to="/my-products" onClick={closeMenu} style={{ padding: isMobileMenuOpen ? '0.5rem 0 0.5rem 1rem' : '12px 16px' }}>📋 My Products (मेरी पोस्ट)</Link>
                            <Link to="/marketplace" onClick={closeMenu} style={{ padding: isMobileMenuOpen ? '0.5rem 0 0.5rem 1rem' : '12px 16px' }}>View Buyers</Link>
                        </div>
                    </div>

                    {/* Today Rates */}
                    <Link to="/rates" onClick={closeMenu} className="nav-link">
                        <span className="nav-label-en">Today Rates</span>
                        <span className="nav-label-hi">(मंडी भाव)</span>
                    </Link>

                    {/* News */}
                    <Link to="/news" onClick={closeMenu} className="nav-link">
                        <span className="nav-label-en">News</span>
                        <span className="nav-label-hi">(समाचार)</span>
                    </Link>

                    {/* Weather */}
                    <Link to="/weather" onClick={closeMenu} className="nav-link">
                        <span className="nav-label-en">Weather</span>
                        <span className="nav-label-hi">(मौसम)</span>
                    </Link>

                    {/* Farming Services */}
                    <Link to="/transport" onClick={closeMenu} className="nav-link">
                        <span className="nav-label-en">Farming Services</span>
                        <span className="nav-label-hi">(कृषि सेवाएँ)</span>
                    </Link>

                    {/* Chaupal */}
                    <Link to="/chaupal" onClick={closeMenu} className="nav-link">
                        <span className="nav-label-en">Chaupal</span>
                        <span className="nav-label-hi">(चौपाल)</span>
                    </Link>

                    {/* Advisory */}
                    <Link to="/advisory" onClick={closeMenu} className="nav-link">
                        <span className="nav-label-en">Advisory</span>
                        <span className="nav-label-hi">(सलाह)</span>
                    </Link>

                    {/* Animal Husbandry */}
                    <Link to="/pashu-palan" onClick={closeMenu} className="nav-link">
                        <span className="nav-label-en">Animal Husbandry</span>
                        <span className="nav-label-hi">(पशुपालन)</span>
                    </Link>

                    {/* "Help" Link Removed as requested (already in Footer) */}
                    {/* "Sign In" Removed as requested */}

                </nav>
            </div>
        </header>
    );
};

export default Header;
