import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db, googleProvider } from "../lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";

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
            // Check if user exists in DB, if not create
            const userRef = doc(db, "users", result.user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                const enrollmentDate = new Date().toISOString();
                await setDoc(userRef, {
                    uid: result.user.uid,
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL,
                    currentDay: 1, // Day 1 unlocked on enrollment
                    enrollmentDate: enrollmentDate,
                    completedDays: [],
                    streak: 0,
                    lastLogin: serverTimestamp(),
                    createdAt: serverTimestamp()
                });
            } else {
                // Update last login
                await updateDoc(userRef, { lastLogin: serverTimestamp() });
            }
            return result.user;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    }

    function logout() {
        return signOut(auth);
    }

    async function startChallenge() {
        if (!currentUser) return;
        const userRef = doc(db, "users", currentUser.uid);
        const enrollmentDate = new Date().toISOString();
        await updateDoc(userRef, {
            currentDay: 1, // Unlock Day 1
            enrollmentDate: enrollmentDate,
            startedAt: serverTimestamp()
        });
        setUserData(prev => ({ ...prev, currentDay: 1, enrollmentDate }));
    }

    async function markDayComplete(dayId) {
        if (!currentUser) return;

        // Only allow marking days that are currently unlocked by time
        const currentData = userData;
        if (dayId > currentData.currentDay) {
            console.log("Cannot mark future day as complete - not yet unlocked by time");
            return;
        }

        const userRef = doc(db, "users", currentUser.uid);
        const now = new Date();
        let newStreak = currentData.streak || 0;

        if (currentData.lastActivity) {
            const lastActivityDate = currentData.lastActivity.toDate ? currentData.lastActivity.toDate() : new Date(currentData.lastActivity);
            const diffTime = Math.abs(now - lastActivityDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // Completed yesterday, increment streak
                newStreak += 1;
            } else if (diffDays > 1) {
                // Formatting break, reset to 1
                newStreak = 1;
            }
            // If diffDays is 0 (same day), streak remains same
        } else {
            // First activity ever
            newStreak = 1;
        }

        await updateDoc(userRef, {
            completedDays: arrayUnion(dayId),
            lastActivity: serverTimestamp(),
            streak: newStreak
        });

        setUserData(prev => ({
            ...prev,
            completedDays: [...(prev.completedDays || []), dayId],
            streak: newStreak,
            lastActivity: now
            // currentDay is NOT incremented here - it's based on enrollment date
        }));
    }

    async function ensureUserDoc(user) {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
            setUserData(snap.data());
        } else {
            // Self-repair: Create missing document
            const enrollmentDate = new Date().toISOString();
            const newUserData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                currentDay: 1, // Day 1 unlocked on enrollment
                enrollmentDate: enrollmentDate,
                completedDays: [],
                streak: 0,
                lastLogin: serverTimestamp(),
                createdAt: serverTimestamp()
            };
            await setDoc(userRef, newUserData);
            setUserData(newUserData);
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                try {
                    await ensureUserDoc(user);
                } catch (err) {
                    console.error("Error fetching/creating user data:", err);
                    // Fallback for UI to show something went wrong
                    setUserData({ error: err.message });
                }
            } else {
                setUserData(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userData,
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
