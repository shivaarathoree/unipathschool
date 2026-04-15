"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import IconifyIcon from "@/components/IconifyIcon";
import ProFeatureGate from "@/components/ProFeatureGate";

const questions = [
    { id: "careerField", title: "What career field excites you the most?", icon: "solar:rocket-bold-duotone", options: ["Software Development", "Data Science / AI", "UI/UX Design", "App Development", "Digital Marketing", "Cybersecurity", "Cloud / DevOps", "I'm not sure yet"] },
    { id: "educationYear", title: "Which year of college are you in?", icon: "solar:diploma-bold-duotone", options: ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduated / Job Seeker"] },
    { id: "skillLevel", title: "What is your current skill level in your chosen field?", icon: "solar:programming-bold-duotone", options: ["Beginner (just starting)", "Intermediate (some experience)", "Advanced (ready for projects/interviews)"] },
    { id: "timeCommitment", title: "How much time can you give per week to career learning?", icon: "solar:calendar-bold-duotone", options: ["Less than 5 hours", "5-10 hours", "10-20 hours", "20+ hours"] },
    { id: "careerGoal", title: "What type of career goal are you targeting?", icon: "solar:target-bold-duotone", options: ["Internship", "Full-time job", "Freelancing", "Startup / Entrepreneurship", "I'm exploring"] },
    { id: "biggestChallenge", title: "What's your biggest challenge right now?", icon: "solar:danger-triangle-bold-duotone", options: ["I don't know where to start", "I learn but can't stay consistent", "I'm confused about what to build", "I need help with interviews / resume", "I lack confidence"] },
    { id: "ready", title: "Ready for Unipath AI to create your personalized 6-month career plan?", icon: "solar:check-read-bold-duotone", options: ["Yes, I'm ready!", "Let's go"] }
];

export default function CareerDiscoveryPage() {
    const { user, profile, loading, isPro } = useAuth();
    const router = useRouter();

    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [roadmapData, setRoadmapData] = useState<any>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login?redirect=career-discovery");
        }
    }, [user, loading, router]);

    const handleOptionSelect = async (option: string) => {
        const question = questions[currentStep];
        const newAnswers = { ...answers, [question.id]: option };
        setAnswers(newAnswers);

        if (currentStep < questions.length - 1) {
            setTimeout(() => setCurrentStep(prev => prev + 1), 300);
        } else {
            await generateRoadmap(newAnswers);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    const generateRoadmap = async (finalAnswers: Record<string, string>) => {
        if (!user) return;
        setIsGenerating(true);
        setError("");

        try {
            const res = await fetch("/api/roadmap", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers: finalAnswers, uid: user.uid }) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to generate roadmap");
            setRoadmapData(data.roadmap);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsGenerating(false);
        }
    };

    if (loading || !user) {
        return <div className="min-h-screen flex items-center justify-center bg-white"><IconifyIcon icon="solar:spinner-bold" className="w-10 h-10 text-primary animate-spin" /></div>;
    }

    if (!profile || !isPro) {
        return <ProFeatureGate title="AI Career Discovery" />;
    }

    if (isGenerating) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:3rem_3rem] z-0"></div>
                
                <div className="relative z-10 max-w-md">
                    <div className="relative mb-12">
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse"></div>
                        <div className="relative w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                            <IconifyIcon icon="solar:spark-cross-linear" className="text-4xl text-white animate-spin-slow" />
                        </div>
                    </div>
                    
                    <h2 className="text-3xl font-heading font-medium text-slate-900 tracking-tighter mb-4">Architecting Your Future</h2>
                    <p className="text-slate-500 font-light leading-relaxed mb-10">Unipath AI is synthesizing your objectives, current competencies, and real-time industry demand to construct a precision 6-month roadmap.</p>
                    
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden relative">
                        <motion.div 
                            className="absolute left-0 top-0 h-full bg-primary"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 8, ease: "linear", repeat: Infinity }}
                        />
                    </div>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] mt-6">Processing Intelligence Vectors</p>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-12 p-6 bg-red-50 border border-red-100 rounded-[2rem] text-xs text-red-600 font-medium"
                        >
                            <p className="mb-4">{error}</p>
                            <button 
                                onClick={() => setIsGenerating(false)} 
                                className="px-6 py-3 bg-white border border-red-100 rounded-full text-red-600 hover:bg-red-50 transition-colors uppercase tracking-widest font-bold text-[10px]"
                            >
                                Retry Protocol
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        );
    }

    if (roadmapData) {
        return <RoadmapDisplay roadmapData={roadmapData} answers={answers} />;
    }

    const question = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;

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
                    <Link href="/dashboard" className="flex items-center gap-3 group">
                        <span className="w-4 h-px bg-slate-900 group-hover:w-6 group-hover:bg-primary transition-all duration-500"></span>
                        <span className="font-heading font-semibold text-slate-900 text-xl tracking-tighter uppercase">Unipath</span>
                        <span className="font-heading font-light text-slate-500 text-xl tracking-tighter uppercase">School</span>
                    </Link>
                    <div className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">
                        Discovery Phase
                    </div>
                </motion.div>
            </header>

            <main className="flex-grow flex items-center justify-center px-6 py-24 relative z-10">
                <div className="w-full max-w-4xl">
                    <div className="mb-12 flex flex-col items-center text-center">
                        <h1 className="text-4xl md:text-5xl font-heading font-medium tracking-tighter text-slate-900 mb-4">AI Career Path Builder</h1>
                        <p className="text-lg text-slate-500 font-light max-w-xl">Engineer your professional trajectory with high-precision AI roadmaps.</p>
                    </div>

                    <div className="glass rounded-[3rem] p-10 md:p-16 shadow-2xl border border-white/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-[8rem] -mr-16 -mt-16 pointer-events-none"></div>

                        <div className="flex items-center justify-between mb-12 relative z-10">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mb-2">Question {currentStep + 1} of {questions.length}</span>
                                <div className="flex gap-1.5">
                                    {questions.map((_, s) => (
                                        <div key={s} className={`h-1 rounded-full transition-all duration-500 ${currentStep >= s ? "w-6 bg-primary" : "w-2 bg-slate-100"}`}></div>
                                    ))}
                                </div>
                            </div>
                            {currentStep > 0 && (
                                <button 
                                    onClick={handleBack} 
                                    className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-all"
                                >
                                    <IconifyIcon icon="solar:arrow-left-linear" className="text-lg group-hover:-translate-x-1 transition-transform" />
                                    Back
                                </button>
                            )}
                        </div>
                        
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={currentStep} 
                                initial={{ opacity: 0, x: 20 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                exit={{ opacity: 0, x: -20 }} 
                                transition={{ duration: 0.4, ease: "circOut" }}
                                className="relative z-10"
                            >
                                <div className="flex gap-6 mb-12 items-start">
                                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xl shadow-slate-900/10">
                                        <IconifyIcon icon={question.icon} className="text-3xl" />
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-heading font-medium text-slate-900 tracking-tighter leading-tight pt-2">{question.title}</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:pl-[5.5rem]">
                                    {question.options.map((option, idx) => (
                                        <button 
                                            key={idx} 
                                            disabled={isGenerating || !!answers[question.id]}
                                            onClick={() => handleOptionSelect(option)} 
                                            className={`group text-left px-8 py-5 border-2 rounded-[2rem] text-sm font-medium transition-all duration-300 flex justify-between items-center ${answers[question.id] === option ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' : 'bg-slate-50 border-slate-50 hover:border-primary/20 hover:bg-white text-slate-600 hover:text-slate-900'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            <span>{option}</span>
                                            <IconifyIcon 
                                                icon="solar:arrow-right-linear" 
                                                className={`text-xl transition-all duration-300 ${answers[question.id] === option ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'}`} 
                                            />
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
}

const RoadmapDisplay = ({ roadmapData, answers }: { roadmapData: any, answers: Record<string, string> }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadPDF = async () => {
        setIsDownloading(true);
        try {
            const element = document.getElementById("roadmap-content");
            if (!element) throw new Error("Could not find roadmap content");
            const html2canvas = (await import("html2canvas")).default;
            const jsPDF = (await import("jspdf")).default;
            const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false, windowWidth: element.scrollWidth, windowHeight: element.scrollHeight });
            const imgData = canvas.toDataURL("image/jpeg", 0.95);
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            let heightLeft = pdfHeight, position = 0;
            pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, pdfHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();
            while (heightLeft >= 0) {
                position = heightLeft - pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, pdfHeight);
                heightLeft -= pdf.internal.pageSize.getHeight();
            }
            pdf.save(`${(answers.careerField || "Career").replace(/[^a-zA-Z0-9]/g, '_')}_Roadmap.pdf`);
        } catch (error) {
            console.error("Failed to generate PDF:", error);
            alert("Failed to download PDF. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans pb-32 relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:3rem_3rem] z-0"></div>
            
            <header className="fixed top-6 w-full z-50 px-6 flex justify-center pointer-events-none">
                <motion.div 
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="max-w-6xl w-full glass rounded-full h-16 flex items-center justify-between px-8 pointer-events-auto border border-white/50 shadow-sm"
                >
                    <Link href="/dashboard" className="flex items-center gap-3 group">
                        <span className="w-4 h-px bg-slate-900 group-hover:w-6 group-hover:bg-primary transition-all duration-500"></span>
                        <span className="font-heading font-semibold text-slate-900 text-xl tracking-tighter uppercase">Unipath</span>
                        <span className="font-heading font-light text-slate-500 text-xl tracking-tighter uppercase">School</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleDownloadPDF} 
                            disabled={isDownloading}
                            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-primary transition-all disabled:opacity-50"
                        >
                            {isDownloading ? <div className="w-3 h-3 border-2 border-white border-t-transparent animate-spin rounded-full"></div> : <IconifyIcon icon="solar:printer-linear" className="text-sm" />}
                            Export PDF
                        </button>
                    </div>
                </motion.div>
            </header>

            <main className="flex-grow max-w-7xl mx-auto w-full px-6 pt-32 pb-20 relative z-10">
                <div id="roadmap-content" className="space-y-16">
                    <header className="flex flex-col items-center text-center space-y-6">
                        <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-slate-900/20">
                            <IconifyIcon icon="solar:map-linear" className="text-5xl" />
                        </div>
                        <div className="max-w-3xl space-y-4">
                            <h1 className="text-5xl md:text-6xl font-heading font-medium tracking-tighter text-slate-900">
                                {roadmapData.careerField} <span className="text-primary">Mastery.</span>
                            </h1>
                            <p className="text-xl text-slate-500 font-light leading-relaxed">
                                {roadmapData.overallStrategy}
                            </p>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Timeline Column */}
                        <div className="lg:col-span-8 space-y-12">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Phase Sequence (6 Months)</h2>
                            </div>
                            
                            <div className="relative pl-12 md:pl-20">
                                <div className="absolute left-6 md:left-10 top-0 bottom-0 w-px bg-slate-100"></div>
                                
                                <div className="space-y-16">
                                    {roadmapData.monthlyPlan?.map((month: any, idx: number) => (
                                        <motion.div 
                                            key={idx}
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            className="relative"
                                        >
                                            <div className="absolute -left-12 md:-left-20 top-0 w-12 md:w-20 h-20 flex items-center justify-center">
                                                <div className="w-4 h-4 rounded-full bg-white border-4 border-slate-900 shadow-sm z-10"></div>
                                            </div>
                                            
                                            <div className="glass rounded-[2.5rem] p-8 md:p-10 border border-white/50 shadow-xl hover:shadow-2xl hover:border-primary/20 transition-all group">
                                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
                                                    <div className="space-y-2">
                                                        <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Month 0{month.month} — Analysis</span>
                                                        <h3 className="text-3xl font-heading font-medium text-slate-900 tracking-tight group-hover:text-primary transition-colors">{month.title}</h3>
                                                        <p className="text-slate-500 font-light text-lg">{month.focus}</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-4">
                                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                            <IconifyIcon icon="solar:programming-linear" className="text-primary" />
                                                            Core Competencies
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {month.skills?.map((sk: string, sIdx: number) => (
                                                                <span key={sIdx} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-xs font-medium text-slate-600">
                                                                    {sk}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                            <IconifyIcon icon="solar:check-read-linear" className="text-[#10B981]" />
                                                            Project Milestones
                                                        </h4>
                                                        <ul className="space-y-3">
                                                            {month.projects?.map((pj: string, pIdx: number) => (
                                                                <li key={pIdx} className="flex items-start gap-3 text-sm text-slate-600 font-light">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-1.5 shrink-0"></div>
                                                                    {pj}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Column */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="sticky top-32 space-y-8">
                                <SidebarCard 
                                    title="Identity Design" 
                                    icon="solar:document-text-linear" 
                                    items={roadmapData.resumeTips} 
                                    accent="primary"
                                />
                                <SidebarCard 
                                    title="Network Strategy" 
                                    icon="solar:users-group-rounded-linear" 
                                    items={roadmapData.linkedInStrategy} 
                                    numbered 
                                    accent="slate"
                                />
                                
                                <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group" data-html2canvas-ignore="true">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
                                    <h3 className="text-xl font-heading font-medium mb-4 relative z-10">Accelerate Progress.</h3>
                                    <p className="text-slate-400 text-sm font-light mb-8 relative z-10 leading-relaxed">Upgrade to Unipath Elite for direct mentor access and premium company sheets.</p>
                                    <Link href="/dashboard" className="flex items-center justify-between w-full px-8 py-4 bg-primary rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all relative z-10 shadow-lg">
                                        <span>Back to Dashboard</span>
                                        <IconifyIcon icon="solar:arrow-right-linear" className="text-lg" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const SidebarCard = ({ title, icon, items, numbered, accent }: { title: string, icon: string, items: string[], numbered?: boolean, accent: 'primary' | 'slate' }) => (
    <div className="glass rounded-[2.5rem] p-8 border border-white/50 shadow-xl">
        <div className="flex items-center gap-4 mb-8">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${accent === 'primary' ? 'bg-primary' : 'bg-slate-900'}`}>
                <IconifyIcon icon={icon} className="text-xl" />
            </div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{title}</h3>
        </div>
        <ul className="space-y-6">
            {items?.map((item: string, idx: number) => (
                <li key={idx} className="flex gap-4">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-bold ${accent === 'primary' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>
                        {numbered ? idx + 1 : <IconifyIcon icon="solar:check-read-linear" />}
                    </div>
                    <span className="text-sm text-slate-600 font-light leading-relaxed">{item}</span>
                </li>
            ))}
        </ul>
    </div>
);

const InfoCard = ({ title, icon, items, numbered }: { title: string, icon: string, items: string[], numbered?: boolean }) => (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
            <IconifyIcon icon={icon} className="text-primary text-2xl" />
            <h3 className="text-lg font-bold text-slate-900 font-heading">{title}</h3>
        </div>
        <ul className="space-y-4">
            {items?.map((item: string, idx: number) => (
                <li key={idx} className="flex gap-3 text-sm text-slate-700">
                    <div className={`w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold`}>
                        {numbered ? idx + 1 : <IconifyIcon icon="solar:check-circle-linear" />}
                    </div>
                    <span className="pt-0.5 font-light">{item}</span>
                </li>
            ))}
        </ul>
    </div>
);