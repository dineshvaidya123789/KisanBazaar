import React from 'react';

const About = () => {
    return (
        <div className="fade-in" style={{
            padding: '2rem 1rem',
            maxWidth: '1000px',
            margin: '0 auto',
            fontFamily: 'var(--font-family-base)',
            lineHeight: '1.6',
            color: '#333'
        }}>
            {/* Hero Section */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ color: 'var(--color-primary)', fontSize: '2.5rem', marginBottom: '1rem' }}>
                    About Us <br />
                    <span className="text-hindi" style={{ fontSize: '1.5rem', opacity: 0.9 }}>हमारा उद्देश्य (हमारे बारे में)</span>
                </h1>
                <p style={{ fontSize: '1.2rem', color: '#555', maxWidth: '800px', margin: '0 auto' }}>
                    Empowering farmers with technology to create a fair, transparent, and profitable marketplace.
                    <br />
                    <span className="text-hindi">किसानों को तकनीक से जोड़कर एक निष्पक्ष और पारदर्शी मंडी बनाना।</span>
                </p>
            </div>

            {/* Mission Section */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem', borderLeft: '5px solid var(--color-secondary)' }}>
                <h2 style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    🎯 Our Mission (हमारा लक्ष्य)
                </h2>
                <p>
                    Kisan Bazaar is dedicated to eliminating middlemen and connecting farmers directly with buyers. We believe that every farmer deserves the best price for their hard work.
                </p>
                <p className="text-hindi" style={{ color: '#555', marginTop: '0.5rem' }}>
                    किसान बाज़ार का मुख्य उद्देश्य बिचौलियों को हटाकर किसानों को सीधे खरीददारों से जोड़ना है। हमारा मानना है कि हर किसान को उसकी मेहनत का सही दाम मिलना चाहिए।
                </p>
            </div>

            {/* What We Do */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <div className="card" style={{ backgroundColor: '#f9f9f9' }}>
                    <h3 style={{ color: '#E65100' }}>🤝 Direct Trade (सीधा व्यापार)</h3>
                    <p>
                        A platform where farmers can list their produce and negotiate directly with bulk buyers, retailers, and exporters.
                    </p>
                    <p className="text-hindi" style={{ fontSize: '0.9rem', color: '#666' }}>
                        एक ऐसा मंच जहाँ किसान अपनी फसल की लिस्टिंग कर सकते हैं और सीधे व्यापारियों से सौदा कर सकते हैं।
                    </p>
                </div>
                <div className="card" style={{ backgroundColor: '#f9f9f9' }}>
                    <h3 style={{ color: '#2E7D32' }}>🌦️ Smart Farming (स्मार्ट खेती)</h3>
                    <p>
                        Providing real-time weather forecasts, farming advisories, and latest government schemes to help you plan better.
                    </p>
                    <p className="text-hindi" style={{ fontSize: '0.9rem', color: '#666' }}>
                        मौसम की सटीक जानकारी, खेती की सलाह और सरकारी योजनाओं की जानकारी ताकि आप बेहतर योजना बना सकें।
                    </p>
                </div>
                <div className="card" style={{ backgroundColor: '#f9f9f9' }}>
                    <h3 style={{ color: '#1565C0' }}>📈 Market Rates (मंडी भाव)</h3>
                    <p>
                        Daily mandi rates from major markets in Madhya Pradesh to keep you updated on current trends.
                    </p>
                    <p className="text-hindi" style={{ fontSize: '0.9rem', color: '#666' }}>
                        मध्य प्रदेश की प्रमुख मंडियों के दैनिक भाव ताकि आप मौजूदा रुझानों से अपडेट रहें।
                    </p>
                </div>
            </div>

            {/* Founder/Context Note (Generic) */}
            <div style={{ textAlign: 'center', background: '#E8F5E9', padding: '2rem', borderRadius: '12px' }}>
                <h3 style={{ margin: '0 0 1rem 0' }}>Built for the Farmers of Bharat</h3>
                <p style={{ fontStyle: 'italic', fontSize: '1.1rem' }}>
                    "Jai Jawan, Jai Kisan"
                </p>
                <p>
                    We are a team of passionate developers and agriculture enthusiasts working to bring the digital revolution to every farm.
                </p>
            </div>
        </div>
    );
};

export default About;
