import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FPORegistration = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        fpoName: '',
        regNumber: '',
        contactPerson: '',
        phone: '',
        email: '',
        memberCount: '',
        district: '',
        primaryCrops: '',
        activities: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate registration process
        setTimeout(async () => {
            try {
                // Automaticaly log in as the newly registered FPO for demo purposes
                await login(formData.phone, '1234', 'FPO');
                alert(`Welcome, ${formData.fpoName}! Your FPO has been successfully registered.\n(स्वागत है! आपका FPO सफलतापूर्वक पंजीकृत हो गया है।)`);
                navigate('/profile');
            } catch (error) {
                alert(error);
            } finally {
                setIsSubmitting(false);
            }
        }, 1500);
    };

    return (
        <div style={{
            backgroundImage: 'url("/images/pattern.png"), linear-gradient(135deg, #1a2a6c 0%, #b21f1f 50%, #fdbb2d 100%)',
            backgroundBlendMode: 'overlay',
            minHeight: '100vh',
            padding: '4rem 1rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '24px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                width: '100%',
                maxWidth: '900px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Header Section */}
                <div style={{
                    background: 'linear-gradient(90deg, #2196F3, #21CBF3)',
                    color: 'white',
                    padding: '3rem 2rem',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏛️</div>
                    <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.5px' }}>FPO Institutional Onboarding</h1>
                    <p style={{ fontSize: '1.2rem', opacity: 0.9, marginTop: '0.5rem' }}>
                        Empowering Farmer Producer Organizations (कृषक उत्पादक संगठनों का सशक्तिकरण)
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} style={{ padding: '3rem' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem'
                    }}>
                        {/* FPO Basic Info */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <h3 style={{ borderBottom: '2px solid #2196F3', paddingBottom: '0.5rem', color: '#1a2a6c', marginBottom: '1.5rem' }}>Institutional Details</h3>
                        </div>

                        <div>
                            <label style={labelStyle}>FPO Name (FPO का नाम) *</label>
                            <input
                                type="text"
                                name="fpoName"
                                required
                                value={formData.fpoName}
                                onChange={handleChange}
                                placeholder="e.g. Malwa Organic Producers Ltd"
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Registration/CIN Number *</label>
                            <input
                                type="text"
                                name="regNumber"
                                required
                                value={formData.regNumber}
                                onChange={handleChange}
                                placeholder="U01111MP2024PTC..."
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Total Members (कुल सदस्य) *</label>
                            <input
                                type="number"
                                name="memberCount"
                                required
                                value={formData.memberCount}
                                onChange={handleChange}
                                placeholder="Number of farmers"
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>District (जिला) *</label>
                            <input
                                type="text"
                                name="district"
                                required
                                value={formData.district}
                                onChange={handleChange}
                                placeholder="e.g. Indore"
                                style={inputStyle}
                            />
                        </div>

                        {/* Contact Info */}
                        <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                            <h3 style={{ borderBottom: '2px solid #2196F3', paddingBottom: '0.5rem', color: '#1a2a6c', marginBottom: '1.5rem' }}>Contact Information</h3>
                        </div>

                        <div>
                            <label style={labelStyle}>Contact Person Name *</label>
                            <input
                                type="text"
                                name="contactPerson"
                                required
                                value={formData.contactPerson}
                                onChange={handleChange}
                                placeholder="CEO or Chairperson Name"
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Phone Number *</label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="10 Digit Number"
                                style={inputStyle}
                            />
                        </div>

                        {/* Crops & Activities */}
                        <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                            <h3 style={{ borderBottom: '2px solid #2196F3', paddingBottom: '0.5rem', color: '#1a2a6c', marginBottom: '1.5rem' }}>Operational Details</h3>
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={labelStyle}>Primary Crops Managed (प्रमुख फसलें) *</label>
                            <input
                                type="text"
                                name="primaryCrops"
                                required
                                value={formData.primaryCrops}
                                onChange={handleChange}
                                placeholder="Wheat, Soybean, Potato, etc."
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={labelStyle}>FPO Activities (FPO की गतिविधियाँ) *</label>
                            <textarea
                                name="activities"
                                rows="3"
                                required
                                value={formData.activities}
                                onChange={handleChange}
                                placeholder="Aggregation, Seed distribution, Processing, etc."
                                style={{ ...inputStyle, resize: 'vertical' }}
                            ></textarea>
                        </div>
                    </div>

                    <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                background: 'linear-gradient(90deg, #1a2a6c, #b21f1f)',
                                color: 'white',
                                padding: '1.2rem 4rem',
                                borderRadius: '50px',
                                border: 'none',
                                fontSize: '1.3rem',
                                fontWeight: '700',
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
                                width: '100%'
                            }}
                        >
                            {isSubmitting ? 'Processing...' : 'Register as Institutional FPO'}
                        </button>
                        <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
                            By registering, you agree to verified trade terms for institutional aggregation.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

const labelStyle = {
    display: 'block',
    marginBottom: '0.6rem',
    fontWeight: '700',
    color: '#444',
    fontSize: '0.95rem'
};

const inputStyle = {
    width: '100%',
    padding: '1rem',
    borderRadius: '12px',
    border: '2px solid #e0e0e0',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease',
    outline: 'none',
    boxSizing: 'border-box'
};

export default FPORegistration;
