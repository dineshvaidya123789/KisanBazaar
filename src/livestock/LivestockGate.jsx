import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useLivestockConfig } from './useLivestockConfig';
import { makeT } from './texts';

// Shows its children only while the livestock module is switched on, or to the admin (same rule as the pages themselves).
// Used for the home-page tile and the menu link, so nothing about livestock appears for the public until launch.
// children is a function that receives the translator: <LivestockGate>{(tx) => ...}</LivestockGate>
const LivestockGate = ({ children }) => {
    const { user } = useAuth();
    const { language } = useLanguage();
    const { config, loaded } = useLivestockConfig();
    const tx = useMemo(() => makeT(language), [language]);
    const isAdmin = !!user && user.role === 'Admin';
    if (!loaded || !(config.enabled || isAdmin)) return null;
    return children(tx);
};

export default LivestockGate;
