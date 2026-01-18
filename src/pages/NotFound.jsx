import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const NotFound = () => {
    const { t } = useLanguage();

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            padding: '2rem'
        }}>
            <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>🚜</div>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
                404 - {t('page_not_found') || 'Page Not Found'}
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
                {t('page_not_found_desc') || "Oops! The page you are looking for does not exist."}
            </p>
            <Link to="/" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
                {t('back_to_home')}
            </Link>
        </div>
    );
};

export default NotFound;
