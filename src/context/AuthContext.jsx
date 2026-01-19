import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../firebase';
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
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
                // You can fetch additional user details from Firestore here if needed.
                // For now, we'll create a user object based on the phone number.
                const phoneNumber = firebaseUser.phoneNumber;

                // Hardcoded Admin Access for your number
                let role = 'Farmer';
                // Check against widely used formats just in case
                if (phoneNumber === '+919987917394' || phoneNumber === '+91 9987917394') {
                    role = 'Admin';
                }

                const userRef = doc(db, 'users', firebaseUser.uid);

                // Fetch profile
                getDoc(userRef).then(docSnap => {
                    const profileData = docSnap.exists() ? docSnap.data() : {};

                    setUser({
                        uid: firebaseUser.uid,
                        phone: phoneNumber,
                        name: profileData.name || (role === 'Admin' ? "Administrator" : "Kisan User"),
                        role: profileData.role || role,
                        isVerified: true,
                        city: profileData.city || '',
                        interests: profileData.interests || [],
                        onboardingCompleted: profileData.onboardingCompleted || false,
                        avatar: profileData.avatar || `https://ui-avatars.com/api/?name=${role}&background=${role === 'Admin' ? '000000' : '4CAF50'}&color=fff`
                    });
                });
            } else {
                // User is signed out.
                setUser(null);
            }
            setLoading(false);
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
        const formatPh = "+91 " + phone; // Added space to match Console format
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
            loading
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
