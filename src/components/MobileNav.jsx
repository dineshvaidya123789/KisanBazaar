import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const MobileNav = () => {
    const { t } = useLanguage();

    return (
        <nav className="mobile-bottom-nav">
            <style>{`
                .mobile-bottom-nav {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background-color: white;
                    display: none; /* Hidden on Desktop */
                    justify-content: space-around;
                    align-items: center;
                    padding: 0.5rem 0;
                    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
                    z-index: 2000; /* Ensure on top */
                    border-top: 1px solid #eee;
                    flex-direction: row; /* Force row */
                    height: 60px; /* Fixed height */
                }

                .mobile-nav-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-decoration: none;
                    color: #666;
                    font-size: 0.75rem;
                    gap: 4px;
                }

                .mobile-nav-item.active {
                    color: var(--color-primary);
                    font-weight: bold;
                }

                .mobile-nav-icon {
                    font-size: 1.5rem;
                }

                @media (max-width: 768px) {
                    .mobile-bottom-nav {
                        display: flex;
                    }
                    /* Add padding to body or footer to prevent overlap */
                    body {
                        padding-bottom: 60px;
                    }
                }
            `}</style>

            <NavLink to="/" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
                <span className="mobile-nav-icon">🏠</span>
                <span>{t('home')}</span>
            </NavLink>

            <NavLink to="/sell?type=Sell" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
                <span className="mobile-nav-icon">🌾</span>
                <span>{t('sell')}</span>
            </NavLink>

            <NavLink to="/marketplace" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
                <span className="mobile-nav-icon">🛒</span>
                <span>{t('buy')}</span>
            </NavLink>

            <NavLink to="/rates" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
                <span className="mobile-nav-icon">📊</span>
                <span>{t('nav_rates')}</span>
            </NavLink>

            <NavLink to="/profile" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
                <span className="mobile-nav-icon">👤</span>
                <span>{t('nav_profile')}</span>
            </NavLink>
        </nav>
    );
};

export default MobileNav;
