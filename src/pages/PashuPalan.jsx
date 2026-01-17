import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import BackToHomeButton from '../components/BackToHomeButton';

const PashuPalan = () => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('dairy');

    const sections = {
        dairy: {
            title: t('dairy_farming'),
            icon: "🐄",
            content: [
                {
                    title: t('feeding_mgmt'),
                    desc: t('feeding_desc')
                },
                {
                    title: t('breeding'),
                    desc: t('breeding_desc')
                },
                {
                    title: t('disease_prev'),
                    desc: t('disease_desc')
                }
            ]
        },
        goat: {
            title: t('goat_farming'),
            icon: "🐐",
            content: [
                {
                    title: t('housing'),
                    desc: t('housing_desc')
                },
                {
                    title: t('vaccination'),
                    desc: t('vaccination_desc')
                }
            ]
        },
        poultry: {
            title: t('poultry_farming'),
            icon: "🐔",
            content: [
                {
                    title: t('biosecurity'),
                    desc: t('biosecurity_desc')
                },
                {
                    title: t('layer_farming'),
                    desc: t('layer_desc')
                }
            ]
        }
    };

    return (
        <div className="container fade-in" style={{ padding: '2rem 1rem', maxWidth: '1000px', margin: '0 auto', minHeight: '80vh' }}>
            <BackToHomeButton compact />

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                    {t('pashu_title')}
                </h1>
                <p style={{ color: '#666', fontSize: '1.1rem' }}>
                    {t('pashu_subtitle')}
                </p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {Object.keys(sections).map(key => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        style={{
                            padding: '1rem 2rem',
                            fontSize: '1.1rem',
                            border: 'none',
                            borderRadius: '12px',
                            backgroundColor: activeTab === key ? 'var(--color-primary)' : 'white',
                            color: activeTab === key ? 'white' : '#555',
                            boxShadow: activeTab === key ? '0 4px 6px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.05)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        <span style={{ fontSize: '1.5rem' }}>{sections[key].icon}</span>
                        {sections[key].title}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="fade-in">
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '2rem',
                    boxShadow: 'var(--shadow-md)',
                    borderTop: `5px solid var(--color-primary)`
                }}>
                    <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                        <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>
                            {sections[activeTab].icon}
                        </span>
                        <h2 style={{ color: 'var(--color-secondary)' }}>{sections[activeTab].title}</h2>
                    </div>

                    <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                        {sections[activeTab].content.map((item, index) => (
                            <div key={index} style={{
                                padding: '1.5rem',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '12px',
                                borderLeft: '4px solid var(--color-secondary)'
                            }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#333' }}>
                                    {item.title}
                                </h3>
                                {/* Content is now fully dynamic from translations, no separate Hindi fields needed */}
                                <p style={{ marginBottom: '0.5rem', color: '#444' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center', padding: '2rem', backgroundColor: '#e8f5e9', borderRadius: '12px' }}>
                <h3 style={{ marginBottom: '1rem' }}>{t('need_advice')}</h3>
                <button className="btn btn-primary" onClick={() => window.location.href = '/chaupal'}>
                    {t('ask_chaupal')}
                </button>
            </div>

            <BackToHomeButton />
        </div>
    );
};

export default PashuPalan;

