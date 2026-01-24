// Crop Database with Weather Requirements and Advisories
// Tailored for Madhya Pradesh farming

export const cropDatabase = {
    wheat: {
        name: 'Wheat',
        nameHindi: 'गेहूं',
        icon: '🌾',
        optimalTemp: { min: 15, max: 25 },
        criticalTemp: { min: 10, max: 30 },
        waterNeeds: 'moderate',
        season: 'Rabi (Winter)',
        advisories: {
            highTemp: {
                icon: '🌡️',
                message: 'Temperature above 30°C can reduce grain quality and yield. Increase irrigation frequency, preferably in early morning or evening.',
                messageHindi: 'तापमान 30°C से ऊपर होने पर अनाज की गुणवत्ता कम हो सकती है। सुबह या शाम को सिंचाई बढ़ाएं।'
            },
            lowTemp: {
                icon: '❄️',
                message: 'Temperature below 10°C may slow growth. Consider frost protection measures for young plants.',
                messageHindi: 'तापमान 10°C से नीचे होने पर विकास धीमा हो सकता है। छोटे पौधों के लिए पाला संरक्षण करें।'
            },
            rain: {
                icon: '🌧️',
                message: 'Avoid harvesting during rain. Risk of grain sprouting and quality loss. Ensure proper drainage.',
                messageHindi: 'बारिश में कटाई न करें। अनाज अंकुरण और गुणवत्ता हानि का खतरा। जल निकासी सुनिश्चित करें।'
            },
            sunny: {
                icon: '☀️',
                message: 'Perfect for grain filling stage. Ensure adequate soil moisture. Good weather for harvesting mature crop.',
                messageHindi: 'अनाज भरने के लिए बढ़िया। मिट्टी में पर्याप्त नमी सुनिश्चित करें। पकी फसल की कटाई के लिए अच्छा मौसम।'
            },
            wind: {
                icon: '💨',
                message: 'High winds can cause lodging (crop flattening). Check crop support and avoid spraying.',
                messageHindi: 'तेज हवा से फसल गिर सकती है। फसल सहारा जांचें और छिड़काव न करें।'
            }
        }
    },

    gram: {
        name: 'Gram (Chana)',
        nameHindi: 'चना',
        icon: '🌱',
        optimalTemp: { min: 10, max: 25 },
        criticalTemp: { min: 5, max: 30 },
        waterNeeds: 'low',
        season: 'Rabi (Winter)',
        advisories: {
            lowTemp: {
                icon: '❄️',
                message: 'CRITICAL: Frost sensitive. If temp drops below 5°C, apply light irrigation or smoke (dhuan) in the field at night.',
                messageHindi: 'पाला संवेदनशील। यदि तापमान 5°C से नीचे गिरता है, तो रात में खेत में हल्की सिंचाई या धुआं करें।'
            },
            highTemp: {
                icon: '🌡️',
                message: 'High temperature during pod filling reduces yield. Ensure soil moisture.',
                messageHindi: 'फली भरने के दौरान उच्च तापमान उपज कम कर देता है। मिट्टी में नमी सुनिश्चित करें।'
            },
            rain: {
                icon: '🌧️',
                message: 'Excess moisture leads to Wilt and Root Rot. Ensure good drainage immediately.',
                messageHindi: 'अधिक नमी से उखटा और जड़ सड़न होती है। तुरंत अच्छी जल निकासी सुनिश्चित करें।'
            },
            humidity: {
                icon: '🌫️',
                message: 'Foggy/Cloudy weather favors Pod Borer (Illi). Monitor crop closely.',
                messageHindi: 'कोहरा/बादल वाला मौसम इल्ली (Pod Borer) को बढ़ावा देता है। फसल की निगरानी करें।'
            }
        }
    },

    peas: {
        name: 'Green Peas',
        nameHindi: 'मटर',
        icon: '🟢',
        optimalTemp: { min: 10, max: 23 },
        criticalTemp: { min: 5, max: 28 },
        waterNeeds: 'moderate',
        season: 'Rabi (Winter)',
        advisories: {
            humidity: {
                icon: '☁️',
                message: 'High humidity (>80%) risk for Powdery Mildew. Spray Sulphur if white powder appears on leaves.',
                messageHindi: 'उच्च आर्द्रता में सफेद फफूंद (Powdery Mildew) का खतरा। पत्तियों पर सफेद पाउडर दिखने पर सल्फर छिड़कें।'
            },
            highTemp: {
                icon: '🔥',
                message: 'Flowering stops above 25°C. Harvest mature pods immediately.',
                messageHindi: '25°C से ऊपर फूल आना बंद हो जाता है। पकी फलियों की तुरंत कटाई करें।'
            },
            lowTemp: {
                icon: '❄️',
                message: 'Frost can damage flowers. Irrigate lightly to raise soil temperature.',
                messageHindi: 'पाला फूलों को नुकसान पहुंचा सकता है। मिट्टी का तापमान बढ़ाने के लिए हल्की सिंचाई करें।'
            }
        }
    },

    carrot: {
        name: 'Carrot',
        nameHindi: 'गाजर',
        icon: '🥕',
        optimalTemp: { min: 15, max: 20 },
        criticalTemp: { min: 10, max: 30 },
        waterNeeds: 'moderate',
        season: 'Rabi (Winter)',
        advisories: {
            highTemp: {
                icon: '🌡️',
                message: 'Temp > 25°C results in pale color and short roots. Mulch soil to keep cool.',
                messageHindi: '25°C से अधिक तापमान पर रंग फीका और जड़ें छोटी हो जाती हैं। ठंडा रखने के लिए मल्च करें।'
            },
            rain: {
                icon: '🌧️',
                message: 'Heavy rain causes root splitting. Improve drainage.',
                messageHindi: 'भारी बारिश से जड़ें फट सकती हैं। जल निकासी सुधारें।'
            },
            sunny: {
                icon: '☀️',
                message: 'Ideal for color development. Ensure consistent moisture.',
                messageHindi: 'रंग विकास के लिए आदर्श। लगातार नमी सुनिश्चित करें।'
            }
        }
    },

    cotton: {
        name: 'Cotton',
        nameHindi: 'कपास',
        icon: '☁️',
        optimalTemp: { min: 21, max: 35 },
        criticalTemp: { min: 15, max: 40 },
        waterNeeds: 'high',
        season: 'Kharif (Monsoon)',
        advisories: {
            highTemp: {
                icon: '🔥',
                message: 'Above 38°C: Increase irrigation frequency. Apply mulch to conserve moisture. Monitor for heat stress.',
                messageHindi: '38°C से ऊपर: सिंचाई बढ़ाएं। नमी बचाने के लिए मल्च डालें। गर्मी तनाव की निगरानी करें।'
            },
            rain: {
                icon: '☔',
                message: 'Excess rain can cause boll rot. Ensure proper drainage. Avoid waterlogging at all costs.',
                messageHindi: 'अधिक बारिश से बॉल सड़न हो सकती है। जल निकासी सुनिश्चित करें। जलभराव से बचें।'
            },
            sunny: {
                icon: '☀️',
                message: 'Excellent for boll opening and fiber development. Good harvest weather. Monitor soil moisture.',
                messageHindi: 'बॉल खुलने और रेशा विकास के लिए उत्कृष्ट। कटाई के लिए अच्छा मौसम। मिट्टी की नमी जांचें।'
            },
            humidity: {
                icon: '💧',
                message: 'High humidity (>80%) increases pest and disease risk. Monitor for bollworm and apply preventive measures.',
                messageHindi: 'उच्च आर्द्रता (>80%) से कीट और रोग का खतरा बढ़ता है। बॉलवर्म की निगरानी करें।'
            }
        }
    },

    soybean: {
        name: 'Soybean',
        nameHindi: 'सोयाबीन',
        icon: '🥔',
        optimalTemp: { min: 20, max: 30 },
        criticalTemp: { min: 15, max: 35 },
        waterNeeds: 'moderate',
        season: 'Kharif (Monsoon)',
        advisories: {
            rain: {
                icon: '🌧️',
                message: 'Critical during flowering stage. Ensure no waterlogging. Excess rain can reduce pod formation.',
                messageHindi: 'फूल आने के समय महत्वपूर्ण। जलभराव न हो। अधिक बारिश से फली बनना कम हो सकता है।'
            },
            sunny: {
                icon: '☀️',
                message: 'Good for pod development and maturity. Monitor soil moisture regularly. Irrigate if needed.',
                messageHindi: 'फली विकास और परिपक्वता के लिए अच्छा। मिट्टी की नमी नियमित जांचें। जरूरत पर सिंचाई करें।'
            },
            highTemp: {
                icon: '🌡️',
                message: 'Above 35°C can reduce yield. Irrigate in evening hours. Consider foliar spray to reduce heat stress.',
                messageHindi: '35°C से ऊपर उपज कम हो सकती है। शाम को सिंचाई करें। गर्मी तनाव कम करने के लिए पर्णीय छिड़काव करें।'
            }
        }
    },

    rice: {
        name: 'Rice',
        nameHindi: 'धान',
        icon: '🌾',
        optimalTemp: { min: 20, max: 35 },
        criticalTemp: { min: 15, max: 40 },
        waterNeeds: 'very high',
        season: 'Kharif (Monsoon)',
        advisories: {
            rain: {
                icon: '🌧️',
                message: 'Essential for rice cultivation. Maintain 5-10cm standing water. Good rainfall reduces irrigation needs.',
                messageHindi: 'धान की खेती के लिए आवश्यक। 5-10 सेमी खड़ा पानी बनाए रखें। अच्छी बारिश से सिंचाई की जरूरत कम होती है।'
            },
            sunny: {
                icon: '☀️',
                message: 'Good for grain filling. Ensure adequate water supply. Monitor for pests in warm weather.',
                messageHindi: 'अनाज भरने के लिए अच्छा। पर्याप्त पानी सुनिश्चित करें। गर्म मौसम में कीटों की निगरानी करें।'
            },
            highTemp: {
                icon: '🔥',
                message: 'Above 38°C during flowering can cause spikelet sterility. Maintain water level and consider evening irrigation.',
                messageHindi: 'फूल आने के समय 38°C से ऊपर बांझपन हो सकता है। पानी का स्तर बनाए रखें।'
            }
        }
    },

    maize: {
        name: 'Maize',
        nameHindi: 'मक्का',
        icon: '🌽',
        optimalTemp: { min: 18, max: 32 },
        criticalTemp: { min: 10, max: 38 },
        waterNeeds: 'moderate',
        season: 'Kharif & Rabi',
        advisories: {
            rain: {
                icon: '🌧️',
                message: 'Moderate rain beneficial. Ensure drainage to prevent root rot. Critical during tasseling and silking.',
                messageHindi: 'मध्यम बारिश लाभदायक। जड़ सड़न रोकने के लिए जल निकासी सुनिश्चित करें।'
            },
            sunny: {
                icon: '☀️',
                message: 'Excellent for growth and cob development. Ensure regular irrigation. Good for harvesting.',
                messageHindi: 'विकास और भुट्टा विकास के लिए उत्कृष्ट। नियमित सिंचाई सुनिश्चित करें।'
            },
            wind: {
                icon: '💨',
                message: 'Strong winds can damage tall plants. Provide support if needed. Avoid spraying in windy conditions.',
                messageHindi: 'तेज हवा से लंबे पौधे क्षतिग्रस्त हो सकते हैं। जरूरत पर सहारा दें।'
            }
        }
    },

    mushroom: {
        name: 'Mushroom',
        nameHindi: 'मशरूम',
        icon: '🍄',
        optimalTemp: { min: 18, max: 28 },
        criticalTemp: { min: 10, max: 32 },
        waterNeeds: 'High (80-90% Humidity)',
        season: 'Year-round (Controlled)',
        advisories: {
            highTemp: {
                icon: '🌡️',
                message: 'Temp > 28°C invites Green Mold. Ensure proper ventilation and cooling.',
                messageHindi: '28°C से ऊपर तापमान से ग्रीन मोल्ड हो सकता है। उचित वेंटिलेशन सुनिश्चित करें।'
            },
            humidity: {
                icon: '💧',
                message: 'Maintain 80-90% humidity. Low humidity dries out pins. Spray water on floor/walls.',
                messageHindi: '80-90% नमी बनाए रखें। कम नमी से पिन सूख जाते हैं। फर्श/दीवारों पर पानी छिड़कें।'
            },
            general: {
                icon: '💡',
                message: 'Harvest 20-30 days after spawning. Maintain hygiene to prevent mites. Pro Tip: Proper air circulation increases yield.',
                messageHindi: 'स्पॉनिंग के 20-30 दिन बाद कटाई करें। स्वच्छता बनाए रखें। प्रो टिप: हवा का आवागमन उपज बढ़ाता है।'
            }
        }
    }
};

