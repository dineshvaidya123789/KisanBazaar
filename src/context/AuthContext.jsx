import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../firebase';
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen for Firebase Auth state changes
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in.
                const phoneNumber = firebaseUser.phoneNumber;

                // Hardcoded Admin Access for your number
                let role = 'Farmer';
                // Check against widely used formats just in case
                if (phoneNumber === '+919987917394' || phoneNumber === '+91 9987917394') {
                    role = 'Admin';
                }

                // 1. Optimistic Update - Unlock UI Immediately
                setUser({
                    uid: firebaseUser.uid,
                    phone: phoneNumber,
                    role: role,
                    name: role === 'Admin' ? "Administrator" : "Kisan User",
                    isVerified: false,
                    onboardingCompleted: false,
                    city: '',
                    interests: [],
                    avatar: `https://ui-avatars.com/api/?name=${role}&background=${role === 'Admin' ? '000000' : '4CAF50'}&color=fff`
                });
                setLoading(false); // <--- CRITICAL: Allow App to Render

                // 2. Fetch/Create Profile Asynchronously
                const userRef = doc(db, 'users', firebaseUser.uid);
                getDoc(userRef).then(async (docSnap) => {
                    let profileData = {};

                    if (docSnap.exists()) {
                        profileData = docSnap.data();
                    } else {
                        // Profile doesn't exist (e.g. existing user or admin), create it now
                        console.log("Creating missing user profile for:", phoneNumber);
                        const newUser = {
                            uid: firebaseUser.uid,
                            phone: phoneNumber,
                            createdAt: new Date().getTime(),
                            role: role,
                            name: role === 'Admin' ? "Administrator" : "Kisan User",
                            isVerified: false,
                            onboardingCompleted: false
                        };
                        try {
                            await setDoc(userRef, newUser);
                            profileData = newUser;
                        } catch (err) {
                            console.error("Error auto-creating profile:", err);
                        }
                    }

                    // Update state with rich profile data ensuring we don't overwrite if user logged out
                    setUser(prev => {
                        if (!prev || prev.uid !== firebaseUser.uid) return prev;
                        return {
                            ...prev,
                            ...profileData,
                            // Ensure defaults if missing in DB
                            name: profileData.name || prev.name,
                            role: profileData.role || prev.role,
                            city: profileData.city || prev.city,
                            interests: profileData.interests || prev.interests
                        };
                    });
                }).catch(err => {
                    console.error("Error fetching user profile:", err);
                    // No UI action needed, we already showed optimistic state
                });

            } else {
                // User is signed out.
                setUser(null);
                setLoading(false);
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const setupRecaptcha = (phoneNumber) => {
        if (window.recaptchaVerifier) {
            try {
                window.recaptchaVerifier.clear();
            } catch (error) {
                console.warn("Error clearing existing recaptcha:", error);
            }
            window.recaptchaVerifier = null;
        }

        // Safety check: Manually clear the DOM container content
        const container = document.getElementById('recaptcha-container');
        if (container) {
            container.innerHTML = '';
        }

        const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                console.log("Recaptcha Verified");
            }
        });
        window.recaptchaVerifier = recaptchaVerifier;
        return recaptchaVerifier;
    };

    const login = async (phone, appVerifier) => {
        const formatPh = "+91" + phone; // standardized format (E.164)
        console.log("DEBUG: Sending OTP to:", formatPh); // Debugging log
        try {
            const confirmationResult = await signInWithPhoneNumber(auth, formatPh, appVerifier);
            return confirmationResult; // Return this to the component to store for step 2
        } catch (error) {
            console.error("Error sending OTP:", error);
            throw error;
        }
    };

    const verifyOtp = async (confirmationResult, otp) => {
        try {
            const result = await confirmationResult.confirm(otp);
            return result.user;
        } catch (error) {
            console.error("Error verifying OTP:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('kisan_user'); // Clear legacy local storage if present
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const createUser = async (uid, userData) => {
        try {
            const userRef = doc(db, 'users', uid);
            const docSnap = await getDoc(userRef);

            if (!docSnap.exists()) {
                const newUser = {
                    ...userData,
                    uid,
                    createdAt: new Date().getTime(), // Using timestamp number for easier sorting
                    role: userData.role || 'Farmer',
                    isVerified: false,
                    onboardingCompleted: false
                };
                await setDoc(userRef, newUser);
                setUser(prev => ({ ...prev, ...newUser })); // Update local state immediately
            }
        } catch (error) {
            console.error("Error creating user profile:", error);
            // Don't throw, just log. Login should still succeed.
        }
    };

    const updateProfile = (updatedData) => {
        // In a real app, update this in Firestore
        // For now, update local state
        setUser(prev => ({ ...prev, ...updatedData }));
    };

    return (
        <AuthContext.Provider value={{
            user,
            setupRecaptcha,
            login,
            verifyOtp,
            logout,
            updateProfile,
            createUser,
            loading
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
