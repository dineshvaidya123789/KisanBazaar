import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getWeather } from '../services/weatherService';
import { detectWeatherAlerts } from '../utils/weatherAlerts';
import { allSchemes, isNewScheme } from '../data/govtSchemes';
import { generateRates } from '../data/mandiRates';

const AlertContext = createContext();

export const useAlerts = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    // Initialize alerts from localStorage
    useEffect(() => {
        const savedAlerts = localStorage.getItem('kisan_alerts');
        if (savedAlerts) {
            const parsed = JSON.parse(savedAlerts);
            setAlerts(parsed);
            setUnreadCount(parsed.filter(a => !a.read).length);
        }
    }, []);

    // Save alerts to localStorage
    useEffect(() => {
        localStorage.setItem('kisan_alerts', JSON.stringify(alerts));
        setUnreadCount(alerts.filter(a => !a.read).length);
    }, [alerts]);

    const addAlert = useCallback((newAlert) => {
        setAlerts(prev => {
            // Avoid duplicate alerts for same type/id within a short window
            const exists = prev.find(a =>
                (a.id === newAlert.id && a.type === newAlert.type) ||
                (a.title === newAlert.title && a.timestamp > Date.now() - 3600000)
            );
            if (exists) return prev;

            return [{ ...newAlert, read: false, timestamp: Date.now() }, ...prev].slice(0, 20);
        });
    }, []);

    const markAsRead = (id) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
    };

    const clearAll = () => {
        setAlerts([]);
    };

    // Alert Detection Logic
    useEffect(() => {
        const runDetection = async () => {
            // 1. Weather Alerts (Based on default district for now)
            try {
                const weatherData = await getWeather('Indore');
                const weatherAlerts = detectWeatherAlerts(weatherData);
                weatherAlerts.forEach(wa => {
                    if (wa.severity === 'high' || wa.severity === 'severe') {
                        addAlert({
                            id: `weather-${wa.type}-${Date.now()}`,
                            type: 'weather',
                            severity: wa.severity,
                            icon: wa.icon,
                            title: wa.title,
                            titleHi: wa.titleHindi,
                            titleMr: wa.titleMarathi || wa.titleHindi,
                            message: wa.message,
                            messageHi: wa.messageHindi,
                            messageMr: wa.messageMarathi || wa.messageHindi,
                            whatsappMsg: `⛈️ *Weather Alert:* ${wa.title} (${wa.titleHindi})\n${wa.message}\nTake action: ${wa.actions?.join(', ')}`
                        });
                    }
                });
            } catch (e) {
                console.error("Alert detection weather error:", e);
            }

            // 2. Price Changes
            // Mock: We compare generated rates for "Today" vs "Yesterday"
            const todayArr = generateRates('Indore', new Date());
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayArr = generateRates('Indore', yesterday);

            todayArr.forEach(todayCrop => {
                const yestCrop = yesterdayArr.find(c => c.name === todayCrop.name);
                if (yestCrop) {
                    const diff = ((todayCrop.modal - yestCrop.modal) / yestCrop.modal) * 100;

                    // Drop > 10%
                    if (diff <= -10) {
                        addAlert({
                            id: `price-drop-${todayCrop.name}-${Date.now()}`,
                            type: 'market-drop',
                            severity: 'medium',
                            icon: '📉',
                            title: `Price Drop: ${todayCrop.name}`,
                            titleHi: `दाम में गिरावट: ${todayCrop.name.split(' (')[1].replace(')', '')}`,
                            titleMr: `किंमत घसरली: ${todayCrop.name.split(' (')[1].replace(')', '')}`,
                            message: `Modal price dropped by ${Math.abs(diff).toFixed(1)}% to ₹${todayCrop.modal}/qtl in Indore Mandi.`,
                            messageHi: `इन्दौर मंडी में ${todayCrop.name.split(' (')[1].replace(')', '')} के दाम ${Math.abs(diff).toFixed(1)}% गिरकर ₹${todayCrop.modal} हो गए हैं।`,
                            messageMr: `इंदूर मंडीमध्ये ${todayCrop.name.split(' (')[1].replace(')', '')} ची किंमत ${Math.abs(diff).toFixed(1)}% घसरून ₹${todayCrop.modal} झाली आहे.`,
                            whatsappMsg: `📉 *Mandi Alert:* Price Drop in ${todayCrop.name}\nDropped by ${Math.abs(diff).toFixed(1)}% to ₹${todayCrop.modal}/qtl.\nStay updated on KisanBazaar!`
                        });
                    }

                    // Increase > 10%
                    if (diff >= 10) {
                        addAlert({
                            id: `price-up-${todayCrop.name}-${Date.now()}`,
                            type: 'market-up',
                            severity: 'medium',
                            icon: '📈',
                            title: `Price Increase: ${todayCrop.name}`,
                            titleHi: `दाम में उछाल: ${todayCrop.name.split(' (')[1].replace(')', '')}`,
                            titleMr: `किंमत वाढली: ${todayCrop.name.split(' (')[1].replace(')', '')}`,
                            message: `Modal price increased by ${diff.toFixed(1)}% to ₹${todayCrop.modal}/qtl! Good time to sell.`,
                            messageHi: `${todayCrop.name.split(' (')[1].replace(')', '')} के दाम ${diff.toFixed(1)}% बढ़कर ₹${todayCrop.modal} हो गए हैं! बेचने का सही समय है।`,
                            messageMr: `${todayCrop.name.split(' (')[1].replace(')', '')} ची किंमत ${diff.toFixed(1)}% वाढून ₹${todayCrop.modal} झाली आहे! विक्रीसाठी योग्य वेळ आहे.`,
                            whatsappMsg: `📈 *Mandi Alert:* Price Increase in ${todayCrop.name}\nIncreased by ${diff.toFixed(1)}% to ₹${todayCrop.modal}/qtl. Good time to sell!`
                        });
                    }
                }
            });

            // 3. New Schemes
            allSchemes.forEach(scheme => {
                if (isNewScheme(scheme.startDate)) {
                    addAlert({
                        id: `scheme-${scheme.id}`,
                        type: 'scheme',
                        severity: 'low',
                        icon: '📜',
                        title: `New Scheme: ${scheme.title}`,
                        titleHi: `नई योजना: ${scheme.titleHi}`,
                        titleMr: `नवीन योजना: ${scheme.titleMr || scheme.titleHi}`,
                        message: scheme.benefit,
                        messageHi: scheme.benefitHi,
                        messageMr: scheme.benefitMr || scheme.benefitHi,
                        whatsappMsg: `📜 *Govt Scheme:* ${scheme.title}\n${scheme.benefit}\nApply here: ${scheme.applyUrl}`
                    });
                }
            });
        };

        // Run detection every 1 hour (or on load)
        runDetection();
        const interval = setInterval(runDetection, 3600000);
        return () => clearInterval(interval);
    }, [addAlert]);

    return (
        <AlertContext.Provider value={{ alerts, unreadCount, isAlertOpen, setIsAlertOpen, markAsRead, clearAll, addAlert }}>
            {children}
        </AlertContext.Provider>
    );
};
