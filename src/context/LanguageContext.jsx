import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('kb_language') || 'en';
    });

    useEffect(() => {
        localStorage.setItem('kb_language', language);
    }, [language]);

    const t = (key) => {
        return translations[language][key] || key;
    };

    const changeLanguage = (newLang) => {
        if (translations[newLang]) {
            setLanguage(newLang);
        }
    };

    return (
        <LanguageContext.Provider value={{ language, t, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
