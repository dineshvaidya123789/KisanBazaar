import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getLanguageSuggestion } from '../utils/locationUtils';
import './LanguageSelectionModal.css';

const LanguageSelectionModal = () => {
    const { language, changeLanguage, showLanguageModal, closeLanguageModal } = useLanguage();
    const [suggestedLang, setSuggestedLang] = useState(null);
    const [detectedState, setDetectedState] = useState(null);
    const [isDetecting, setIsDetecting] = useState(true);

    useEffect(() => {
        // Only detect location if modal is shown and it's first visit
        if (showLanguageModal) {
            detectLocation();
        }
    }, [showLanguageModal]);

    const detectLocation = async () => {
        setIsDetecting(true);
        const suggestion = await getLanguageSuggestion();
        setSuggestedLang(suggestion.language);
        setDetectedState(suggestion.state);
        setIsDetecting(false);
    };

    const handleLanguageSelect = (lang) => {
        changeLanguage(lang);
        // Mark that user has selected language
        localStorage.setItem('kisan_bazaar_language_selected', 'true');
        closeLanguageModal();
    };

    if (!showLanguageModal) return null;

    const languages = [
        {
            code: 'en',
            name: 'English',
            nativeName: 'English',
            flag: '🇬🇧',
            greeting: 'Welcome'
        },
        {
            code: 'hi',
            name: 'Hindi',
            nativeName: 'हिंदी',
            flag: '🇮🇳',
            greeting: 'स्वागत है'
        },
        {
            code: 'mr',
            name: 'Marathi',
            nativeName: 'मराठी',
            flag: '🇮🇳',
            greeting: 'स्वागत आहे'
        }
    ];

    return (
        <div className="language-modal-overlay">
            <div className="language-modal-content">
                {/* Welcome Header with Logo */}
                <div className="language-modal-header">
                    <div className="language-modal-logo">
                        <img
                            src="/images/logo.png"
                            alt="Kisan Bazaar Logo"
                            style={{
                                height: '60px',
                                width: 'auto',
                                objectFit: 'contain',
                                marginBottom: '1rem'
                            }}
                        />
                    </div>
                    <h1 className="language-modal-title">
                        KisanBazaar
                    </h1>
                    <p className="language-modal-subtitle">
                        Welcome to Kisan Bazaar
                    </p>
                    <p className="language-modal-subtitle-multi">
                        किसान बाजार में आपका स्वागत है<br />
                        किसान बाजारमध्ये आपले स्वागत आहे
                    </p>
                </div>

                {/* Instruction */}
                <p className="language-modal-instruction">
                    Choose your preferred language:
                </p>

                {/* Location Detection Info */}
                {isDetecting && (
                    <div className="language-modal-detecting">
                        <div className="spinner-small"></div>
                        <span>Detecting your location...</span>
                    </div>
                )}

                {detectedState && !isDetecting && (
                    <div className="language-modal-location">
                        📍 Based on your location: <strong>{detectedState}</strong>
                    </div>
                )}

                {/* Language Cards */}
                <div className="language-cards-container">
                    {languages.map((lang) => {
                        const isSuggested = suggestedLang === lang.code && !isDetecting;
                        const isCurrent = language === lang.code;

                        return (
                            <button
                                key={lang.code}
                                className={`language-card ${isSuggested ? 'suggested' : ''} ${isCurrent ? 'current' : ''}`}
                                onClick={() => handleLanguageSelect(lang.code)}
                            >
                                <div className="language-card-flag">{lang.flag}</div>
                                <div className="language-card-name">{lang.nativeName}</div>
                                <div className="language-card-english">{lang.name}</div>
                                {isSuggested && (
                                    <div className="language-card-badge">
                                        ⭐ Suggested
                                    </div>
                                )}
                                {isCurrent && (
                                    <div className="language-card-badge current-badge">
                                        ✓ Current
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Footer Note */}
                <p className="language-modal-footer">
                    You can change this anytime from the language selector
                </p>
            </div>
        </div>
    );
};

export default LanguageSelectionModal;
