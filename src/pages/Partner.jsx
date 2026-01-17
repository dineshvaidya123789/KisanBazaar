import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import BackToHomeButton from '../components/BackToHomeButton';

const Partner = () => {
    const { t } = useLanguage();
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

        // Custom Validation with Auto-Focus
        if (!formData.name) {
            alert(t('partner_error_name'));
            document.getElementsByName('name')[0]?.focus();
            return;
        }
        if (!formData.phone || formData.phone.length < 10) {
            alert(t('partner_error_phone'));
            document.getElementsByName('phone')[0]?.focus();
            return;
        }
        if (!formData.email) {
            alert(t('partner_error_email'));
            document.getElementsByName('email')[0]?.focus();
            return;
        }
        if (!formData.city) {
            alert(t('partner_error_city'));
            document.getElementsByName('city')[0]?.focus();
            return;
        }
        if (!formData.companyName) {
            alert(t('partner_error_company'));
            document.getElementsByName('companyName')[0]?.focus();
            return;
        }
        if (!formData.activities) {
            alert(t('partner_error_activities'));
            document.getElementsByName('activities')[0]?.focus();
            return;
        }

        // Save to local storage for admin view
        const existingPartners = JSON.parse(localStorage.getItem('kisan_partners') || '[]');
        const newPartner = {
            ...formData,
            id: Date.now(),
            timestamp: new Date().toLocaleString()
        };
        localStorage.setItem('kisan_partners', JSON.stringify([newPartner, ...existingPartners]));

        alert(`${t('partner_success')}`);
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
                <BackToHomeButton compact />

                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: 'var(--shadow-md)',
                    overflow: 'hidden',
                    border: '1px solid #eee'
                }}>
                    {/* Header Section */}
                    <div style={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        padding: '2rem',
                        textAlign: 'center'
                    }}>
                        <h1 style={{ margin: 0, fontSize: '2rem', fontFamily: 'serif' }}>{t('partner_title')}</h1>
                        <p style={{ marginTop: '0.5rem', opacity: 0.9 }}>
                            {t('partner_subtitle')}
                        </p>
                        <div style={{ marginTop: '1.5rem', fontSize: '0.95rem', lineHeight: '1.6', opacity: 0.9, maxWidth: '600px', margin: '1.5rem auto 0', textAlign: 'center' }}>
                            <p style={{ marginBottom: '0.4rem' }}>{t('partner_intro')}</p>
                            <p>{t('partner_contact_msg')}</p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleSubmit} style={{ padding: '2rem' }} noValidate>

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
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#444' }}>{t('partner_name')} *</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#444' }}>{t('partner_phone')} *</label>
                                <input
                                    type="tel"
                                    name="phone"
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
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#444' }}>{t('partner_email')} *</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}
                                />
                            </div>

                            {/* City */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#444' }}>{t('partner_city')} *</label>
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="Enter your city name"
                                    value={formData.city}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}
                                />
                            </div>

                            {/* Country */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#444' }}>{t('partner_country')}</label>
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
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#444' }}>{t('partner_company')} *</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    placeholder="Enter your Company Name"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}
                                />
                            </div>

                            {/* Web Address */}
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#444' }}>{t('partner_website')}</label>
                                <input
                                    type="url"
                                    name="webAddress"
                                    placeholder="https://example.com"
                                    value={formData.webAddress}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}
                                />
                                <small style={{ color: '#666', fontSize: '0.8rem' }}>{t('partner_website_format')}</small>
                            </div>

                            {/* Company Activities */}
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#444' }}>{t('partner_activities')} *</label>
                                <textarea
                                    name="activities"
                                    rows="4"
                                    placeholder={t('partner_activities_placeholder')}
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
                                {t('partner_submit')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Partner;
