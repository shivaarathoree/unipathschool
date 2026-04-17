"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Loader2 } from "lucide-react";
import IconifyIcon from "@/components/IconifyIcon";
import { motion } from "framer-motion";

const chartData = [
    { name: "Software Engineer", min: 85, median: 125, max: 185 },
    { name: "Data Scientist", min: 95, median: 135, max: 195 },
    { name: "Cloud Engineer", min: 100, median: 150, max: 210 },
    { name: "Cybersecurity Analyst", min: 80, median: 115, max: 175 },
    { name: "Product Manager", min: 105, median: 155, max: 230 },
    { name: "DevOps Engineer", min: 95, median: 140, max: 200 },
];

export default function DashboardPage() {
    const { user, profile, loading } = useAuth();
    const router = useRouter();

    const [trends, setTrends] = useState<string[]>([]);
    const [recommendSkills, setRecommendSkills] = useState<string[]>([]);
    const [isFetchingAI, setIsFetchingAI] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        } else if (!loading && user && !profile) {
            router.push("/onboarding");
        }
    }, [user, profile, loading, router]);

    useEffect(() => {
        if (!profile) return;

        const controller = new AbortController();

        const fetchInsights = async () => {
            setIsFetchingAI(true);
            try {
                const res = await fetch("/api/insights", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        industry: profile.industry,
                        experience: profile.experience,
                        skills: profile.skills,
                    }),
                    signal: controller.signal,
                });
                if (res.ok) {
                    const data = await res.json();
                    if (!controller.signal.aborted) {
                        if (data.trends) setTrends(data.trends);
                        if (data.recommendedSkills) setRecommendSkills(data.recommendedSkills);
                    }
                }
            } catch (err: unknown) {
                if (err instanceof Error && err.name === "AbortError") return;
                console.error("AI Insights Error:", err);
            } finally {
                if (!controller.signal.aborted) {
                    setIsFetchingAI(false);
                }
            }
        };

        fetchInsights();

        return () => controller.abort();
    }, [profile]);

    if (loading || !user || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: any[], label?: string }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass p-4 rounded-2xl shadow-xl border-white/50">
                    <p className="text-slate-900 font-semibold mb-2 font-heading tracking-tight">{label}</p>
                    <p className="text-xs text-slate-500">Min Salary: <span className="font-bold text-slate-700">${payload[0].value as number}K</span></p>
                    <p className="text-xs text-slate-500">Median Salary: <span className="font-bold text-slate-700">${payload[1].value as number}K</span></p>
                    <p className="text-xs text-slate-500">Max Salary: <span className="font-bold text-slate-700">${payload[2].value as number}K</span></p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:3rem_3rem] z-0"></div>

            {/* Header */}
            <header className="fixed top-6 w-full z-50 px-6 flex justify-center pointer-events-none">
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                    className="max-w-6xl w-full glass rounded-full h-16 flex items-center justify-between px-6 pointer-events-auto shadow-[0_0.5rem_2rem_rgba(15,23,42,0.05)] border border-white/50"
                >
                    <Link href="/" className="flex items-center gap-3 group">
                        <span className="w-4 h-px bg-slate-900 mr-1 group-hover:w-6 group-hover:bg-primary transition-all duration-500 ease-out"></span>
                        <span className="font-heading font-semibold text-slate-900 group-hover:text-primary transition-colors text-xl tracking-tighter">UNIPATH</span>
                        <span className="font-heading font-light text-slate-500 ml-1 text-xl tracking-tighter">SCHOOL</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/onboarding" className="text-[10px] font-medium text-slate-500 hover:text-slate-900 uppercase tracking-[0.2em] px-4 transition-colors">
                            Update Profile
                        </Link>
                        <Link href="/dashboard" className="relative flex items-center justify-center px-6 py-2.5 text-xs font-medium text-white bg-slate-900 rounded-full overflow-hidden group/btn shadow-sm hover:shadow-lg transition-all duration-500">
                            <div className="absolute inset-0 w-0 bg-primary transition-all duration-500 ease-out group-hover/btn:w-full z-0"></div>
                            <span className="relative z-10 flex items-center gap-2 tracking-wider uppercase">
                                Dashboard
                            </span>
                        </Link>
                    </div>
                </motion.div>
            </header>

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 space-y-12 relative z-10">
                {/* Welcome Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <h1 className="text-5xl font-medium font-heading tracking-tighter text-slate-900">Welcome back, {(profile?.name || user?.displayName || "User").split(' ')[0]}.</h1>
                    <p className="text-lg text-slate-500 font-light mt-2">Here is your personalized career intelligence dashboard.</p>
                </motion.div>

                {/* AI Career Discovery Promo Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-gradient-to-r from-primary to-orange-600 rounded-[2rem] shadow-lg p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-white border border-orange-400/50"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full inline-block border border-white/20">Pro Feature</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-heading font-medium tracking-tight mb-2">
                            AI Career Path Builder
                        </h2>
                        <p className="text-orange-100 text-sm md:text-base max-w-2xl font-light leading-relaxed">
                            Find the career path that perfectly matches your interests, academic background, and strengths. Get a personalized 6-month roadmap crafted by Unipath AI.
                        </p>
                    </div>
                    <Link
                        href="/career-discovery"
                        className="shrink-0 bg-white text-primary hover:bg-orange-50 font-bold py-4 px-8 rounded-full shadow-xl hover:shadow-2xl transition-all font-heading text-xs uppercase tracking-widest flex items-center gap-2 group"
                    >
                        Start Discovery
                        <IconifyIcon icon="solar:arrow-right-linear" className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                {/* 4 Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { title: "AI Interview", icon: "solar:videocamera-record-linear", link: "/ai-interview", desc: "Practice with AI" },
                        { title: "FAANG Roadmaps", icon: "solar:map-arrow-square-linear", link: "/faang-roadmap", desc: "Step-by-step guides" },
                        { title: "Company Sheets", icon: "solar:document-text-linear", link: "/company-sheets", desc: "Top 100 questions" },
                        { title: "Career Discovery", icon: "solar:compass-big-linear", link: "/career-discovery", desc: "Find your path" }
                    ].map((card, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                        >
                            <Link href={card.link} className="group block h-full">
                                <div className="glass h-full p-8 rounded-[2rem] border border-white/50 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_1rem_3rem_rgba(194,65,12,0.08)] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem] -mr-4 -mt-4 group-hover:bg-primary/10 transition-colors duration-500"></div>
                                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-slate-900/10">
                                        <IconifyIcon icon={card.icon} className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2 font-heading tracking-tight">{card.title}</h3>
                                    <p className="text-xs text-slate-500 font-medium tracking-wide leading-relaxed">{card.desc}</p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Chart Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="glass rounded-[2rem] shadow-lg border border-white/50 p-6 lg:p-8"
                >
                    <h3 className="text-xl font-semibold text-slate-900 mb-1 font-heading tracking-tight">Salary Ranges by Role</h3>
                    <p className="text-xs text-slate-500 mb-8 font-medium tracking-wide uppercase">Minimum, Median, and Maximum (in thousands)</p>

                    <div className="w-full h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000008" />
                                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} ticks={[0, 60, 120, 180, 240]} />
                                <Tooltip cursor={{ fill: "#00000005" }} content={<CustomTooltip />} />
                                <Bar dataKey="min" fill="#00000010" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="median" fill="#00000020" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="max" fill="#C2410C" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="glass-dark rounded-[2rem] shadow-lg border border-white/5 p-6 lg:p-8 min-h-[250px]"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold text-white font-heading tracking-tight">Key AI Industry Trends</h3>
                            {isFetchingAI && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
                        </div>
                        <p className="text-xs text-slate-400 mb-6 font-medium tracking-wide uppercase">For {profile?.industry}</p>

                        {isFetchingAI ? (
                            <div className="space-y-4 pt-4">
                                <div className="h-4 bg-slate-800 rounded w-full animate-pulse"></div>
                                <div className="h-4 bg-slate-800 rounded w-5/6 animate-pulse"></div>
                                <div className="h-4 bg-slate-800 rounded w-4/6 animate-pulse"></div>
                            </div>
                        ) : trends.length > 0 ? (
                            <ul className="space-y-4">
                                {trends.map((t, idx) => (
                                    <li key={idx} className="flex items-start gap-4 text-sm text-slate-300 font-light">
                                        <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-primary flex-shrink-0 shadow-[0_0_8px_#C2410C]" />
                                        {t}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-slate-500 italic">No trends available.</p>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="glass-dark rounded-[2rem] shadow-lg border border-white/5 p-6 lg:p-8 min-h-[250px]"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold text-white font-heading tracking-tight">AI Recommended Skills</h3>
                            {isFetchingAI && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
                        </div>
                        <p className="text-xs text-slate-400 mb-6 font-medium tracking-wide uppercase">Missing skills to level up</p>

                        {isFetchingAI ? (
                            <div className="flex flex-wrap gap-2.5 pt-4">
                                <div className="h-8 bg-slate-800 rounded-full w-24 animate-pulse"></div>
                                <div className="h-8 bg-slate-800 rounded-full w-32 animate-pulse"></div>
                                <div className="h-8 bg-slate-800 rounded-full w-40 animate-pulse"></div>
                            </div>
                        ) : recommendSkills.length > 0 ? (
                            <div className="flex flex-wrap gap-3">
                                {recommendSkills.map((sk, idx) => (
                                    <span key={idx} className="bg-slate-800/50 border border-slate-700 text-xs px-4 py-2 rounded-full text-slate-300 font-medium hover:bg-primary/20 hover:text-white transition cursor-default shadow-sm">
                                        {sk}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 italic">No skill recommendations available.</p>
                        )}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}