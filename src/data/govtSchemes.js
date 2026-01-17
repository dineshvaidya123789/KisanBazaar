// Utility functions to generate dynamic dates
const getFutureDate = (monthsFromNow) => {
    const date = new Date();
    date.setMonth(date.getMonth() + monthsFromNow);
    return date.toISOString().split('T')[0];
};

const getPastDate = (monthsAgo) => {
    const date = new Date();
    date.setMonth(date.getMonth() - monthsAgo);
    return date.toISOString().split('T')[0];
};

export const allSchemes = [
    {
        id: 1,
        title: "PM Kusum Yojana (Solar Pump)",
        titleHi: "पीएम कुसुम योजना (सोलर पंप)",
        titleMr: "पीएम कुसुम योजना (सौर पंप)",
        benefit: "Up to 90% Subsidy on Solar Pumps",
        benefitHi: "सोलर पंप पर 90% तक की सब्सिडी",
        benefitMr: "सौर पंपावर ९०% पर्यंत अनुदान",
        applyText: "Visit Portal",
        applyUrl: "https://pmkusum.mnre.gov.in",
        color: "#FF9800",
        startDate: getPastDate(11),
        validUntil: getFutureDate(12)
    },
    {
        id: 101,
        title: "Kisan Suvidha Portal",
        titleHi: "किसान सुविधा पोर्टल",
        titleMr: "किसान सुविधा पोर्टल",
        benefit: "Central Govt All-in-One Agri Services",
        benefitHi: "केंद्र सरकार की सभी कृषि सेवाएं एक जगह",
        benefitMr: "केंद्र सरकारची सर्व कृषी सेवा एकाच ठिकाणी",
        applyText: "Visit Now",
        applyUrl: "https://kisansuvidha.gov.in/",
        color: "#009688",
        startDate: getPastDate(1),
        validUntil: getFutureDate(24)
    },
    {
        id: 102,
        title: "MP Krishi (Govt of MP)",
        titleHi: "म.प्र. कृषि विभाग",
        titleMr: "मध्य प्रदेश कृषी विभाग",
        benefit: "All MP Govt Schemes & Updates",
        benefitHi: "मध्य प्रदेश सरकार की सभी योजनाएं",
        benefitMr: "मध्य प्रदेश सरकारच्या सर्व योजना आणि अपडेट्स",
        applyText: "Visit Now",
        applyUrl: "https://mpkrishi.mp.gov.in/",
        color: "#2E7D32",
        startDate: getPastDate(1),
        validUntil: getFutureDate(24)
    },
    {
        id: 2,
        title: "Tractor Subsidy Scheme",
        titleHi: "ट्रैक्टर सब्सिडी योजना",
        titleMr: "ट्रॅक्टर सबसिडी योजना",
        benefit: "20-50% Subsidy on new Tractors",
        benefitHi: "नए ट्रैक्टर पर 20-50% तक की छूट",
        benefitMr: "नवीन ट्रॅक्टरवर २०-५०% पर्यंत सवलत",
        applyText: "MP Krishi Yantra",
        applyUrl: "https://dbt.mpdage.org",
        color: "#4CAF50",
        startDate: getPastDate(1),
        validUntil: getFutureDate(6)
    },
    {
        id: 3,
        title: "PM Fasal Bima Yojana",
        titleHi: "प्रधानमंत्री फसल बीमा योजना",
        titleMr: "प्रधानमंत्री पीक विमा योजना",
        benefit: "Crop insurance against natural calamities",
        benefitHi: "प्राकृतिक आपदाओं से फसल नुकसान का बीमा",
        benefitMr: "नैसर्गिक आपत्तींपासून होणाऱ्या नुकसानीसाठी पीक विमा",
        applyText: "Contact Bank/CSC",
        applyUrl: "https://pmfby.gov.in",
        color: "#2196F3",
        startDate: getPastDate(6),
        validUntil: getFutureDate(12)
    },
    {
        id: 4,
        title: "Kisan Credit Card (KCC)",
        titleHi: "किसान क्रेडिट कार्ड (KCC)",
        titleMr: "किसान क्रेडिट कार्ड (KCC)",
        benefit: "Low interest loans (4%) for farming needs",
        benefitHi: "खेती के लिए कम ब्याज (4%) पर लोन",
        benefitMr: "शेतीसाठी कमी व्याजावर (४%) कर्ज",
        applyText: "Visit Bank",
        applyUrl: "https://www.myscheme.gov.in/schemes/kcc",
        color: "#9C27B0",
        startDate: getPastDate(23),
        validUntil: getFutureDate(15)
    },
    {
        id: 5,
        title: "Soil Health Card Scheme",
        titleHi: "मृदा स्वास्थ्य कार्ड योजना",
        titleMr: "मृदा आरोग्य कार्ड योजना",
        benefit: "Free Soil Testing & Fertilizer advice",
        benefitHi: "मुफ्त मिट्टी परीक्षण और खाद की सलाह",
        benefitMr: "मोफत माती परीक्षण आणि खत सल्ला",
        applyText: "Contact Agri Dept",
        applyUrl: "https://soilhealth.dac.gov.in",
        color: "#795548",
        startDate: getPastDate(11),
        validUntil: getFutureDate(12)
    },
    {
        id: 6,
        title: "Organic Farming (PKVY)",
        titleHi: "परंपरागत कृषि विकास योजना (जैविक खेती)",
        titleMr: "परंपरागत कृषी विकास योजना (सेंद्रिय शेती)",
        benefit: "Rs. 50,000/ha subsidy for Organic Farming",
        benefitHi: "जैविक खेती के लिए 50,000 रु/हेक्टेयर की सहायता",
        benefitMr: "सेंद्रिय शेतीसाठी ५०,००० रु/हेक्टर अनुदान",
        applyText: "Agri Dept Reg.",
        applyUrl: "https://pgsindia-ncof.gov.in",
        color: "#8BC34A",
        startDate: getPastDate(0),
        validUntil: getFutureDate(24)
    },
    {
        id: 7,
        title: "Pradhan Mantri Krishi Sinchai Yojana",
        titleHi: "प्रधानमंत्री कृषि सिंचाई योजना",
        titleMr: "प्रधानमंत्री कृषी सिंचन योजना",
        benefit: "Subsidy on Drip/Sprinkler Irrigation",
        benefitHi: "ड्रिप और स्प्रिंकलर सिंचाई पर भारी छूट",
        benefitMr: "ठिबक आणि तुषार सिंचनावर मोठे अनुदान",
        applyText: "MPFSTS Portal",
        applyUrl: "https://mpfsts.mp.gov.in",
        color: "#03A9F4",
        startDate: getPastDate(7),
        validUntil: getFutureDate(10)
    },
    {
        id: 8,
        title: "e-NAM (National Agriculture Market)",
        titleHi: "ई-नाम (राष्ट्रीय कृषि बाजार)",
        titleMr: "ई-नाम (राष्ट्रीय कृषी बाजार)",
        benefit: "Sell crops online at best prices across India",
        benefitHi: "देश भर में अपनी फसल ऑनलाइन अच्छे दाम पर बेचें",
        benefitMr: "देशभरात आपले पीक चांगल्या भावाने ऑनलाइन विका",
        applyText: "Register Online",
        applyUrl: "https://www.enam.gov.in",
        color: "#FF5722",
        startDate: getPastDate(11),
        validUntil: getFutureDate(999)
    }
];

export const isNewScheme = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
};
