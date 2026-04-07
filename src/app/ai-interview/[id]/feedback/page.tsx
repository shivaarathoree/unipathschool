"use client";

import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IconifyIcon from "@/components/IconifyIcon";
import { getInterviewById, getFeedbackByInterviewId } from "@/lib/interview/actions";
import { motion } from "framer-motion";
import ProFeatureGate from "@/components/ProFeatureGate";

interface InterviewData {
    id: string;
    role: string;
    type: string;
}

interface FeedbackData {
    id: string;
    interviewId: string;
    totalScore: number;
    categoryScores: Array<{
        name: string;
        score: number;
        comment: string;
    }>;
    strengths: string[];
    areasForImprovement: string[];
    finalAssessment: string;
    createdAt: string;
}

function CircularScore({ score, maxScore = 100, label, size = "lg" }: { score: number; maxScore?: number; label: string; size?: "lg" | "sm" }) {
    const percentage = (score / maxScore) * 100;
    const radius = size === "lg" ? 54 : 36;
    const stroke = size === "lg" ? 6 : 4;
    const circumference = 2 * Math.PI * radius;
    const dashoffset = circumference - (percentage / 100) * circumference;

    const getColor = (pct: number) => {
        if (pct >= 80) return "#10B981";
        if (pct >= 60) return "#C2410C";
        if (pct >= 40) return "#D97706";
        return "#EF4444";
    };

    const color = getColor(percentage);
    const svgSize = (radius + stroke) * 2;

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative" style={{ width: svgSize, height: svgSize }}>
                <svg width={svgSize} height={svgSize} className="-rotate-90">
                    <circle cx={radius + stroke} cy={radius + stroke} r={radius} fill="none" stroke="#F1F5F9" strokeWidth={stroke} />
                    <circle
                        cx={radius + stroke} cy={radius + stroke} r={radius} fill="none" stroke={color} strokeWidth={stroke}
                        strokeDasharray={circumference} strokeDashoffset={dashoffset}
                        strokeLinecap="round" className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`font-bold font-heading ${size === "lg" ? "text-3xl" : "text-xl"}`} style={{ color }}>
                        {score}
                    </span>
                </div>
            </div>
            <span className={`font-heading font-bold text-slate-900 ${size === "lg" ? "text-[10px] uppercase tracking-widest" : "text-[8px] uppercase tracking-widest"} text-center leading-tight`}>
                {label}
            </span>
        </div>
    );
}

