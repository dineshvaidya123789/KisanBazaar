import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        const handler = (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI to notify the user they can add to home screen
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="slide-in" style={{
            position: 'fixed',
            bottom: '80px', // Above bottom nav
            left: '20px',
            right: '20px',
            backgroundColor: '#166534', // Dark green
            color: 'white',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            maxWidth: '400px',
            margin: '0 auto'
        }}>
            <div>
                <strong style={{ display: 'block', fontSize: '1rem', marginBottom: '4px' }}>
                    {t('install_app_title')}
                </strong>
                <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                    {t('install_app_desc')}
                </span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
                <button
                    onClick={() => setIsVisible(false)}
                    style={{
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.3)',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                    }}
                >
                    {t('close')}
                </button>
                <button
                    onClick={handleInstallClick}
                    style={{
                        background: 'white',
                        border: 'none',
                        color: '#166534',
                        padding: '6px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                    }}
                >
                    {t('install')}
                </button>
            </div>
        </div>
    );
};

export default InstallPrompt;
