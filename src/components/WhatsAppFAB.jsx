import React from 'react';

const WhatsAppFAB = () => {
    // const whatsappNumber = "919876543210"; // Placeholder number
    // const message = "Hello, I have a query regarding Kisan Bazaar.";

    return (
        <a
            href="https://wa.me/919876543210" // Replace with actual number
            target="_blank"
            rel="noopener noreferrer"
            style={{
                position: 'fixed',
                bottom: '80px', // Raised to avoid browser URL bar issues on mobile
                right: '25px',
                backgroundColor: '#25D366',
                color: 'white',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                zIndex: 9999, // Ensure it's on top of everything
                textDecoration: 'none',
                transition: 'transform 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            title="Chat on WhatsApp"
        >
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="WhatsApp"
                style={{ width: '35px', height: '35px' }}
            />
        </a>
    );
};

export default WhatsAppFAB;
