import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('kisan_feedback') || '[]');
        setFeedbacks(data);
    }, []);

    const clearAll = () => {
        if (window.confirm('Are you sure you want to clear all feedback?')) {
            localStorage.removeItem('kisan_feedback');
            setFeedbacks([]);
        }
    };

    return (
        <div className="container fade-in" style={{ padding: 'var(--spacing-xl) 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <h1>Admin Feedback Dashboard</h1>
                <button onClick={clearAll} className="btn" style={{ backgroundColor: '#dc3545', color: 'white', border: 'none' }}>
                    Clear All Feedback
                </button>
            </div>

            {feedbacks.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                    <p>No feedback received yet.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                    {feedbacks.map(item => (
                        <div key={item.id} className="card" style={{ borderLeft: '5px solid var(--color-primary)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#666', fontSize: '0.85rem' }}>
                                <span>📅 {item.timestamp}</span>
                                <span>📱 {item.mobile}</span>
                            </div>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>{item.name}</h3>
                            <p style={{ margin: 0, color: '#333', lineHeight: '1.5' }}>
                                {item.suggestion}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            <div style={{ marginTop: 'var(--spacing-xl)', textAlign: 'center' }}>
                <Link to="/" className="btn btn-outline">Back to Home</Link>
            </div>
        </div>
    );
};

export default AdminFeedback;
