import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Chaupal = () => {
    const { user, login } = useAuth();

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
    const [replyText, setReplyText] = useState("");
    const [selectedImage, setSelectedImage] = useState(null); // For new question
    const [replyImage, setReplyImage] = useState(null); // For reply

    // Auth & Admin State
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginPhone, setLoginPhone] = useState("");
    const [loginOtp, setLoginOtp] = useState("");
    const [isAdminMode, setIsAdminMode] = useState(false);

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
        if (!newQuestion.trim()) return;

        const newQ = {
            id: Date.now(), // Unique ID based on timestamp
            author: user.name, // Use actual user name
            district: user.village || "Madhya Pradesh",
            question: newQuestion,
            questionHindi: "",
            image: selectedImage,
            likes: 0,
            replies: [],
            timestamp: "Just Now"
        };

        const updatedQuestions = [newQ, ...questions];
        setQuestions(updatedQuestions);
        setNewQuestion("");
        setSelectedImage(null);
        setShowAskForm(false);
    };

    const handleVote = (id, type) => {
        if (!checkAuth()) return;
        const updatedQuestions = questions.map(q => {
            if (q.id === id) {
                return { ...q, likes: q.likes + 1 };
            }
            return q;
        });
        setQuestions(updatedQuestions);
    };

    const handleReplySubmit = (e, questionId) => {
        e.preventDefault();
        if (!checkAuth()) return;
        if (!replyText.trim()) return;

        const newReply = {
            id: Date.now(),
            author: user.name,
            text: replyText,
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
        setReplyText("");
        setReplyImage(null);
        setReplyingTo(null);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this question?")) {
            setQuestions(questions.filter(q => q.id !== id));
        }
    };

    return (
        <div className="container fade-in" style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto', minHeight: '80vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                    Kisan Chaupal (किसान चौपाल)
                </h1>
                <p style={{ color: '#666', fontSize: '1.1rem' }}>
                    Ask questions, share knowledge, and help fellow farmers.<br />
                    (प्रश्न पूछें, ज्ञान साझा करें और साथी किसानों की मदद करें)
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
                    <button className="btn btn-outline" onClick={() => { localStorage.removeItem('kisan_chaupal_questions'); window.location.reload(); }} style={{ fontSize: '0.8rem' }}>
                        ⚠️ Reset Demo Data
                    </button>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', cursor: 'pointer', userSelect: 'none' }}>
                        <input type="checkbox" checked={isAdminMode} onChange={e => setIsAdminMode(e.target.checked)} />
                        🛡️ Admin Mode
                    </label>
                </div>
            </div>

            {/* Ask Question Button */}
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                {!showAskForm ? (
                    <button
                        onClick={() => checkAuth() && setShowAskForm(true)}
                        className="btn btn-primary"
                        style={{ fontSize: '1.1rem', padding: '0.8rem 2rem', borderRadius: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    >
                        ➕ Ask a Question (प्रश्न पूछें)
                    </button>
                ) : (
                    <form onSubmit={handlePostQuestion} className="card fade-in" style={{ textAlign: 'left', padding: '1.5rem', border: '2px solid var(--color-primary)' }}>
                        <h3 style={{ marginTop: 0, color: 'var(--color-primary)' }}>New Question</h3>
                        <textarea
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder="Type your question here... (अपना प्रश्न यहाँ लिखें...)"
                            style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px', marginBottom: '1rem', fontSize: '1rem' }}
                            required
                        />

                        {/* Image Upload Input */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>📷 Upload Image (Optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, false)}
                                style={{ fontSize: '0.9rem' }}
                            />
                            {selectedImage && (
                                <div style={{ marginTop: '10px' }}>
                                    <img src={selectedImage} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                                    <button type="button" onClick={() => setSelectedImage(null)} style={{ display: 'block', color: 'red', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer', marginTop: '5px' }}>Remove</button>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button type="button" onClick={() => setShowAskForm(false)} className="btn btn-outline">Cancel</button>
                            <button type="submit" className="btn btn-primary">Post Question</button>
                        </div>
                    </form>
                )}
            </div>

            {/* Questions List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {questions.slice(0, visibleCount).map(q => (
                    <div key={q.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontWeight: 'bold', color: '#333' }}>👤 {q.author}</span>
                                    <span>📍 {q.district}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span>🕒 {q.timestamp}</span>
                                    {isAdminMode && (
                                        <button onClick={() => handleDelete(q.id)} style={{ background: 'red', color: 'white', border: 'none', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer' }}>
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>

                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#222' }}>{q.question}</h3>
                            {q.questionHindi && (
                                <p className="text-hindi" style={{ fontSize: '1.1rem', color: '#555', marginBottom: '1rem' }}>
                                    {q.questionHindi}
                                </p>
                            )}
                            {q.image && (
                                <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
                                    <img
                                        src={q.image}
                                        alt="User Upload"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '400px',
                                            objectFit: 'contain', // Ensure full image is visible
                                            borderRadius: '8px',
                                            border: '1px solid #eee',
                                            backgroundColor: '#f8f9fa' // Background for transparency
                                        }}
                                    />
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem', marginTop: '1rem' }}>
                                <button
                                    onClick={() => handleVote(q.id)}
                                    className="btn-outline"
                                    style={{ border: 'none', padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', backgroundColor: q.likes > 0 ? '#e8f5e9' : 'transparent', color: q.likes > 0 ? 'green' : 'inherit' }}
                                >
                                    👍 {q.likes} Likes
                                </button>
                                <button className="btn-outline" style={{ border: 'none', padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    💬 {q.replies.length} Replies
                                </button>
                                <button
                                    onClick={() => checkAuth() && setReplyingTo(replyingTo === q.id ? null : q.id)}
                                    className="btn-outline"
                                    style={{ border: 'none', padding: '0.5rem', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--color-primary)', cursor: 'pointer' }}
                                >
                                    ↩️ {replyingTo === q.id ? 'Cancel Reply' : 'Reply'}
                                </button>
                            </div>

                            {/* Reply Form */}
                            {replyingTo === q.id && (
                                <div style={{ marginTop: '1rem' }}>
                                    <form onSubmit={(e) => handleReplySubmit(e, q.id)} style={{ display: 'flex', gap: '10px' }}>
                                        <input
                                            type="text"
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Write a reply..."
                                            style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                                            required
                                            autoFocus
                                        />
                                        {/* Mini Image Upload for Reply */}
                                        <label style={{ cursor: 'pointer', fontSize: '1.2rem', padding: '0 5px' }} title="Upload Image">
                                            📷
                                            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, true)} style={{ display: 'none' }} />
                                        </label>
                                        <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Post</button>
                                    </form>
                                    {replyImage && (
                                        <div style={{ marginTop: '5px', marginLeft: '10px' }}>
                                            <span style={{ fontSize: '0.8rem', color: 'green' }}>Image selected</span>
                                            <button type="button" onClick={() => setReplyImage(null)} style={{ marginLeft: '10px', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>❌</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Replies Section */}
                        {q.replies.length > 0 && (
                            <div style={{ backgroundColor: '#f9f9f9', padding: '1rem 1.5rem', borderTop: '1px solid #eee' }}>
                                {q.replies.map(reply => (
                                    <div key={reply.id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-secondary)', marginBottom: '0.2rem' }}>
                                            {reply.author}
                                        </div>
                                        <div style={{ fontSize: '0.95rem' }}>{reply.text}</div>
                                        {reply.image && (
                                            <div style={{ marginTop: '8px' }}>
                                                <img
                                                    src={reply.image}
                                                    alt="Reply Upload"
                                                    style={{
                                                        width: '100%',
                                                        maxWidth: '300px', // Increased from 150px
                                                        height: 'auto',
                                                        borderRadius: '8px',
                                                        border: '1px solid #ddd',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                                    }}
                                                />
                                            </div>
                                        )}
                                        {reply.textHindi && <div className="text-hindi" style={{ fontSize: '0.9rem', color: '#666' }}>{reply.textHindi}</div>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {/* Load More Button */}
                {questions.length > visibleCount && (
                    <button
                        onClick={() => setVisibleCount(prev => prev + 5)}
                        className="btn btn-outline"
                        style={{ margin: '1rem auto', display: 'block' }}
                    >
                        Load More Questions (⬇️)
                    </button>
                )}
            </div>

            {/* Login Modal */}
            {showLoginModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowLoginModal(false)}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', maxWidth: '400px', width: '100%', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                        <h2>Login Required</h2>
                        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                            Please login to ask questions or reply.<br />
                            (कृपया प्रश्न पूछने या उत्तर देने के लिए लॉग इन करें)
                        </p>
                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                type="tel"
                                placeholder="Mobile Number"
                                value={loginPhone}
                                onChange={e => setLoginPhone(e.target.value)}
                                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                required
                            />
                            <input
                                type="password"
                                placeholder="OTP (Enter 1234)"
                                value={loginOtp}
                                onChange={e => setLoginOtp(e.target.value)}
                                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                required
                            />
                            <button type="submit" className="btn btn-primary" style={{ padding: '10px' }}>Login</button>
                        </form>
                        <button style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setShowLoginModal(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chaupal;
