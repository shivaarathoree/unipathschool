"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import IconifyIcon from "@/components/IconifyIcon";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
    const { user, profile, loading, signInWithGoogle } = useAuth();
    const router = useRouter();
    const [isSigningIn, setIsSigningIn] = useState(false);

    useEffect(() => {
        if (loading) return;
        if (user) {
            if (profile) {
                router.push("/dashboard");
            } else {
                router.push("/onboarding");
            }
        }
    }, [user, profile, loading, router]);

    const handleGoogleSignIn = async () => {
        try {
            setIsSigningIn(true);
            await signInWithGoogle();
        } catch (error) {
            console.error("Sign in failed", error);
            setIsSigningIn(false);
        }
    };

    if (loading || isSigningIn || user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
            {/* AI Background Elements */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:3rem_3rem] z-0"></div>
            
            <motion.div 
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0"
            />
            
            <div className="w-full max-w-lg relative z-10 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center mb-12"
                >
                    <Link href="/" className="flex items-center gap-3 mb-4 group">
                        <span className="w-6 h-px bg-slate-900 group-hover:w-8 group-hover:bg-primary transition-all duration-500"></span>
                        <span className="font-heading font-semibold text-slate-900 group-hover:text-primary transition-colors text-2xl tracking-tighter">
                            UNIPATH
                        </span>
                        <span className="font-heading font-light text-slate-500 ml-1 text-2xl tracking-tighter">
                            SCHOOL
                        </span>
                    </Link>
                    <div className="h-px w-12 bg-primary/30"></div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="glass rounded-[2.5rem] p-10 lg:p-14 shadow-2xl border border-white/50 relative overflow-hidden group"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30"></div>
                    
                    <div className="relative z-10">
                        <div className="mb-10 text-center">
                            <h1 className="text-3xl font-heading font-semibold text-slate-900 mb-3 tracking-tighter">
                                Initialize <span className="text-primary">Session.</span>
                            </h1>
                            <p className="text-sm text-slate-500 font-light tracking-wide">
                                Secure access to your AI career infrastructure.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <button
                                onClick={handleGoogleSignIn}
                                className="w-full flex items-center justify-center gap-4 bg-white border border-slate-200 hover:border-primary/30 hover:bg-slate-50 text-slate-700 py-4 transition-all duration-500 font-medium text-xs rounded-full shadow-sm hover:shadow-lg group/google uppercase tracking-widest"
                            >
                                <IconifyIcon icon="logos:google-icon" className="text-lg group-hover/google:scale-110 transition-transform" />
                                Continue with Google
                            </button>

                            <div className="flex items-center gap-4 py-2">
                                <div className="h-px bg-slate-100 flex-1"></div>
                                <span className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">or internal login</span>
                                <div className="h-px bg-slate-100 flex-1"></div>
                            </div>

                            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); }}>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase ml-4">
                                        Infrastructure ID
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="user@unipath.edu"
                                        className="w-full bg-slate-50/50 border border-slate-200 rounded-full px-8 py-4 text-xs focus:outline-none focus:border-primary/50 focus:bg-white transition-all placeholder:text-slate-300 font-light tracking-wide"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase ml-4">
                                        Access Key
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50/50 border border-slate-200 rounded-full px-8 py-4 text-xs focus:outline-none focus:border-primary/50 focus:bg-white transition-all placeholder:text-slate-300 font-light tracking-wide"
                                    />
                                </div>
                                <button
                                    className="w-full bg-slate-900 text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-primary transition-all duration-500 shadow-lg hover:shadow-primary/20 mt-4 group/btn"
                                >
                                    Verify & Enter
                                    <IconifyIcon icon="solar:key-linear" className="inline-block ml-2 text-sm group-hover/btn:rotate-12 transition-transform" />
                                </button>
                            </form>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="text-center mt-10"
                >
                    <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                        Legal Protocol:{" "}
                        <Link href="#" className="text-slate-900 hover:text-primary transition-colors underline underline-offset-4 decoration-primary/20">
                            Terms
                        </Link>
                        {" "}&{" "}
                        <Link href="#" className="text-slate-900 hover:text-primary transition-colors underline underline-offset-4 decoration-primary/20">
                            Privacy
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
