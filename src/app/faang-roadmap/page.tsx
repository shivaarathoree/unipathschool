"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IconifyIcon from "@/components/IconifyIcon";
import type { FANGProfile } from "@/lib/types";
import ProFeatureGate from "@/components/ProFeatureGate";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { motion } from "framer-motion";

export default function FaangRoadmapPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col min-h-screen bg-white">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </main>
                <Footer />
            </div>
        }>
            <FaangRoadmapDashboard />
        </Suspense>
    );
}

function FaangRoadmapDashboard() {
    const { user, profile: userProfile, loading: authLoading, isPro } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const username = searchParams.get("username");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<FANGProfile | null>(null);
    const [generatingPlan, setGeneratingPlan] = useState(false);
    const [studyPlan, setStudyPlan] = useState<any | null>(null);
    const [inputHandle, setInputHandle] = useState("");

    useEffect(() => {
        if (!username) return;

        setLoading(true);
        setError(null);
        setProfile(null);

        const fetchAnalysis = async () => {
            try {
                const res = await fetch("/api/analyze", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username }),
                });
                const data = await res.json();
                if (!data.success) throw new Error(data.error || "Failed to analyze profile");
                setProfile(data.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [username]);

    const handleGenerateAIPlan = async () => {
        if (!profile) return;
        setGeneratingPlan(true);
        try {
            const res = await fetch("/api/ai/plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ profile }),
            });
            const data = await res.json();
            if (data.success) setStudyPlan(data.data);
            else alert("Failed to generate AI plan.");
        } catch (err) {
            console.error(err);
            alert("An error occurred while generating the plan.");
        } finally {
            setGeneratingPlan(false);
        }
    };

    const handleSubmitHandle = (e: React.FormEvent) => {
        e.preventDefault();
        const handle = inputHandle.trim();
        if (!handle) return;
        router.push(`/faang-roadmap?username=${encodeURIComponent(handle)}`);
    };

    if (authLoading) {
        return (
            <div className="flex flex-col min-h-screen bg-white">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </main>
                <Footer />
            </div>
        );
    }

    if (!user || !userProfile || !isPro) {
        return <ProFeatureGate title="FAANG Roadmap Generation" />;
    }

    // ── No username yet: show a premium input form ──
    if (!username) {
        return (
            <div className="min-h-screen bg-white text-slate-900 relative overflow-hidden flex flex-col">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:3rem_3rem] z-0" />
                <Header />
                <main className="flex-grow flex items-center justify-center px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="max-w-lg w-full glass rounded-[3rem] p-12 border border-white/50 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30 rounded-t-[3rem]" />

                        <div className="flex flex-col items-center text-center gap-8">
                            <div className="w-20 h-20 rounded-[2rem] bg-slate-900 flex items-center justify-center shadow-xl shadow-slate-900/20">
                                <IconifyIcon icon="solar:chart-bold-duotone" className="text-4xl text-primary" />
                            </div>

                            <div>
                                <h1 className="text-3xl font-heading font-semibold text-slate-900 tracking-tighter mb-3">
                                    FAANG <span className="text-primary">Readiness.</span>
                                </h1>
                                <p className="text-sm text-slate-500 font-light leading-relaxed">
                                    Enter your LeetCode username to get a personalised AI-generated study roadmap and skill-gap analysis.
                                </p>
                            </div>

                            <form onSubmit={handleSubmitHandle} className="w-full space-y-4">
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-focus-within:bg-primary/10 group-focus-within:text-primary transition-colors">
                                        <IconifyIcon icon="simple-icons:leetcode" className="text-lg" />
                                    </div>
                                    <input
                                        type="text"
                                        value={inputHandle}
                                        onChange={(e) => setInputHandle(e.target.value)}
                                        placeholder="your-leetcode-username"
                                        required
                                        className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-medium focus:outline-none focus:border-primary/40 focus:bg-white transition-all placeholder:text-slate-300"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!inputHandle.trim()}
                                    className="w-full bg-slate-900 hover:bg-primary text-white py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 shadow-xl hover:shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    <IconifyIcon icon="solar:magic-stick-3-bold" className="text-lg" />
                                    Analyse My Profile
                                </button>
                            </form>

                            <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                                We only read your public LeetCode data. No login required.
                            </p>
                        </div>
                    </motion.div>
                </main>
                <Footer />
            </div>
        );
    }

    // ── Username present: show dashboard ──
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto w-full">
                    <div className="flex items-center justify-between mb-10 pb-8 border-b border-slate-100">
                        <div>
                            <h1 className="text-4xl font-heading font-medium text-slate-900">
                                {profile ? profile.realName || profile.username : username}&apos;s Dashboard
                            </h1>
                            <p className="text-slate-500 mt-2 font-light text-base">
                                FAANG Readiness Analysis &amp; AI-Generated Study Plan
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            {profile && profile.avatar && (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={profile.avatar} alt="Avatar" className="w-20 h-20 rounded-full border-4 border-white shadow-lg" />
                            )}
                            <Link
                                href="/faang-roadmap"
                                className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-primary border border-slate-200 hover:border-primary/30 px-5 py-3 rounded-full transition-all"
                            >
                                Change Handle
                            </Link>
                        </div>
                    </div>

                    {loading && (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                            <p className="font-medium text-sm uppercase tracking-widest text-slate-400">Fetching &amp; Analysing LeetCode Profile…</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-red-600">
                            <h3 className="font-bold flex items-center gap-2 mb-2">
                                <IconifyIcon icon="solar:danger-triangle-bold" /> Error Processing Handle
                            </h3>
                            <p>{error}</p>
                            <Link href="/faang-roadmap" className="inline-block mt-4 underline hover:text-red-800 font-semibold">
                                Try a different handle
                            </Link>
                        </div>
                    )}

                    {!loading && !error && profile && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            <div className="lg:col-span-4 space-y-8">
                                <StatCard title="Readiness Score" icon="solar:chart-bold-duotone" value={profile.score.total} unit="/100" color="primary" />
                                <div className="glass rounded-[2rem] p-6 border border-white/50 shadow-lg">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Score Breakdown</h3>
                                    <ScoreBar label="Topic Coverage" value={profile.score.topicCoverage} color="#C2410C" />
                                    <ScoreBar label="Problem Volume" value={profile.score.problemVolume} color="#4f46e5" />
                                    <ScoreBar label="Consistency" value={profile.score.consistency} color="#10b981" />
                                </div>
                                <StatCard title="Total Solved" icon="solar:check-read-bold-duotone" value={profile.totalSolved} color="indigo" />
                                <StatCard title="Longest Streak" icon="solar:calendar-bold-duotone" value={profile.score.longestStreak} unit=" days" color="emerald" />
                                <button
                                    onClick={handleGenerateAIPlan}
                                    disabled={generatingPlan || !!studyPlan}
                                    className="w-full bg-slate-900 hover:bg-primary text-white py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all shadow-lg hover:shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {generatingPlan
                                        ? <><IconifyIcon icon="solar:spinner-bold" className="animate-spin text-lg" /> AI Generating…</>
                                        : studyPlan
                                            ? <><IconifyIcon icon="solar:check-circle-bold" className="text-lg" /> AI Plan Ready</>
                                            : <><IconifyIcon icon="solar:magic-stick-3-bold" className="text-lg" /> Generate AI Study Plan</>
                                    }
                                </button>
                            </div>

                            <div className="lg:col-span-8 space-y-8">
                                {profile.skillGapReport.criticalGaps.length > 0 && <SkillGapSection gaps={profile.skillGapReport.criticalGaps} />}
                                {studyPlan && <AIStudyPlanSection plan={studyPlan} />}
                                <RoadmapSection roadmap={profile.roadmap} weeklyTarget={profile.roadmap.weeklyProblemTarget} />
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

