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
        validUntil: getFutureDate(12),
        state: "central"
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
        validUntil: getFutureDate(24),
        state: "central"
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
        validUntil: getFutureDate(24),
        state: "mp"
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
        validUntil: getFutureDate(6),
        state: "mp"
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
        validUntil: getFutureDate(12),
        state: "central"
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
        validUntil: getFutureDate(15),
        state: "central"
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
        validUntil: getFutureDate(12),
        state: "central"
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
        validUntil: getFutureDate(24),
        state: "central"
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
        validUntil: getFutureDate(10),
        state: "mp"
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
        validUntil: getFutureDate(999),
        state: "central"
    },
    {
        id: 201,
        title: "Magel Tyala Shettale",
        titleHi: "मागेल त्याला शेततळे",
        titleMr: "मागेल त्याला शेततळे",
        benefit: "Subsidy for Farm Ponds",
        benefitHi: "खेत तालाब के लिए अनुदान",
        benefitMr: "शेततळ्यासाठी अनुदान",
        applyText: "Apply on MahaDBT",
        applyUrl: "https://mahadbt.maharashtra.gov.in/",
        color: "#0288D1",
        startDate: getPastDate(2),
        validUntil: getFutureDate(12),
        state: "mh"
    },
    {
        id: 202,
        title: "Nanaji Deshmukh Krishi Sanjivani Yojana (PoCRA)",
        titleHi: "नानाजी देशमुख कृषि संजीवनी योजना",
        titleMr: "नानाजी देशमुख कृषी संजीवनी योजना (पोकरा)",
        benefit: "Climate Resilient Agriculture Support",
        benefitHi: "जलवायु अनुकूल कृषि सहायता",
        benefitMr: "हवामान अनुकूल शेती मदत",
        applyText: "Visit PoCRA",
        applyUrl: "https://dbt.mahapocra.gov.in/",
        color: "#689F38",
        startDate: getPastDate(6),
        validUntil: getFutureDate(24),
        state: "mh"
    },
    {
        id: 203,
        title: "Mukhyamantri Saur Krushi Pump Yojana",
        titleHi: "मुख्यमंत्री सौर कृषि पंप योजना",
        titleMr: "मुख्यमंत्री सौर कृषी पंप योजना",
        benefit: "90-95% Subsidy on Solar Pumps",
        benefitHi: "सौर पंप पर 90-95% सब्सिडी",
        benefitMr: "सौर पंपावर ९०-९५% अनुदान",
        applyText: "Apply Online",
        applyUrl: "https://www.mahadiscom.in/solar-roof-top/",
        color: "#FBC02D",
        startDate: getPastDate(3),
        validUntil: getFutureDate(12),
        state: "mh"
    },
    {
        id: 204,
        title: "Mahatma Jyotirao Phule Shetkari Karjmukti Yojana",
        titleHi: "महात्मा ज्योतिराव फुले किसान कर्जमुक्ति योजना",
        titleMr: "महात्मा ज्योतिराव फुले शेतकरी कर्जमुक्ती योजना",
        benefit: "Loan Waiver up to ₹2 Lakhs",
        benefitHi: "2 लाख रुपये तक का कर्ज माफी",
        benefitMr: "२ लाख रुपयांपर्यंत कर्जमाफी",
        applyText: "Check Status",
        applyUrl: "https://mjpsky.maharashtra.gov.in/",
        color: "#D32F2F",
        startDate: getPastDate(12),
        validUntil: getFutureDate(6),
        state: "mh"
    },
    {
        id: 205,
        title: "Bhausaheb Fundkar Falbag Lagvad Yojana",
        titleHi: "भाऊसाहेब फुंडकर फलबाग लागवड योजना",
        titleMr: "भाऊसाहेब फुंडकर फळबाग लागवड योजना",
        benefit: "100% Subsidy for Orchard Planting",
        benefitHi: "फलबाग लगाने के लिए 100% सब्सिडी",
        benefitMr: "फळबाग लागवडीसाठी १००% अनुदान",
        applyText: "Apply MahaDBT",
        applyUrl: "https://mahadbt.maharashtra.gov.in/",
        color: "#388E3C",
        startDate: getPastDate(5),
        validUntil: getFutureDate(18),
        state: "mh"
    },
    {
        id: 206,
        title: "Gopinath Munde Shetkari Apghat Vima Yojana",
        titleHi: "गोपीनाथ मुंडे किसान दुर्घटना बीमा योजना",
        titleMr: "गोपीनाथ मुंडे शेतकरी अपघात विमा योजना",
        benefit: "₹2 Lakh Insurance Cover for Accidents",
        benefitHi: "दुर्घटना के लिए 2 लाख रुपये का बीमा कवर",
        benefitMr: "अपघातासाठी २ लाख रुपयांचे विमा संरक्षण",
        applyText: "Contact Talathi",
        applyUrl: "https://krishi.maharashtra.gov.in/",
        color: "#5D4037",
        startDate: getPastDate(24),
        validUntil: getFutureDate(36),
        state: "mh"
    },
    {
        id: 207,
        title: "Dr. Panjabrao Deshmukh Interest Concession Scheme",
        titleHi: "डॉ. पंजाबराव देशमुख ब्याज रियायत योजना",
        titleMr: "डॉ. पंजाबराव देशमुख व्याज सवलत योजना",
        benefit: "0% Interest on Crop Loans up to ₹3 Lakhs",
        benefitHi: "3 लाख तक के फसल ऋण पर 0% ब्याज",
        benefitMr: "३ लाख रुपयांपर्यंतच्या पीक कर्जावर ०% व्याज",
        applyText: "Contact Bank",
        applyUrl: "https://cooperation.maharashtra.gov.in/",
        color: "#1976D2",
        startDate: getPastDate(1),
        validUntil: getFutureDate(12),
        state: "mh"
    }
];

export const isNewScheme = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
};
