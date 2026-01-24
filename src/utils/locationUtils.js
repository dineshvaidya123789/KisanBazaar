/**
 * Location-based language detection utility
 * Detects user's state and suggests appropriate language
 */

/**
 * Detect user's state using browser Geolocation API
 * @returns {Promise<string|null>} State name or null if detection fails
 */
export const detectUserState = async () => {
    return new Promise((resolve) => {
        // Check if geolocation is supported
        if (!navigator.geolocation) {
            console.log('Geolocation not supported');
            resolve(null);
            return;
        }

        // Request user's location
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    // Use reverse geocoding to get state
                    // Using OpenStreetMap Nominatim API (free, no API key required)
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=5&addressdetails=1`,
                        {
                            headers: {
                                'User-Agent': 'KisanBazaar/1.0'
                            }
                        }
                    );

                    const data = await response.json();
                    const state = data.address?.state || null;

                    console.log('Detected state:', state);
                    resolve(state);
                } catch (error) {
                    console.error('Error in reverse geocoding:', error);
                    resolve(null);
                }
            },
            (error) => {
                console.log('Geolocation permission denied or error:', error.message);
                resolve(null);
            },
            {
                timeout: 10000, // 10 second timeout
                enableHighAccuracy: false // Faster, less battery
            }
        );
    });
};

/**
 * Suggest language based on detected state
 * @param {string|null} state - Detected state name
 * @returns {string} Language code ('en', 'hi', 'mr')
 */
export const suggestLanguage = (state) => {
    if (!state) return 'en'; // Default to English if no state detected

    const stateLower = state.toLowerCase();

    // Maharashtra → Marathi
    if (stateLower.includes('maharashtra')) {
        return 'mr';
    }

    // Madhya Pradesh → Hindi
    if (stateLower.includes('madhya pradesh') || stateLower.includes('mp')) {
        return 'hi';
    }

    // Hindi-speaking states
    const hindiStates = [
        'uttar pradesh', 'up', 'bihar', 'rajasthan', 'haryana',
        'jharkhand', 'chhattisgarh', 'uttarakhand', 'delhi'
    ];

    if (hindiStates.some(s => stateLower.includes(s))) {
        return 'hi';
    }

    // Default to English for other states
    return 'en';
};

/**
 * Get suggested language with location detection
 * @returns {Promise<{language: string, state: string|null, detected: boolean}>}
 */
export const getLanguageSuggestion = async () => {
    try {
        const state = await detectUserState();
        const language = suggestLanguage(state);

        return {
            language,
            state,
            detected: state !== null
        };
    } catch (error) {
        console.error('Error getting language suggestion:', error);
        return {
            language: 'en',
            state: null,
            detected: false
        };
    }
};