const StatCard = ({ title, icon, value, unit, color }: { title: string; icon: string; value: string | number; unit?: string; color: string }) => {
    const colors: Record<string, string> = {
        primary: "bg-primary/10 text-primary",
        indigo: "bg-indigo-500/10 text-indigo-500",
        emerald: "bg-emerald-500/10 text-emerald-500",
    };
    return (
        <div className="glass rounded-[2rem] p-6 border border-white/50 shadow-lg flex items-center gap-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${colors[color]}`}>
                <IconifyIcon icon={icon} className="text-3xl" />
            </div>
            <div>
                <p className="text-sm font-bold uppercase tracking-widest text-slate-400">{title}</p>
                <p className="text-4xl font-heading font-medium text-slate-900">
                    {value}<span className="text-2xl text-slate-400">{unit}</span>
                </p>
            </div>
        </div>
    );
};

const ScoreBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="mb-4">
        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
            <span>{label}</span>
            <span>{value}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
        </div>
    </div>
);

const SkillGapSection = ({ gaps }: { gaps: any[] }) => (
    <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-2xl">
        <h3 className="font-bold flex items-center gap-3 mb-4 text-red-600 text-base">
            <IconifyIcon icon="solar:danger-triangle-bold-duotone" className="text-2xl" />
            Critical Skill Gaps Detected
        </h3>
        <div className="space-y-3">
            {gaps.map((gap: any) => (
                <div key={gap.topic} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-red-500/20 p-4 rounded-lg">
                    <div>
                        <span className="font-bold mr-2 text-slate-900 text-sm uppercase tracking-wider">{gap.topic}</span>
                        <span className="text-xs text-slate-500">({gap.phase})</span>
                    </div>
                    <div className="mt-2 sm:mt-0 flex flex-wrap gap-2 text-xs">
                        <span className="bg-red-500/10 text-red-600 px-2.5 py-1 rounded font-bold uppercase tracking-wider">-{gap.gapSize} problems</span>
                        <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded font-medium">~{gap.estimatedDaysToClose} days to fix</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const AIStudyPlanSection = ({ plan }: { plan: any }) => (
    <div className="glass-dark rounded-[2rem] p-6 border border-white/5 shadow-lg">
        <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center text-primary text-3xl flex-shrink-0">
                <IconifyIcon icon="solar:magic-stick-3-bold-duotone" />
            </div>
            <div>
                <h2 className="text-xl font-bold font-heading text-white tracking-tight">Dr. FAANG&apos;s Study Plan</h2>
                <p className="text-sm text-primary font-bold mt-1 uppercase tracking-wider">{plan.focusMessage}</p>
            </div>
        </div>
        <div className="space-y-6">
            {plan.weeks.slice(0, 1).map((week: any, i: number) => (
                <div key={i} className="border border-slate-800 bg-slate-900/50 rounded-xl overflow-hidden">
                    <div className="bg-slate-900/80 text-white p-3 font-mono text-xs font-bold flex justify-between items-center border-b border-slate-800">
                        <span>WEEK {week.weekNumber}: {week.theme.toUpperCase()}</span>
                        <span>{week.dailyProblems.length} Problems</span>
                    </div>
                    <div className="p-4 space-y-4">
                        {week.dailyProblems.map((dayItem: any, j: number) => (
                            <div key={j} className="flex flex-col gap-1.5 border-b border-slate-800 pb-3 last:border-0 last:pb-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono font-bold bg-primary/20 text-primary px-2 py-0.5 rounded">DAY {dayItem.day}</span>
                                    <a href={dayItem.problem.leetcodeUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold hover:underline text-white flex items-center gap-1.5">
                                        {dayItem.problem.title} <IconifyIcon icon="solar:link-circle-linear" />
                                    </a>
                                    <span className={`text-xs px-2 py-0.5 ml-auto rounded font-bold uppercase ${dayItem.problem.difficulty === "Easy" ? "bg-green-500/10 text-green-400" : dayItem.problem.difficulty === "Medium" ? "bg-yellow-500/10 text-yellow-400" : "bg-red-500/10 text-red-400"}`}>
                                        {dayItem.problem.difficulty}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 font-light italic pl-12">&ldquo;{dayItem.whyThisProblem}&rdquo;</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            {plan.weeks.length > 1 && (
                <div className="text-center p-3 border border-dashed border-slate-700 text-slate-400 font-mono text-xs uppercase tracking-widest cursor-pointer hover:bg-slate-800/50 rounded-lg">
                    + {plan.weeks.length - 1} more weeks generated
                </div>
            )}
        </div>
    </div>
);

const RoadmapSection = ({ roadmap, weeklyTarget }: { roadmap: any; weeklyTarget: number }) => (
    <div className="glass rounded-[2rem] p-6 border border-white/50 shadow-lg">
        <h3 className="font-bold text-xl mb-6 font-heading border-b border-slate-100 pb-4 text-slate-900">Phase Roadmap</h3>
        <div className="relative border-l-2 border-slate-200 ml-4 space-y-10 pb-4">
            {roadmap.phases.map((phase: any) => (
                <div key={phase.phase} className="relative pl-8">
                    <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-md ${phase.status === "complete" ? "bg-emerald-500" : phase.status === "in-progress" ? "bg-primary animate-pulse shadow-primary/50" : "bg-slate-300"}`} />
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h4 className={`font-bold font-mono uppercase tracking-widest ${phase.status === "in-progress" ? "text-primary text-base" : "text-slate-900"}`}>
                                Phase {phase.phaseNumber}: {phase.phase}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 font-light">{phase.keyInsight}</p>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 uppercase rounded-full ${phase.status === "complete" ? "bg-emerald-500/10 text-emerald-600" : phase.status === "in-progress" ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-500"}`}>
                            {phase.status}
                        </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                        {phase.topics.slice(0, 5).map((topic: any) => (
                            <div key={topic.tagSlug} className="text-xs p-3 border border-slate-200 bg-white rounded-lg flex flex-col justify-between h-full hover:border-primary/50 transition-colors">
                                <div className="font-bold truncate text-slate-700" title={topic.topic}>{topic.topic}</div>
                                <div className="mt-2 flex justify-between items-center text-slate-500 font-mono">
                                    <span className="font-bold">{topic.solved}/{topic.threshold}</span>
                                    {topic.status === "strong"
                                        ? <IconifyIcon icon="solar:check-circle-bold" className="text-emerald-500" />
                                        : topic.status === "average"
                                            ? <IconifyIcon icon="solar:round-alt-arrow-right-bold" className="text-amber-500" />
                                            : <IconifyIcon icon="solar:close-circle-bold" className="text-red-500" />
                                    }
                                </div>
                            </div>
                        ))}
                        {phase.topics.length > 5 && (
                            <div className="text-xs p-3 border border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 font-mono">
                                +{phase.topics.length - 5} more
                            </div>
                        )}
                    </div>
                    {phase.status !== "complete" && phase.estimatedWeeks > 0 && (
                        <div className="mt-4 text-xs font-mono bg-slate-50 inline-block px-3 py-1.5 border border-slate-200 rounded-lg">
                            Est. to complete: <span className="font-bold text-slate-900">{phase.estimatedWeeks} weeks</span> @ {weeklyTarget} probs/wk
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
);