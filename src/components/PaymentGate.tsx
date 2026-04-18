"use client";

import { useEffect, useState } from "react";
import RazorpayButton from "./RazorpayButton";
import IconifyIcon from "./IconifyIcon";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

interface PaymentGateProps {
    featureName: string;
    featureDescription: string;
    amount: number;
    storageKey: string; // localStorage key to persist payment for this user
    children: React.ReactNode;
}

export default function PaymentGate({
    featureName,
    featureDescription,
    amount,
    storageKey,
    children,
}: PaymentGateProps) {
    const { user } = useAuth();
    const [hasPaid, setHasPaid] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        if (!user) return;
        const key = `${storageKey}_${user.uid}`;
        const paid = localStorage.getItem(key) === "true";
        setHasPaid(paid);
        setChecking(false);
    }, [user, storageKey]);

    const handlePaymentSuccess = (response: any) => {
        if (!user) return;
        const key = `${storageKey}_${user.uid}`;
        localStorage.setItem(key, "true");
        setHasPaid(true);
        console.log("Payment successful:", response);
    };

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            </div>
        );
    }

    if (hasPaid) {
        return <>{children}</>;
    }

    // Show payment gate
    return (
        <div className="min-h-screen bg-white text-slate-900 relative overflow-hidden flex flex-col items-center justify-center px-6">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:3rem_3rem] z-0" />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="relative z-10 max-w-lg w-full glass rounded-[3rem] p-12 border border-white/50 shadow-2xl"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30 rounded-t-[3rem]" />

                <div className="flex flex-col items-center text-center gap-6">
                    <div className="w-20 h-20 rounded-[2rem] bg-slate-900 flex items-center justify-center shadow-xl shadow-slate-900/20">
                        <IconifyIcon icon="solar:lock-keyhole-bold-duotone" className="text-4xl text-primary" />
                    </div>

                    <div>
                        <h1 className="text-3xl font-heading font-semibold text-slate-900 tracking-tighter mb-3">
                            Unlock <span className="text-primary">{featureName}</span>
                        </h1>
                        <p className="text-sm text-slate-500 font-light leading-relaxed">
                            {featureDescription}
                        </p>
                    </div>

                    <div className="w-full bg-slate-50 rounded-2xl p-6 space-y-3 border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Includes</p>
                        {[
                            "AI-powered mock interview sessions",
                            "Real-time voice interaction via VAPI",
                            "Detailed performance feedback & scoring",
                            "Behavioural & technical interview modes",
                        ].map((item) => (
                            <div key={item} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <IconifyIcon icon="solar:check-read-linear" className="text-xs text-primary" />
                                </div>
                                <span className="text-xs text-slate-600 font-medium text-left">{item}</span>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
                            One-time access — ₹{amount}
                        </p>
                        <RazorpayButton
                            amount={amount}
                            buttonText={`Pay ₹${amount} & Unlock`}
                            description={`Unlock ${featureName} on UniPath School`}
                            onSuccess={handlePaymentSuccess}
                            className="w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-primary text-white py-4 px-10 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 shadow-xl hover:shadow-primary/20"
                        />
                    </div>

                    <p className="text-[10px] text-slate-400 font-medium">
                        Secured by Razorpay · Access unlocked instantly after payment
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
