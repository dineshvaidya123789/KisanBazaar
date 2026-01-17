import React, { useState, useEffect } from 'react';
import { getMandiRates } from '../data/mandiRates';

const PriceAdvisor = ({ commodity, district, enteredPrice }) => {
    const [marketData, setMarketData] = useState(null);
    const [feedback, setFeedback] = useState(null);

    // Fetch market data when commodity or district changes
    useEffect(() => {
        if (!commodity || !district) {
            setMarketData(null);
            return;
        }

        // Get rates for the selected district (simulated mandi)
        const rates = getMandiRates(district);

        // Find the specific crop
        // We use a simple includes check to match "Wheat" with "Wheat (गेहूं)"
        const crop = rates.find(c =>
            c.name.toLowerCase().includes(commodity.toLowerCase()) ||
            commodity.toLowerCase().includes(c.name.split(' ')[0].toLowerCase())
        );

        if (crop) {
            setMarketData(crop);
        } else {
            setMarketData(null);
        }
    }, [commodity, district]);

    // Analyze price when marketData or enteredPrice changes
    useEffect(() => {
        if (!marketData || !enteredPrice) {
            setFeedback(null);
            return;
        }

        const price = parseFloat(enteredPrice);
        if (isNaN(price)) return;

        const { min, max, modal } = marketData;

        if (price < min * 0.8) {
            setFeedback({
                type: 'warning',
                color: '#E65100', // Orange
                bg: '#FFF3E0',
                icon: '📉',
                message: "Price is much lower than market rates. You might be undervaluing your produce.",
                hindiMessage: "मूल्य बाजार भाव से बहुत कम है। आप अपनी उपज का कम मूल्यांकन कर रहे हैं।"
            });
        } else if (price > max * 1.3) {
            setFeedback({
                type: 'caution',
                color: '#C62828', // Red
                bg: '#FFEBEE',
                icon: '📈',
                message: "Price is significantly higher than market rates. Buyers may not be interested.",
                hindiMessage: "मूल्य बाजार भाव से काफी अधिक है। खरीदार रुचि नहीं ले सकते हैं।"
            });
        } else if (price >= min && price <= max) {
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

    }, [marketData, enteredPrice]);

    if (!marketData) return null;

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
                    📊 Market Rate in {district} (बाजार भाव):
                </strong>
                <span style={{
                    backgroundColor: '#f5f5f5',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                }}>
                    ₹{marketData.min} - ₹{marketData.max} / Quintal
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
