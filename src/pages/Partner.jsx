import React, { useState } from 'react';

const Partner = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        city: '',
        country: 'India',
        companyName: '',
        webAddress: '',
        activities: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Save to local storage for admin view
        const existingPartners = JSON.parse(localStorage.getItem('kisan_partners') || '[]');
        const newPartner = {
            ...formData,
            id: Date.now(),
            timestamp: new Date().toLocaleString()
        };
        localStorage.setItem('kisan_partners', JSON.stringify([newPartner, ...existingPartners]));

        alert(`Thank you, ${formData.name}! Your partnership request has been submitted.\n(धन्यवाद! आपका अनुरोध जमा कर दिया गया है।)`);
        // Reset form
        setFormData({
            name: '',
            phone: '',
            email: '',
            city: '',
            country: 'India',
            companyName: '',
            webAddress: '',
            activities: ''
        });
    };

    return (
        <div style={{
            /* Using the premium background pattern */
            backgroundImage: 'url("/images/pattern.png"), linear-gradient(180deg, #f9f9f9 0%, #e6f0e9 100%)',
            backgroundBlendMode: 'multiply',
            minHeight: '90vh',
            padding: 'var(--spacing-xl) 0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: 'var(--shadow-md)',
                    overflow: 'hidden',
                    border: '1px solid #eee'
                }}>
                    {/* Header Section */}
                    {/* Header Section */}
                    <div style={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        padding: '2rem',
                        textAlign: 'center'
                    }}>
                        <h1 style={{ margin: 0, fontSize: '2rem', fontFamily: 'serif' }}>Be A Partner (हमसे जुड़े)</h1>
                        <p style={{ marginTop: '0.5rem', opacity: 0.9 }}>
                            Join our network and grow with KisanBazaar (किसान बाज़ार के साथ जुड़ें और आगे बढ़ें)
                        </p>
                        <div style={{ marginTop: '1.5rem', fontSize: '0.95rem', lineHeight: '1.6', opacity: 0.9, maxWidth: '600px', margin: '1.5rem auto 0', textAlign: 'center' }}>
                            <p style={{ marginBottom: '0.4rem' }}>If you are interested to be a part of KisanBazaar then fill up following detail.</p>
                            <p>Our top management and commerce department will contact you. <strong style={{ color: 'white' }}>Thank You!</strong></p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>

                        {/* Responsive Grid Logic via CSS */}
                        <style>{`
                            .partner-grid {
                                display: grid;
                                grid-template-columns: 1fr 1fr;
                                gap: 1.5rem;
                            }
                            @media (max-width: 768px) {
                                .partner-grid {
                                    grid-template-columns: 1fr !important;
                                    gap: 1rem !important;
                                }
                                .partner-grid > div {
                                    grid-column: span 1 !important;
                                }
                                .partner-card-content {
                                    padding: 1rem !important;
                                }
                            }
                        `}</style>

                        <div className="partner-grid">

                            {/* Name */}
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#444' }}>Name (नाम) *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Enter your Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#444' }}>Phone Number (मोबाइल) *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    pattern="[0-9]{10}"
                                    title="Please enter a valid 10-digit mobile number"
                                    placeholder="Enter 10-digit Mobile Number"
                                    value={formData.phone}
                                    onChange={(e) => {
                                        // Only allow numbers
                                        const val = e.target.value.replace(/\D/g, '');
                                        if (val.length <= 10) handleChange({ target: { name: 'phone', value: val } });
                                    }}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#444' }}>Email (ईमेल) *</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="Enter your Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}
                                />
                            </div>

                            {/* City */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#444' }}>City (शहर) *</label>
                                <input
                                    type="text"
                                    name="city"
                                    required
                                    placeholder="Enter your city name"
                                    value={formData.city}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}
                                />
                            </div>

                            {/* Country */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#444' }}>Country (देश)</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    readOnly
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #eee', backgroundColor: '#f5f5f5', color: '#777' }}
                                />
                            </div>

                            {/* Company Name (Span 2 on desktop, auto on mobile via CSS above) */}
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#444' }}>Company Name (कंपनी का नाम) *</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    required
                                    placeholder="Enter your Company Name"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}
                                />
                            </div>

                            {/* Web Address */}
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#444' }}>Web Address (वेबसाइट)</label>
                                <input
                                    type="url"
                                    name="webAddress"
                                    placeholder="https://example.com"
                                    value={formData.webAddress}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}
                                />
                                <small style={{ color: '#666', fontSize: '0.8rem' }}>Format: https://example.com</small>
                            </div>

                            {/* Company Activities */}
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#444' }}>Company Activities (कंपनी की गतिविधियाँ) *</label>
                                <textarea
                                    name="activities"
                                    rows="4"
                                    required
                                    placeholder="Describe what your company does..."
                                    value={formData.activities}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc', resize: 'vertical' }}
                                ></textarea>
                            </div>

                        </div>

                        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{
                                    padding: '1rem 3rem',
                                    fontSize: '1.2rem',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                    width: '100%' // Full width button on mobile
                                }}
                            >
                                Submit Request (अनुरोध भेजें)
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Partner;
