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
                { id: 101, author: "Dr. Singh (Agri Expert)", isVerified: true, text: "Check for nitrogen deficiency. Apply urea if needed.", textHindi: "नाइट्रोजन की कमी की जाँच करें। आवश्यकता हो तो यूरिया डालें।" },
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
    const [replyingTo, setReplyingTo] = useState(null);
    const [visibleCount, setVisibleCount] = useState(5);
    const [replyText, setReplyText] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [replyImage, setReplyImage] = useState(null);
    const questionInputRef = React.useRef(null);

    // Voice Note State
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const timerRef = React.useRef(null);

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

    // --- Voice Recording Logic ---
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks = [];

            recorder.ondataavailable = (e) => chunks.push(e.data);
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                setAudioBlob(blob);
                setAudioUrl(URL.createObjectURL(blob));
                setIsRecording(false);
                clearInterval(timerRef.current);
            };

            setMediaRecorder(recorder);
            recorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => {
                    if (prev >= 30) {
                        recorder.stop();
                        return 30;
                    }
                    return prev + 1;
                });
            }, 1000);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Microphone access denied or not available.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
    };

    const blobToBase64 = (blob) => {
        return new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    };

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
        let initialData = [];
        if (savedQuestions) {
            initialData = JSON.parse(savedQuestions).sort((a, b) => b.id - a.id);
        } else {
            initialData = seedQuestions.sort((a, b) => b.id - a.id);
        }
        setQuestions(initialData);
    }, []);

    // Save to localStorage whenever questions change
    useEffect(() => {
        if (questions.length > 0) {
            localStorage.setItem('kisan_chaupal_questions', JSON.stringify(questions));
        }
    }, [questions]);

    const checkAuth = () => {
        if (!user) {
            setShowLoginModal(true);
            return false;
        }
        return true;
    };

    const handlePostQuestion = async (e) => {
        e.preventDefault();
        if (!checkAuth()) return;

        if (!newQuestion.trim()) {
            questionInputRef.current?.focus();
            return;
        }

        const newQ = {
            id: Date.now(),
            author: user.name,
            district: user.village || "Madhya Pradesh",
            question: newQuestion,
            questionHindi: "",
            image: selectedImage,
            audio: audioBlob ? await blobToBase64(audioBlob) : null,
            likes: 0,
            replies: [],
            timestamp: t('just_now')
        };

        const updatedQuestions = [newQ, ...questions];
        setQuestions(updatedQuestions);
        setNewQuestion("");
        setSelectedImage(null);
        setAudioBlob(null);
        setAudioUrl(null);
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

    const handleReplySubmit = async (questionId) => {
        if (!checkAuth()) return;
        const text = replyText[questionId] || "";
        if (!text.trim()) return;

        const newReply = {
            id: Date.now(),
            author: user.name,
            text: text,
            image: replyImage,
            audio: audioBlob ? await blobToBase64(audioBlob) : null,
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
        setAudioBlob(null);
        setAudioUrl(null);
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
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            className="btn btn-outline"
                            style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                            onClick={() => document.getElementById('questionImageInput').click()}
                        >
                            📷 {selectedImage ? t('image_selected') : t('upload_image')}
                        </button>

                        {!isRecording && !audioUrl && (
                            <button
                                className="btn btn-outline"
                                style={{ fontSize: '0.85rem', padding: '8px 12px', border: '1px solid var(--color-secondary)', color: 'var(--color-secondary)' }}
                                onClick={startRecording}
                            >
                                🎙️ {t('voice_note')}
                            </button>
                        )}

                        {isRecording && (
                            <button
                                className="btn btn-danger"
                                style={{
                                    fontSize: '0.85rem',
                                    padding: '8px 12px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    animation: 'pulse 1.5s infinite'
                                }}
                                onClick={stopRecording}
                            >
                                ⏹️ {t('stop_recording')} ({recordingTime}s)
                            </button>
                        )}
                    </div>
                    <button className="btn btn-primary" onClick={handlePostQuestion}>{t('post_question')}</button>
                </div>

                {audioUrl && (
                    <div style={{ marginTop: '1rem', padding: '10px', backgroundColor: '#f0f9ff', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <audio src={audioUrl} controls style={{ height: '35px', flex: 1 }} />
                        <button
                            onClick={() => { setAudioBlob(null); setAudioUrl(null); }}
                            style={{ border: 'none', background: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '1.2rem' }}
                            title={t('delete_voice')}
                        >
                            🗑️
                        </button>
                    </div>
                )}
            </div>

            {/* Questions Feed */}
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{t('chaupal_feed')}</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {questions.map(q => (
                    <div key={q.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontWeight: 'bold', color: '#555' }}>👤 {q.author}</span>
                                    {q.isVerified && (
                                        <span style={{
                                            backgroundColor: '#e3f2fd',
                                            color: '#1976d2',
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            fontSize: '0.7rem',
                                            fontWeight: 'bold',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            border: '1px solid #bbdefb'
                                        }}>
                                            ✅ {t('verified_expert')}
                                        </span>
                                    )}
                                </div>
                                {isAdminMode && !q.isExternal && <button onClick={() => handleDelete(q.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>{t('delete')}</button>}
                            </div>

                            {/* Question Text in Localized Language */}
                            <p style={{ margin: '0.5rem 0', color: '#333', fontSize: '1.1rem', lineHeight: '1.5' }}>
                                {getContent(q, 'question')}
                            </p>

                            <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '1rem' }}>
                                📍 {q.district} • {q.timestamp}
                            </div>

                            {q.image && (
                                <img src={q.image} alt="Crop issue" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} />
                            )}

                            {q.audio && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <audio src={q.audio} controls style={{ width: '100%', height: '40px' }} />
                                </div>
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
                                    <div key={r.id} style={{
                                        marginBottom: '1rem',
                                        padding: r.isVerified ? '1rem' : '0',
                                        paddingBottom: '1rem',
                                        borderBottom: '1px solid #eee',
                                        backgroundColor: r.isVerified ? '#fff' : 'transparent',
                                        borderRadius: r.isVerified ? '12px' : '0',
                                        border: r.isVerified ? '1px solid #e3f2fd' : 'none',
                                        boxShadow: r.isVerified ? '0 2px 4px rgba(25, 118, 210, 0.05)' : 'none'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#444' }}>{r.author}</span>
                                            {r.isVerified && (
                                                <span style={{
                                                    backgroundColor: '#e3f2fd',
                                                    color: '#1976d2',
                                                    padding: '1px 6px',
                                                    borderRadius: '10px',
                                                    fontSize: '0.65rem',
                                                    fontWeight: 'bold',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    border: '1px solid #bbdefb'
                                                }}>
                                                    🛡️ {t('verified_expert')}
                                                </span>
                                            )}
                                        </div>
                                        <p style={{ margin: '0', color: '#555', fontSize: '0.95rem' }}>{getContent(r, 'text')}</p>
                                        {r.audio && (
                                            <div style={{ marginTop: '0.5rem' }}>
                                                <audio src={r.audio} controls style={{ width: '100%', height: '35px' }} />
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {replyingTo === q.id && (
                                    <div style={{ marginTop: '1rem' }}>
                                        <textarea
                                            value={replyText[q.id] || ''}
                                            onChange={(e) => setReplyText({ ...replyText, [q.id]: e.target.value })}
                                            placeholder={t('write_reply')}
                                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '0.5rem', minHeight: '80px' }}
                                        />
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            {!isRecording && !audioUrl && (
                                                <button
                                                    className="btn btn-outline"
                                                    style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                                                    onClick={startRecording}
                                                >
                                                    🎙️ {t('voice_note')}
                                                </button>
                                            )}
                                            {isRecording && (
                                                <span style={{ fontSize: '0.75rem', color: '#dc3545', fontWeight: 'bold' }}>
                                                    🔴 {t('recording')} ({recordingTime}s)
                                                    <button onClick={stopRecording} style={{ marginLeft: '8px', cursor: 'pointer', border: 'none', background: '#dc3545', color: 'white', padding: '2px 8px', borderRadius: '4px' }}>{t('stop_recording')}</button>
                                                </span>
                                            )}
                                            {audioUrl && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                                                    <audio src={audioUrl} controls style={{ height: '30px', flex: 1 }} />
                                                    <button onClick={() => { setAudioBlob(null); setAudioUrl(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button>
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            <button className="btn btn-primary btn-sm" onClick={() => handleReplySubmit(q.id)}>{t('reply')}</button>
                                            <button className="btn btn-outline btn-sm" onClick={() => setReplyingTo(null)}>{t('cancel_reply')}</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Login Modal */}
            {showLoginModal && (
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
            )}

            <BackToHomeButton />
        </div>
    );
};

export default Chaupal;
