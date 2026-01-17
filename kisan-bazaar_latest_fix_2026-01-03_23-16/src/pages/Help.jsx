import React, { useState } from 'react';

const Help = () => {
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

        setStatus({ type: 'success', text: 'Thank you! Your request has been submitted. (धन्यवाद! आपका अनुरोध प्राप्त हुआ है।)' });
        setFormData({ name: '', mobile: '', topic: 'Suggestion', message: '' });

        // Reset status after 5 seconds
        setTimeout(() => setStatus({ type: '', text: '' }), 5000);
    };

    return (
        <div className="container fade-in" style={{ padding: 'var(--spacing-xl) 0', maxWidth: '600px' }}>
            <div className="card" style={{ padding: '2rem' }}>
                <h1 style={{ color: 'var(--color-primary)', marginBottom: '1rem', textAlign: 'center' }}>
                    How can we help you? <br />
                    (हम आपकी क्या मदद कर सकते हैं?)
                </h1>

                <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
                    Please fill out this simple form and we will get back to you soon.
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
                        <label style={{ fontWeight: '600', color: '#444' }}>Full Name (पूरा नाम) *</label>
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
                        <label style={{ fontWeight: '600', color: '#444' }}>Mobile Number (मोबाइल नंबर) *</label>
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
                        <label style={{ fontWeight: '600', color: '#444' }}>Topic (विषय) *</label>
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
                            <option value="Suggestion">Suggestion (सुझाव)</option>
                            <option value="Issue">Technical Issue (तकनीकी समस्या)</option>
                            <option value="Question">Question (प्रश्न)</option>
                            <option value="Other">Other (अन्य)</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontWeight: '600', color: '#444' }}>Message (संदेश) *</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="How can we improve? Or what do you need help with?"
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
                        Submit Information (जानकारी भेजें)
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Help;
