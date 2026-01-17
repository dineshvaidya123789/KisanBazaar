import React, { useState } from 'react';

const PashuPalan = () => {
    const [activeTab, setActiveTab] = useState('dairy');

    const sections = {
        dairy: {
            title: "Dairy Farming (डेयरी पालन)",
            icon: "🐄",
            content: [
                {
                    title: "Feeding Management",
                    titleHindi: "आहार प्रबंधन",
                    desc: "Provide balanced ration (Green fodder + Dry fodder + Concentrates). Ensure 24/7 clean water access.",
                    descHindi: "संतुलित आहार दें (हरा चारा + सूखा चारा + दाना)। 24/7 साफ पानी की व्यवस्था सुनिश्चित करें।"
                },
                {
                    title: "Breeding",
                    titleHindi: "प्रजनन",
                    desc: "Artificial Insemination (AI) is recommended for better breed improvement. Detect heat symptoms early.",
                    descHindi: "नस्ल सुधार के लिए कृत्रिम गर्भाधान (AI) की सलाह दी जाती है। गर्मी के लक्षणों को जल्दी पहचानें।"
                },
                {
                    title: "Disease Prevention",
                    titleHindi: "रोग निवारण",
                    desc: "Vaccinate against FMD (Foot & Mouth Disease) and HS annually. Deworm every 3 months.",
                    descHindi: "साल में एक बार FMD (खुरपका-मुंहपका) और HS का टीका लगवाएं। हर 3 महीने में पेट के कीड़ों की दवा दें।"
                }
            ]
        },
        goat: {
            title: "Goat Farming (बकरी पालन)",
            icon: "🐐",
            content: [
                {
                    title: "Housing",
                    titleHindi: "आवास",
                    desc: "Ensure dry, elevated floor with good ventilation. Protect from cold winds.",
                    descHindi: "सूखी, ऊंची और हवादार जगह सुनिश्चित करें। ठंडी हवाओं से बचाएं।"
                },
                {
                    title: "Vaccination",
                    titleHindi: "टीकाकरण",
                    desc: "PPR and ET vaccines are critical. Consult local vet for schedule.",
                    descHindi: "PPR और ET टीके महत्वपूर्ण हैं। समय सारिणी के लिए पशु चिकित्सक से संपर्क करें।"
                }
            ]
        },
        poultry: {
            title: "Poultry (मुर्गी पालन)",
            icon: "🐔",
            content: [
                {
                    title: "Bio-security",
                    titleHindi: "जैव सुरक्षा",
                    desc: "Restrict entry of visitors. Use disinfectant footbaths at entrance.",
                    descHindi: "बाहरी लोगों का प्रवेश रोकें। प्रवेश द्वार पर कीटाणुनाशक फुटबाथ का प्रयोग करें।"
                },
                {
                    title: "Layer Farming",
                    titleHindi: "अंडा उत्पादन",
                    desc: "Maintain 16 hours of light for optimal egg production. Provide calcium-rich diet.",
                    descHindi: "अंडा उत्पादन के लिए 16 घंटे रोशनी आवश्यक है। कैल्शियम युक्त आहार दें।"
                }
            ]
        }
    };

    return (
        <div className="container fade-in" style={{ padding: '2rem 1rem', maxWidth: '1000px', margin: '0 auto', minHeight: '80vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                    Animal Husbandry (पशुपालन)
                </h1>
                <p style={{ color: '#666', fontSize: '1.1rem' }}>
                    Expert tips for Dairy, Goat, and Poultry farming.<br />
                    (डेयरी, बकरी और मुर्गी पालन के लिए विशेषज्ञ सुझाव)
                </p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {Object.keys(sections).map(key => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        style={{
                            padding: '1rem 2rem',
                            fontSize: '1.1rem',
                            border: 'none',
                            borderRadius: '12px',
                            backgroundColor: activeTab === key ? 'var(--color-primary)' : 'white',
                            color: activeTab === key ? 'white' : '#555',
                            boxShadow: activeTab === key ? '0 4px 6px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.05)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        <span style={{ fontSize: '1.5rem' }}>{sections[key].icon}</span>
                        {sections[key].title}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="fade-in">
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '2rem',
                    boxShadow: 'var(--shadow-md)',
                    borderTop: `5px solid var(--color-primary)`
                }}>
                    <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                        <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>
                            {sections[activeTab].icon}
                        </span>
                        <h2 style={{ color: 'var(--color-secondary)' }}>{sections[activeTab].title}</h2>
                    </div>

                    <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                        {sections[activeTab].content.map((item, index) => (
                            <div key={index} style={{
                                padding: '1.5rem',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '12px',
                                borderLeft: '4px solid var(--color-secondary)'
                            }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#333' }}>
                                    {item.title}
                                </h3>
                                <h4 className="text-hindi" style={{ fontSize: '1rem', marginBottom: '1rem', color: '#666', fontWeight: 'normal' }}>
                                    {item.titleHindi}
                                </h4>
                                <p style={{ marginBottom: '0.5rem', color: '#444' }}>{item.desc}</p>
                                <p className="text-hindi" style={{ color: '#666', opacity: 0.9 }}>{item.descHindi}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center', padding: '2rem', backgroundColor: '#e8f5e9', borderRadius: '12px' }}>
                <h3 style={{ marginBottom: '1rem' }}>Need specific advice? (विशिष्ट सलाह चाहिए?)</h3>
                <button className="btn btn-primary" onClick={() => window.location.href = '/chaupal'}>
                    Ask in Kisan Chaupal (किसान चौपाल में पूछें)
                </button>
            </div>
        </div>
    );
};

export default PashuPalan;