export default function InterviewFeedbackPage() {
    const { id } = useParams<{ id: string }>();
    const { user, loading: authLoading } = useAuth();
    const [interview, setInterview] = useState<InterviewData | null>(null);
    const [feedback, setFeedback] = useState<FeedbackData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id || authLoading) return;
        const currentUserId = user?.uid || "test-user-001";

        const fetchData = async () => {
            try {
                const interviewData = await getInterviewById(id);
                if (interviewData) {
                    setInterview(interviewData as any);
                }

                const feedbackData = await getFeedbackByInterviewId({
                    interviewId: id,
                    userId: currentUserId
                });
                
                if (feedbackData) {
                    setFeedback(feedbackData as any);
                }
            } catch (err) {
                console.error("Error fetching feedback:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, user, authLoading]);

    if (!user) {
        return <ProFeatureGate title="Interview Feedback" />;
    }

    if (loading || authLoading) {
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

    if (!interview || !feedback) {
        return (
            <div className="flex flex-col min-h-screen bg-white">
                <Header />
                <main className="flex-grow flex items-center justify-center p-6">
                    <div className="text-center max-w-md">
                        <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <IconifyIcon icon="solar:danger-triangle-bold-duotone" className="text-4xl text-slate-400" />
                        </div>
                        <h2 className="text-2xl font-heading font-medium text-slate-900 mb-4">Feedback Not Found</h2>
                        <Link href="/ai-interview" className="text-primary font-bold uppercase tracking-widest text-xs hover:underline">
                            ← Back to Dashboard
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const getSentiment = (score: number) => {
        if (score >= 75) return { label: "Positive", color: "#10B981" };
        if (score >= 50) return { label: "Neutral", color: "#D97706" };
        return { label: "Needs Work", color: "#EF4444" };
    };
    const sentiment = getSentiment(feedback.totalScore);

    return (
        <div className="flex flex-col min-h-screen bg-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:3rem_3rem] z-0"></div>
            <Header />
            <main className="flex-grow py-32 px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-6xl mx-auto">

                    {/* Title bar */}
                    <div className="flex items-center justify-between mb-12">
                        <Link href="/ai-interview" className="text-slate-400 hover:text-primary flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors group">
                            <IconifyIcon icon="solar:arrow-left-linear" className="group-hover:-translate-x-1 transition-transform" />
                            Back to Summary
                        </Link>
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                            <IconifyIcon icon="solar:calendar-linear" className="text-sm" />
                            {feedback.createdAt ? dayjs(feedback.createdAt).format("MMM D, YYYY • h:mm A") : "N/A"}
                        </div>
                    </div>

                    {/* Interview Title Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass rounded-[2.5rem] p-8 lg:p-10 mb-8 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/50 shadow-xl"
                    >
                        <div>
                            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                                Analysis Complete
                            </span>
                            <h1 className="text-4xl lg:text-5xl font-heading font-medium text-slate-900 tracking-tighter capitalize leading-tight">
                                {interview.role} <span className="text-primary">Performance.</span>
                            </h1>
                            <p className="text-base text-slate-500 mt-2 font-light">AI Feedback Analysis • Infrastructure Insight</p>
                        </div>
                        <div className="flex items-center gap-6 bg-white/50 px-8 py-6 rounded-3xl border border-slate-100">
                            <div className="text-right">
                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">User Sentiment</span>
                                <span className="text-lg font-bold font-heading" style={{ color: sentiment.color }}>{sentiment.label}</span>
                            </div>
                            <div className="w-3 h-12 bg-slate-100 rounded-full overflow-hidden">
                                <div className="w-full h-full" style={{ backgroundColor: sentiment.color, opacity: 0.8 }} />
                            </div>
                        </div>
                    </motion.div>

                    {/* General Summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-4 glass rounded-[2.5rem] p-10 flex flex-col items-center justify-center border border-white/50 shadow-lg"
                        >
                            <CircularScore score={feedback.totalScore} label="Overall Readiness" size="lg" />
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="lg:col-span-8 glass rounded-[2.5rem] p-10 border border-white/50 shadow-lg"
                        >
                            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Primary Focus Areas</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {feedback.categoryScores?.slice(0, 2).map((cat, i) => (
                                    <div key={i} className="flex flex-col items-start gap-6">
                                        <CircularScore score={cat.score} label={cat.name} size="sm" />
                                        <p className="text-sm text-slate-500 leading-relaxed font-light">
                                            {cat.comment}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Detailed Breakdown */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass rounded-[2.5rem] p-10 mb-8 border border-white/50 shadow-lg"
                    >
                        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-10 text-center">Infrastructure Breakdown</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {feedback.categoryScores?.map((cat, i) => (
                                <div key={i} className="flex flex-col items-center gap-4 text-center">
                                    <CircularScore score={cat.score} label={cat.name} size="sm" />
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Call Summary */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="glass-dark rounded-[2.5rem] p-10 mb-8 border border-white/5 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none" />
                        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Executive Summary</h2>
                        <p className="text-lg text-slate-300 leading-relaxed font-light italic">&ldquo;{feedback.finalAssessment}&rdquo;</p>
                    </motion.div>

                    {/* Strengths & Improvements */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-emerald-50/30 border border-emerald-100 rounded-[2.5rem] p-8 lg:p-10"
                        >
                            <h3 className="text-emerald-600 mb-8 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em]">
                                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-lg">
                                    <IconifyIcon icon="solar:like-bold" />
                                </div>
                                Core Strengths
                            </h3>
                            <ul className="space-y-5">
                                {feedback.strengths?.map((s, i) => (
                                    <li key={i} className="flex items-start gap-4 text-sm text-slate-700 font-medium">
                                        <IconifyIcon icon="solar:check-circle-bold" className="text-emerald-500 mt-0.5 shrink-0 text-lg" />
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-orange-50/30 border border-orange-100 rounded-[2.5rem] p-8 lg:p-10"
                        >
                            <h3 className="text-primary mb-8 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em]">
                                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-lg">
                                    <IconifyIcon icon="solar:target-bold" />
                                </div>
                                Growth Opportunities
                            </h3>
                            <ul className="space-y-5">
                                {feedback.areasForImprovement?.map((a, i) => (
                                    <li key={i} className="flex items-start gap-4 text-sm text-slate-700 font-medium">
                                        <IconifyIcon icon="solar:round-alt-arrow-right-bold" className="text-primary mt-0.5 shrink-0 text-lg" />
                                        {a}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Actions */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="flex flex-col sm:flex-row gap-6 justify-center pt-8 border-t border-slate-100"
                    >
                        <Link
                            href="/ai-interview"
                            className="text-center px-12 py-5 border border-slate-200 text-slate-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-slate-50 transition-all"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href={`/ai-interview/${id}`}
                            className="text-center px-12 py-5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-primary transition-all shadow-lg hover:shadow-primary/20 group"
                        >
                            Retake Session 
                            <IconifyIcon icon="solar:refresh-linear" className="inline-block ml-2 text-lg group-hover:rotate-180 transition-transform duration-500" />
                        </Link>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}