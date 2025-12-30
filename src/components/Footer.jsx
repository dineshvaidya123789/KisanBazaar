import React from 'react';
import { Link } from 'react-router-dom';
import FeedbackForm from './FeedbackForm';

const Footer = () => {
    return (
        <footer style={{
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            padding: 'var(--spacing-xl) 0',
            marginTop: 'auto'
        }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)' }}>

                {/* Brand */}
                <div>
                    <h3 style={{ color: 'white', marginBottom: 'var(--spacing-md)' }}>किसान बाज़ार</h3>
                    <p style={{ opacity: 0.9 }}>
                        किसानों के लिए एक आधुनिक मंच।<br />
                        अपनी फसल बेचें और नई तकनीक अपनाएं।
                    </p>
                </div>

                {/* Links */}
                <div>
                    <h4 style={{ color: 'var(--color-secondary)', marginBottom: 'var(--spacing-md)' }}>महत्वपूर्ण लिंक</h4>
                    <ul style={{ listStyle: 'none', opacity: 0.9 }}>
                        <li style={{ marginBottom: '8px' }}><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home (होम)</Link></li>
                        <li style={{ marginBottom: '8px' }}><Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>About Us (हमारे बारे में)</Link></li>
                        <li style={{ marginBottom: '8px' }}><Link to="/advisory" style={{ color: 'white', textDecoration: 'none' }}>Integrated Farming (एकीकृत खेती)</Link></li>
                        <li style={{ marginBottom: '8px' }}><Link to="/help" style={{ color: 'white', textDecoration: 'none' }}>Help (सहायता)</Link></li>
                        <li style={{ marginBottom: '8px' }}><Link to="/privacy" style={{ color: 'white', textDecoration: 'none' }}>Privacy Policy (गोपनीयता नीति)</Link></li>
                        <li style={{ marginBottom: '8px' }}><Link to="/partner" style={{ color: 'white', textDecoration: 'none' }}>Be A Partner (हमसे जुड़े)</Link></li>
                        <li style={{ marginBottom: '8px' }}><Link to="/admin/dashboard" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.8rem' }}>Admin Dashboard</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 style={{ color: 'var(--color-secondary)', marginBottom: 'var(--spacing-md)' }}>संपर्क करें</h4>
                    <p style={{ marginBottom: '8px' }}>बुरहानपुर, मध्य प्रदेश</p>
                    <p style={{ marginBottom: '8px' }}>ईमेल: support@kisanbazaar.com</p>
                    <p>फोन: +91 99879 17394</p>
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
