"use client";

import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IconifyIcon from "@/components/IconifyIcon";
import Link from "next/link";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { getInterviewsByUserId, getLatestInterviews } from "@/lib/interview/actions";
import { motion } from "framer-motion";
import ProFeatureGate from "@/components/ProFeatureGate";

interface InterviewData {
    id: string;
    role: string;
    type: string;
    techstack: string[];
    createdAt: string;
    userId: string;
    finalized: boolean;
}

function InterviewCardClient({ interview }: { interview: InterviewData }) {
    const normalizedType = /mix/gi.test(interview.type) ? "Mixed" : interview.type;
    const badgeStyles: Record<string, string> = {
        Behavioral: "bg-orange-500/10 text-orange-600",
        Mixed: "bg-slate-900/10 text-slate-900",
        Technical: "bg-primary/10 text-primary",
    };
    const formattedDate = dayjs(interview.createdAt).isValid() 
        ? dayjs(interview.createdAt).format("MMM D, YYYY")
        : "N/A";

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass border border-white/50 rounded-[2rem] overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all group p-8"
        >
            <div className="flex flex-col gap-6">
                <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0 shadow-lg shadow-slate-900/10 group-hover:scale-110 transition-transform">
                        <IconifyIcon icon="solar:chat-round-call-linear" className="text-2xl text-white" />
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${badgeStyles[normalizedType] || "bg-slate-100 text-slate-600"}`}>
                        {normalizedType}
                    </span>
                </div>

                <div>
                    <h3 className="font-heading font-medium text-slate-900 text-xl capitalize leading-tight mb-2">
                        {interview.role}
                    </h3>
                    <div className="flex items-center gap-4 text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                            <IconifyIcon icon="solar:calendar-linear" className="text-sm" />
                            {formattedDate}
                        </span>
                    </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                    {interview.techstack?.join(" • ") || "General interview practice"}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex -space-x-2">
                        {interview.techstack?.slice(0, 3).map((tech, i) => (
                            <div key={i} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-400 shadow-sm uppercase">
                                {tech.substring(0, 2)}
                            </div>
                        ))}
                    </div>

                    <Link
                        href={`/ai-interview/${interview.id}`}
                        className="bg-slate-900 hover:bg-primary text-white text-[10px] px-6 py-3 rounded-full font-bold uppercase tracking-widest transition-all shadow-sm hover:shadow-lg group/btn flex items-center gap-2"
                    >
                        Review
                        <IconifyIcon icon="solar:arrow-right-linear" className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

export default function AIInterviewDashboard() {
    const { user, profile, loading: authLoading, isPro } = useAuth();
    const [userInterviews, setUserInterviews] = useState<InterviewData[]>([]);
    const [communityInterviews, setCommunityInterviews] = useState<InterviewData[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"my" | "explore">("my");
    const [error, setError] = useState("");

    useEffect(() => {
        if (authLoading || !user) return;

        const fetchInterviews = async () => {
            try {
                const userDocs = await getInterviewsByUserId(user.uid);
                setUserInterviews(userDocs as any);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Unknown error";
                setError("Could not load your interviews. " + errorMessage);
            }

            try {
                const commDocs = await getLatestInterviews({ userId: user.uid, limit: 20 });
                setCommunityInterviews(commDocs as any);
            } catch (err) { /* Silently fail on community interviews */ }

            setLoading(false);
        };

        fetchInterviews();
    }, [user, authLoading]);

    if (authLoading || loading) {
        return (
            <div className="flex flex-col min-h-screen bg-white">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                        <p className="font-medium text-[10px] uppercase tracking-[0.2em] text-slate-400">Loading...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!user || !profile) {
        return <ProFeatureGate title="AI Mock Interviews" />;
    }

    const interviews = activeTab === "my" ? userInterviews : communityInterviews;

    return (
        <div className="min-h-screen bg-white text-slate-900 relative overflow-hidden flex flex-col">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:3rem_3rem] z-0"></div>
            
            <Header />

            <main className="flex-grow max-w-7xl mx-auto w-full px-6 pt-32 pb-20 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-64 shrink-0 space-y-8">
                        <div>
                            <h2 className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em] mb-6">Navigation</h2>
                            <nav className="space-y-2">
                                <button 
                                    onClick={() => setActiveTab("my")} 
                                    className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-semibold transition-all duration-300 ${activeTab === "my" ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
                                >
                                    <IconifyIcon icon="solar:chat-round-call-linear" className="text-lg" />
                                    My Sessions
                                </button>
                                <button 
                                    onClick={() => setActiveTab("explore")} 
                                    className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-semibold transition-all duration-300 ${activeTab === "explore" ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
                                >
                                    <IconifyIcon icon="solar:globus-linear" className="text-lg" />
                                    Community
                                </button>
                            </nav>
                        </div>

                        <div className="pt-8 border-t border-slate-100">
                            <Link 
                                href="/ai-interview/generate" 
                                className="group w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-primary text-white text-xs font-bold uppercase tracking-widest transition-all hover:bg-primary-dark shadow-lg shadow-primary/20"
                            >
                                <span>New Session</span>
                                <IconifyIcon icon="solar:add-circle-linear" className="text-xl group-hover:rotate-90 transition-transform duration-500" />
                            </Link>
                        </div>
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1 space-y-10">
                        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h1 className="text-4xl font-medium font-heading tracking-tighter text-slate-900">
                                    {activeTab === "my" ? "My Interviews" : "Community Sessions"}
                                </h1>
                                <p className="text-lg text-slate-500 font-light mt-2">
                                    {activeTab === "my" ? "Analyze and improve your performance." : "Learn from high-performing candidates."}
                                </p>
                            </div>
                        </header>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-600 font-medium flex items-center gap-3"
                            >
                                <IconifyIcon icon="solar:danger-circle-linear" className="text-lg" />
                                {error}
                            </motion.div>
                        )}

                        {interviews.length === 0 && !error ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-[3rem] bg-slate-50/30"
                            >
                                <div className="w-20 h-20 bg-white rounded-[2rem] shadow-sm flex items-center justify-center mb-6">
                                    <IconifyIcon icon="solar:add-circle-linear" className="text-4xl text-slate-300" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-900 mb-2">No interviews found</h3>
                                <p className="text-sm text-slate-500 mb-8 font-light">Start your first AI-powered mock interview session.</p>
                                <Link 
                                    href="/ai-interview/generate" 
                                    className="bg-slate-900 text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-lg"
                                >
                                    Create Session
                                </Link>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {interviews.map((interview) => (
                                    <InterviewCardClient key={interview.id} interview={interview} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}