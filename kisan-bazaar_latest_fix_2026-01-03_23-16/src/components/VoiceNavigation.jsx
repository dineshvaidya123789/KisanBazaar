import React from 'react';
import { useNavigate } from 'react-router-dom';
import VoiceInput from './VoiceInput';

const VoiceNavigation = () => {
    const navigate = useNavigate();

    const [lastCommand, setLastCommand] = React.useState("");

    const handleVoiceCommand = (transcript) => {
        console.log("Voice Command Received:", transcript);
        setLastCommand(transcript);
        const lowerText = transcript.toLowerCase();

        // Clear command display after 3 seconds
        setTimeout(() => setLastCommand(""), 4000);

        // Navigation Logic
        if (lowerText.includes('news') || lowerText.includes('samachar') || lowerText.includes('khabar')) {
            navigate('/news');
        }
        else if (lowerText.includes('sell') || lowerText.includes('bechna') || lowerText.includes('vikreta')) {
            navigate('/sell?type=Sell');
        }
        else if (lowerText.includes('buy') || lowerText.includes('kharidna') || lowerText.includes('kharidar') || lowerText.includes('buyer') || lowerText.includes('marketplace')) {
            navigate('/marketplace');
        }
        else if (lowerText.includes('weather') || lowerText.includes('mausam') || lowerText.includes('barish')) {
            navigate('/weather');
        }
        else if (lowerText.includes('rate') || lowerText.includes('bhav') || lowerText.includes('mandi') || lowerText.includes('price')) {
            navigate('/rates');
        }
        else if (lowerText.includes('chaupal') || lowerText.includes('community') || lowerText.includes('prashn') || lowerText.includes('madal')) {
            navigate('/chaupal');
        }
        else if (lowerText.includes('animal') || lowerText.includes('pashu') || lowerText.includes('gay') || lowerText.includes('bhains')) {
            navigate('/pashu-palan');
        }
        else if (lowerText.includes('home') || lowerText.includes('mukhya') || lowerText.includes('wapas')) {
            navigate('/');
        }
        else if (lowerText.includes('seller') || lowerText.includes('directory')) {
            navigate('/sellers');
        }
        // Commodity Search via Voice
        else if (lowerText.length > 2) {
            // If it's a specific crop name, go to marketplace and search for it
            navigate(`/marketplace?search=${encodeURIComponent(lowerText)}`);
        }
    };

    return (
        <>
            <VoiceInput onTranscript={handleVoiceCommand} />
            {lastCommand && (
                <div style={{
                    position: 'fixed',
                    bottom: '150px', // Raised higher than FABs
                    right: '25px',
                    backgroundColor: '#333',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    zIndex: 2000,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    maxWidth: '200px',
                    wordWrap: 'break-word',
                    animation: 'fadeIn 0.3s ease'
                }}>
                    Heard: "{lastCommand}"
                </div>
            )}
        </>
    );
};

export default VoiceNavigation;
