import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const VoiceOverlay = ({ isOpen, transcript, onClose, isListening }) => {
    const { t } = useLanguage();

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999, // High z-index to cover everything
            color: 'white',
            padding: '20px',
            animation: 'fadeIn 0.2s ease-out'
        }} onClick={onClose}>
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    textAlign: 'center',
                    maxWidth: '500px',
                    width: '100%'
                }}
            >
                <div style={{
                    fontSize: '4rem',
                    marginBottom: '1.5rem',
                    animation: isListening ? 'pulse 1.5s infinite' : 'none',
                    filter: isListening ? 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.5))' : 'none'
                }}>
                    🎙️
                </div>

                <h2 style={{
                    fontSize: '1.8rem',
                    marginBottom: '1rem',
                    fontWeight: 'bold'
                }}>
                    {isListening ? (t('listening') || 'Listening...') : (t('processing') || 'Processing...')}
                </h2>

                <div style={{
                    fontSize: '1.2rem',
                    textAlign: 'center',
                    color: '#fbbf24',
                    fontStyle: 'italic',
                    minHeight: '60px',
                    marginBottom: '2rem',
                    padding: '1rem',
                    border: '1px dashed rgba(255,255,255,0.3)',
                    borderRadius: '12px',
                    background: 'rgba(0,0,0,0.3)'
                }}>
                    "{transcript || "..."}"
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '0.8rem 2rem',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '30px',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
                        }}
                    >
                        🛑 {t('stop') || 'Stop'}
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default VoiceOverlay;