/**
 * Get crop-specific advisory based on current weather
 * @param {string} cropType - Type of crop (wheat, cotton, etc.)
 * @param {Object} weatherData - Current weather data
 * @returns {Array} Array of relevant advisories
 */
export const getCropAdvisory = (cropType, weatherData) => {
    const crop = cropDatabase[cropType];
    if (!crop) return [];

    const advisories = [];
    const temp = weatherData.current.temp;
    const condition = weatherData.current.condition.toLowerCase();
    const humidity = weatherData.current.humidity;
    const windSpeed = parseInt(weatherData.current.wind);

    // Temperature advisories
    if (temp > crop.optimalTemp.max && crop.advisories.highTemp) {
        advisories.push(crop.advisories.highTemp);
    } else if (temp < crop.optimalTemp.min && crop.advisories.lowTemp) {
        advisories.push(crop.advisories.lowTemp);
    }

    // Weather condition advisories
    if ((condition.includes('rain') || condition.includes('drizzle')) && crop.advisories.rain) {
        advisories.push(crop.advisories.rain);
    } else if ((condition.includes('sunny') || condition.includes('clear')) && crop.advisories.sunny) {
        advisories.push(crop.advisories.sunny);
    }

    // Humidity advisory
    if (humidity > 80 && crop.advisories.humidity) {
        advisories.push(crop.advisories.humidity);
    }

    // Wind advisory
    if (windSpeed > 30 && crop.advisories.wind) {
        advisories.push(crop.advisories.wind);
    }

    // If no specific advisories, add a general one
    if (advisories.length === 0) {
        advisories.push({
            icon: crop.icon || '🌾',
            message: `Weather conditions are moderate for ${crop.name}. Continue regular monitoring and care.`,
            messageHindi: `${crop.nameHindi} के लिए मौसम की स्थिति सामान्य है। नियमित निगरानी जारी रखें।`
        });
    }

    return advisories;
};
