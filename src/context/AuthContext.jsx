import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate checking local storage for persisted session
        const savedUser = localStorage.getItem('kisan_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (phone, otp) => {
        // MOCK LOGIN LOGIC
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (otp === '1234') {
                    const mockUser = {
                        name: "Kishan Kumar",
                        phone: phone,
                        village: "Palakhedi, Indore",
                        landSize: "5 Acres",
                        crops: ["Wheat", "Soybean"],
                        isVerified: true,
                        avatar: "https://ui-avatars.com/api/?name=Kishan+Kumar&background=4CAF50&color=fff"
                    };
                    setUser(mockUser);
                    localStorage.setItem('kisan_user', JSON.stringify(mockUser));
                    resolve(mockUser);
                } else {
                    reject("Invalid OTP. Please enter 1234.");
                }
            }, 1000);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('kisan_user');
    };

    const updateProfile = (updatedData) => {
        const newUser = { ...user, ...updatedData };
        setUser(newUser);
        localStorage.setItem('kisan_user', JSON.stringify(newUser));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateProfile, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
