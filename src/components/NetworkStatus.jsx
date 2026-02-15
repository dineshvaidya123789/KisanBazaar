import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useLanguage } from '../context/LanguageContext';

const NetworkStatus = () => {
    const isOnline = useOnlineStatus();
    const { t } = useLanguage();

    if (isOnline) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#ff9800',
            color: 'white',
            textAlign: 'center',
            padding: '8px 16px',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            animation: 'slideDown 0.3s ease-out'
        }}>
            <span>⚠️ {t('offline_msg')}</span>
        </div>
    );
};

export default NetworkStatus;
