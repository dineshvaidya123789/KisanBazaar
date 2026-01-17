import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const FeedbackForm = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        suggestion: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.suggestion.trim()) {
            alert(t('placeholder_suggestion').replace('*', '').trim());
            return;
        }

        // Save to local storage for admin view
        const existingFeedback = JSON.parse(localStorage.getItem('kisan_feedback') || '[]');
        const newFeedback = {
            ...formData,
            id: Date.now(),
            timestamp: new Date().toLocaleString()
        };
        localStorage.setItem('kisan_feedback', JSON.stringify([newFeedback, ...existingFeedback]));

        setSubmitted(true);
        setFormData({ name: '', mobile: '', suggestion: '' });
        // After 3 seconds, reset the submission state
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div style={{ maxWidth: '400px' }}>
            <h4 style={{ color: 'var(--color-secondary)', marginBottom: 'var(--spacing-md)' }}>{t('feedback_title')}</h4>
            {submitted ? (
                <div style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    padding: 'var(--spacing-md)',
                    borderRadius: '8px',
                    color: '#fff',
                    textAlign: 'center'
                }}>
                    {t('feedback_success')}
                </div>
            ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input
                        type="text"
                        name="name"
                        placeholder={t('placeholder_name')}
                        value={formData.name}
                        onChange={handleChange}
                        style={{
                            padding: '10px',
                            borderRadius: '5px',
                            border: 'none',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            fontSize: '0.9rem'
                        }}
                    />
                    <input
                        type="tel"
                        name="mobile"
                        placeholder={t('placeholder_mobile')}
                        value={formData.mobile}
                        onChange={handleChange}
                        style={{
                            padding: '10px',
                            borderRadius: '5px',
                            border: 'none',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            fontSize: '0.9rem'
                        }}
                    />
                    <textarea
                        name="suggestion"
                        required
                        placeholder={t('placeholder_suggestion')}
                        value={formData.suggestion}
                        onChange={handleChange}
                        rows="3"
                        style={{
                            padding: '10px',
                            borderRadius: '5px',
                            border: 'none',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            fontSize: '0.9rem',
                            resize: 'none'
                        }}
                    ></textarea>
                    <button
                        type="submit"
                        style={{
                            padding: '10px',
                            borderRadius: '5px',
                            border: 'none',
                            backgroundColor: 'var(--color-secondary)',
                            color: 'var(--color-primary)',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'opacity 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.opacity = '0.9'}
                        onMouseOut={(e) => e.target.style.opacity = '1'}
                    >
                        {t('submit')}
                    </button>
                </form>
            )}
        </div>
    );
};

export default FeedbackForm;
