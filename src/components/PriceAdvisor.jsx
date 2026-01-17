import React, { useState, useEffect } from 'react';
import { getMandiRates, baseCrops } from '../data/mandiRates';

const PriceAdvisor = ({ commodity, district, enteredPrice, priceUnit }) => {
    const [marketData, setMarketData] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [isEst, setIsEst] = useState(false);

    // Fetch market data when commodity or district changes
    useEffect(() => {
        if (!commodity) {
            setMarketData(null);
            return;
        }

        // 1. Try to get local rates for the district
        const safeDistrict = district || "";
        const rates = getMandiRates(safeDistrict);

        // Find the specific crop in local rates
        let crop = rates.find(c =>
            c.name.toLowerCase().includes(commodity.toLowerCase()) ||
            commodity.toLowerCase().includes(c.name.split(' ')[0].toLowerCase())
        );

        if (crop) {
            setMarketData(crop);
            setIsEst(false);
        } else {
            // 2. Fallback to Base Crops (National Average) if not in local mandi
            const baseCrop = baseCrops.find(c =>
                c.name.toLowerCase().includes(commodity.toLowerCase()) ||
                commodity.toLowerCase().includes(c.name.split(' ')[0].toLowerCase())
            );

            if (baseCrop) {
                setMarketData({
                    ...baseCrop,
                    min: baseCrop.basePrice - 200,
                    max: baseCrop.basePrice + 200,
                    modal: baseCrop.basePrice
                });
                setIsEst(true);
            } else {
                setMarketData(null);
            }
        }
    }, [commodity, district]);

    // Analyze price when marketData, enteredPrice, or priceUnit changes
    useEffect(() => {
        if (!marketData || !enteredPrice || !priceUnit) {
            setFeedback(null);
            return;
        }

        const price = parseFloat(enteredPrice);
        if (isNaN(price)) return;

        let { min, max } = marketData;

        // Convert Market Rates (always in Quintal) to User's Selected Unit
        // 1 Quintal = 100 Kg
        // 1 Ton = 10 Quintal

        let adjustedMin = min;
        let adjustedMax = max;

        if (priceUnit === 'Kg') {
            adjustedMin = min / 100;
            adjustedMax = max / 100;
        } else if (priceUnit === 'Ton') {
            adjustedMin = min * 10;
            adjustedMax = max * 10;
        }
        // If Quintal, no change needed

        if (price < adjustedMin * 0.8) {
            setFeedback({
                type: 'warning',
                color: '#E65100', // Orange
                bg: '#FFF3E0',
                icon: '📉',
                message: "Price is much lower than market rates. You might be undervaluing your produce.",
                hindiMessage: "मूल्य बाजार भाव से बहुत कम है। आप अपनी उपज का कम मूल्यांकन कर रहे हैं।"
            });
        } else if (price > adjustedMax * 1.3) {
            setFeedback({
                type: 'caution',
                color: '#C62828', // Red
                bg: '#FFEBEE',
                icon: '📈',
                message: "Price is significantly higher than market rates. Buyers may not be interested.",
                hindiMessage: "मूल्य बाजार भाव से काफी अधिक है। खरीदार रुचि नहीं ले सकते हैं।"
            });
        } else if (price >= adjustedMin && price <= adjustedMax) {
            setFeedback({
                type: 'good',
                color: '#2E7D32', // Green
                bg: '#E8F5E9',
                icon: '✅',
                message: "Perfect! This is a competitive market price.",
                hindiMessage: "सही है! यह एक प्रतिस्पर्धी बाजार मूल्य है।"
            });
        } else {
            setFeedback({
                type: 'neutral',
                color: '#1565C0', // Blue
                bg: '#E3F2FD',
                icon: 'ℹ️',
                message: "Price is reasonable.",
                hindiMessage: "मूल्य उचित है।"
            });
        }

    }, [marketData, enteredPrice, priceUnit]);

    if (!marketData) {
        return (
            <div className="fade-in" style={{
                marginTop: '10px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: '#f8f9fa',
                color: '#666',
                fontSize: '0.9rem',
                textAlign: 'center'
            }}>
                Requires more market data for <strong>{commodity}</strong>.
                <br />
                <span style={{ fontSize: '0.8rem' }}>Please set your price competitively based on local trends.</span>
            </div>
        );
    }

    // Display rate in the user's selected unit for clarity
    const getDisplayRate = (rate) => {
        if (priceUnit === 'Kg') return (rate / 100).toFixed(1);
        if (priceUnit === 'Ton') return (rate * 10).toFixed(0);
        return rate;
    };

    return (
        <div className="fade-in" style={{
            marginTop: '10px',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ color: '#555', fontSize: '0.9rem' }}>
                    📊 {isEst ? 'Est. Market Rate' : `Market Rate in ${district}`} ({isEst ? 'अनुमानित दर' : 'बाजार भाव'}):
                </strong>
                <span style={{
                    backgroundColor: '#f5f5f5',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                }}>
                    ₹{getDisplayRate(marketData.min)} - ₹{getDisplayRate(marketData.max)} / {priceUnit || 'Quintal'}
                </span>
            </div>

            {feedback && (
                <div style={{
                    backgroundColor: feedback.bg,
                    color: feedback.color,
                    padding: '10px',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'start'
                }}>
                    <span style={{ fontSize: '1.2rem' }}>{feedback.icon}</span>
                    <div>
                        <div style={{ fontWeight: 'bold' }}>{feedback.message}</div>
                        <div style={{ opacity: 0.9 }}>{feedback.hindiMessage}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PriceAdvisor;
