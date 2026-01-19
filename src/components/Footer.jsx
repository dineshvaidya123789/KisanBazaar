import React from 'react';
import { Link } from 'react-router-dom';
import FeedbackForm from './FeedbackForm';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();

    return (
        <footer style={{
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            padding: 'var(--spacing-xl) 0',
            marginTop: 'auto'
        }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)' }}>

                <div>
                    <h3 style={{ color: 'white', marginBottom: 'var(--spacing-md)' }}>{t('app_name')}</h3>
                    <p style={{ opacity: 0.9 }}>
                        {t('footer_desc')}
                    </p>
                </div>

                <div>
                    <h4 style={{ color: 'var(--color-secondary)', marginBottom: 'var(--spacing-md)' }}>{t('important_links')}</h4>
                    <ul style={{ listStyle: 'none', opacity: 0.9 }}>
                        <li style={{ marginBottom: '8px' }}><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>{t('home')}</Link></li>
                        <li style={{ marginBottom: '8px' }}><Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>{t('about_us')}</Link></li>
                        <li style={{ marginBottom: '8px' }}><Link to="/advisory" style={{ color: 'white', textDecoration: 'none' }}>{t('integrated_farming')}</Link></li>
                        <li style={{ marginBottom: '8px' }}><Link to="/pashu-palan" style={{ color: 'white', textDecoration: 'none' }}>{t('animal_husbandry')}</Link></li>
                        <li style={{ marginBottom: '8px' }}><Link to="/partner" style={{ color: 'white', textDecoration: 'none' }}>{t('be_partner')}</Link></li>
                        <li style={{ marginBottom: '8px' }}><Link to="/fpo-registration" style={{ color: 'white', textDecoration: 'none' }}>{t('fpo')}</Link></li>
                        <li style={{ marginBottom: '8px' }}><Link to="/help" style={{ color: 'white', textDecoration: 'none' }}>{t('help')}</Link></li>
                        <li style={{ marginBottom: '8px' }}><Link to="/privacy" style={{ color: 'white', textDecoration: 'none' }}>{t('privacy_policy')}</Link></li>
                        <li style={{ marginBottom: '8px' }}><Link to="/admin" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.8rem' }}>Admin Dashboard</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 style={{ color: 'var(--color-secondary)', marginBottom: 'var(--spacing-md)' }}>{t('contact_us')}</h4>
                    <p style={{ marginBottom: '8px' }}>{t('email')}: support@kisanbazaar.com</p>
                    <p style={{ marginBottom: '8px' }}>{t('phone')}: +91 99879 17394</p>
                    <p>{t('address')}</p>
                </div>

                {/* Feedback Form */}
                <FeedbackForm />
            </div>

            <div className="container" style={{
                marginTop: 'var(--spacing-lg)',
                paddingTop: 'var(--spacing-md)',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                textAlign: 'center',
                opacity: 0.7
            }}>
                &copy; {new Date().getFullYear()} Kisan Bazaar. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
