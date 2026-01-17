import React, { useEffect } from 'react';

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sectionStyle = {
        marginBottom: '2rem',
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid #f1f5f9'
    };

    const h2Style = {
        color: 'var(--color-primary)',
        fontSize: '1.25rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    };

    return (
        <div style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'var(--font-family-base)', lineHeight: '1.6' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--color-dark)', marginBottom: '0.5rem' }}>Privacy Policy (गोपनीयता नीति)</h1>
                <p style={{ color: '#64748b' }}>Last updated: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </div>

            <div style={sectionStyle}>
                <h2 style={h2Style}><span>🛡️</span> 1. Introduction (परिचय)</h2>
                <p>Welcome to <strong>Kisan Bazaar</strong>. Your privacy is critical to us. We build this platform to help farmers and buyers connect safely. This policy explains how we handle your information in compliance with Indian Digital Personal Data Protection (DPDP) standards.</p>
                <p style={{ fontStyle: 'italic', color: '#475569' }}>Kisan Bazaar में आपका स्वागत है। आपकी गोपनीयता हमारे लिए महत्वपूर्ण है। यह नीति बताती है कि हम आपकी जानकारी का उपयोग कैसे करते हैं।</p>
            </div>

            <div style={sectionStyle}>
                <h2 style={h2Style}><span>📊</span> 2. Data We Collect (हम क्या जानकारी लेते हैं)</h2>
                <ul style={{ paddingLeft: '1.2rem' }}>
                    <li><strong>Basic Info:</strong> Name, Mobile Number, and Location.</li>
                    <li><strong>Usage Data:</strong> How you use our search and marketplace.</li>
                    <li><strong>Communication:</strong> Feedback and help requests you send us.</li>
                </ul>
                <p style={{ marginTop: '10px', fontStyle: 'italic', color: '#475569' }}>हम आपका नाम, मोबाइल नंबर, स्थान और आपके द्वारा भेजी गई प्रतिक्रियाएँ एकत्रित करते हैं।</p>
            </div>

            <div style={sectionStyle}>
                <h2 style={h2Style}><span>⚙️</span> 3. How We Use Data (उपयोग कैसे करते हैं)</h2>
                <p>We use your data only to:</p>
                <ul style={{ paddingLeft: '1.2rem' }}>
                    <li>Display your listings to potential buyers.</li>
                    <li>Send you critical weather and price alerts.</li>
                    <li>Improve our app services for farmers.</li>
                </ul>
                <p style={{ marginTop: '10px', fontStyle: 'italic', color: '#475569' }}>हम आपकी जानकारी का उपयोग केवल आपको खरीदारों से जोड़ने और महत्वपूर्ण अलर्ट भेजने के लिए करते हैं।</p>
            </div>

            <div style={sectionStyle}>
                <h2 style={h2Style}><span>🤝</span> 4. Sharing Your Data (डेटा साझा करना)</h2>
                <p>We <strong>NEVER</strong> sell your data to third parties. Your mobile number is only visible to buyers if you post a "Sell" listing, to facilitate a direct deal.</p>
                <p style={{ fontStyle: 'italic', color: '#475569' }}>हम आपका डेटा किसी को नहीं बेचते। आपका नंबर केवल खरीदारों को तभी दिखता है जब आप बेचने के लिए जानकारी पोस्ट करते हैं।</p>
            </div>

            <div style={sectionStyle}>
                <h2 style={h2Style}><span>✅</span> 5. Your Rights (आपके अधिकार)</h2>
                <ul style={{ paddingLeft: '1.2rem' }}>
                    <li><strong>Access:</strong> You can see all your data in your Profile.</li>
                    <li><strong>Erasure:</strong> You can request us to delete all your info at any time.</li>
                    <li><strong>Correction:</strong> You can update your mobile or name anytime.</li>
                </ul>
                <p style={{ fontStyle: 'italic', color: '#475569' }}>आप अपनी जानकारी कभी भी देख सकते हैं, सुधार सकते हैं या मिटाने का अनुरोध कर सकते हैं।</p>
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem', borderTop: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>If you have any questions, please contact us via the <strong>Help</strong> section.</p>
                <button
                    onClick={() => window.history.back()}
                    className="btn btn-primary"
                    style={{ marginTop: '1.5rem', padding: '0.75rem 2rem' }}
                >
                    Go Back (वापस जाएं)
                </button>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
