"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import IconifyIcon from "@/components/IconifyIcon";
import { Loader2 } from "lucide-react";

const industries = [
    "Technology",
    "Financial Services",
    "Healthcare & Life Sciences",
    "Manufacturing & Industrial",
    "Retail & E-commerce",
    "Media & Entertainment",
    "Education & Training",
    "Energy & Utilities",
    "Professional Services",
    "Telecommunications",
];

export default function OnboardingPage() {
    const { user, profile, loading, setLocalProfile } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        industry: "",
        experience: "",
        skills: "",
        bio: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (profile) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData({
                industry: profile.industry || "",
                experience: profile.experience || "",
                skills: Array.isArray(profile.skills) ? profile.skills.join(", ") : "",
                bio: profile.bio || "",
            });
        }
    }, [profile]);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [loading, user, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSubmitting(true);

        const skillsArray = formData.skills.split(",").map(s => s.trim()).filter(Boolean);
        const profileData = {
            ...profile,
            name: user.displayName || 'Anonymous',
            email: user.email || '',
            industry: formData.industry,
            experience: formData.experience,
            skills: skillsArray,
            bio: formData.bio,
            isPro: profile?.isPro ?? false,
        };

        try {
            const savePromise = setDoc(doc(db, "users", user.uid), profileData, { merge: true });
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Firebase save timed out")), 5000));

            await Promise.race([savePromise, timeoutPromise]);

            setLocalProfile(profileData);
            router.push("/dashboard");
        } catch (error) {
            console.warn("Could not reach firestore. Using seamless local bypass:", error);
            setLocalProfile(profileData);
            router.push("/dashboard");
        }
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            </div>
        );
    }

    const nextStep = () => setStep(s => Math.min(s + 1, 4));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const renderStep = () => {
        switch (step) {
            case 1:
                return <Step1 formData={formData} handleChange={handleChange} />;
            case 2:
                return <Step2 formData={formData} handleChange={handleChange} />;
            case 3:
                return <Step3 formData={formData} handleChange={handleChange} />;
            case 4:
                return <Step4 formData={formData} handleChange={handleChange} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 relative overflow-hidden flex flex-col">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:3rem_3rem] z-0"></div>

            <header className="fixed top-6 w-full z-50 px-6 flex justify-center pointer-events-none">
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="max-w-6xl w-full glass rounded-full h-16 flex items-center justify-between px-8 pointer-events-auto border border-white/50 shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        <span className="w-4 h-px bg-slate-900"></span>
                        <span className="font-heading font-semibold text-slate-900 text-xl tracking-tighter uppercase">Unipath</span>
                        <span className="font-heading font-light text-slate-500 text-xl tracking-tighter uppercase">School</span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">
                        Onboarding Phase
                    </div>
                </motion.div>
            </header>

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
                                <IconifyIcon icon="solar:user-plus-linear" className="text-2xl" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-heading font-medium text-slate-900 tracking-tighter">{profile ? "Update Profile" : "Identity Setup"}</h1>
                                <p className="text-sm text-slate-500 font-light">{profile ? "Modify your career intelligence matrix." : "Architect your professional profile."}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mb-1">Step {step} of 4</span>
                            <div className="flex gap-1.5">
                                {[1, 2, 3, 4].map((s) => (
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

                            {step < 4 ? (
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
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                                    ) : (
                                        <>
                                            {profile ? "Save Changes" : "Finalize Profile"}
                                            <IconifyIcon icon="solar:check-read-linear" className="text-lg group-hover:scale-110 transition-transform" />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </form>
                </motion.div>
            </main>
        </div>
    );
}

// Step Components
const Step1 = ({ formData, handleChange }: { formData: { industry: string }, handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }) => (
    <div className="space-y-6">
        <div>
            <h2 className="text-2xl font-medium text-slate-900 font-heading tracking-tight mb-2">Industry Sector</h2>
            <p className="text-sm text-slate-500 font-light leading-relaxed">Select your target industry to calibrate our intelligence engine for your specific field.</p>
        </div>
        <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-focus-within:bg-primary/10 group-focus-within:text-primary transition-colors">
                <IconifyIcon icon="solar:suitcase-linear" className="text-xl" />
            </div>
            <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                required
                className="w-full pl-20 pr-12 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-medium focus:outline-none focus:border-primary/30 focus:bg-white transition-all appearance-none"
            >
                <option value="" disabled>Select an industry</option>
                {industries.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
            </select>
            <IconifyIcon icon="solar:alt-arrow-down-linear" className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
    </div>
);

const Step2 = ({ formData, handleChange }: { formData: { experience: string }, handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div className="space-y-6">
        <div>
            <h2 className="text-2xl font-medium text-slate-900 font-heading tracking-tight mb-2">Experience Matrix</h2>
            <p className="text-sm text-slate-500 font-light leading-relaxed">How would you describe your current professional standing? Be specific about years or seniority.</p>
        </div>
        <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-focus-within:bg-primary/10 group-focus-within:text-primary transition-colors">
                <IconifyIcon icon="solar:user-id-linear" className="text-xl" />
            </div>
            <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g., Senior Lead, 5+ Years"
                required
                className="w-full pl-20 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-medium focus:outline-none focus:border-primary/30 focus:bg-white transition-all placeholder:text-slate-300"
            />
        </div>
    </div>
);

const Step3 = ({ formData, handleChange }: { formData: { skills: string }, handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div className="space-y-6">
        <div>
            <h2 className="text-2xl font-medium text-slate-900 font-heading tracking-tight mb-2">Skill Inventory</h2>
            <p className="text-sm text-slate-500 font-light leading-relaxed">List your core technical competencies. This powers our gap-analysis and roadmap generation.</p>
        </div>
        <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-focus-within:bg-primary/10 group-focus-within:text-primary transition-colors">
                <IconifyIcon icon="solar:code-circle-linear" className="text-xl" />
            </div>
            <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g., Rust, AWS, Distributed Systems"
                required
                className="w-full pl-20 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-medium focus:outline-none focus:border-primary/30 focus:bg-white transition-all placeholder:text-slate-300"
            />
        </div>
        <div className="flex items-center gap-2 px-6 py-3 bg-slate-50 rounded-2xl">
            <IconifyIcon icon="solar:info-circle-linear" className="text-slate-400" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Use commas to separate multiple entries</p>
        </div>
    </div>
);

const Step4 = ({ formData, handleChange }: { formData: { bio: string }, handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void }) => (
    <div className="space-y-6">
        <div>
            <h2 className="text-2xl font-medium text-slate-900 font-heading tracking-tight mb-2">Professional Narrative</h2>
            <p className="text-sm text-slate-500 font-light leading-relaxed">Synthesize your background and ambitions. This bio informs the AI&apos;s personalized feedback style.</p>
        </div>
        <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Describe your trajectory..."
            rows={5}
            required
            className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-medium focus:outline-none focus:border-primary/30 focus:bg-white transition-all resize-none placeholder:text-slate-300"
        ></textarea>
    </div>
);