"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IconifyIcon from "@/components/IconifyIcon";
import { motion, AnimatePresence } from "framer-motion";
import ProFeatureGate from "@/components/ProFeatureGate";
import { useRouter } from "next/navigation";

export default function GenerateInterviewPage() {
    const { user, profile, loading } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        role: "",
        level: "Junior",
        type: "Technical",
        techstack: "",
        numQuestions: 5,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'numQuestions' ? parseInt(value) : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (!formData.role.trim()) {
            setFormError("Please specify a job role.");
            setStep(1);
            return;
        }

        setIsSubmitting(true);
        setFormError("");

        try {
            const res = await fetch("/api/vapi/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    techstack: formData.techstack || "General",
                    amount: formData.numQuestions,
                    userId: user.uid,
                }),
            });
            const data = await res.json();
            if (data.success) {
                router.push("/ai-interview");
            } else {
                const errorMsg = typeof data.error === 'string' ? data.error : (data.error?.message || "Failed to generate interview. Please try again.");
                setFormError(errorMsg);
            }
        } catch (err: any) {
            setFormError(typeof err === 'string' ? err : (err?.message || "A network error occurred. Please try again."));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-white">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <IconifyIcon icon="solar:spinner-bold" className="text-4xl animate-spin text-primary" />
                </main>
                <Footer />
            </div>
        );
    }

    if (!user || !profile) {
        return <ProFeatureGate title="AI Interview Generation" />;
    }

    const nextStep = () => setStep(s => Math.min(s + 1, 3));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const renderStep = () => {
        switch (step) {
            case 1: return <Step1 formData={formData} handleChange={handleChange} />;
            case 2: return <Step2 formData={formData} handleChange={handleChange} />;
            case 3: return <Step3 formData={formData} handleChange={handleChange} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 relative overflow-hidden flex flex-col">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:3rem_3rem] z-0"></div>
            
            <Header />

            <main className="flex-grow flex items-center justify-center px-6 py-24 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                    className="w-full max-w-2xl glass rounded-[3rem] p-10 lg:p-14 shadow-2xl border border-white/50 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-[8rem] -mr-16 -mt-16 pointer-events-none"></div>

                    <div className="flex items-center justify-between mb-12 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-900/10">
                                <IconifyIcon icon="solar:spark-cross-linear" className="text-2xl" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-heading font-medium text-slate-900 tracking-tighter">New Interview</h1>
                                <p className="text-sm text-slate-500 font-light">Set up your AI mock interview session.</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mb-1">Progress</span>
                            <div className="flex gap-1.5">
                                {[1, 2, 3].map((s) => (
                                    <div key={s} className={`h-1 rounded-full transition-all duration-500 ${step >= s ? "w-6 bg-primary" : "w-2 bg-slate-100"}`}></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="relative z-10">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={step} 
                                initial={{ opacity: 0, x: 20 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                exit={{ opacity: 0, x: -20 }} 
                                transition={{ duration: 0.4, ease: "circOut" }}
                            >
                                {renderStep()}
                            </motion.div>
                        </AnimatePresence>

                        {formError && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-600 font-medium mt-8"
                            >
                                <IconifyIcon icon="solar:danger-circle-linear" className="text-lg" />
                                {String(formError)}
                            </motion.div>
                        )}

                        <div className="flex items-center justify-between mt-16 pt-10 border-t border-slate-100">
                            <button 
                                type="button" 
                                onClick={prevStep} 
                                disabled={step === 1} 
                                className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <IconifyIcon icon="solar:arrow-left-linear" className="text-lg group-hover:-translate-x-1 transition-transform" />
                                Back
                            </button>
                            
                            {step < 3 ? (
                                <button 
                                    type="button" 
                                    onClick={nextStep} 
                                    className="group flex items-center gap-3 px-8 py-4 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl shadow-slate-900/10 hover:shadow-primary/20"
                                >
                                    Continue
                                    <IconifyIcon icon="solar:arrow-right-linear" className="text-lg group-hover:translate-x-1 transition-transform" />
                                </button>
                            ) : (
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting} 
                                    className={`group flex items-center gap-3 px-10 py-4 rounded-full text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-all shadow-xl ${isSubmitting ? "bg-slate-400 cursor-not-allowed" : "bg-primary hover:bg-primary-dark shadow-primary/20"}`}
                                >
                                    {isSubmitting ? (
                                        <><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div> Generating...</>
                                    ) : (
                                        <>Create Session <IconifyIcon icon="solar:spark-cross-linear" className="text-lg group-hover:rotate-12 transition-transform" /></>
                                    )}
                                </button>
                            )}
                        </div>
                    </form>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}

const Step1 = ({ formData, handleChange }: { formData: any, handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div className="space-y-6">
        <div>
            <h2 className="text-2xl font-medium text-slate-900 font-heading tracking-tight mb-2">Target Role</h2>
            <p className="text-sm text-slate-500 font-light leading-relaxed">Specific roles yield high-quality AI questions (e.g., &ldquo;Fullstack Engineer&rdquo; vs &ldquo;Software&rdquo;).</p>
        </div>
        <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-focus-within:bg-primary/10 group-focus-within:text-primary transition-colors">
                <IconifyIcon icon="solar:case-linear" className="text-xl" />
            </div>
            <input 
                type="text" 
                name="role" 
                value={formData.role} 
                onChange={handleChange} 
                placeholder="e.g., Product Designer" 
                required 
                className="w-full pl-20 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-medium focus:outline-none focus:border-primary/30 focus:bg-white transition-all placeholder:text-slate-300" 
            />
        </div>
    </div>
);

const Step2 = ({ formData, handleChange }: { formData: any, handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div className="space-y-6">
        <div>
            <h2 className="text-2xl font-medium text-slate-900 font-heading tracking-tight mb-2">Technical Focus</h2>
            <p className="text-sm text-slate-500 font-light leading-relaxed">List primary technologies or frameworks to include in the assessment.</p>
        </div>
        <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-focus-within:bg-primary/10 group-focus-within:text-primary transition-colors">
                <IconifyIcon icon="solar:code-circle-linear" className="text-xl" />
            </div>
            <input 
                type="text" 
                name="techstack" 
                value={formData.techstack} 
                onChange={handleChange} 
                placeholder="e.g., React, TypeScript, Tailwind" 
                className="w-full pl-20 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-medium focus:outline-none focus:border-primary/30 focus:bg-white transition-all placeholder:text-slate-300" 
            />
        </div>
    </div>
);

const Step3 = ({ formData, handleChange }: { formData: any, handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void }) => (
    <div className="space-y-8">
        <div>
            <h2 className="text-2xl font-medium text-slate-900 font-heading tracking-tight mb-2">Final Details</h2>
            <p className="text-sm text-slate-500 font-light leading-relaxed">Calibrate the interview complexity and length.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-2">Experience</label>
                <div className="relative group">
                    <select 
                        name="level" 
                        value={formData.level} 
                        onChange={handleChange} 
                        className="w-full pl-6 pr-12 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-medium focus:outline-none focus:border-primary/30 focus:bg-white transition-all appearance-none"
                    >
                        <option>Junior</option><option>Mid-Level</option><option>Senior</option><option>Lead</option>
                    </select>
                    <IconifyIcon icon="solar:alt-arrow-down-linear" className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
            </div>
            <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-2">Type</label>
                <div className="relative group">
                    <select 
                        name="type" 
                        value={formData.type} 
                        onChange={handleChange} 
                        className="w-full pl-6 pr-12 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-medium focus:outline-none focus:border-primary/30 focus:bg-white transition-all appearance-none"
                    >
                        <option>Technical</option><option>Behavioral</option><option>Mixed</option>
                    </select>
                    <IconifyIcon icon="solar:alt-arrow-down-linear" className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
            </div>
        </div>
        <div className="space-y-4 pt-4">
            <div className="flex justify-between items-end">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-2">Volume</label>
                <span className="text-sm font-bold text-primary font-heading">{formData.numQuestions} Questions</span>
            </div>
            <input 
                type="range" 
                name="numQuestions" 
                min={3} 
                max={15} 
                value={formData.numQuestions} 
                onChange={handleChange} 
                className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary" 
            />
            <div className="flex justify-between text-[8px] font-bold text-slate-300 uppercase tracking-widest px-1">
                <span>Brief</span>
                <span>In-depth</span>
            </div>
        </div>
    </div>
);