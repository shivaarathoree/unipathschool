"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export interface UserProfile {
    name: string;
    email: string;
    industry: string;
    experience: string;
    skills: string[];
    bio: string;
    isPro: boolean;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    isPro: boolean;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    setLocalProfile: (profile: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPro, setIsPro] = useState(true); // Default to true for testing as requested by user

    const fetchProfile = async (uid: string) => {
        try {
            const localData = localStorage.getItem(`unipath_profile_${uid}`);
            if (localData) {
                const parsed = JSON.parse(localData);
                setProfile(parsed);
                // setIsPro(parsed.isPro || false); // Overridden to true for testing
            }

            const docRef = doc(db, "users", uid);
            const fetchPromise = getDoc(docRef);
            const timeoutPromise = new Promise<{ exists: () => false }>((resolve) =>
                setTimeout(() => resolve({ exists: () => false }), 5000)
            );
            const docSnap = await Promise.race([fetchPromise, timeoutPromise]) as any;

            if (docSnap && docSnap.exists && docSnap.exists()) {
                const fetchedData = docSnap.data() as UserProfile;
                setProfile(fetchedData);
                // setIsPro(fetchedData.isPro || false); // Overridden to true for testing
                localStorage.setItem(`unipath_profile_${uid}`, JSON.stringify(fetchedData));
            } else if (!localData) {
                setProfile(null);
                // setIsPro(false); // Overridden to true for testing
            }
        } catch (e) {
            console.warn("Could not fetch profile (offline/blocked), using fallback.", e);
            const localData = localStorage.getItem(`unipath_profile_${uid}`);
            if (!localData) {
                setProfile(null);
                // setIsPro(false); // Overridden to true for testing
            }
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                await fetchProfile(currentUser.uid);
            } else {
                setProfile(null);
                // setIsPro(false); // Overridden to true for testing
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if user is new
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
            // Create a default profile for new users
            const defaultProfile: Partial<UserProfile> = {
                email: user.email || "",
                name: user.displayName || "",
                isPro: true, // New users are Pro by default for testing
            };
            await setDoc(doc(db, "users", user.uid), defaultProfile, { merge: true });
        }
    };

    const logout = async () => {
        await signOut(auth);
    };

    const refreshProfile = async () => {
        if (user) await fetchProfile(user.uid);
    };

    const setLocalProfile = (p: UserProfile) => {
        const profileWithPro = { ...p, isPro: true }; // Force pro for local profile too
        setProfile(profileWithPro);
        setIsPro(true);
        if (user) {
            localStorage.setItem(`unipath_profile_${user.uid}`, JSON.stringify(profileWithPro));
        }
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, isPro, signInWithGoogle, logout, refreshProfile, setLocalProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
