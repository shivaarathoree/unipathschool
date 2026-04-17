"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IconifyIcon from "@/components/IconifyIcon";
import { motion } from "framer-motion";
import Link from "next/link";
import { submitCompanyRequest } from "./actions";

const companies = [
    { name: "Google", icon: "logos:google-icon", color: "bg-blue-500/10 border-blue-200", questions: 52, difficulty: "Hard", slug: "google" },
    { name: "Amazon", icon: "logos:aws", color: "bg-orange-500/10 border-orange-200", questions: 81, difficulty: "Medium-Hard", slug: "amazon" },
    { name: "Meta", icon: "logos:meta-icon", color: "bg-blue-600/10 border-blue-300", questions: 120, difficulty: "Hard", slug: "" },
    { name: "Adobe", icon: "simple-icons:adobe", iconColor: "text-[#FF0000]", color: "bg-red-500/10 border-red-200", questions: 42, difficulty: "Medium-Hard", slug: "adobe" },
    { name: "Microsoft", icon: "logos:microsoft-icon", color: "bg-green-500/10 border-green-200", questions: 96, difficulty: "Medium", slug: "microsoft" },
    { name: "Netflix", icon: "logos:netflix-icon", color: "bg-red-500/10 border-red-200", questions: 80, difficulty: "Hard", slug: "" },
];

export default function CompanySheetsPage() {
    const [reqCompanyName, setReqCompanyName] = useState("");
    const [reqEmail, setReqEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | string>("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reqCompanyName.trim()) return;

        setIsSubmitting(true);
        setSubmitStatus("idle");

        try {
            const result = await submitCompanyRequest(reqCompanyName, reqEmail);
            if (result.success) {
                setSubmitStatus("success");
                setReqCompanyName("");
                setReqEmail("");
            } else {
                console.error("Server Action Error:", result.error);
                setSubmitStatus(result.error || "An unknown error occurred.");
            }
        } catch (error: any) {
            console.error("Action Catch Error:", error);
            setSubmitStatus("An unexpected error occurred while communicating with the server.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:3rem_3rem] z-0"></div>

            <Header />

            <main className="flex-grow max-w-7xl mx-auto w-full px-6 pt-32 pb-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-medium font-heading tracking-tighter text-slate-900">
                        Company <span className="text-primary">Sheets.</span>
                    </h1>
                    <p className="text-lg text-slate-500 font-light mt-2">
                        Top interview questions curated from FAANG and top-tier companies.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {companies.map((company, i) => {
                        const hasQuestions = !!company.slug;

                        const cardContent = (
                            <>
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem] -mr-4 -mt-4 group-hover:bg-primary/10 transition-colors duration-500"></div>

                                <div className="flex items-start justify-between mb-6 relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0 shadow-lg shadow-slate-900/10 group-hover:scale-110 transition-transform">
                                        <IconifyIcon icon={company.icon} className={`text-2xl ${(company as any).iconColor || 'text-white'}`} />
                                    </div>
                                    <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                                        {company.difficulty}
                                    </span>
                                </div>

                                <h3 className="font-heading font-medium text-slate-900 text-xl mb-2">{company.name}</h3>
                                <p className="text-sm text-slate-500 font-light mb-6">
                                    {company.questions}+ curated interview questions
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        Updated Weekly
                                    </span>
                                    {hasQuestions ? (
                                        <Link href="/pricing" className="bg-primary hover:bg-primary-dark text-white text-[10px] px-6 py-3 rounded-full font-bold uppercase tracking-widest transition-all flex items-center gap-2">
                                            Start Practicing
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                            </svg>
                                        </Link>
                                    ) : (
                                        <div className="bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-500 text-[10px] px-6 py-3 rounded-full font-bold uppercase tracking-widest transition-all flex items-center gap-2 group/btn">
                                            Coming Soon
                                        </div>
                                    )}
                                </div>
                            </>
                        );

                        return hasQuestions ? (
                            <motion.div
                                key={company.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="glass rounded-[2rem] p-8 border border-white/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl group cursor-pointer relative overflow-hidden h-full"
                            >
                                {cardContent}
                            </motion.div>
                        ) : (
                            <motion.div
                                key={company.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="glass rounded-[2rem] p-8 border border-white/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl group cursor-pointer relative overflow-hidden"
                            >
                                {cardContent}
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-16 text-center"
                >
                    <div className="glass-dark rounded-[2.5rem] p-12 inline-block max-w-2xl border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-[4rem] -mr-8 -mt-8"></div>
                        <div className="relative z-10 w-full">
                            <IconifyIcon icon="solar:star-fall-bold-duotone" className="text-5xl text-primary mb-6 mx-auto" />
                            <h2 className="text-3xl font-heading font-medium text-white mb-4 tracking-tight">
                                Which company should we add next?
                            </h2>
                            <p className="text-slate-400 text-sm font-light leading-relaxed mb-8 max-w-lg mx-auto">
                                Submit a company name and we'll gather the most frequently asked interview questions for it. We're curating the complete collection!
                            </p>

                            {submitStatus === "success" ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-2xl flex items-center justify-center gap-3 max-w-sm mx-auto"
                                >
                                    <IconifyIcon icon="solar:check-circle-bold-duotone" className="text-2xl" />
                                    <span className="text-sm font-medium">Thanks! We've received your request.</span>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm mx-auto">
                                    <div className="flex flex-col gap-3">
                                        <input
                                            type="text"
                                            value={reqCompanyName}
                                            onChange={(e) => setReqCompanyName(e.target.value)}
                                            placeholder="Company Name (e.g. Uber, Stripe)"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm"
                                            required
                                            disabled={isSubmitting}
                                        />
                                        <input
                                            type="email"
                                            value={reqEmail}
                                            onChange={(e) => setReqEmail(e.target.value)}
                                            placeholder="Email (optional, to notify you)"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm"
                                            disabled={isSubmitting}
                                        />
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !reqCompanyName.trim()}
                                            className="bg-primary hover:bg-primary-dark text-white rounded-xl px-8 py-3 font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-full"
                                        >
                                            {isSubmitting ? (
                                                <IconifyIcon icon="svg-spinners:270-ring" className="text-xl" />
                                            ) : (
                                                "Submit Request"
                                            )}
                                        </button>
                                    </div>
                                    {submitStatus !== "idle" && submitStatus !== "success" && (
                                        <p className="text-red-400 text-xs mt-1 text-center font-medium">* {submitStatus}</p>
                                    )}
                                </form>
                            )}
                        </div>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}
