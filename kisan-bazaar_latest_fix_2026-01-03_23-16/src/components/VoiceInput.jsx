import React, { useState, useEffect } from 'react';

const VoiceInput = ({ onTranscript, disabled = false }) => {
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(true);

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            setIsSupported(false);
            alert("Voice Search is not supported in this browser. Please use Chrome or Edge.");
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const startListening = () => {
        setIsListening(true);
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'hi-IN'; // Default to Hindi/English mix
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            onTranscript(transcript);
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            if (event.error === 'not-allowed') {
                alert("Microphone access blocked. Please allow microphone permissions in your browser settings.");
            } else if (event.error === 'no-speech') {
                // Ignore no-speech, just stop listening
            } else {
                alert("Voice Error: " + event.error);
            }
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const stopListening = () => {
        setIsListening(false);
        // Recognition stops automatically on end or error usually, 
        // but this state update ensures UI sync.
    };

    if (!isSupported) return null;

    return (
        <button
            onClick={toggleListening}
            disabled={disabled}
            title="Speak to Search (बोलकर खोजें)"
            style={{
                background: isListening ? '#ff4d4d' : 'white',
                border: isListening ? '2px solid #ff4d4d' : '2px solid #4CAF50',
                cursor: 'pointer',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                width: '60px',
                height: '60px',
                position: 'fixed',
                bottom: '150px', // Adjusted to stack vertically above WhatsApp (80px + 60px + gap)
                right: '25px', // Aligned with WhatsApp FAB
                zIndex: 1000
            }}
        >
            <span style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isListening ? (
                    '⏹️'
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 96 960 960" width="32" fill={isListening ? "white" : "#4CAF50"}>
                        <path d="M480 576q-33 0-56.5-23.5T400 496V256q0-33 23.5-56.5T480 176q33 0 56.5 23.5T560 256v240q0 33-23.5 56.5T480 576Zm0 200q-76 0-138.5-43T264 616h61q14 55 59.5 87.5T480 736q52 0 97-32.5T635 616h61q-15 76-77.5 119T480 776Zm-40 180v-99q-126-17-203-108.5T160 546h40q0 117 81.5 198.5T480 826q117 0 198.5-81.5T760 546h40q0 120-77 211.5T520 866v90h-80Z" />
                    </svg>
                )}
            </span>
        </button>
    );
};

export default VoiceInput;
