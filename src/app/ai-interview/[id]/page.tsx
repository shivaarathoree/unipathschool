"use client";

import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InterviewAgent from "@/components/interview/InterviewAgent";
import IconifyIcon from "@/components/IconifyIcon";
import { doc, getDoc, collection, query, where, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface InterviewData {
    id: string;
    role: string;
    type: string;
    level: string;
    techstack: string[];
    questions: string[];
}

export default function InterviewSessionPage() {
    const { id } = useParams<{ id: string }>();
    const { user, loading: authLoading } = useAuth();
    const [interview, setInterview] = useState<InterviewData | null>(null);
    const [feedbackId, setFeedbackId] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id || authLoading) return;

        const fetchInterview = async () => {
            try {
                const docRef = doc(db, "interviews", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setInterview({ id: docSnap.id, ...docSnap.data() } as InterviewData);
                }

                if (user) {
                    const feedbackQ = query(
                        collection(db, "feedback"),
                        where("interviewId", "==", id),
                        where("userId", "==", user.uid),
                        limit(1)
                    );
                    const feedbackSnap = await getDocs(feedbackQ);
                    if (!feedbackSnap.empty) {
                        setFeedbackId(feedbackSnap.docs[0].id);
                    }
                }
            } catch (err) {
                console.error("Error fetching interview:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInterview();
    }, [id, user, authLoading]);

    if (loading || authLoading) {
        return (
            <div className="flex flex-col min-h-screen bg-white">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                        <p className="font-medium text-[10px] uppercase tracking-[0.2em] text-slate-400">Loading Session...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!interview) {
        return (
            <div className="flex flex-col min-h-screen bg-white">
                <Header />
                <main className="flex-grow flex items-center justify-center px-6">
                    <div className="max-w-md w-full glass rounded-[2.5rem] p-12 text-center border border-white/50">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <IconifyIcon icon="solar:danger-circle-linear" className="text-4xl" />
                        </div>
                        <h2 className="text-2xl font-heading font-medium text-slate-900 mb-2">Session Not Found</h2>
                        <p className="text-sm text-slate-500 mb-8 font-light">The interview session you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                        <Link href="/ai-interview" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:text-primary-dark transition-colors">
                            <IconifyIcon icon="solar:arrow-left-linear" />
                            Back to Intelligence
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-slate-900 relative overflow-hidden flex flex-col">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:3rem_3rem] z-0"></div>
            
            <Header />

            <main className="flex-grow max-w-5xl mx-auto w-full px-6 pt-32 pb-20 relative z-10">
                <div className="space-y-12">
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                                    {interview.type}
                                </span>
                                <span className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest">
                                    {interview.level}
                                </span>
                            </div>
                            <h1 className="text-4xl font-medium font-heading tracking-tighter text-slate-900 capitalize">
                                {interview.role} Interview
                            </h1>
                            <p className="text-lg text-slate-500 font-light mt-2">
                                Practice your skills in a high-stakes, realistic environment.
                            </p>
                        </div>
                    </header>

                    <div className="glass rounded-[3rem] p-2 md:p-4 shadow-2xl border border-white/50 relative overflow-hidden">
                        <InterviewAgent
                            userName={user?.displayName || "Student"}
                            userId={user?.uid}
                            interviewId={id}
                            type="interview"
                            questions={interview.questions}
                            feedbackId={feedbackId}
                            interviewTitle={`${interview.role} Session`}
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
