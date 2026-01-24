import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import BackToHomeButton from '../components/BackToHomeButton';

const CropAdvisory = () => {
    const { t, language } = useLanguage();
    const [searchParams] = useSearchParams();
    const cropQuery = searchParams.get('crop');
    const topicQuery = searchParams.get('topic');

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentSeason, setCurrentSeason] = useState('');
    const [searchHighlight, setSearchHighlight] = useState(cropQuery || '');
    const [visibleCount, setVisibleCount] = useState(12); // Pagination: show 12 crops initially

    // Helper to get localized field
    const getLoc = (item, field) => {
        if (language === 'hi') return item[`${field}_hi`] || item[field];
        if (language === 'mr') return item[`${field}_mr`] || item[field];
        return item[field];
    };

    // Dynamic Season Detection
    useEffect(() => {
        const month = new Date().getMonth(); // 0-11
        let season = 'All';

        if (month >= 5 && month <= 9) {
            season = 'Kharif';
        } else if (month >= 3 && month <= 4) {
            season = 'Zaid';
        } else {
            season = 'Rabi'; // Winter (Oct-March)
        }

        setCurrentSeason(season);

        // If searching specific crop, show 'All' categories AND prioritize the match
        // Default to 'All' category for clean start
        setSelectedCategory('All');
    }, [cropQuery]);

    const crops = [
        // --- NEW ADDITIONS (Zaid/Vegetables/Fruits) ---
        {
            id: 201,
            name: "Lemon",
            name_hi: "नींबू",
            name_mr: "लिंबू",
            category: "Perennial", // or Zaid/All Year
            scientificName: "Citrus limon",
            sowing: "July-Aug or Feb-March",
            sowing_hi: "जुलाई-अगस्त या फरवरी-मार्च",
            sowing_mr: "जुलै-ऑगस्ट किंवा फेब्रुवारी-मार्च",
            harvesting: "Year-round (Peak: June-Aug)",
            harvesting_hi: "साल भर (शिखर: जून-अगस्त)",
            harvesting_mr: "वर्षभर (पीक: जून-ऑगस्ट)",
            soil: "Well-drained Sandy Loam",
            water: "Regular irrigation. Basin method is best.",
            water_hi: "नियमित सिंचाई। थाला विधि सर्वोत्तम है।",
            water_mr: "नियमित पाणी देणे. आळे पद्धत सर्वोत्तम आहे.",
            diseases: "Citrus Canker, Leaf Miner.",
            diseases_hi: "साइट्रस कैंकर, लीफ माइनर।",
            diseases_mr: "लिंबूवरील खैरा रोग, पाने पोखरणारी अळी.",
            tips: "Pruning dry branches is essential. Apply Zinc and Boron for better fruit quality.",
            tips_hi: "सूखी शाखाओं की छंटाई आवश्यक है। बेहतर फल गुणवत्ता के लिए जिंक और बोरॉन का प्रयोग करें।",
            tips_mr: "वाळलेल्या फांद्या छाटणे आवश्यक आहे. फळांच्या चांगल्या गुणवत्तेसाठी झिंक आणि बोरॉन वापरा.",
            image: "https://images.unsplash.com/photo-1595855709923-a550992e22dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            status: "High Demand"
        },
        {
            id: 202,
            name: "Tomato",
            name_hi: "टमाटर",
            name_mr: "टोमॅटो",
            category: "Rabi", // Can be Rabi/Kharif/Zaid depending on variety, putting Rabi/Zaid
            scientificName: "Solanum lycopersicum",
            sowing: "Aug-Sept or Dec-Jan",
            sowing_hi: "अगस्त-सितंबर या दिसंबर-जनवरी",
            sowing_mr: "ऑगस्ट-सप्टेंबर किंवा डिसेंबर-जानेवारी",
            harvesting: "60-70 days after planting",
            harvesting_hi: "रोपाई के 60-70 दिन बाद",
            harvesting_mr: "लागवडीनंतर ६०-७० दिवसांनी",
            soil: "Well-drained Sandy Loam",
            water: "Crucial at flowering & fruiting.",
            water_hi: "फूल और फल आते समय महत्वपूर्ण।",
            water_mr: "फुले आणि फळे येताना पाणी देणे महत्त्वाचे.",
            diseases: "Leaf Curl Virus, Blight.",
            diseases_hi: "लीफ कर्ल वायरस, झुलसा।",
            diseases_mr: "पाने गुंडाळणारा विषाणू, करपा.",
            tips: "Staking (Sahara) increases yield by 40%. Mulching prevents soil borne diseases.",
            tips_hi: "सहारा (स्टेकिंग) देने से उपज 40% बढ़ती है। मल्चिंग मृदा जनित रोगों को रोकता है।",
            tips_mr: "आधार (स्टेकिंग) दिल्यास उत्पन्नात ४०% वाढ होते. मल्चिंगमुळे जमिनीतील रोग रोखले जातात.",
            image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            status: "Daily Need"
        },
        {
            id: 203,
            name: "Onion",
            name_hi: "प्याज़",
            name_mr: "कांदा",
            category: "Rabi",
            scientificName: "Allium cepa",
            sowing: "Oct-Nov (Nursery)",
            sowing_hi: "अक्टूबर-नवंबर (नर्सरी)",
            sowing_mr: "ऑक्टोबर-नोव्हेंबर (रोपवाटिका)",
            harvesting: "April-May",
            harvesting_hi: "अप्रैल-मई",
            harvesting_mr: "एप्रिल-मे",
            soil: "Friable, non-crusting Loam",
            water: "Shallow rooted - needs light frequent irrigation.",
            water_hi: "उथली जड़ें - हल्की और बार-बार सिंचाई की आवश्यकता होती है।",
            water_mr: "उथळ मुळे - हलके व वारंवार पाणी देणे आवश्यक.",
            diseases: "Purple Blotch, Thrips.",
            diseases_hi: "बैंगनी धब्बा, थिप्स।",
            diseases_mr: "जांभळा करपा, फुलकिडे.",
            tips: "Stop irrigation 15 days before harvest to increase shelf life.",
            tips_hi: "भंडारण क्षमता बढ़ाने के लिए खुदाई से 15 दिन पहले सिंचाई रोक दें।",
            tips_mr: "साठवण क्षमता वाढवण्यासाठी काढणीच्या १५ दिवस आधी पाणी देणे थांबवा.",
            image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa829?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            status: "Volatile"
        },
        {
            id: 204,
            name: "Potato",
            name_hi: "आलू",
            name_mr: "बटाटा",
            category: "Rabi",
            scientificName: "Solanum tuberosum",
            sowing: "Oct - Nov",
            sowing_hi: "अक्टूबर - नवंबर",
            sowing_mr: "ऑक्टोबर - नोव्हेंबर",
            harvesting: "Feb - March",
            harvesting_hi: "फरवरी - मार्च",
            harvesting_mr: "फेब्रुवारी - मार्च",
            soil: "Sandy Loam, rich in organic matter",
            water: "Pre-sowing + 5-6 irrigations.",
            water_hi: "बुवाई पूर्व + 5-6 सिंचाई।",
            water_mr: "पेरणी पूर्व + ५-६ वेळा पाणी.",
            diseases: "Late Blight (Jhuls).",
            diseases_hi: "पछता झुलसा (लेट ब्लाइट)।",
            diseases_mr: "उशिरा येणारा करपा.",
            tips: "Earthing up (Mitti chadhana) is crucial at 25-30 days.",
            tips_hi: "25-30 दिनों पर मिट्टी चढ़ाना महत्वपूर्ण है।",
            tips_mr: "२५-३० दिवसांनी माती लावणे महत्त्वाचे आहे.",
            image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            status: "Staple"
        },
        {
            id: 205,
            name: "Garlic",
            name_hi: "लहसुन",
            name_mr: "लसूण",
            category: "Rabi",
            scientificName: "Allium sativum",
            sowing: "Sept - Oct",
            sowing_hi: "सितंबर - अक्टूबर",
            sowing_mr: "सप्टेंबर - ऑक्टोबर",
            harvesting: "Feb - March",
            harvesting_hi: "फरवरी - मार्च",
            harvesting_mr: "फेब्रुवारी - मार्च",
            soil: "Well-drained Loam",
            water: "Every 10-15 days.",
            water_hi: "हर 10-15 दिन में।",
            water_mr: "दर १०-१५ दिवसांनी.",
            diseases: "Downy Mildew, Thrips.",
            diseases_hi: "डाउनी मिलड्यू, थिप्स।",
            diseases_mr: "डाउनी मिल्ड्यू, फुलकिडे.",
            tips: "Clove size determines bulb size. Plant bigger cloves.",
            tips_hi: "कलियों का आकार कंद का आकार तय करता है। बड़ी कलियाँ लगाएँ।",
            tips_mr: "पाकळीचा आकार कंदाचा आकार ठरवतो. मोठ्या पाकळ्या लावा.",
            image: "https://images.unsplash.com/photo-1615477083098-b807c4b4f3b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        },
        {
            id: 206,
            name: "Okra",
            name_hi: "भिंडी",
            name_mr: "भेंडी",
            category: "Kharif", // Also Zaid
            scientificName: "Abelmoschus esculentus",
            sowing: "Feb-March or June-July",
            sowing_hi: "फरवरी-मार्च या जून-जुलाई",
            sowing_mr: "फेब्रुवारी-मार्च किंवा जून-जुलै",
            harvesting: "45-60 days after sowing",
            harvesting_hi: "बुवाई के 45-60 दिन बाद",
            harvesting_mr: "पेरणीनंतर ४५-६० दिवसांनी",
            soil: "Sandy Loam to Clay Loam",
            water: "Summer: Every 4-5 days.",
            water_hi: "गर्मी: हर 4-5 दिन में।",
            water_mr: "उन्हाळा: दर ४-५ दिवसांनी.",
            diseases: "Yellow Vein Mosaic Virus.",
            diseases_hi: "पीला मोजैक वायरस।",
            diseases_mr: "यलो व्हेन मोझॅक व्हायरस.",
            tips: "Pick pods every alternate day.",
            tips_hi: "हर दूसरे दिन फल तोड़ें।",
            tips_mr: "दर दुसऱ्या दिवशी शेंगा तोडा.",
            image: "https://images.unsplash.com/photo-1425543103986-226d3d8fa136?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            status: "Daily Need"
        },

        // --- RABI (Winter) High Demand Crops ---
        {
            id: 101,
            name: "Green Peas",
            name_hi: "मटर",
            name_mr: "वाटाणा",
            category: "Rabi",
            scientificName: "Pisum sativum",
            sowing: "Oct - Nov",
            sowing_hi: "अक्टूबर - नवंबर",
            sowing_mr: "ऑक्टोबर - नोव्हेंबर",
            harvesting: "Dec - Feb",
            harvesting_hi: "दिसंबर - फरवरी",
            harvesting_mr: "डिसेंबर - फेब्रुवारी",
            soil: "Well-drained Loamy Soil",
            water: "Frequent light irrigation.",
            water_hi: "बार-बार हल्की सिंचाई।",
            water_mr: "वारंवार हलके पाणी.",
            diseases: "Powdery Mildew.",
            diseases_hi: "पाउडरी मिलड्यू (सफेद फफूंद)।",
            diseases_mr: "भुरी रोग.",
            tips: "Early sown 'Arkel' variety gets higher market price.",
            tips_hi: "जल्दी बोई गई 'आर्कल' किस्म को उच्च बाजार मूल्य मिलता है।",
            tips_mr: "लवकर पेरलेल्या 'आर्केल' जातीला जास्त बाजारभाव मिळतो.",
            image: "https://images.unsplash.com/photo-1592323602568-15d2bb98246e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            status: "Trending"
        },
        {
            id: 1,
            name: "Wheat",
            name_hi: "गेहूं",
            name_mr: "गहू",
            category: "Rabi",
            scientificName: "Triticum aestivum",
            sowing: "November - December",
            sowing_hi: "नवंबर - दिसंबर",
            sowing_mr: "नोव्हेंबर - डिसेंबर",
            harvesting: "March - April",
            harvesting_hi: "मार्च - अप्रैल",
            harvesting_mr: "मार्च - एप्रिल",
            soil: "Loamy or Clay Loam",
            water: "4-6 Irrigations required.",
            water_hi: "4-6 सिंचाई की आवश्यकता।",
            water_mr: "४-६ वेळा पाणी आवश्यक.",
            diseases: "Rust (Yellow/Brown), Blight.",
            diseases_hi: "रतुआ (पीला/भूरा), झुलसा।",
            diseases_mr: "तांबेरा (पिवळा/तपकिरी).",
            tips: "Late sowing reduces yield by 30kg/day.",
            tips_hi: "देर से बुवाई करने पर उपज 30 किग्रा/दिन कम हो जाती है।",
            tips_mr: "उशिरा पेरणी केल्यास उत्पादन ३० किलो/दिवस कमी होते.",
            image: "https://images.unsplash.com/photo-1574943320219-55edeb705382?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            status: "Staple"
        },
        {
            id: 3,
            name: "Gram/Chickpea",
            name_hi: "चना",
            name_mr: "हरभरा",
            category: "Rabi",
            scientificName: "Cicer arietinum",
            sowing: "October - November",
            sowing_hi: "अक्टूबर - नवंबर",
            sowing_mr: "ऑक्टोबर - नोव्हेंबर",
            harvesting: "February - March",
            harvesting_hi: "फरवरी - मार्च",
            harvesting_mr: "फेब्रुवारी - मार्च",
            soil: "Sandy Loam to Clay Loam",
            water: "Requires less water (1-2 irrigations).",
            water_hi: "कम पानी की आवश्यकता (1-2 सिंचाई)।",
            water_mr: "कमी पाणी लागते (१-२ वेळा).",
            diseases: "Wilt (Ukhtha), Pod Borer.",
            diseases_hi: "उकठा, फली बेधक (इल्ली)।",
            diseases_mr: "मर रोग, घाटे अळी.",
            tips: "Nipping at 30 days increases branching.",
            tips_hi: "30 दिनों पर शीर्ष की कटाई (निपिंग) से शाखाएं बढ़ती हैं।",
            tips_mr: "३० दिवसांनी शेंडे खुडल्यास फांद्या वाढतात.",
            image: "https://images.unsplash.com/photo-1515923984029-21b9134a413a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            status: "High Value"
        },
        {
            id: 102,
            name: "Carrot",
            name_hi: "गाजर",
            name_mr: "गाजर",
            category: "Rabi",
            scientificName: "Daucus carota",
            sowing: "Aug - Nov",
            sowing_hi: "अगस्त - नवंबर",
            sowing_mr: "ऑगस्ट - नोव्हेंबर",
            harvesting: "Nov - Feb",
            harvesting_hi: "नवंबर - फरवरी",
            harvesting_mr: "नोव्हेंबर - फेब्रुवारी",
            soil: "Deep, Loose Loamy Soil",
            water: "Maintain moisture. Irregular watering causes splitting.",
            water_hi: "नमी बनाए रखें। अनियमित पानी देने से विभाजन होता है।",
            water_mr: "ओलावा टिकवून ठेवा. अनियमित पाण्यामुळे विभाजन होते.",
            diseases: "Leaf Blight, Forking (if soil is hard).",
            diseases_hi: "पत्ती झुलसा, फोर्क करना (यदि मिट्टी कठोर है)।",
            diseases_mr: "पानांचा करपा, फाटे फुटणे (जर माती कठीण असेल).",
            tips: "For red color development, temperature of 15-20°C is best. 'Pusa Rudhira' is a good red variety.",
            tips_hi: "लाल रंग के विकास के लिए 15-20°C तापमान सबसे अच्छा है। 'पूसा रुधिरा' एक अच्छी लाल किस्म है।",
            tips_mr: "लाल रंगाच्या विकासासाठी 15-20°C तापमान सर्वोत्तम आहे. 'पुसा रुधिरा' एक चांगली लाल जात आहे.",
            image: "https://images.unsplash.com/photo-1447175008436-812378a86185?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            status: "Seasonal"
        },

        // --- KHARIF (Monsoon) ---
        {
            id: 2,
            name: "Soybean",
            name_hi: "सोयाबीन",
            name_mr: "सोयाबीन",
            category: "Kharif",
            scientificName: "Glycine max",
            sowing: "Mid June - Early July",
            sowing_hi: "जून मध्य - जुलाई शुरुआत",
            sowing_mr: "मध्य जून - जुलैची सुरुवात",
            harvesting: "September - October",
            harvesting_hi: "सितंबर - अक्टूबर",
            harvesting_mr: "सप्टेंबर - ऑक्टोबर",
            soil: "Well-drained Black Cotton Soil",
            water: "Rainfed. Requires good drainage.",
            water_hi: "वर्षा आधारित। अच्छी जल निकासी आवश्यक।",
            water_mr: "पावसावर आधारित. चांगला निचरा आवश्यक.",
            diseases: "Yellow Mosaic Virus.",
            diseases_hi: "पीला मोजैक वायरस।",
            diseases_mr: "यलो मोझॅक व्हायरस.",
            tips: "Treat seeds with Rhizobium culture. Maintain plant population.",
            tips_hi: "बीजों को राइजोबियम कल्चर से उपचारित करें। पौधों की आबादी बनाए रखें।",
            tips_mr: "बियाणांवर रायझोबियम कल्चरची प्रक्रिया करा. योग्य रोपांची संख्या ठेवा.",
            image: "https://images.unsplash.com/photo-1599583733072-000c01d90610?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            status: "MP Main"
        },
        {
            id: 4,
            name: "Maize",
            name_hi: "मक्का",
            name_mr: "मका",
            category: "Kharif",
            scientificName: "Zea mays",
            sowing: "June - July",
            sowing_hi: "जून - जुलाई",
            sowing_mr: "जून - जुलै",
            harvesting: "September - October",
            harvesting_hi: "सितंबर - अक्टूबर",
            harvesting_mr: "सप्टेंबर - ऑक्टोबर",
            soil: "Fertile, Well-drained Loam",
            water: "Sensitive to water stress.",
            water_hi: "पानी की कमी के प्रति संवेदनशील।",
            water_mr: "पाण्याच्या ताणास संवेदनशील.",
            diseases: "Fall Army Worm.",
            diseases_hi: "फॉल आर्मी वॉर्म।",
            diseases_mr: "लष्करी अळी.",
            tips: "Apply Nitrogen in split doses. Control weeds in first 40 days.",
            tips_hi: "नाइट्रोजन को विभाजित खुराक में डालें। पहले 40 दिनों में खरपतवार नियंत्रित करें।",
            tips_mr: "नायट्रोजन विभागून द्या. पहिल्या ४० दिवसांत तण नियंत्रण करा.",
            image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
            status: "Staple"
        },
        // --- MUSHROOM (Year-round / Perennial) ---
        {
            id: 207,
            name: "Mushroom",
            name_hi: "मशरूम",
            name_mr: "मशरूम",
            category: "Perennial",
            scientificName: "Agaricus bisporus / Oyster / Milky",
            sowing: "Year-round (controlled environment)",
            sowing_hi: "साल भर (नियंत्रित वातावरण)",
            sowing_mr: "वर्षभर (नियंत्रित वातावरण)",
            harvesting: "20-30 days after spawning",
            harvesting_hi: "स्पॉनिंग के 20-30 दिन बाद",
            harvesting_mr: "स्पॉनिंगनंतर 20-30 दिवसांनी",
            soil: "Compost / Straw Substrate",
            water: "Humidity 80-90%, Temp 18-28°C, indirect light",
            water_hi: "नमी 80-90%, तापमान 18-28°C, अप्रत्यक्ष प्रकाश",
            water_mr: "आर्द्रता 80-90%, तापमान 18-28°C, अप्रत्यक्ष प्रकाश",
            diseases: "Green mold, mites, poor ventilation",
            diseases_hi: "ग्रीन मोल्ड, माइट्स, खराब वेंटिलेशन",
            diseases_mr: "ग्रीन मोल्ड, माइट्स, खराब वेंटिलेशन",
            tips: "Maintain hygiene & proper air circulation for higher yield.",
            tips_hi: "उच्च उपज के लिए स्वच्छता और हवा का उचित संचार बनाए रखें।",
            tips_mr: "जास्त उत्पादनासाठी स्वच्छता आणि हवेशीर वातावरण ठेवा.",
            image: "https://images.unsplash.com/photo-1595503046049-34b8682e016c?auto=format&fit=crop&w=600&q=80",
            status: "High Value"
        },
        {
            id: 208,
            name: "Button Mushroom",
            name_hi: "बटन मशरूम",
            name_mr: "बटन मशरूम",
            category: "Perennial",
            scientificName: "Agaricus bisporus",
            sowing: "Year-round (controlled environment)",
            sowing_hi: "साल भर (नियंत्रित वातावरण)",
            sowing_mr: "वर्षभर (नियंत्रित वातावरण)",
            harvesting: "20-25 days after spawning",
            harvesting_hi: "स्पॉनिंग के 20-25 दिन बाद",
            harvesting_mr: "स्पॉनिंगनंतर 20-25 दिवसांनी",
            soil: "Compost (Wheat/Paddy Straw + Manure)",
            water: "Humidity 85-90%, Temp 22-25°C, no direct sunlight",
            water_hi: "नमी 85-90%, तापमान 22-25°C, सीधी धूप नहीं",
            water_mr: "आर्द्रता 85-90%, तापमान 22-25°C, थेट सूर्यप्रकाश नाही",
            diseases: "Green mold, Bubble disease, Dry bubble",
            diseases_hi: "ग्रीन मोल्ड, बबल रोग, सूखा बबल",
            diseases_mr: "ग्रीन मोल्ड, बबल रोग, कोरडा बबल",
            tips: "Most popular variety. Requires pasteurized compost. Maintain strict temperature control.",
            tips_hi: "सबसे लोकप्रिय किस्म। पाश्चुरीकृत खाद की आवश्यकता। सख्त तापमान नियंत्रण बनाए रखें।",
            tips_mr: "सर्वात लोकप्रिय जात. पाश्चरीकृत खत आवश्यक. कडक तापमान नियंत्रण ठेवा.",
            image: "https://images.unsplash.com/photo-1595503046049-34b8682e016c?auto=format&fit=crop&w=600&q=80",
            status: "High Demand"
        },
        {
            id: 209,
            name: "Oyster Mushroom",
            name_hi: "ऑयस्टर मशरूम",
            name_mr: "ऑयस्टर मशरूम",
            category: "Perennial",
            scientificName: "Pleurotus ostreatus",
            sowing: "Year-round (easier than Button)",
            sowing_hi: "साल भर (बटन से आसान)",
            sowing_mr: "वर्षभर (बटन पेक्षा सोपे)",
            harvesting: "25-30 days after spawning",
            harvesting_hi: "स्पॉनिंग के 25-30 दिन बाद",
            harvesting_mr: "स्पॉनिंगनंतर 25-30 दिवसांनी",
            soil: "Paddy/Wheat Straw (No compost needed)",
            water: "Humidity 80-85%, Temp 20-30°C, indirect light beneficial",
            water_hi: "नमी 80-85%, तापमान 20-30°C, अप्रत्यक्ष प्रकाश लाभदायक",
            water_mr: "आर्द्रता 80-85%, तापमान 20-30°C, अप्रत्यक्ष प्रकाश फायदेशीर",
            diseases: "Trichoderma (Green mold), Bacterial blotch",
            diseases_hi: "ट्राइकोडर्मा (ग्रीन मोल्ड), बैक्टीरियल ब्लॉच",
            diseases_mr: "ट्रायकोडर्मा (ग्रीन मोल्ड), बॅक्टेरियल ब्लॉच",
            tips: "Easiest for beginners. No pasteurization needed. High protein content.",
            tips_hi: "शुरुआती लोगों के लिए सबसे आसान। पाश्चुरीकरण की आवश्यकता नहीं। उच्च प्रोटीन सामग्री।",
            tips_mr: "नवशिक्यांसाठी सर्वात सोपे. पाश्चरीकरण आवश्यक नाही. उच्च प्रथिने.",
            image: "https://images.unsplash.com/photo-1595503046049-34b8682e016c?auto=format&fit=crop&w=600&q=80",
            status: "Beginner Friendly"
        },
        {
            id: 210,
            name: "Dry Mushroom",
            name_hi: "सूखा मशरूम",
            name_mr: "सुक्या मशरूम",
            category: "Perennial",
            scientificName: "Dried Agaricus / Pleurotus",
            sowing: "Process fresh mushrooms",
            sowing_hi: "ताजा मशरूम को प्रोसेस करें",
            sowing_mr: "ताज्या मशरूम प्रक्रिया करा",
            harvesting: "Drying takes 6-8 hours",
            harvesting_hi: "सुखाने में 6-8 घंटे लगते हैं",
            harvesting_mr: "वाळवण्यास 6-8 तास लागतात",
            soil: "N/A (Post-harvest processing)",
            water: "Sun drying or dehydrator at 50-60°C",
            water_hi: "धूप में सुखाना या 50-60°C पर डिहाइड्रेटर",
            water_mr: "उन्हात वाळवणे किंवा 50-60°C वर डिहायड्रेटर",
            diseases: "Moisture contamination, Mold during storage",
            diseases_hi: "नमी संदूषण, भंडारण के दौरान फफूंद",
            diseases_mr: "ओलावा दूषित होणे, साठवणादरम्यान बुरशी",
            tips: "Store in airtight containers. 10x longer shelf life. Premium export value.",
            tips_hi: "एयरटाइट कंटेनर में स्टोर करें। 10 गुना लंबी शेल्फ लाइफ। प्रीमियम निर्यात मूल्य।",
            tips_mr: "एअरटाइट कंटेनरमध्ये साठवा. 10 पट जास्त शेल्फ लाइफ. प्रीमियम निर्यात मूल्य.",
            image: "https://images.unsplash.com/photo-1595503046049-34b8682e016c?auto=format&fit=crop&w=600&q=80",
            status: "Value Addition"
        },
        // --- FRUITS (Perennial / Zaid) ---
        {
            id: 211,
            name: "Grapes",
            name_hi: "अंगूर",
            name_mr: "द्राक्षे",
            category: "Perennial",
            scientificName: "Vitis vinifera",
            sowing: "June-July (Rainy season planting)",
            sowing_hi: "जून-जुलाई (बरसात के मौसम में रोपण)",
            sowing_mr: "जून-जुलै (पावसाळ्यात लागवड)",
            harvesting: "January-March (Winter harvest)",
            harvesting_hi: "जनवरी-मार्च (सर्दियों की कटाई)",
            harvesting_mr: "जानेवारी-मार्च (हिवाळी कापणी)",
            soil: "Well-drained Sandy Loam",
            water: "Drip irrigation recommended. Critical during fruit development.",
            water_hi: "ड्रिप सिंचाई की सिफारिश की जाती है। फल विकास के दौरान महत्वपूर्ण।",
            water_mr: "ठिबक सिंचन शिफारसीय. फळ विकासादरम्यान महत्त्वाचे.",
            diseases: "Downy Mildew, Powdery Mildew, Anthracnose",
            diseases_hi: "डाउनी मिल्ड्यू, पाउडरी मिल्ड्यू, एन्थ्रेक्नोज",
            diseases_mr: "डाउनी मिल्ड्यू, पावडरी मिल्ड्यू, अँथ्रॅक्नोज",
            tips: "Pruning is critical for yield. Use trellis/pandal system. Apply Sulphur spray for disease control. Thompson Seedless is popular.",
            tips_hi: "उपज के लिए छंटाई महत्वपूर्ण है। ट्रेलिस/मचान प्रणाली का उपयोग करें। रोग नियंत्रण के लिए सल्फर स्प्रे करें। थॉम्पसन सीडलेस लोकप्रिय है।",
            tips_mr: "उत्पादनासाठी छाटणी महत्त्वाची आहे. मचान पद्धत वापरा. रोग नियंत्रणासाठी सल्फर फवारणी करा. थॉम्पसन सीडलेस लोकप्रिय आहे.",
            image: "https://images.unsplash.com/photo-1599819177795-d9eb531d9f44?auto=format&fit=crop&w=600&q=80",
            status: "High Value"
        },
        {
            id: 212,
            name: "Watermelon",
            name_hi: "तरबूज",
            name_mr: "कलिंगड",
            category: "Zaid",
            scientificName: "Citrullus lanatus",
            sowing: "February-March",
            sowing_hi: "फरवरी-मार्च",
            sowing_mr: "फेब्रुवारी-मार्च",
            harvesting: "May-June (90-100 days)",
            harvesting_hi: "मई-जून (90-100 दिन)",
            harvesting_mr: "मे-जून (90-100 दिवस)",
            soil: "Sandy Loam with good drainage",
            water: "Regular irrigation during fruit development. Reduce before harvest.",
            water_hi: "फल विकास के दौरान नियमित सिंचाई। कटाई से पहले कम करें।",
            water_mr: "फळ विकासादरम्यान नियमित पाणी. कापणीपूर्वी कमी करा.",
            diseases: "Fusarium Wilt, Anthracnose, Fruit Fly",
            diseases_hi: "फ्यूजेरियम विल्ट, एन्थ्रेक्नोज, फल मक्खी",
            diseases_mr: "फ्युझेरियम विल्ट, अँथ्रॅक्नोज, फळ माशी",
            tips: "Mulching conserves moisture. Pinch off excess vines for larger fruits. Tap test for ripeness - hollow sound means ripe.",
            tips_hi: "मल्चिंग नमी बचाती है। बड़े फलों के लिए अतिरिक्त बेलों को काटें। पकने के लिए थपथपाएं - खोखली आवाज का मतलब पका हुआ।",
            tips_mr: "मल्चिंगमुळे ओलावा टिकतो. मोठ्या फळांसाठी जास्त वेली काढा. पिकण्यासाठी टॅप टेस्ट - पोकळ आवाज म्हणजे पिकलेले.",
            image: "https://images.unsplash.com/photo-1587049352846-4a222e784720?auto=format&fit=crop&w=600&q=80",
            status: "Summer Demand"
        },
        {
            id: 213,
            name: "Sweet Watermelon",
            name_hi: "मीठा तरबूज",
            name_mr: "गोड कलिंगड",
            category: "Zaid",
            scientificName: "Citrullus lanatus var. dulcis",
            sowing: "February-March",
            sowing_hi: "फरवरी-मार्च",
            sowing_mr: "फेब्रुवारी-मार्च",
            harvesting: "May-June (85-95 days)",
            harvesting_hi: "मई-जून (85-95 दिन)",
            harvesting_mr: "मे-जून (85-95 दिवस)",
            soil: "Well-drained Sandy Loam, rich in organic matter",
            water: "Consistent moisture. Reduce watering near harvest for sweetness.",
            water_hi: "लगातार नमी। मिठास के लिए कटाई के पास पानी कम करें।",
            water_mr: "सातत्यपूर्ण ओलावा. गोडपणासाठी कापणीजवळ पाणी कमी करा.",
            diseases: "Fusarium Wilt, Fruit Fly, Blossom End Rot",
            diseases_hi: "फ्यूजेरियम विल्ट, फल मक्खी, फूल अंत सड़न",
            diseases_mr: "फ्युझेरियम विल्ट, फळ माशी, ब्लॉसम एंड रॉट",
            tips: "Sugar Baby and Charleston Gray varieties are popular. Check sugar content with refractometer (12-14% is ideal). Apply potash for sweetness.",
            tips_hi: "शुगर बेबी और चार्ल्सटन ग्रे किस्में लोकप्रिय हैं। रेफ्रैक्टोमीटर से चीनी की मात्रा जांचें (12-14% आदर्श है)। मिठास के लिए पोटाश डालें।",
            tips_mr: "शुगर बेबी आणि चार्ल्सटन ग्रे जाती लोकप्रिय आहेत. रेफ्रॅक्टोमीटरने साखर तपासा (12-14% आदर्श). गोडपणासाठी पोटॅश द्या.",
            image: "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?auto=format&fit=crop&w=600&q=80",
            status: "Premium"
        },
        {
            id: 214,
            name: "Mango",
            name_hi: "आम",
            name_mr: "आंबा",
            category: "Perennial",
            scientificName: "Mangifera indica",
            sowing: "July-August (Grafting season)",
            sowing_hi: "जुलाई-अगस्त (ग्राफ्टिंग का मौसम)",
            sowing_mr: "जुलै-ऑगस्ट (कलम लावण्याचा हंगाम)",
            harvesting: "March-June (depending on variety)",
            harvesting_hi: "मार्च-जून (किस्म के आधार पर)",
            harvesting_mr: "मार्च-जून (जातीनुसार)",
            soil: "Deep, well-drained Loamy soil",
            water: "Regular irrigation during flowering and fruit development. Reduce during ripening.",
            water_hi: "फूल आने और फल विकास के दौरान नियमित सिंचाई। पकने के दौरान कम करें।",
            water_mr: "फुलोरा आणि फळ विकासादरम्यान नियमित पाणी. पिकताना कमी करा.",
            diseases: "Powdery Mildew, Anthracnose, Mango Hopper",
            diseases_hi: "पाउडरी मिल्ड्यू, एन्थ्रेक्नोज, आम का फुदका",
            diseases_mr: "पावडरी मिल्ड्यू, अँथ्रॅक्नोज, आंब्याचा फुदका",
            tips: "Alphonso, Kesar, Dasheri are premium varieties. Apply NAA spray to prevent fruit drop. Smoke treatment induces uniform flowering.",
            tips_hi: "अल्फांसो, केसर, दशहरी प्रीमियम किस्में हैं। फल गिरने से रोकने के लिए NAA स्प्रे करें। धुआं उपचार समान फूल को प्रेरित करता है।",
            tips_mr: "अल्फान्सो, केसर, दशहरी प्रीमियम जाती आहेत. फळ गळण्यापासून रोखण्यासाठी NAA फवारणी करा. धुराचा उपचार एकसमान फुलोरा आणतो.",
            image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80",
            status: "King of Fruits"
        }
    ];

    const filteredCrops = (selectedCategory === 'All'
        ? crops
        : crops.filter(crop => crop.category === selectedCategory || (selectedCategory === 'Perennial' && crop.category === 'Perennial'))
    ).filter(crop => {
        if (!cropQuery) return true;
        // Strict Search Filter if query exists
        const query = cropQuery.toLowerCase();
        return crop.name.toLowerCase().includes(query) ||
            (crop.name_hi && crop.name_hi.toLowerCase().includes(query)) ||
            (crop.name_mr && crop.name_mr.toLowerCase().includes(query)) ||
            crop.scientificName?.toLowerCase().includes(query) ||
            crop.category.toLowerCase().includes(query);
    }).sort((a, b) => b.id - a.id);

    // Pagination: show only visibleCount crops
    const displayedCrops = filteredCrops.slice(0, visibleCount);
    const hasMoreCrops = visibleCount < filteredCrops.length;

    // Reset visible count when category changes
    useEffect(() => {
        setVisibleCount(12);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [selectedCategory]);

    // Load More handler
    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 12);
    };

    return (
        <div className="fade-in" style={{
            padding: '2rem 1rem',
            maxWidth: '1200px',
            margin: '0 auto',
            fontFamily: 'var(--font-family-base)',
            minHeight: '100vh',
            backgroundImage: 'linear-gradient(to bottom, #fafaeb, #fff)'
        }}>
            <BackToHomeButton compact />

            <h1 style={{ textAlign: 'center', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
                {t('advisory_title')}
                {currentSeason && <span style={{ fontSize: '0.6em', display: 'block', color: '#666', marginTop: '5px' }}>
                    {t('running_season')}: <span style={{ color: 'var(--color-secondary)' }}>{t(`cat_${currentSeason.toLowerCase()}`) || currentSeason}</span>
                </span>}
            </h1>
            {/* Removed original Hindi line as t() handles localization */}

            {/* Category Filter */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
                {['All', 'Rabi', 'Kharif', 'Zaid'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                        style={{ minWidth: '100px', borderRadius: '20px' }}
                    >
                        {t(`cat_${cat.toLowerCase()}`)}
                    </button>
                ))}
            </div>

            {/* Dynamic Info Box */}
            <div style={{
                maxWidth: '600px',
                margin: '0 auto 2rem',
                padding: '1rem',
                backgroundColor: '#e3f2fd',
                borderRadius: '8px',
                borderLeft: '5px solid #2196f3',
                fontSize: '0.95rem',
                color: '#0d47a1'
            }}>
                <strong>📢 {t('season_update')}:</strong> {t('demand_high')}
                {currentSeason === 'Rabi' ? (language === 'en' ? ' Green Peas, Wheat, and Carrots ' : language === 'hi' ? ' मटर, गेहूं और गाजर ' : ' वाटाणा, गहू आणि गाजर ') : (language === 'en' ? ' Soybean and Maize ' : language === 'hi' ? ' सोयाबीन और मक्का ' : ' सोयाबीन आणि मका ')}
                {t('plan_accordingly')}
            </div>

            {/* Crops Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {displayedCrops.map(crop => (
                    <div key={crop.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                        {/* Status Badge */}
                        {crop.status && (
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                backgroundColor: crop.status === 'Trending' ? '#ff4d4d' : '#4caf50',
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                zIndex: 2,
                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                            }}>
                                {crop.status === 'Trending' ? '🔥 ' : '⭐ '}
                                {crop.status}
                            </div>
                        )}

                        <div style={{ position: 'relative', height: '200px' }}>
                            <img
                                src={crop.image}
                                alt={getLoc(crop, 'name')}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                loading="lazy"
                            />
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                padding: '1rem',
                                color: 'white'
                            }}>
                                <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{getLoc(crop, 'name')}</h3>
                                <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>{crop.scientificName}</span>
                            </div>
                        </div>

                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{
                                    background: topicQuery === 'sowing' ? '#fff9c4' : '#f5f5f5',
                                    padding: '0.5rem',
                                    borderRadius: '4px',
                                    border: topicQuery === 'sowing' ? '1px solid #fbc02d' : 'none',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <strong style={{ display: 'block', color: '#666', fontSize: '0.8rem' }}>{t('sowing')}</strong>
                                    {getLoc(crop, 'sowing')}
                                </div>
                                <div style={{
                                    background: topicQuery === 'harvesting' ? '#fff9c4' : '#f5f5f5',
                                    padding: '0.5rem',
                                    borderRadius: '4px',
                                    border: topicQuery === 'harvesting' ? '1px solid #fbc02d' : 'none',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <strong style={{ display: 'block', color: '#666', fontSize: '0.8rem' }}>{t('harvesting')}</strong>
                                    {getLoc(crop, 'harvesting')}
                                </div>
                            </div>

                            <div style={{
                                marginBottom: '1rem',
                                backgroundColor: topicQuery === 'water' ? '#e3f2fd' : 'transparent',
                                borderRadius: '4px'
                            }}>
                                <strong style={{ color: 'var(--color-secondary)' }}>💧 {t('water_soil')}:</strong>
                                <p style={{ margin: '0.2rem 0 0', fontSize: '0.95rem', color: '#444' }}>
                                    {crop.soil}. {getLoc(crop, 'water')}
                                </p>
                            </div>

                            <div style={{
                                marginBottom: '1rem',
                                background: topicQuery === 'care' ? '#ffebee' : 'transparent',
                                border: topicQuery === 'care' ? '1px solid #ffcdd2' : 'none',
                                padding: topicQuery === 'care' ? '5px' : '0',
                                borderRadius: '4px',
                                transition: 'all 0.3s ease'
                            }}>
                                <strong style={{ color: '#d32f2f' }}>🐛 {t('care_diseases')}:</strong>
                                <p style={{ margin: '0.2rem 0 0', fontSize: '0.95rem', color: '#444' }}>
                                    {getLoc(crop, 'diseases')}
                                </p>
                            </div>

                            <div style={{
                                marginTop: 'auto',
                                background: topicQuery === 'tips' || topicQuery === 'general' ? '#FFF9C4' : '#E8F5E9',
                                padding: '1rem',
                                borderRadius: '8px',
                                borderLeft: '4px solid var(--color-primary)',
                                transition: 'all 0.3s ease'
                            }}>
                                <strong style={{ display: 'block', color: 'var(--color-primary)', marginBottom: '0.2rem' }}>💡 {t('pro_tip')}:</strong>
                                <span style={{ fontSize: '0.9rem', color: '#2e7d32' }}>{getLoc(crop, 'tips')}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Crop Count and Load More Button */}
            {filteredCrops.length > 0 && (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.95rem' }}>
                        {t('showing_crops').replace('{count}', displayedCrops.length).replace('{total}', filteredCrops.length)}
                    </p>
                    {hasMoreCrops && (
                        <button
                            onClick={handleLoadMore}
                            className="btn btn-primary"
                            style={{
                                padding: '1rem 3rem',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                                borderRadius: '50px',
                                boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)'
                            }}
                        >
                            {t('load_more_crops')}
                        </button>
                    )}
                </div>
            )}

            {filteredCrops.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                    {t('no_crops_found')}
                </div>
            )}

            <BackToHomeButton />
        </div>
    );
};

export default CropAdvisory;
