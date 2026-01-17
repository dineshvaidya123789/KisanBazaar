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

    const login = (phone, otp, requestedRole = 'Farmer', city = '') => {
        // MOCK LOGIN LOGIC
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (otp === '1234') {
                    let role = requestedRole;
                    let name = "Kishan Kumar";
                    let avatar = "4CAF50";

                    // Admin Backdoor
                    if (phone.toLowerCase() === 'admin') {
                        role = 'Admin';
                        name = "Administrator";
                        avatar = "000000";
                    } else if (requestedRole === 'FPO') {
                        name = "Malwa FPO Association";
                        avatar = "2196F3";
                    }

                    const mockUser = {
                        name: name,
                        phone: phone,
                        village: "Palakhedi, Indore",
                        city: city, // Store the city/samiti name
                        landSize: role === 'FPO' ? "500+ Acres (Aggregated)" : "5 Acres",
                        crops: ["Wheat", "Soybean"],
                        isVerified: true,
                        role: role,
                        avatar: `https://ui-avatars.com/api/?name=${name.replace(/ /g, '+')}&background=${avatar}&color=fff`
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
