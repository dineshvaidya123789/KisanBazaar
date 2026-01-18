import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import BackToHomeButton from '../components/BackToHomeButton';

const Chaupal = () => {
    const { user, login } = useAuth();
    const { t, language } = useLanguage();

    // Initial Seed Data
    const seedQuestions = [
        {
            id: 1,
            author: "Ram Lal",
            district: "Ujjain",
            question: "My wheat crop leaves are turning yellow. What should I do?",
            questionHindi: "मेरे गेहूं के पत्ते पीले पड़ रहे हैं। मुझे क्या करना चाहिए?",
            likes: 12,
            replies: [
                { id: 101, author: "Dr. Singh (Agri Expert)", text: "Check for nitrogen deficiency. Apply urea if needed.", textHindi: "नाइट्रोजन की कमी की जाँच करें। आवश्यकता हो तो यूरिया डालें।" },
                { id: 102, author: "Shyam", text: "It could also be due to over-watering.", textHindi: "यह अधिक पानी देने के कारण भी हो सकता है।" }
            ],
            timestamp: "2 hours ago"
        },
        {
            id: 2,
            author: "Mohan Patel",
            district: "Indore",
            question: "What is the best time to sow soybean in Malwa region?",
            questionHindi: "मालवा क्षेत्र में सोयाबीन बोने का सबसे अच्छा समय क्या है?",
            likes: 8,
            replies: [],
            timestamp: "5 hours ago"
        }
    ];

    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState("");
    const [showAskForm, setShowAskForm] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null); // ID of question being replied to
    const [visibleCount, setVisibleCount] = useState(5); // Pagination Limit
    // replyText needs to be an object to handle multiple reply inputs if needed, 
    // or at least match the usage logic { [id]: text }
    const [replyText, setReplyText] = useState({});
    const [selectedImage, setSelectedImage] = useState(null); // For new question
    const [replyImage, setReplyImage] = useState(null); // For reply
    const questionInputRef = React.useRef(null);

    // Auth & Admin State
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginPhone, setLoginPhone] = useState("");
    const [loginOtp, setLoginOtp] = useState("");
    const [isAdminMode, setIsAdminMode] = useState(false);

    // Helper to get localized content
    const getContent = (item, field) => {
        if (language === 'hi' && item[`${field}Hindi`]) return item[`${field}Hindi`];
        if (language === 'mr' && item[`${field}Marathi`]) return item[`${field}Marathi`];
        return item[field];
    };

    // Helper to convert file to Base64
    const handleImageChange = (e, isReply = false) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (isReply) {
                    setReplyImage(reader.result);
                } else {
                    setSelectedImage(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Load from localStorage on mount
    useEffect(() => {
        const savedQuestions = localStorage.getItem('kisan_chaupal_questions');
        if (savedQuestions) {
            const data = JSON.parse(savedQuestions);
            setQuestions(data.sort((a, b) => b.id - a.id));
        } else {
            setQuestions(seedQuestions.sort((a, b) => b.id - a.id));
        }
    }, []);

    // Save to localStorage whenever questions change
    useEffect(() => {
        if (questions.length > 0) {
            localStorage.setItem('kisan_chaupal_questions', JSON.stringify(questions));
        }
    }, [questions]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(loginPhone, loginOtp);
            setShowLoginModal(false);
            setLoginPhone("");
            setLoginOtp("");
            // If they were trying to ask or reply, they can now proceed
        } catch (error) {
            alert(error);
        }
    };

    const checkAuth = () => {
        if (!user) {
            setShowLoginModal(true);
            return false;
        }
        return true;
    };

    const handlePostQuestion = (e) => {
        e.preventDefault();
        if (!checkAuth()) return;

        if (!newQuestion.trim()) {
            // Standard Criteria: Auto-focus instead of popup
            questionInputRef.current?.focus();
            return;
        }

        const newQ = {
            id: Date.now(), // Unique ID based on timestamp
            author: user.name, // Use actual user name
            district: user.village || "Madhya Pradesh",
            question: newQuestion,
            questionHindi: "",
            image: selectedImage,
            likes: 0,
            replies: [],
            timestamp: t('just_now')
        };

        const updatedQuestions = [newQ, ...questions];
        setQuestions(updatedQuestions);
        setNewQuestion("");
        setSelectedImage(null);
        setShowAskForm(false);
    };

    const handleVote = (id) => {
        if (!checkAuth()) return;
        const updatedQuestions = questions.map(q => {
            if (q.id === id) {
                return { ...q, likes: q.likes + 1 };
            }
            return q;
        });
        setQuestions(updatedQuestions);
    };

    const handleReplySubmit = (questionId) => {
        if (!checkAuth()) return;
        const text = replyText[questionId] || "";
        if (!text.trim()) return;

        const newReply = {
            id: Date.now(),
            author: user.name,
            text: text,
            image: replyImage,
            textHindi: ""
        };

        const updatedQuestions = questions.map(q => {
            if (q.id === questionId) {
                return { ...q, replies: [newReply, ...q.replies] };
            }
            return q;
        });

        setQuestions(updatedQuestions);
        setReplyText({ ...replyText, [questionId]: "" });
        setReplyImage(null);
        setReplyingTo(null);
    };

    const handleDelete = (id) => {
        if (window.confirm(t('confirm_delete_question'))) {
            setQuestions(questions.filter(q => q.id !== id));
        }
    };

    return (
        <div className="container fade-in" style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto', minHeight: '80vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                    {t('chaupal_title')}
                </h1>
                <p style={{ color: '#666', fontSize: '1.1rem' }}>
                    {t('chaupal_subtitle')}
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
                    <button className="btn btn-outline" onClick={() => { localStorage.removeItem('kisan_chaupal_questions'); window.location.reload(); }} style={{ fontSize: '0.8rem' }}>
                        ⚠️ {t('reset_demo')}
                    </button>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', cursor: 'pointer', userSelect: 'none' }}>
                        <input type="checkbox" checked={isAdminMode} onChange={e => setIsAdminMode(e.target.checked)} />
                        🛡️ {t('admin_mode')}
                    </label>
                </div>
            </div>

            {/* Ask Box */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', borderTop: '4px solid var(--color-secondary)' }}>
                <h3 style={{ marginBottom: '1rem' }}>{t('ask_question')}</h3>
                <textarea
                    ref={questionInputRef}
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder={t('type_question')}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '80px', marginBottom: '1rem' }}
                />
                <input
                    type="file"
                    id="questionImageInput"
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, false)}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                        className="btn btn-outline"
                        style={{ fontSize: '0.9rem' }}
                        onClick={() => document.getElementById('questionImageInput').click()}
                    >
                        📷 {selectedImage ? t('image_selected') : t('upload_image')}
                    </button>
                    <button className="btn btn-primary" onClick={handlePostQuestion}>{t('post_question')}</button>
                </div>
            </div>

            {/* Questions Feed */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {questions.map(q => (
                    <div key={q.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 'bold', color: '#555' }}>👤 {q.author}</span>
                                {isAdminMode && <button onClick={() => handleDelete(q.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>{t('delete')}</button>}
                            </div>

                            {/* Question Text in Localized Language */}
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#222' }}>
                                {getContent(q, 'question')}
                            </h3>

                            {q.image && (
                                <img src={q.image} alt="Crop issue" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} />
                            )}

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                                <button
                                    onClick={() => handleVote(q.id)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' }}
                                >
                                    👍 {q.likes} {t('likes')}
                                </button>
                                <button
                                    onClick={() => setReplyingTo(replyingTo === q.id ? null : q.id)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}
                                >
                                    💬 {q.replies.length} {t('replies')}
                                </button>
                            </div>
                        </div>

                        {/* Replies Section */}
                        {(replyingTo === q.id || q.replies.length > 0) && (
                            <div style={{ backgroundColor: '#f9f9f9', padding: '1rem 1.5rem', borderTop: '1px solid #eee' }}>
                                {q.replies.map(r => (
                                    <div key={r.id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#444' }}>{r.author}</div>
                                        <div style={{ fontSize: '0.95rem', color: '#333' }}>
                                            {getContent(r, 'text')}
                                        </div>
                                    </div>
                                ))}

                                {replyingTo === q.id && (
                                    <div style={{ marginTop: '1rem', display: 'flex', gap: '10px' }}>
                                        <input
                                            type="text"
                                            value={replyText[q.id] || ''}
                                            onChange={(e) => setReplyText({ ...replyText, [q.id]: e.target.value })}
                                            placeholder={t('write_reply')}
                                            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                        />
                                        <button className="btn btn-sm btn-primary" onClick={() => handleReplySubmit(q.id)}>{t('reply')}</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Login Modal */}
            {
                showLoginModal && (
                    <div className="modal-overlay">
                        <div className="modal-content" style={{ maxWidth: '300px', textAlign: 'center' }}>
                            <h3>{t('login_required')}</h3>
                            <p>{t('login_to_ask')}</p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                                <button className="btn btn-primary" onClick={() => login('9876543210', '1234').then(() => setShowLoginModal(false))}>{t('login_demo_user')}</button>
                                <button className="btn btn-outline" onClick={() => setShowLoginModal(false)}>{t('cancel_reply')}</button>
                            </div>
                        </div>
                    </div>
                )
            }

            <BackToHomeButton />
        </div >
    );
};

export default Chaupal;
