import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    async function login() {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const token = await result.user.getIdToken();

            // Exchange Firebase Token for Backend JWT
            const response = await authAPI.googleLogin({ token });

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                setUserData(response.data.user);
            }

            return result.user;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    }

    function logout() {
        localStorage.removeItem('token');
        return signOut(auth);
    }

    // TODO: Move these to backend API calls via services when progress features are fully backend-integrated
    async function startChallenge() {
        console.log("startChallenge: Logic should be moved to backend API");
        // Example: await progressAPI.startChallenge();
    }

    async function markDayComplete(dayId) {
        console.log("markDayComplete: Logic should be moved to backend API", dayId);
        // Example: await progressAPI.markDayComplete(dayId);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                try {
                    // Sync with backend on reload
                    const token = await user.getIdToken();
                    const response = await authAPI.googleLogin({ token });

                    if (response.data.success) {
                        localStorage.setItem('token', response.data.token);
                        setUserData(response.data.user);
                    }
                } catch (err) {
                    console.error("Error syncing user data:", err);
                    setUserData(null);
                }
            } else {
                localStorage.removeItem('token');
                setUserData(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser, // Firebase User
        userData,    // MySQL User Data
        setUserData,
        login,
        logout,
        startChallenge,
        markDayComplete,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
