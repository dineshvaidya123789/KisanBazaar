// Weather Alert Detection System
// Detects extreme weather conditions and generates farmer-friendly alerts

/**
 * Detect weather alerts based on current and forecast data
 * @param {Object} weatherData - Weather data from API
 * @returns {Array} Array of alert objects
 */
export const detectWeatherAlerts = (weatherData) => {
    const alerts = [];
    const current = weatherData.current;
    const forecast = weatherData.forecast;

    // API alerts (if available from WeatherAPI.com)
    if (weatherData.alerts && weatherData.alerts.length > 0) {
        weatherData.alerts.forEach(alert => {
            alerts.push({
                type: 'official',
                severity: 'high',
                icon: '⚠️',
                title: alert.headline || 'Weather Alert',
                message: alert.desc || alert.event,
                messageHindi: 'आधिकारिक मौसम चेतावनी',
                source: 'Official Weather Alert'
            });
        });
    }

    // Custom alert detection

    // 1. Heatwave Alert
    if (current.temp >= 40) {
        alerts.push({
            type: 'heatwave',
            severity: current.temp >= 45 ? 'severe' : 'high',
            icon: '🔥',
            title: 'Extreme Heat Alert',
            titleHindi: 'अत्यधिक गर्मी चेतावनी',
            message: `Temperature is ${current.temp}°C! Avoid midday field work (11 AM - 4 PM). Increase irrigation frequency. Protect livestock from heat stress.`,
            messageHindi: `तापमान ${current.temp}°C है! दोपहर में खेत का काम न करें (11 AM - 4 PM)। सिंचाई बढ़ाएं। पशुओं को गर्मी से बचाएं।`,
            actions: [
                'Increase irrigation frequency',
                'Apply mulch to conserve moisture',
                'Avoid spraying during peak heat',
                'Provide shade for livestock'
            ]
        });
    }

    // 2. Cold Wave Alert
    if (current.temp <= 8) {
        alerts.push({
            type: 'coldwave',
            severity: current.temp <= 5 ? 'severe' : 'medium',
            icon: '❄️',
            title: 'Cold Wave Alert',
            titleHindi: 'शीत लहर चेतावनी',
            message: `Temperature dropped to ${current.temp}°C! Frost risk high. Protect sensitive crops with covers. Light irrigation may help prevent frost damage.`,
            messageHindi: `तापमान ${current.temp}°C तक गिर गया! पाला का खतरा। संवेदनशील फसलों को ढकें। हल्की सिंचाई से पाला रोका जा सकता है।`,
            actions: [
                'Cover sensitive crops',
                'Light irrigation before dawn',
                'Use smoke/smudge pots',
                'Delay harvesting'
            ]
        });
    }

    // 3. High Wind Alert
    const windSpeed = parseInt(current.wind);
    if (windSpeed >= 40) {
        alerts.push({
            type: 'wind',
            severity: windSpeed >= 60 ? 'high' : 'medium',
            icon: '💨',
            title: 'High Wind Warning',
            titleHindi: 'तेज हवा चेतावनी',
            message: `Wind speed ${windSpeed} km/h! Postpone all spraying operations. Risk of crop lodging. Secure loose items and structures.`,
            messageHindi: `हवा की गति ${windSpeed} km/h! सभी छिड़काव कार्य स्थगित करें। फसल गिरने का खतरा। ढीली वस्तुओं को सुरक्षित करें।`,
            actions: [
                'Postpone spraying',
                'Check crop support',
                'Secure farm equipment',
                'Delay drone operations'
            ]
        });
    }

    // 4. Heavy Rain Alert
    const rainChance = parseInt(current.rainProb);
    if (rainChance >= 70 || forecast[0]?.rainChance >= 70) {
        alerts.push({
            type: 'rain',
            severity: rainChance >= 90 ? 'high' : 'medium',
            icon: '🌧️',
            title: 'Heavy Rain Expected',
            titleHindi: 'भारी बारिश की संभावना',
            message: `${rainChance}% chance of rain! Postpone fertilizer/pesticide application. Ensure proper field drainage. Harvest ready crops if possible.`,
            messageHindi: `${rainChance}% बारिश की संभावना! उर्वरक/कीटनाशक छिड़काव रोकें। खेत में जल निकासी सुनिश्चित करें। तैयार फसल की कटाई करें।`,
            actions: [
                'Postpone spraying',
                'Check drainage systems',
                'Harvest mature crops',
                'Protect stored grain'
            ]
        });
    }

    // 5. Fog/Low Visibility Alert
    if (current.visibility < 1) {
        alerts.push({
            type: 'fog',
            severity: 'medium',
            icon: '🌫️',
            title: 'Dense Fog Alert',
            titleHindi: 'घना कोहरा चेतावनी',
            message: `Very low visibility (${current.visibility} km). Delay early morning field work. Increased disease risk in crops. Monitor for fungal infections.`,
            messageHindi: `बहुत कम दृश्यता (${current.visibility} km)। सुबह का खेत काम देर से करें। फसलों में रोग का खतरा बढ़ा। फफूंद संक्रमण की निगरानी करें।`,
            actions: [
                'Delay morning activities',
                'Monitor for fungal diseases',
                'Ensure proper ventilation',
                'Avoid spraying'
            ]
        });
    }

    // 6. Thunderstorm Alert
    const condition = current.condition.toLowerCase();
    if (condition.includes('thunder') || condition.includes('storm')) {
        alerts.push({
            type: 'thunderstorm',
            severity: 'high',
            icon: '⛈️',
            title: 'Thunderstorm Warning',
            titleHindi: 'आंधी-तूफान चेतावनी',
            message: 'Thunderstorm activity detected! Stay indoors. Avoid open fields. Unplug electrical equipment. Secure livestock and equipment.',
            messageHindi: 'आंधी-तूफान की गतिविधि! घर के अंदर रहें। खुले मैदान से बचें। बिजली के उपकरण बंद करें। पशुओं को सुरक्षित करें।',
            actions: [
                'Stay indoors',
                'Avoid open fields',
                'Unplug equipment',
                'Secure livestock'
            ]
        });
    }

    // 7. High Humidity Alert (Pest Risk)
    if (current.humidity >= 85) {
        alerts.push({
            type: 'humidity',
            severity: 'low',
            icon: '💧',
            title: 'High Humidity - Pest Risk',
            titleHindi: 'उच्च आर्द्रता - कीट जोखिम',
            message: `Humidity at ${current.humidity}%. Increased risk of pests and fungal diseases. Monitor crops closely. Consider preventive measures.`,
            messageHindi: `आर्द्रता ${current.humidity}% है। कीटों और फफूंद रोगों का खतरा बढ़ा। फसलों की बारीकी से निगरानी करें। निवारक उपाय करें।`,
            actions: [
                'Monitor for pests',
                'Check for fungal diseases',
                'Improve air circulation',
                'Consider preventive spray'
            ]
        });
    }

    return alerts;
};

/**
 * Get alert severity color
 */
export const getAlertColor = (severity) => {
    switch (severity) {
        case 'severe':
            return '#D32F2F'; // Dark Red
        case 'high':
            return '#F44336'; // Red
        case 'medium':
            return '#FF9800'; // Orange
        case 'low':
            return '#FFC107'; // Amber
        default:
            return '#2196F3'; // Blue
    }
};

/**
 * Get alert priority (for sorting)
 */
export const getAlertPriority = (severity) => {
    switch (severity) {
        case 'severe': return 4;
        case 'high': return 3;
        case 'medium': return 2;
        case 'low': return 1;
        default: return 0;
    }
};
