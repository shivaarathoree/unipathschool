"use client";

import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IconifyIcon from "@/components/IconifyIcon";
import ProFeatureGate from "@/components/ProFeatureGate";
import { motion } from "framer-motion";

const companies = [
    { name: "Google", icon: "logos:google-icon", color: "bg-blue-500/10 border-blue-200", questions: 150, difficulty: "Hard" },
    { name: "Amazon", icon: "logos:aws", color: "bg-orange-500/10 border-orange-200", questions: 200, difficulty: "Medium-Hard" },
    { name: "Meta", icon: "logos:meta-icon", color: "bg-blue-600/10 border-blue-300", questions: 120, difficulty: "Hard" },
    { name: "Apple", icon: "logos:apple", color: "bg-slate-500/10 border-slate-200", questions: 100, difficulty: "Medium-Hard" },
    { name: "Microsoft", icon: "logos:microsoft-icon", color: "bg-green-500/10 border-green-200", questions: 180, difficulty: "Medium" },
    { name: "Netflix", icon: "logos:netflix-icon", color: "bg-red-500/10 border-red-200", questions: 80, difficulty: "Hard" },
];

export default function CompanySheetsPage() {
    const { user, profile, loading, isPro } = useAuth();

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-white">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!user || !profile || !isPro) {
        return <ProFeatureGate title="Company Interview Sheets" />;
    }

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
                    {companies.map((company, i) => (
                        <motion.div
                            key={company.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className={`glass rounded-[2rem] p-8 border border-white/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl group cursor-pointer relative overflow-hidden`}
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem] -mr-4 -mt-4 group-hover:bg-primary/10 transition-colors duration-500"></div>
                            
                            <div className="flex items-start justify-between mb-6 relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0 shadow-lg shadow-slate-900/10 group-hover:scale-110 transition-transform">
                                    <IconifyIcon icon={company.icon} className="text-2xl text-white" />
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
                                <div className="bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-500 text-[10px] px-6 py-3 rounded-full font-bold uppercase tracking-widest transition-all flex items-center gap-2 group/btn">
                                    Coming Soon
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-16 text-center"
                >
                    <div className="glass-dark rounded-[2.5rem] p-12 inline-block max-w-2xl border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-[4rem] -mr-8 -mt-8"></div>
                        <div className="relative z-10">
                            <IconifyIcon icon="solar:star-fall-bold-duotone" className="text-4xl text-primary mb-6" />
                            <h2 className="text-2xl font-heading font-medium text-white mb-4 tracking-tight">
                                Full Company Sheets Launching Soon
                            </h2>
                            <p className="text-slate-400 text-sm font-light leading-relaxed">
                                We&apos;re curating the most asked interview questions from top companies. 
                                Stay tuned for the complete collection with solutions, patterns, and difficulty breakdowns.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}
