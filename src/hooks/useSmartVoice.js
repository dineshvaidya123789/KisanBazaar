import { useState, useRef, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { parseVoiceInput } from '../utils/voiceParser';

export const useSmartVoice = () => {
    const { language, t } = useLanguage();
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [showOverlay, setShowOverlay] = useState(false);
    const recognitionRef = useRef(null);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        setIsListening(false);
        // Delay closing overlay slightly to show final text
        setTimeout(() => setShowOverlay(false), 1500);
    }, []);

    const startListening = useCallback((onResult) => {
        if (!('webkitSpeechRecognition' in window)) {
            alert(t('voice_input_unsupported') || "Voice input is not supported in this browser.");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US';
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognitionRef.current = recognition;

        recognition.onstart = () => {
            setIsListening(true);
            setShowOverlay(true);
            setTranscript('');
        };

        recognition.onresult = (event) => {
            const currentTranscript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');

            setTranscript(currentTranscript);

            if (event.results[0].isFinal) {
                // Parse the final result
                const parsed = parseVoiceInput(currentTranscript, language);
                if (onResult) {
                    onResult({ transcript: currentTranscript, parsed });
                }
                stopListening(); // Stop after final result for single-shot command
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech Recognition Error:", event.error);
            stopListening();
        };

        recognition.onend = () => {
            // Don't auto-close here if we are handling final result in onresult, 
            // but safe to ensure state consistency
            if (isListening) {
                setIsListening(false);
                setTimeout(() => setShowOverlay(false), 1000);
            }
        };

        recognition.start();

    }, [language, t, stopListening]);

    const manualClose = () => {
        if (recognitionRef.current) recognitionRef.current.stop();
        setIsListening(false);
        setShowOverlay(false);
    };

    // Text-to-Speech Function
    const speak = (text) => {
        if (!('speechSynthesis' in window)) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Select Voice based on language
        const voices = window.speechSynthesis.getVoices();
        let selectedVoice = null;

        if (language === 'hi') {
            selectedVoice = voices.find(v => v.lang.includes('hi')) || voices.find(v => v.lang.includes('IN'));
        } else if (language === 'mr') {
            selectedVoice = voices.find(v => v.lang.includes('mr')) || voices.find(v => v.lang.includes('hi')) || voices.find(v => v.lang.includes('IN'));
        } else {
            selectedVoice = voices.find(v => v.lang.includes('en-IN')) || voices.find(v => v.lang.includes('en'));
        }

        if (selectedVoice) utterance.voice = selectedVoice;

        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1;

        window.speechSynthesis.speak(utterance);
    };

    return {
        isListening,
        transcript,
        showOverlay,
        startListening,
        stopListening: manualClose, // Immediate close for UI button
        speak // Expose TTS
    };
};
