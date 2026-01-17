import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import BackToHomeButton from '../components/BackToHomeButton';

const Help = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        topic: 'Suggestion',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Save to localStorage for Admin view (reusing feedback logic)
        const existingHelp = JSON.parse(localStorage.getItem('kisan_help_requests') || '[]');
        const newEntry = {
            ...formData,
            id: Date.now(),
            timestamp: new Date().toLocaleString()
        };
        localStorage.setItem('kisan_help_requests', JSON.stringify([newEntry, ...existingHelp]));

        setStatus({ type: 'success', text: t('help_success') });
        setFormData({ name: '', mobile: '', topic: 'Suggestion', message: '' });

        // Reset status after 5 seconds
        setTimeout(() => setStatus({ type: '', text: '' }), 5000);
    };

    return (
        <div className="container fade-in" style={{ padding: 'var(--spacing-xl) 0', maxWidth: '600px' }}>
            <BackToHomeButton compact />

            <div className="card" style={{ padding: '2rem' }}>
                <h1 style={{ color: 'var(--color-primary)', marginBottom: '1rem', textAlign: 'center' }}>
                    {t('help_title')}
                </h1>

                <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
                    {t('help_subtitle')}
                </p>

                {status.text && (
                    <div style={{
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        backgroundColor: status.type === 'success' ? '#e8f5e9' : '#ffebee',
                        color: status.type === 'success' ? '#2e7d32' : '#c62828',
                        textAlign: 'center',
                        fontWeight: '500'
                    }}>
                        {status.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontWeight: '600', color: '#444' }}>{t('help_name')} *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ex: Rajesh Kumar"
                            required
                            style={{
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontWeight: '600', color: '#444' }}>{t('help_mobile')} *</label>
                        <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            placeholder="10 digit mobile number"
                            pattern="[0-9]{10}"
                            required
                            style={{
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontWeight: '600', color: '#444' }}>{t('help_topic')} *</label>
                        <select
                            name="topic"
                            value={formData.topic}
                            onChange={handleChange}
                            style={{
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '1rem',
                                outline: 'none',
                                backgroundColor: 'white'
                            }}
                        >
                            <option value="Suggestion">{t('help_topic_suggestion')}</option>
                            <option value="Issue">{t('help_topic_issue')}</option>
                            <option value="Question">{t('help_topic_question')}</option>
                            <option value="Other">{t('help_topic_other')}</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontWeight: '600', color: '#444' }}>{t('help_message')} *</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder={t('help_message_placeholder')}
                            rows="4"
                            required
                            style={{
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '1rem',
                                outline: 'none',
                                resize: 'none'
                            }}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                            padding: '14px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            borderRadius: '50px',
                            marginTop: '1rem'
                        }}
                    >
                        {t('help_submit')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Help;
